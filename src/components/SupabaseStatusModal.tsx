import React, { useState } from 'react';
import { Database, Check, Copy, ExternalLink, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SUPABASE_URL } from '../lib/supabase';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  pubCount: number;
  invCount: number;
  lastSyncTime: Date | null;
  errorMessage: string | null;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({
  isOpen,
  onClose,
  onRefresh,
  isLoading,
  pubCount,
  invCount,
  lastSyncTime,
  errorMessage,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const sqlScript = `-- 1. Pastikan kolom lengkap di kedua tabel Supabase
ALTER TABLE "Publikasi" 
  ADD COLUMN IF NOT EXISTS "Nomor ISBN/DOI" text,
  ADD COLUMN IF NOT EXISTS "Abstrak" text;

ALTER TABLE "Karya Inovasi" 
  ADD COLUMN IF NOT EXISTS "Deskripsi Lengkap" text,
  ADD COLUMN IF NOT EXISTS "Tautan Eksternal/Dok" text;

-- 2. Aktifkan Row Level Security (RLS) dan berikan izin akses ke publik (anon)
ALTER TABLE "Publikasi" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Akses Publik Publikasi" ON "Publikasi";
CREATE POLICY "Akses Publik Publikasi" ON "Publikasi"
  FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE "Karya Inovasi" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Akses Publik Karya Inovasi" ON "Karya Inovasi";
CREATE POLICY "Akses Publik Karya Inovasi" ON "Karya Inovasi"
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- 3. Konfigurasi Supabase Storage Bucket "berkas-publikasi" untuk File PDF
INSERT INTO storage.buckets (id, name, public)
VALUES ('berkas-publikasi', 'berkas-publikasi', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Akses Publik Berkas Publikasi" ON storage.objects;
CREATE POLICY "Akses Publik Berkas Publikasi" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'berkas-publikasi');

DROP POLICY IF EXISTS "Upload Publik Berkas Publikasi" ON storage.objects;
CREATE POLICY "Upload Publik Berkas Publikasi" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'berkas-publikasi');`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 text-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Status Koneksi Supabase Database
              </h3>
              <p className="text-xs text-slate-400">
                Terhubung ke project: <span className="font-mono text-emerald-300">{SUPABASE_URL.replace('https://', '')}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-lg"
          >
            ✕
          </button>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[11px] text-slate-400 block">Status Cloud</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-sm font-semibold text-emerald-400">Live Sync Aktif</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[11px] text-slate-400 block">Tabel Publikasi</span>
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-semibold text-white">{pubCount} Data Tersimpan</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-[11px] text-slate-400 block">Tabel Karya Inovasi</span>
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="h-4 w-4 text-teal-400" />
              <span className="text-sm font-semibold text-white">{invCount} Data Tersimpan</span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <span className="font-semibold block text-amber-300">Catatan Sinkronisasi:</span>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* SQL Quick Setup */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">
                Script SQL Supabase (Hak Akses Publik & Kolom)
              </span>
            </div>
            <button
              onClick={handleCopySql}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors"
            >
              {copiedSql ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedSql ? 'Tersalin!' : 'Salin SQL'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Jika Anda baru saja membuat tabel di Supabase atau ingin memastikan data dapat disimpan tanpa hambatan Row Level Security (RLS), silakan jalankan query SQL berikut di menu <strong className="text-slate-200">SQL Editor</strong> pada dashboard Supabase Anda:
          </p>

          <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300/90 overflow-x-auto leading-relaxed">
            {sqlScript}
          </pre>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            {lastSyncTime ? `Sinkronisasi terakhir: ${lastSyncTime.toLocaleTimeString('id-ID')}` : 'Belum disinkronkan'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
            </button>

            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-sm"
            >
              <span>Dashboard Supabase</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
