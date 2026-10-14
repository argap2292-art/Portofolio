import React, { useState } from 'react';
import { ProfileData } from '../types';
import { 
  MapPin, 
  Calendar, 
  Heart, 
  Gamepad2, 
  Bike, 
  Trophy, 
  Sparkles, 
  GraduationCap, 
  Quote, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Eye, 
  FileText,
  Upload,
  RefreshCw,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { ChangeProfilePhotoModal } from './ChangeProfilePhotoModal';
import { uploadProfilePhoto, saveProfileAvatarToSupabase } from '../lib/supabase';

interface ProfileSectionProps {
  profile: ProfileData;
  photoProfilSaya: string;
  onOpenLightbox: (imageUrl: string, title: string, description: string) => void;
  onOpenContact: () => void;
  onNavigateToPortfolio: () => void;
  onUpdatePhoto?: (newUrl: string) => Promise<boolean | void> | void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  photoProfilSaya,
  onOpenLightbox,
  onOpenContact,
  onNavigateToPortfolio,
  onUpdatePhoto,
}) => {
  const [isPhotoChangerOpen, setIsPhotoChangerOpen] = useState(false);
  const [isUploadingDirect, setIsUploadingDirect] = useState(false);

  const handleLocalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdatePhoto) {
      setIsUploadingDirect(true);
      try {
        // Upload ke Supabase Storage bucket 'profil'
        const uploadRes = await uploadProfilePhoto(file);
        let finalUrl = '';
        if (uploadRes.url) {
          finalUrl = uploadRes.url;
        } else {
          // Fallback ke FileReader jika Storage belum siap
          const reader = new FileReader();
          await new Promise<void>((resolve) => {
            reader.onload = (ev) => {
              if (ev.target?.result) {
                finalUrl = ev.target.result as string;
              }
              resolve();
            };
            reader.readAsDataURL(file);
          });
        }

        if (finalUrl) {
          await saveProfileAvatarToSupabase(finalUrl);
          await onUpdatePhoto(finalUrl);
        }
      } catch (err) {
        console.error('Error uploading photo:', err);
      } finally {
        setIsUploadingDirect(false);
      }
    }
  };

  return (
    <section id="profile" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
            <span>Profil Pribadi & Nilai Hidup</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-sans-body">
            Mengenal Lebih Dekat
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Dedikasi seorang pendidik muda dari bumi Reog Ponorogo yang memadukan kedalaman spiritual, kecakapan kepanduan, dan inovasi pedagogi modern.
          </p>
        </div>

        {/* Profile Main Grid: Left Portrait Frame, Right Comprehensive Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Dedicated Special Photo Frame (Bingkai Foto Khusus Profil Saya) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm sm:max-w-md mx-auto group">
              {/* Decorative subtle backdrop halo */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-600/20 via-teal-500/10 to-amber-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-80" />
              
              {/* Designated Picture Frame Container */}
              <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-xl shadow-slate-200/80 border border-slate-200/90">
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={photoProfilSaya}
                    alt={`${profile.fullName}, ${profile.titleDegree}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
                  />
                  
                  {/* Subtle lower gradient overlay for name ribbon */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />
                  
                  {/* Action Button: Ganti Foto Profil */}
                  <button
                    onClick={() => setIsPhotoChangerOpen(true)}
                    className="absolute top-4 left-4 py-2 px-3 rounded-xl bg-emerald-700/95 hover:bg-emerald-600 text-white backdrop-blur-md transition-all shadow-md hover:scale-105 flex items-center gap-1.5 text-xs font-semibold"
                    title="Ganti Foto Profil (Perangkat / Kamera / Link)"
                    aria-label="Ganti Foto Profil"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Ganti Foto</span>
                  </button>

                  {/* Floating Action Button to view Fullscreen */}
                  <button
                    onClick={() => onOpenLightbox(photoProfilSaya, `${profile.fullName}, ${profile.titleDegree}`, 'Foto profil resmi pendidik dalam balutan seragam PGRI dan peci nasional.')}
                    className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md transition-all shadow-md hover:scale-105"
                    title="Perbesar Foto Profil"
                    aria-label="Perbesar Foto Profil"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  {/* Name banner overlay at bottom of frame */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                      Foto Profil Resmi
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                      {profile.fullName}, {profile.titleDegree}
                    </h3>
                    <p className="text-xs text-slate-300">
                      Magister Pendidikan Agama Islam (M.Pd.)
                    </p>
                  </div>
                </div>

                {/* Sub-frame metadata caption */}
                <div className="mt-3 px-2 py-1 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Status: Pendidik Aktif
                  </span>
                  <span>Ponorogo, Jawa Timur</span>
                </div>

                {/* Direct Upload & Switcher toolbar */}
                {onUpdatePhoto && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-2">
                    {/* Primary Button to Open Full Photo Modal */}
                    <button
                      onClick={() => setIsPhotoChangerOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Ganti Foto (Perangkat / Kamera / Link)</span>
                    </button>

                    <div className="flex items-center justify-between gap-1.5 text-[11px]">
                      <span className="text-slate-500">Pilihan Foto Presisi:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onUpdatePhoto('/images/profil-resmi.jpg')}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                          title="Gunakan Foto Presisi 1"
                        >
                          Varian 1
                        </button>
                        <button
                          onClick={() => onUpdatePhoto('/images/profil-varian2.jpg')}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                          title="Gunakan Foto Presisi 2"
                        >
                          Varian 2
                        </button>
                      </div>
                    </div>

                    <label className={`w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                      isUploadingDirect
                        ? 'bg-emerald-100 text-emerald-800 pointer-events-none'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}>
                      <Upload className={`h-3.5 w-3.5 ${isUploadingDirect ? 'animate-bounce text-emerald-700' : 'text-slate-600'}`} />
                      <span>{isUploadingDirect ? 'Mengunggah ke Supabase...' : 'Pilih File Langsung dari Galeri HP/PC'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploadingDirect}
                        onChange={handleLocalUpload}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Quick action buttons below photo */}
            <div className="mt-6 w-full max-w-sm sm:max-w-md flex items-center gap-3">
              <button
                onClick={onOpenContact}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium shadow-sm transition-all"
              >
                <Mail className="h-4 w-4" />
                <span>Kirim Pesan</span>
              </button>
              <button
                onClick={onNavigateToPortfolio}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all"
              >
                <GraduationCap className="h-4 w-4 text-emerald-700" />
                <span>Lihat Portofolio</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Structured Personal Details (Nama, Tempat Lahir, Domisili, Hobi, Motivasi) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Identity Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 sm:p-7 shadow-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
                Biodata & Identitas Lengkap
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <span className="text-xs font-medium text-slate-500 block mb-1">Nama Lengkap</span>
                  <p className="text-lg font-bold text-slate-900">
                    {profile.fullName}, <span className="text-emerald-700 font-serif-display">{profile.titleDegree}</span>
                  </p>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-500 block mb-1">Gelar Akademik</span>
                  <p className="text-base font-semibold text-slate-800">
                    Magister Pendidikan (S-2 PAI)
                  </p>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-500 block mb-1">Tempat & Tanggal Lahir</span>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-slate-800">
                      {profile.birthPlaceAndDate}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-500 block mb-1">Alamat / Domisili Saat Ini</span>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-slate-800">
                      {profile.currentAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivasi Hidup (Kutipan Filosofis Jawa) */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-amber-50/30 to-orange-50/40 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 mb-2">
                <Quote className="h-4 w-4 text-amber-700" />
                <span>Motivasi Hidup & Falsafah</span>
              </div>
              
              <blockquote className="text-lg sm:text-xl font-serif-display font-semibold italic text-amber-950 leading-relaxed my-2">
                “{profile.lifeMotivationJavanese}”
              </blockquote>
              
              <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed mt-2 pt-2 border-t border-amber-200/60">
                <span className="font-semibold text-amber-950">Makna & Refleksi: </span>
                {profile.lifeMotivationIndonesian} Falsafah kearifan lokal Jawa yang mengajarkan qana'ah, ketenangan batin, serta rasa syukur tanpa henti dalam mengabdi di dunia pendidikan dan sosial.
              </p>
            </div>

            {/* Hobi & Kegemaran */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                <Heart className="h-4 w-4 text-rose-600" />
                <span>Hobi & Waktu Luang</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Aktivitas penyeimbang fisik, pikiran, dan rekreasi yang digemari di sela-sela aktivitas mengajar:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Badminton */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Badminton</h4>
                    <span className="text-[11px] text-slate-500">Olahraga & Stamina</span>
                  </div>
                </div>

                {/* Bersepeda */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
                    <Bike className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Bersepeda</h4>
                    <span className="text-[11px] text-slate-500">Keliling Ponorogo</span>
                  </div>
                </div>

                {/* Game Online */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-800">
                    <Gamepad2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Game Online</h4>
                    <span className="text-[11px] text-slate-500">Hiburan & Strategi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ringkasan Profil Keahlian */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Keahlian & Fokus Kompetensi
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                  Pendidikan Agama Islam (PAI)
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                  Media Smart Display Layar Sentuh
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                  Kepanduan & Pramuka Garuda Laksana
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                  Seni Musik Islami Hadrah Rebana
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                  Kurikulum Merdeka Belajar
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                  Pemberdayaan Karang Taruna Pemuda
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* MODAL GANTI FOTO PROFIL */}
      <ChangeProfilePhotoModal
        isOpen={isPhotoChangerOpen}
        currentPhotoUrl={photoProfilSaya}
        onSelectPhoto={(newUrl) => {
          if (onUpdatePhoto) onUpdatePhoto(newUrl);
        }}
        onResetDefault={() => {
          if (onUpdatePhoto) onUpdatePhoto('/images/profil-resmi.jpg');
        }}
        onClose={() => setIsPhotoChangerOpen(false)}
      />
    </section>
  );
};
