import React from 'react';
import { X, Upload, RotateCcw, Image as ImageIcon, CheckCircle2, Eye } from 'lucide-react';

interface PhotoManagerModalProps {
  isOpen: boolean;
  photos: {
    gambar1: string;
    gambar2: string;
    gambar3: string;
    gambar4: string;
    profilSaya: string;
  };
  onUpdatePhoto: (slotKey: 'gambar1' | 'gambar2' | 'gambar3' | 'gambar4' | 'profilSaya', newUrl: string) => void;
  onResetPhotos: () => void;
  onClose: () => void;
  onOpenLightbox: (imageUrl: string, title: string, description: string) => void;
}

export const PhotoManagerModal: React.FC<PhotoManagerModalProps> = ({
  isOpen,
  photos,
  onUpdatePhoto,
  onResetPhotos,
  onClose,
  onOpenLightbox,
}) => {
  if (!isOpen) return null;

  const photoSlots: Array<{
    key: 'profilSaya' | 'gambar1' | 'gambar2' | 'gambar3' | 'gambar4';
    label: string;
    role: string;
    currentUrl: string;
    description: string;
  }> = [
    {
      key: 'profilSaya',
      label: 'Foto Profil Saya',
      role: 'Ditampilkan di Bingkai Khusus Bagian Profil',
      currentUrl: photos.profilSaya,
      description: 'Foto potret resmi berseragam batik PGRI dengan songkok hitam peci nasional.',
    },
    {
      key: 'gambar1',
      label: 'Gambar 1 (Pramuka Prestasi)',
      role: 'Dipadukan sebagai Latar Belakang Halaman Utama (Home)',
      currentUrl: photos.gambar1,
      description: 'Dokumentasi prestasi Siaga & lomba pengucap do’a Pramuka Kwarran Mlarak.',
    },
    {
      key: 'gambar2',
      label: 'Gambar 2 (Kelas Interaktif)',
      role: 'Dipadukan sebagai Latar Belakang Halaman Utama (Home)',
      currentUrl: photos.gambar2,
      description: 'Dokumentasi interaktif mengajar di kelas beralaskan karpet dengan smart display TV.',
    },
    {
      key: 'gambar3',
      label: 'Gambar 3 (Rebana Hadrah)',
      role: 'Dipadukan sebagai Latar Belakang Bagian Portofolio',
      currentUrl: photos.gambar3,
      description: 'Latihan seni musik hadrah rebana duduk melingkar di aula bersama siswa.',
    },
    {
      key: 'gambar4',
      label: 'Gambar 4 (Inovasi Smartboard)',
      role: 'Dipadukan sebagai Latar Belakang Bagian Portofolio',
      currentUrl: photos.gambar4,
      description: 'Pendidik berseragam dinas memaparkan materi sistem organ pada layar digital kelas.',
    },
  ];

  const handleFileChange = (slotKey: 'profilSaya' | 'gambar1' | 'gambar2' | 'gambar3' | 'gambar4', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onUpdatePhoto(slotKey, e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Kelola 5 Slot Foto Galeri Anda</h3>
              <p className="text-xs text-slate-500">
                Lihat detail 5 foto atau ganti dengan file gambar lain dari perangkat Anda secara instan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup manajer foto"
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-600">
            Total Foto Aktif: <strong>5 File Sesuai Spesifikasi</strong>
          </span>
          <button
            onClick={onResetPhotos}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Kembalikan ke Foto Awal</span>
          </button>
        </div>

        {/* 5 Photo Slots Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {photoSlots.map((slot) => (
            <div
              key={slot.key}
              className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between"
            >
              {/* Photo Preview Frame */}
              <div className="relative aspect-[4/3] w-full bg-slate-900 group overflow-hidden">
                <img
                  src={slot.currentUrl}
                  alt={slot.label}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                
                {/* Overlay actions */}
                <button
                  onClick={() => onOpenLightbox(slot.currentUrl, slot.label, slot.description)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm text-xs flex items-center gap-1"
                  title="Lihat Penuh"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Slot Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-0.5">
                    {slot.label}
                  </h4>
                  <p className="text-[11px] font-semibold text-emerald-700 mb-1.5">
                    {slot.role}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {slot.description}
                  </p>
                </div>

                {/* Upload replacement input */}
                <div className="pt-2 border-t border-slate-200">
                  <label className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer transition-colors">
                    <Upload className="h-3.5 w-3.5 text-slate-500" />
                    <span>Ganti Foto Ini</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileChange(slot.key, file);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
