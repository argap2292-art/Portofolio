import { createClient } from '@supabase/supabase-js';
import { InnovationItem, PublicationItem } from '../types';

export const SUPABASE_URL = 'https://xnlckffyduujdidvvrtj.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubGNrZmZ5ZHV1amRpZHZ2cnRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4Mjg5NzIsImV4cCI6MjEwNzQwNDk3Mn0.8LLx590UrhfyeuJ34Ph-MdM99dNO54bLq8GklpvA-7g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export interface SupabaseSyncStatus {
  connected: boolean;
  lastSync: Date | null;
  error?: string | null;
  needsRlsFix?: boolean;
}

// ---------------------------------------------------------------------------
// 1. PUBLIKASI FUNCTIONS
// ---------------------------------------------------------------------------

export async function fetchPublicationsFromSupabase(): Promise<{
  data: PublicationItem[];
  error: Error | null;
  needsRlsFix?: boolean;
}> {
  try {
    const { data, error } = await supabase
      .from('Publikasi')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.warn('[Supabase] Gagal mengambil Publikasi:', error.message);
      return {
        data: [],
        error: new Error(error.message),
        needsRlsFix: error.code === '42501',
      };
    }

    if (!data) return { data: [], error: null };

    const items: PublicationItem[] = data.map((row: any) => {
      const rowId = String(row.id || `pub-${Date.now()}`);
      const type = (row['Jenis Karya'] || 'Jurnal') as PublicationItem['type'];
      const year = String(row['Tahun Terbit'] || new Date().getFullYear());
      const tags = [type, year].filter(Boolean);

      return {
        id: rowId,
        title: row['Judul'] || 'Tanpa Judul',
        type: type,
        publisherOrInstitution: row['Penerbit'] || 'UIN Ponorogo',
        year: year,
        doiOrIssn: row['Nomor ISBN/DOI'] || undefined,
        abstract:
          row['Abstrak'] ||
          'Karya tulis ilmiah dan publikasi akademik resmi oleh Arga Putra Pratama.',
        fileUrl: row['Tautan File'] || undefined,
        externalUrl: row['Tautan File'] || undefined,
        tags: tags,
      };
    });

    return { data: items, error: null };
  } catch (err: any) {
    return { data: [], error: err };
  }
}

export async function insertPublicationToSupabase(
  item: Omit<PublicationItem, 'id'>
): Promise<{ data: PublicationItem | null; error: Error | null; needsRlsFix?: boolean }> {
  try {
    const payloadFull: Record<string, any> = {
      Judul: item.title,
      'Jenis Karya': item.type,
      'Tahun Terbit': item.year,
      Penerbit: item.publisherOrInstitution,
      'Tautan File': item.fileUrl || item.externalUrl || '',
      'Nomor ISBN/DOI': item.doiOrIssn || '',
      Abstrak: item.abstract || '',
    };

    // Try full insert first
    let res = await supabase.from('Publikasi').insert([payloadFull]).select();

    // If column Abstrak or Nomor ISBN/DOI doesn't exist yet in the database schema, fallback to base columns
    if (res.error && res.error.message.includes('in the schema cache')) {
      console.info(
        '[Supabase] Kolom Abstrak/ISBN belum ada di tabel, menyimpan dengan kolom dasar...'
      );
      const payloadBase: Record<string, any> = {
        Judul: item.title,
        'Jenis Karya': item.type,
        'Tahun Terbit': item.year,
        Penerbit: item.publisherOrInstitution,
        'Tautan File': item.fileUrl || item.externalUrl || '',
      };
      res = await supabase.from('Publikasi').insert([payloadBase]).select();
    }

    if (res.error) {
      console.error('[Supabase] Insert Publikasi gagal:', res.error);
      return {
        data: null,
        error: new Error(res.error.message),
        needsRlsFix: res.error.code === '42501',
      };
    }

    const insertedRow = res.data?.[0];
    const createdItem: PublicationItem = {
      ...item,
      id: insertedRow ? String(insertedRow.id) : `pub-${Date.now()}`,
    };

    return { data: createdItem, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function deletePublicationFromSupabase(
  id: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const numericId = Number(id);
    const query = Number.isFinite(numericId)
      ? supabase.from('Publikasi').delete().eq('id', numericId)
      : supabase.from('Publikasi').delete().eq('id', id);

    const { error } = await query;
    if (error) {
      console.warn('[Supabase] Delete Publikasi gagal:', error.message);
      return { success: false, error: new Error(error.message) };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

// ---------------------------------------------------------------------------
// 2. KARYA INOVASI FUNCTIONS
// ---------------------------------------------------------------------------

export async function fetchInnovationsFromSupabase(): Promise<{
  data: InnovationItem[];
  error: Error | null;
  needsRlsFix?: boolean;
}> {
  try {
    const { data, error } = await supabase
      .from('Karya Inovasi')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.warn('[Supabase] Gagal mengambil Karya Inovasi:', error.message);
      return {
        data: [],
        error: new Error(error.message),
        needsRlsFix: error.code === '42501',
      };
    }

    if (!data) return { data: [], error: null };

    const items: InnovationItem[] = data.map((row: any) => {
      const rowId = String(row.id || `inv-${Date.now()}`);
      const rawCategory = row['Kategori Program'] || 'media_digital';

      let catKey: InnovationItem['category'] = 'media_digital';
      if (rawCategory.includes('rebana') || rawCategory.includes('ekstrakurikuler')) {
        catKey = 'ekstrakurikuler';
      } else if (rawCategory.includes('karakter') || rawCategory.includes('pramuka')) {
        catKey = 'karakter';
      } else if (rawCategory.includes('modul') || rawCategory.includes('kurikulum')) {
        catKey = 'modul_ajar';
      }

      const tagsRaw = row['Kata Kunci'] || '';
      const tagsArray = typeof tagsRaw === 'string'
        ? tagsRaw.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [];

      const extLink = row['Tautan Eksternal/Dok'] || '';

      return {
        id: rowId,
        title: row['Judul Karya'] || 'Karya Inovasi',
        category: catKey,
        year: String(row['Tahun Pelaksanaan'] || new Date().getFullYear()),
        description:
          row['Deskripsi Lengkap'] ||
          'Inovasi pembelajaran dan pengembangan pendidikan agama Islam.',
        tags: tagsArray.length > 0 ? tagsArray : ['Inovasi', 'Pendidikan'],
        externalLink: extLink || undefined,
        documentUrl: extLink || undefined,
        imageUrl: extLink?.match(/\.(jpeg|jpg|png|gif|webp|svg)$/i) ? extLink : undefined,
      };
    });

    return { data: items, error: null };
  } catch (err: any) {
    return { data: [], error: err };
  }
}

export async function insertInnovationToSupabase(
  item: Omit<InnovationItem, 'id'>
): Promise<{ data: InnovationItem | null; error: Error | null; needsRlsFix?: boolean }> {
  try {
    const categoryLabels: Record<InnovationItem['category'], string> = {
      media_digital: 'Media Digital & Smart Screen',
      ekstrakurikuler: 'Ekstrakurikuler & Seni Rebana',
      karakter: 'Pembinaan Karakter & Pramuka',
      modul_ajar: 'Modul Ajar & Kurikulum',
    };

    const payloadFull: Record<string, any> = {
      'Judul Karya': item.title,
      'Kategori Program': categoryLabels[item.category] || item.category,
      'Tahun Pelaksanaan': item.year,
      'Kata Kunci': Array.isArray(item.tags) ? item.tags.join(', ') : item.tags,
      'Deskripsi Lengkap': item.description || '',
      'Tautan Eksternal/Dok': item.externalLink || item.documentUrl || item.imageUrl || '',
    };

    // Try full insert first
    let res = await supabase.from('Karya Inovasi').insert([payloadFull]).select();

    // If column Deskripsi Lengkap or Tautan Eksternal/Dok doesn't exist yet, fallback to base columns
    if (res.error && res.error.message.includes('in the schema cache')) {
      console.info(
        '[Supabase] Kolom Deskripsi Lengkap/Tautan belum ada di tabel, menyimpan kolom dasar...'
      );
      const payloadBase: Record<string, any> = {
        'Judul Karya': item.title,
        'Kategori Program': categoryLabels[item.category] || item.category,
        'Tahun Pelaksanaan': item.year,
        'Kata Kunci': Array.isArray(item.tags) ? item.tags.join(', ') : item.tags,
      };
      res = await supabase.from('Karya Inovasi').insert([payloadBase]).select();
    }

    if (res.error) {
      console.error('[Supabase] Insert Karya Inovasi gagal:', res.error);
      return {
        data: null,
        error: new Error(res.error.message),
        needsRlsFix: res.error.code === '42501',
      };
    }

    const insertedRow = res.data?.[0];
    const createdItem: InnovationItem = {
      ...item,
      id: insertedRow ? String(insertedRow.id) : `inv-${Date.now()}`,
    };

    return { data: createdItem, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function deleteInnovationFromSupabase(
  id: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const numericId = Number(id);
    const query = Number.isFinite(numericId)
      ? supabase.from('Karya Inovasi').delete().eq('id', numericId)
      : supabase.from('Karya Inovasi').delete().eq('id', id);

    const { error } = await query;
    if (error) {
      console.warn('[Supabase] Delete Karya Inovasi gagal:', error.message);
      return { success: false, error: new Error(error.message) };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}
