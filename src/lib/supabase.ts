import { createClient } from '@supabase/supabase-js';
import { InnovationItem, PublicationItem } from '../types';

export const SUPABASE_URL = 'https://xnlckffyduujdidvvrtj.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubGNrZmZ5ZHV1amRpZHZ2cnRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4Mjg5NzIsImV4cCI6MjEwNzQwNDk3Mn0.8LLx590UrhfyeuJ34Ph-MdM99dNO54bLq8GklpvA-7g';

export const BUCKET_BERKAS_PUBLIKASI = 'berkas-publikasi';
export const BUCKET_BERKAS_INOVASI = 'berkas-inovasi';

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
// 1. SUPABASE STORAGE: UNGGAH FILE PDF KE BUCKET "berkas-publikasi"
// ---------------------------------------------------------------------------

export async function uploadPublicationPdf(
  file: File
): Promise<{
  url: string | null;
  error: Error | null;
  needsRlsFix?: boolean;
  bucketNotFound?: boolean;
}> {
  try {
    const ext = file.name.split('.').pop() || 'pdf';
    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    const fileName = `${Date.now()}_${cleanBaseName}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET_BERKAS_PUBLIKASI)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/pdf',
      });

    if (error) {
      console.warn('[Supabase Storage] Gagal upload:', error.message);
      const isBucketNotFound =
        error.message?.includes('Bucket not found') ||
        (error as any).statusCode === '404' ||
        (error as any).code === 'NoSuchBucket';
      const isRls =
        error.message?.includes('violates row-level security') ||
        (error as any).statusCode === '403' ||
        (error as any).code === 'AccessDenied';

      return {
        url: null,
        error: new Error(error.message),
        bucketNotFound: isBucketNotFound,
        needsRlsFix: isRls,
      };
    }

    const { data: pubData } = supabase.storage
      .from(BUCKET_BERKAS_PUBLIKASI)
      .getPublicUrl(fileName);

    return { url: pubData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err };
  }
}

// ---------------------------------------------------------------------------
// 1b. SUPABASE STORAGE: UNGGAH DOKUMEN / MEDIA KE BUCKET "berkas-inovasi"
// ---------------------------------------------------------------------------

export async function uploadInnovationFile(
  file: File
): Promise<{
  url: string | null;
  error: Error | null;
  needsRlsFix?: boolean;
  bucketNotFound?: boolean;
}> {
  try {
    const ext = file.name.split('.').pop() || 'bin';
    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    const fileName = `${Date.now()}_${cleanBaseName}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET_BERKAS_INOVASI)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || undefined,
      });

    if (error) {
      console.warn('[Supabase Storage berkas-inovasi] Gagal upload:', error.message);
      const isBucketNotFound =
        error.message?.includes('Bucket not found') ||
        (error as any).statusCode === '404' ||
        (error as any).code === 'NoSuchBucket';
      const isRls =
        error.message?.includes('violates row-level security') ||
        (error as any).statusCode === '403' ||
        (error as any).code === 'AccessDenied' ||
        (error as any).code === '42501';

      return {
        url: null,
        error: new Error(error.message),
        bucketNotFound: isBucketNotFound,
        needsRlsFix: isRls,
      };
    }

    const { data: pubData } = supabase.storage
      .from(BUCKET_BERKAS_INOVASI)
      .getPublicUrl(fileName);

    return { url: pubData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err };
  }
}

// ---------------------------------------------------------------------------
// 2. PUBLIKASI FUNCTIONS
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
  item: Omit<PublicationItem, 'id'>,
  file?: File | null
): Promise<{
  data: PublicationItem | null;
  error: Error | null;
  needsRlsFix?: boolean;
  storageWarning?: string | null;
}> {
  try {
    let finalFileUrl = item.fileUrl || item.externalUrl || '';
    let storageWarning: string | null = null;

    // 1. Jika ada file PDF yang dipilih, unggah ke Supabase Storage terlebih dahulu
    if (file) {
      const uploadRes = await uploadPublicationPdf(file);
      if (uploadRes.error) {
        console.warn('[Supabase Storage] Gagal mengunggah file PDF:', uploadRes.error.message);
        storageWarning = uploadRes.bucketNotFound
          ? `Bucket '${BUCKET_BERKAS_PUBLIKASI}' belum dibuat di Supabase Storage.`
          : `Gagal mengunggah file ke Storage: ${uploadRes.error.message}`;
      } else if (uploadRes.url) {
        finalFileUrl = uploadRes.url;
      }
    }

    // 2. Siapkan data baris baru sesuai struktur kolom tabel "Publikasi"
    const payloadFull: Record<string, any> = {
      Judul: item.title,
      'Jenis Karya': item.type,
      'Tahun Terbit': item.year,
      Penerbit: item.publisherOrInstitution,
      'Tautan File': finalFileUrl,
      'Nomor ISBN/DOI': item.doiOrIssn || '',
      Abstrak: item.abstract || '',
    };

    // 3. Simpan baris baru ke Supabase
    let res = await supabase.from('Publikasi').insert([payloadFull]).select();

    // Fallback jika kolom Abstrak atau Nomor ISBN/DOI belum ada di schema cache
    if (res.error && res.error.message.includes('in the schema cache')) {
      console.info(
        '[Supabase] Kolom Abstrak/ISBN belum ada di schema cache, menyimpan dengan kolom dasar...'
      );
      const payloadBase: Record<string, any> = {
        Judul: item.title,
        'Jenis Karya': item.type,
        'Tahun Terbit': item.year,
        Penerbit: item.publisherOrInstitution,
        'Tautan File': finalFileUrl,
      };
      res = await supabase.from('Publikasi').insert([payloadBase]).select();
    }

    if (res.error) {
      console.error('[Supabase] Insert Publikasi gagal:', res.error);
      return {
        data: null,
        error: new Error(res.error.message),
        needsRlsFix: res.error.code === '42501',
        storageWarning,
      };
    }

    const insertedRow = res.data?.[0];
    const createdItem: PublicationItem = {
      ...item,
      id: insertedRow ? String(insertedRow.id) : `pub-${Date.now()}`,
      fileUrl: finalFileUrl || undefined,
      externalUrl: finalFileUrl || item.externalUrl || undefined,
    };

    return { data: createdItem, error: null, storageWarning };
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
// 3. KARYA INOVASI FUNCTIONS
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
      const tagsArray =
        typeof tagsRaw === 'string'
          ? tagsRaw
              .split(',')
              .map((t: string) => t.trim())
              .filter(Boolean)
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
  item: Omit<InnovationItem, 'id'>,
  file?: File | null
): Promise<{
  data: InnovationItem | null;
  error: Error | null;
  needsRlsFix?: boolean;
  storageWarning?: string | null;
}> {
  try {
    let finalExternalUrl = item.externalLink || item.documentUrl || '';
    let storageWarning: string | null = null;

    // 1. Jika ada file dokumen/media yang dipilih, unggah terlebih dahulu ke Supabase Storage bucket "berkas-inovasi"
    if (file) {
      console.info('[Supabase Storage] Mengunggah berkas ke bucket berkas-inovasi...');
      const uploadRes = await uploadInnovationFile(file);
      if (uploadRes.error) {
        console.warn('[Supabase Storage] Gagal mengunggah file inovasi:', uploadRes.error.message);
        storageWarning = uploadRes.bucketNotFound
          ? `Bucket '${BUCKET_BERKAS_INOVASI}' belum dibuat di Supabase Storage.`
          : `Gagal mengunggah file ke Storage: ${uploadRes.error.message}`;
      } else if (uploadRes.url) {
        finalExternalUrl = uploadRes.url;
      }
    }

    const categoryLabels: Record<InnovationItem['category'], string> = {
      media_digital: 'Media Digital & Smart Screen',
      ekstrakurikuler: 'Ekstrakurikuler & Seni Rebana',
      karakter: 'Pembinaan Karakter & Pramuka',
      modul_ajar: 'Modul Ajar & Kurikulum',
    };

    // 2. Siapkan baris data sesuai struktur kolom tabel "Karya Inovasi"
    // PENTING: Kolom 'id' bertipe int8 Primary Key tidak disertakan dalam .insert()
    const payloadFull: Record<string, any> = {
      'Judul Karya': item.title,
      'Kategori Program': categoryLabels[item.category] || item.category,
      'Tahun Pelaksanaan': item.year,
      'Deskripsi Lengkap': item.description || '',
      'Kata Kunci': Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      'Tautan Eksternal/Dok': finalExternalUrl,
    };

    // 3. Simpan ke database Supabase
    let res = await supabase.from('Karya Inovasi').insert([payloadFull]).select();

    // Fallback jika kolom Deskripsi Lengkap atau Tautan Eksternal/Dok belum ada di cache schema
    if (res.error && res.error.message.includes('in the schema cache')) {
      console.info(
        '[Supabase] Kolom Deskripsi Lengkap/Tautan belum ada di tabel, menyimpan kolom dasar...'
      );
      const payloadBase: Record<string, any> = {
        'Judul Karya': item.title,
        'Kategori Program': categoryLabels[item.category] || item.category,
        'Tahun Pelaksanaan': item.year,
        'Kata Kunci': Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      };
      res = await supabase.from('Karya Inovasi').insert([payloadBase]).select();
    }

    if (res.error) {
      console.error('[Supabase] Insert Karya Inovasi gagal:', res.error);
      return {
        data: null,
        error: new Error(res.error.message),
        needsRlsFix: res.error.code === '42501',
        storageWarning,
      };
    }

    const insertedRow = res.data?.[0];
    const isImageFile = finalExternalUrl?.match(/\.(jpeg|jpg|png|gif|webp|svg)(\?.*)?$/i);
    const createdItem: InnovationItem = {
      ...item,
      id: insertedRow ? String(insertedRow.id) : `inv-${Date.now()}`,
      externalLink: finalExternalUrl || undefined,
      documentUrl: finalExternalUrl || undefined,
      imageUrl: isImageFile ? finalExternalUrl : item.imageUrl,
    };

    return { data: createdItem, error: null, storageWarning };
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
