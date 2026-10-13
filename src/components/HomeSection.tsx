import React, { useState } from 'react';
import { ArrowRight, Award, BookOpen, Monitor, Eye } from 'lucide-react';

interface HomeSectionProps {
  photoGambar1: string;
  photoGambar2: string;
  onNavigate: (sectionId: string) => void;
  onOpenLightbox: (imageUrl: string, title: string, description: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  photoGambar1,
  photoGambar2,
  onNavigate,
  onOpenLightbox,
}) => {
  const [blendMode, setBlendMode] = useState<'both' | 'gambar1' | 'gambar2'>('both');

  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
      {/* 
        AESTHETIC DUAL-PHOTO COLLABORATIVE BACKGROUND
        Harmoniously blending "gambar 1" (Pramuka Prestasi) & "gambar 2" (Pembelajaran Interaktif Kelas)
        without rigid photo frames, seamlessly integrated as atmospheric website scenery.
      */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Photo 1: Pramuka Prestasi Siaga (Left - Top / Center blend) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            blendMode === 'both' ? 'opacity-35 lg:opacity-40' : blendMode === 'gambar1' ? 'opacity-80' : 'opacity-0'
          }`}
          style={{
            clipPath: 'polygon(0 0, 75% 0, 45% 100%, 0% 100%)',
          }}
        >
          <img
            src={photoGambar1}
            alt="Dokumentasi Prestasi Pramuka Siaga Kwarran Mlarak"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter saturate-[0.95] contrast-[1.05] transform scale-105"
          />
          {/* Subtle gradient vignette to blend into background */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/80" />
        </div>

        {/* Photo 2: Pembelajaran Interaktif Smart Display (Right - Bottom / Center blend) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            blendMode === 'both' ? 'opacity-35 lg:opacity-40' : blendMode === 'gambar2' ? 'opacity-80' : 'opacity-0'
          }`}
          style={{
            clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 25% 100%)',
          }}
        >
          <img
            src={photoGambar2}
            alt="Dokumentasi Mengajar Interaktif dengan Smart Screen TV"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter saturate-[0.95] contrast-[1.05] transform scale-105"
          />
          {/* Subtle gradient vignette to blend seamlessly */}
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950/70 via-slate-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/80" />
        </div>

        {/* Artistic central seam diffusion & overall ambient lighting */}
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/60 to-slate-950/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-950/85" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 flex flex-col justify-between">
        
        {/* Top Floating Blend Selector (Interactive experience for visitors) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Portofolio Pendidik PAI Ponorogo</span>
          </div>

          {/* Visual Blend Switcher */}
          <div className="inline-flex items-center gap-1 p-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-xs text-slate-300">
            <button
              onClick={() => setBlendMode('both')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                blendMode === 'both' ? 'bg-emerald-600/90 text-white shadow-xs font-medium' : 'hover:text-white'
              }`}
            >
              Kolaborasi 2 Foto
            </button>
            <button
              onClick={() => setBlendMode('gambar1')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                blendMode === 'gambar1' ? 'bg-emerald-600/90 text-white shadow-xs font-medium' : 'hover:text-white'
              }`}
            >
              Pramuka (Foto 1)
            </button>
            <button
              onClick={() => setBlendMode('gambar2')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                blendMode === 'gambar2' ? 'bg-emerald-600/90 text-white shadow-xs font-medium' : 'hover:text-white'
              }`}
            >
              Kelas Digital (Foto 2)
            </button>
          </div>
        </div>

        {/* Core Hero Typography */}
        <div className="max-w-3xl space-y-6">
          {/* Sapaan Personal: "Hai, namaku Arga." */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-sm font-sans-body">
              Hai, namaku <span className="text-emerald-400 font-serif-display italic">Arga</span>.
            </h1>
            <p className="text-lg sm:text-xl font-medium text-slate-300">
              Arga Putra Pratama
            </p>
          </div>

          {/* Kalimat Mutiara / Motivasi Hidup */}
          <div className="relative pl-5 py-2 border-l-2 border-emerald-400/80">
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-serif-display italic text-emerald-100 leading-relaxed text-balance drop-shadow-xs">
              “Berproses dengan ikhlas, mengabdi dengan hati, dan terus menebar manfaat.”
            </blockquote>
          </div>

          {/* Deskripsi Pengabdian & Peran */}
          <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-2xl">
            Guru Pendidikan Agama Islam (PAI) dan praktisi inovasi pembelajaran interaktif. Berkomitmen membentuk generasi berakhlak mulia, tangguh, mandiri melalui penguatan karakter dan sentuhan teknologi digital di ruang kelas.
          </p>

        </div>

        {/* Bottom Ambient Cards / Visual Anchors */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-8">
          {/* Card 1: Pendidikan Agama Islam */}
          <div
            onClick={() => onNavigate('portofolio')}
            className="group cursor-pointer p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900/90 border border-white/10 hover:border-emerald-400/40 backdrop-blur-md transition-all"
          >
            <div className="flex items-center justify-between text-xs text-amber-300 font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Pendidikan Agama Islam</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-amber-200 transition-colors">
              Pendidikan Agama Islam UIN
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Menuntaskan S-1 dan S-2 PAI di UIN Ponorogo (2019-2025) dengan fokus riset media pedagogi modern.
            </p>
          </div>

          {/* Card 2: Notifikasi Hasil Publikasi */}
          <div
            onClick={() => onNavigate('publikasi')}
            className="group cursor-pointer p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900/90 border border-white/10 hover:border-emerald-400/40 backdrop-blur-md transition-all"
          >
            <div className="flex items-center justify-between text-xs text-emerald-300 font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" />
                <span>Hasil Publikasi</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-emerald-200 transition-colors">
              Publikasi Ilmiah & Riset
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Koleksi karya tulis ilmiah, tesis, dan artikel jurnal terindeks yang dapat diunduh serta diakses online.
            </p>
          </div>

          {/* Card 3: Notifikasi Karya Inovasi */}
          <div
            onClick={() => onNavigate('portofolio')}
            className="group cursor-pointer p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900/90 border border-white/10 hover:border-emerald-400/40 backdrop-blur-md transition-all"
          >
            <div className="flex items-center justify-between text-xs text-teal-300 font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <Monitor className="h-3.5 w-3.5" />
                <span>Karya Inovasi</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-teal-200 transition-colors">
              Inovasi & Program Unggulan
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Transformasi media pembelajaran digital interaktif, Smart Display TV, dan pengembangan modul edukasi.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
