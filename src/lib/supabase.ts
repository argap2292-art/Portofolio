import { createClient } from '@supabase/supabase-js';
import { InnovationItem, PublicationItem } from '../types';

export const SUPABASE_URL = 'https://xnlckffyduujdidvvrtj.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubGNrZmZ5ZHV1amRpZHZ2cnRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4Mjg5NzIsImV4cCI6MjEwNzQwNDk3Mn0.8LLx590UrhfyeuJ34Ph-MdM99dNO54bLq8GklpvA-7g';

export const BUCKET_BERKAS_PUBLIKASI = 'berkas-publikasi';
export const BUCKET_BERKAS_KARYA = 'Berkas Karya';
export const BUCKET_BERKAS_INOVASI = 'Berkas Karya';
export const BUCKET_PROFIL = 'profil';
export const BUCKET_PROFIL_FALLBACK = 'foto-profil';

export const TABLE_PENGATURAN_PROFIL = 'Pengaturan _Profil';
export const TABLE_PENGATURAN_PROFIL_ALT = 'Pengaturan_Profil';

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
// 1b. SUPABASE STORAGE & IMAGE COMPRESSION: UNGGAH DOKUMEN / MEDIA
// ---------------------------------------------------------------------------

/**
 * Mengompresi file gambar secara otomatis ke resolusi optimal (max 1200px, 82% quality)
 * dan mengembalikan base64 Data URL. Sangat andal sebagai fallback instan jika storage bucket belum siap.
 */
export function fileToCompressedDataUrl(
  file: File,
  maxDimension: number = 1200,
  quality: number = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Mengunggah file foto/media karya inovasi ke Supabase Storage bucket 'Berkas Karya'.
 * Mengembalikan Public URL dari file yang berhasil diunggah.
 */
export async function uploadInnovationPhotoToStorage(
  file: File
): Promise<{
  url: string | null;
  error: Error | null;
  needsRlsFix?: boolean;
  bucketNotFound?: boolean;
}> {
  try {
    const ext = file.name.split('.').pop() || 'jpg';
    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const fileName = `karya_${Date.now()}_${cleanBaseName}.${ext}`;

    // Target bucket utama adalah 'Berkas Karya' (sesuai bucket user di Supabase)
    const candidateBuckets = [
      BUCKET_BERKAS_KARYA, // 'Berkas Karya'
      'berkas-karya',
      'Berkas_Karya',
      'berkas-inovasi',
      'profil',
    ];

    let lastError: any = null;
    let successfulBucket: string | null = null;

    for (const b of candidateBuckets) {
      const { error } = await supabase.storage
        .from(b)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'image/jpeg',
        });

      if (!error) {
        successfulBucket = b;
        break;
      }

      lastError = error;
      const isNotFound =
        error.message?.includes('Bucket not found') ||
        (error as any).statusCode === '404' ||
        (error as any).code === 'NoSuchBucket';

      // Jika bucket ditemukan namun ditolak karena RLS, hentikan loop pada bucket tersebut
      if (!isNotFound) {
        break;
      }
    }

    if (!successfulBucket) {
      console.warn('[Supabase Storage Berkas Karya] Gagal upload:', lastError?.message);
      const isBucketNotFound =
        lastError?.message?.includes('Bucket not found') ||
        (lastError as any)?.statusCode === '404' ||
        (lastError as any)?.code === 'NoSuchBucket';
      const isRls =
        lastError?.message?.includes('violates row-level security') ||
        (lastError as any)?.statusCode === '403' ||
        (lastError as any)?.code === 'AccessDenied' ||
        (lastError as any)?.code === '42501';

      return {
        url: null,
        error: new Error(
          isRls
            ? `Supabase Storage bucket '${BUCKET_BERKAS_KARYA}' memerlukan izin policy RLS publik (INSERT anon). Buka Status Supabase untuk melihat SQL fix.`
            : isBucketNotFound
            ? `Bucket '${BUCKET_BERKAS_KARYA}' belum dibuat di Supabase Storage.`
            : (lastError?.message || 'Gagal mengunggah foto ke Supabase Storage.')
        ),
        bucketNotFound: isBucketNotFound,
        needsRlsFix: isRls,
      };
    }

    const { data: pubData } = supabase.storage
      .from(successfulBucket)
      .getPublicUrl(fileName);

    return { url: pubData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err };
  }
}

export async function uploadInnovationFile(
  file: File
): Promise<{
  url: string | null;
  error: Error | null;
  needsRlsFix?: boolean;
  bucketNotFound?: boolean;
}> {
  return uploadInnovationPhotoToStorage(file);
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

/**
 * Helper untuk mendeteksi dan mengekstrak media/gambar/dokumen dari baris database 'Karya Inovasi'.
 * Menangani berbagai variasi kolom (Tautan Eksternal/Dok, imageUrl, Gambar, Foto, Berkas),
 * Google Drive link (folder atau file), Supabase Storage public URL, dan base64 Data URL.
 */
export function resolveInnovationMedia(row: any): {
  imageUrl?: string;
  externalLink?: string;
  isDriveLink: boolean;
  driveType?: 'folder' | 'file';
} {
  if (!row) {
    return { isDriveLink: false };
  }

  // 1. Cek semua variasi nama kolom untuk tautan / dokumen / berkas
  const rawLink = String(
    row['Tautan Eksternal/Dok'] ||
    row['Tautan Eksternal'] ||
    row['Tautan'] ||
    row['imageUrl'] ||
    row['image_url'] ||
    row['Gambar'] ||
    row['Foto'] ||
    row['Berkas'] ||
    row['File'] ||
    row['url_gambar'] ||
    row['foto_url'] ||
    row['documentUrl'] ||
    row['document_url'] ||
    ''
  ).trim();

  // 2. Cek kolom khusus gambar jika tersedia
  const directImg = String(
    row['imageUrl'] ||
    row['image_url'] ||
    row['Gambar'] ||
    row['Foto'] ||
    row['url_gambar'] ||
    row['foto_url'] ||
    ''
  ).trim();

  let resolvedImageUrl: string | undefined = undefined;
  let isDriveLink = false;
  let driveType: 'folder' | 'file' | undefined = undefined;

  // Analisis Google Drive Link
  if (rawLink.includes('drive.google.com')) {
    isDriveLink = true;
    if (rawLink.includes('/drive/folders/')) {
      driveType = 'folder';
    } else {
      driveType = 'file';
      const fileIdMatch = rawLink.match(/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/i);
      if (fileIdMatch && fileIdMatch[1]) {
        resolvedImageUrl = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w1000`;
      }
    }
  }

  // Jika ada kolom gambar eksplisit
  if (directImg) {
    resolvedImageUrl = directImg;
  }

  // Jika tautan adalah base64 Data URL gambar
  if (!resolvedImageUrl && rawLink.startsWith('data:image/')) {
    resolvedImageUrl = rawLink;
  }

  // Jika tautan adalah file gambar online atau Supabase Storage URL
  const isSupabaseStorage =
    rawLink.includes('/storage/v1/object/public/') ||
    rawLink.includes('supabase.co/storage/');
  const isDocFile = /\.(pdf|docx?|xlsx?|pptx?|zip|rar)($|\?|#)/i.test(rawLink);

  if (
    !resolvedImageUrl &&
    (
      (isSupabaseStorage && !isDocFile) ||
      /\.(jpeg|jpg|png|gif|webp|svg|bmp|avif)($|\?|#)/i.test(rawLink) ||
      rawLink.includes('images.unsplash.com') ||
      rawLink.includes('imgur.com')
    )
  ) {
    resolvedImageUrl = rawLink;
  }

  return {
    imageUrl: resolvedImageUrl,
    externalLink: rawLink || undefined,
    isDriveLink,
    driveType,
  };
}

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

      // Resolusi media, gambar, dan tautan dokumen dengan fleksibel
      const media = resolveInnovationMedia(row);

      return {
        id: rowId,
        title: row['Judul Karya'] || 'Karya Inovasi',
        category: catKey,
        year: String(row['Tahun Pelaksanaan'] || new Date().getFullYear()),
        description:
          row['Deskripsi Lengkap'] ||
          'Inovasi pembelajaran dan pengembangan pendidikan agama Islam.',
        tags: tagsArray.length > 0 ? tagsArray : ['Inovasi', 'Pendidikan'],
        externalLink: media.externalLink,
        documentUrl: media.externalLink,
        imageUrl: media.imageUrl,
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

    // 1. Jika ada file dokumen/media yang dipilih, unggah ke Storage bucket 'Berkas Karya'
    if (file) {
      console.info(`[Supabase Storage] Mengunggah berkas ke bucket '${BUCKET_BERKAS_KARYA}'...`);
      const uploadRes = await uploadInnovationPhotoToStorage(file);
      if (uploadRes.url) {
        finalExternalUrl = uploadRes.url;
      } else {
        console.warn('[Supabase Storage] Gagal mengunggah file inovasi:', uploadRes.error?.message);
        // PENTING: JANGAN simpan Base64 ke database karena index Postgres btree memiliki batas 8191 bytes.
        storageWarning = uploadRes.needsRlsFix
          ? `Izin RLS upload belum aktif pada bucket '${BUCKET_BERKAS_KARYA}'. Data disimpan tanpa lampiran file online.`
          : uploadRes.bucketNotFound
          ? `Bucket '${BUCKET_BERKAS_KARYA}' belum dibuat di Supabase Storage.`
          : `Gagal upload ke Storage: ${uploadRes.error?.message}`;
      }
    } else if (item.imageUrl && !item.imageUrl.startsWith('data:')) {
      // Jika pengguna menyertakan URL gambar online valid (bukan data: URL)
      finalExternalUrl = item.imageUrl;
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
    const isImageFile =
      finalExternalUrl?.match(/\.(jpeg|jpg|png|gif|webp|svg|bmp|avif)($|\?|#)/i) ||
      finalExternalUrl?.includes('/storage/v1/object/public/');

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

/**
 * Memperbarui foto sampul / tautan gambar untuk kartu Karya Inovasi yang sudah ada di Supabase.
 * File diunggah ke Supabase Storage bucket 'Berkas Karya' dan string Public URL disimpan ke tabel database.
 */
export async function updateInnovationPhotoInSupabase(
  id: string,
  fileOrUrl: File | string
): Promise<{ success: boolean; url?: string; error: Error | null; needsRlsFix?: boolean }> {
  try {
    let finalUrl = '';

    if (typeof fileOrUrl === 'string') {
      const trimmed = fileOrUrl.trim();
      // Jangan izinkan string base64 besar disimpan ke tabel database karena batas ukuran index PostgreSQL
      if (trimmed.startsWith('data:') && trimmed.length > 4000) {
        return {
          success: false,
          error: new Error(
            'Ukuran data Base64 terlalu besar untuk disimpan langsung ke database. Harap unggah berkas gambar lewat tombol Unggah Foto agar tersimpan ke Supabase Storage.'
          ),
        };
      }
      finalUrl = trimmed;
    } else {
      // 1. Unggah file gambar ke Supabase Storage bucket 'Berkas Karya'
      console.info(`[Supabase Storage] Mengunggah foto kegiatan ke bucket '${BUCKET_BERKAS_KARYA}'...`);
      const uploadRes = await uploadInnovationPhotoToStorage(fileOrUrl);
      if (uploadRes.error || !uploadRes.url) {
        // HENTIKAN di sini dan laporkan error. JANGAN simpan Base64 mentah ke tabel database!
        return {
          success: false,
          error: uploadRes.error || new Error('Gagal mendapatkan Public URL dari Supabase Storage.'),
          needsRlsFix: uploadRes.needsRlsFix,
        };
      }
      finalUrl = uploadRes.url;
    }

    if (!finalUrl) {
      return { success: false, error: new Error('Tautan atau berkas gambar tidak valid.') };
    }

    // 2. Simpan string Public URL ke kolom database tabel 'Karya Inovasi'
    const numericId = Number(id);
    const query = Number.isFinite(numericId)
      ? supabase.from('Karya Inovasi').update({ 'Tautan Eksternal/Dok': finalUrl }).eq('id', numericId).select()
      : supabase.from('Karya Inovasi').update({ 'Tautan Eksternal/Dok': finalUrl }).eq('id', id).select();

    const { data, error } = await query;
    if (error) {
      console.warn('[Supabase] Gagal update foto Karya Inovasi:', error.message);
      return {
        success: false,
        error: new Error(error.message),
        needsRlsFix: error.code === '42501',
      };
    }

    return { success: true, url: finalUrl, error: null };
  } catch (err: any) {
    return { success: false, error: err };
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

// ---------------------------------------------------------------------------
// 4. PENGATURAN PROFIL & FOTO AVATAR (STORAGE & DATABASE SYNC)
// ---------------------------------------------------------------------------

/**
 * Mengunggah file gambar ke Supabase Storage bucket 'profil'.
 * Jika bucket 'profil' belum dibuat atau mengalami kendala, mencoba fallback ke bucket 'foto-profil'.
 */
export async function uploadProfilePhoto(
  fileOrBlob: File | Blob,
  fileNameCustom?: string
): Promise<{
  url: string | null;
  error: Error | null;
  bucketNotFound?: boolean;
  needsRlsFix?: boolean;
}> {
  try {
    const ext =
      fileOrBlob instanceof File
        ? fileOrBlob.name.split('.').pop() || 'jpg'
        : 'jpg';
    const timestamp = Date.now();
    const fileName = fileNameCustom || `avatar_${timestamp}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const contentType = fileOrBlob.type || 'image/jpeg';

    // 1. Coba upload ke bucket 'profil'
    let uploadRes = await supabase.storage
      .from(BUCKET_PROFIL)
      .upload(fileName, fileOrBlob, {
        cacheControl: '3600',
        upsert: true,
        contentType,
      });

    // 2. Jika bucket 'profil' not found, coba bucket 'foto-profil'
    let usedBucket = BUCKET_PROFIL;
    if (
      uploadRes.error &&
      (uploadRes.error.message?.includes('Bucket not found') ||
        (uploadRes.error as any).statusCode === '404' ||
        (uploadRes.error as any).code === 'NoSuchBucket')
    ) {
      console.info(`[Supabase Storage] Bucket '${BUCKET_PROFIL}' tidak ditemukan, mencoba '${BUCKET_PROFIL_FALLBACK}'...`);
      const fallbackRes = await supabase.storage
        .from(BUCKET_PROFIL_FALLBACK)
        .upload(fileName, fileOrBlob, {
          cacheControl: '3600',
          upsert: true,
          contentType,
        });

      if (!fallbackRes.error) {
        uploadRes = fallbackRes;
        usedBucket = BUCKET_PROFIL_FALLBACK;
      }
    }

    if (uploadRes.error) {
      console.warn('[Supabase Storage Profil] Upload error:', uploadRes.error.message);
      const isBucketNotFound =
        uploadRes.error.message?.includes('Bucket not found') ||
        (uploadRes.error as any).statusCode === '404' ||
        (uploadRes.error as any).code === 'NoSuchBucket';
      const isRls =
        uploadRes.error.message?.includes('violates row-level security') ||
        (uploadRes.error as any).statusCode === '403' ||
        (uploadRes.error as any).code === 'AccessDenied' ||
        (uploadRes.error as any).code === '42501';

      return {
        url: null,
        error: new Error(uploadRes.error.message),
        bucketNotFound: isBucketNotFound,
        needsRlsFix: isRls,
      };
    }

    // Ambil Public URL dari file yang diunggah
    const { data: pubData } = supabase.storage
      .from(usedBucket)
      .getPublicUrl(fileName);

    return { url: pubData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err };
  }
}

/**
 * Mengambil URL avatar terbaru dari tabel 'Pengaturan _Profil' / 'Pengaturan_Profil'.
 */
export async function fetchProfileAvatarFromSupabase(): Promise<{
  avatarUrl: string | null;
  error: Error | null;
}> {
  try {
    // Coba tabel 'Pengaturan _Profil' (ada spasi)
    let res = await supabase
      .from(TABLE_PENGATURAN_PROFIL)
      .select('avatar_url, id')
      .order('id', { ascending: false })
      .limit(1);

    // Jika tabel tidak ditemukan, coba nama alternatif tanpa spasi
    if (res.error && res.error.message.includes('in the schema cache')) {
      res = await supabase
        .from(TABLE_PENGATURAN_PROFIL_ALT)
        .select('avatar_url, id')
        .order('id', { ascending: false })
        .limit(1);
    }

    if (res.error) {
      console.warn('[Supabase] Gagal fetch avatar_url:', res.error.message);
      return { avatarUrl: null, error: new Error(res.error.message) };
    }

    if (res.data && res.data.length > 0 && res.data[0].avatar_url) {
      return { avatarUrl: res.data[0].avatar_url, error: null };
    }

    return { avatarUrl: null, error: null };
  } catch (err: any) {
    return { avatarUrl: null, error: err };
  }
}

/**
 * Menyimpan/memperbarui record avatar_url di tabel 'Pengaturan _Profil' / 'Pengaturan_Profil'.
 */
export async function saveProfileAvatarToSupabase(
  avatarUrl: string
): Promise<{
  success: boolean;
  error: Error | null;
  needsRlsFix?: boolean;
}> {
  try {
    // 1. Cek apakah sudah ada baris di Pengaturan _Profil
    let checkRes = await supabase
      .from(TABLE_PENGATURAN_PROFIL)
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    let activeTable = TABLE_PENGATURAN_PROFIL;

    if (checkRes.error && checkRes.error.message.includes('in the schema cache')) {
      activeTable = TABLE_PENGATURAN_PROFIL_ALT;
      checkRes = await supabase
        .from(TABLE_PENGATURAN_PROFIL_ALT)
        .select('id')
        .order('id', { ascending: false })
        .limit(1);
    }

    if (checkRes.error && !checkRes.error.message.includes('in the schema cache')) {
      // Periksa error RLS
      const isRls = checkRes.error.code === '42501';
      return { success: false, error: new Error(checkRes.error.message), needsRlsFix: isRls };
    }

    const existingRow = checkRes.data?.[0];

    let saveRes;
    if (existingRow?.id) {
      // Update baris yang sudah ada
      saveRes = await supabase
        .from(activeTable)
        .update({ avatar_url: avatarUrl })
        .eq('id', existingRow.id)
        .select();
    } else {
      // Insert baris pertama
      saveRes = await supabase
        .from(activeTable)
        .insert([{ avatar_url: avatarUrl }])
        .select();
    }

    if (saveRes.error) {
      console.error('[Supabase] Gagal menyimpan avatar_url ke database:', saveRes.error);
      return {
        success: false,
        error: new Error(saveRes.error.message),
        needsRlsFix: saveRes.error.code === '42501',
      };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

