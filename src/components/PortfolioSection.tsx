import React, { useState } from 'react';
import { 
  EducationItem, 
  InnovationItem, 
  OrganizationItem 
} from '../types';
import { 
  GraduationCap, 
  Users, 
  Lightbulb, 
  Plus, 
  ExternalLink, 
  Calendar, 
  Eye, 
  Building2, 
  Briefcase, 
  Award, 
  Sparkles, 
  Layers,
  ChevronRight,
  Filter,
  Trash2
} from 'lucide-react';

interface PortfolioSectionProps {
  educationList: EducationItem[];
  organizationList: OrganizationItem[];
  innovationList: InnovationItem[];
  photoGambar3: string;
  photoGambar4: string;
  onOpenLightbox: (imageUrl: string, title: string, description: string) => void;
  onAddInnovation: (item: Omit<InnovationItem, 'id'>) => void;
  onDeleteInnovation?: (id: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  educationList,
  organizationList,
  innovationList,
  photoGambar3,
  photoGambar4,
  onOpenLightbox,
  onAddInnovation,
  onDeleteInnovation,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pendidikan' | 'organisasi' | 'inovasi'>('all');
  const [orgFilter, setOrgFilter] = useState<'all' | 'luar_sekolah' | 'pekerjaan'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bgBlendMode, setBgBlendMode] = useState<'both' | 'gambar3' | 'gambar4'>('both');

  // Form state for adding new innovation
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<InnovationItem['category']>('media_digital');
  const [newYear, setNewYear] = useState('2025');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newImagePreview, setNewImagePreview] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitInnovation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAddInnovation({
      title: newTitle.trim(),
      category: newCategory,
      year: newYear.trim() || '2025',
      description: newDesc.trim() || 'Karya inovasi dan program dedikasi pembelajaran.',
      tags: tagsArray.length > 0 ? tagsArray : ['Inovasi PAI', 'Karya Edukasi'],
      imageUrl: newImagePreview || photoGambar4,
      externalLink: newLink.trim() || undefined,
    });

    // Reset
    setNewTitle('');
    setNewDesc('');
    setNewTags('');
    setNewLink('');
    setNewImagePreview('');
    setIsModalOpen(false);
  };

  const filteredOrgs = organizationList.filter((item) => {
    if (orgFilter === 'all') return true;
    return item.category === orgFilter;
  });

  return (
    <section id="portofolio" className="relative py-20 lg:py-28 overflow-hidden bg-slate-950 text-white">
      {/* 
        VISUAL BACKGROUND PORTOFOLIO:
        Artistically and aesthetically blending "gambar 3" (Seni Hadrah Rebana) & "gambar 4" (Pembelajaran Smartboard)
        to attract visitors and enhance the portfolio's visual impact without rigid photo boxes.
      */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Photo 3: Rebana Hadrah (Top / Left blend) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            bgBlendMode === 'both' ? 'opacity-25 lg:opacity-30' : bgBlendMode === 'gambar3' ? 'opacity-70' : 'opacity-0'
          }`}
          style={{
            clipPath: 'polygon(0 0, 70% 0, 30% 100%, 0% 100%)',
          }}
        >
          <img
            src={photoGambar3}
            alt="Dokumentasi Pelatihan Seni Hadrah Rebana"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter saturate-[0.9] contrast-[1.1] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950" />
        </div>

        {/* Photo 4: Pembelajaran Smartboard Inovasi (Bottom / Right blend) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            bgBlendMode === 'both' ? 'opacity-25 lg:opacity-30' : bgBlendMode === 'gambar4' ? 'opacity-70' : 'opacity-0'
          }`}
          style={{
            clipPath: 'polygon(35% 0, 100% 0, 100% 100%, 15% 100%)',
          }}
        >
          <img
            src={photoGambar4}
            alt="Dokumentasi Mengajar Inovasi Smart Screen TV"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter saturate-[0.9] contrast-[1.1] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950" />
        </div>

        {/* Atmospheric Scrim to maintain WCAG AA text contrast */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/60 to-slate-950" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Rekam Jejak & Pengabdian</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-sans-body">
              Portofolio Perjalanan
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
              Rangkaian riwayat pendidikan formal, kepemimpinan organisasi kemasyarakatan, serta inisiatif inovasi pembelajaran di ruang kelas.
            </p>
          </div>

          {/* Interactive Background Visual Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 p-1 bg-white/10 backdrop-blur-md rounded-xl text-xs border border-white/10">
              <span className="px-2 text-slate-400 hidden sm:inline">Visual Latar:</span>
              <button
                onClick={() => setBgBlendMode('both')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  bgBlendMode === 'both' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300 hover:text-white'
                }`}
              >
                Padukan 2 Foto
              </button>
              <button
                onClick={() => setBgBlendMode('gambar3')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  bgBlendMode === 'gambar3' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300 hover:text-white'
                }`}
              >
                Hadrah (Foto 3)
              </button>
              <button
                onClick={() => setBgBlendMode('gambar4')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  bgBlendMode === 'gambar4' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300 hover:text-white'
                }`}
              >
                Smartboard (Foto 4)
              </button>
            </div>
          </div>
        </div>

        {/* Portofolio Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-white/10">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            Semua Bagian
          </button>
          <button
            onClick={() => setActiveTab('pendidikan')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'pendidikan'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Riwayat Pendidikan ({educationList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('organisasi')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'organisasi'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Pengalaman Organisasi ({organizationList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('inovasi')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'inovasi'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            <span>Karya Inovasi{innovationList.length > 0 ? ` (${innovationList.length})` : ''}</span>
          </button>
        </div>

        {/* 1. SECTION: RIWAYAT PENDIDIKAN */}
        {(activeTab === 'all' || activeTab === 'pendidikan') && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block">
                  Jejak Studi & Akademik
                </span>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2.5 mt-1">
                  <GraduationCap className="h-6 w-6 text-emerald-400" />
                  <span>Riwayat Pendidikan</span>
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                2004 — 2025 (21 Tahun Berproses)
              </span>
            </div>

            {/* Vertical Interactive Timeline */}
            <div className="relative pl-6 sm:pl-8 border-l border-emerald-500/30 space-y-8 before:absolute before:top-0 before:left-[-1px] before:h-full before:w-[2px] before:bg-gradient-to-b before:from-emerald-400 before:via-teal-500 before:to-slate-800">
              {educationList.map((item, index) => {
                const isHigherEd = item.stage.includes('Magister') || item.stage.includes('Sarjana');
                return (
                  <div key={item.id} className="relative group">
                    {/* Timeline Node Dot */}
                    <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full transition-transform group-hover:scale-125 ${
                      isHigherEd
                        ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                        : 'bg-slate-800 text-emerald-400 ring-2 ring-white/10'
                    }`}>
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>

                    {/* Timeline Card */}
                    <div className={`p-5 rounded-2xl border backdrop-blur-md transition-all ${
                      isHigherEd
                        ? 'bg-gradient-to-br from-emerald-950/50 via-slate-900/80 to-slate-900/90 border-emerald-500/30 shadow-lg shadow-emerald-950/20'
                        : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                    }`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                            isHigherEd ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-slate-300'
                          }`}>
                            {item.stage}
                          </span>
                          {item.degree && (
                            <span className="text-xs text-emerald-200 font-serif-display font-medium">
                              {item.degree}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono tabular-nums text-slate-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.years}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {item.institution}
                      </h4>

                      {item.description && (
                        <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. SECTION: PENGALAMAN ORGANISASI */}
        {(activeTab === 'all' || activeTab === 'organisasi') && (
          <div className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 block">
                  Kepemimpinan & Jiwa Sosial
                </span>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2.5 mt-1">
                  <Users className="h-6 w-6 text-teal-400" />
                  <span>Pengalaman Organisasi</span>
                </h3>
              </div>

              {/* Sub-filter for Organization */}
              <div className="inline-flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl text-xs">
                <button
                  onClick={() => setOrgFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    orgFilter === 'all' ? 'bg-teal-600 text-white font-medium' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Semua ({organizationList.length})
                </button>
                <button
                  onClick={() => setOrgFilter('luar_sekolah')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    orgFilter === 'luar_sekolah' ? 'bg-teal-600 text-white font-medium' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Di Luar Sekolah (5)
                </button>
                <button
                  onClick={() => setOrgFilter('pekerjaan')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    orgFilter === 'pekerjaan' ? 'bg-teal-600 text-white font-medium' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Di Pekerjaan (3)
                </button>
              </div>
            </div>

            {/* Organizations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOrgs.map((org) => {
                const isWork = org.category === 'pekerjaan';
                return (
                  <div
                    key={org.id}
                    className="p-5 rounded-2xl border border-white/10 bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-md transition-all flex flex-col justify-between hover:border-teal-400/40"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-medium ${
                          isWork ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        }`}>
                          {isWork ? <Briefcase className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                          {isWork ? 'Organisasi Pekerjaan' : 'Di Luar Sekolah'}
                        </span>
                        <span className="font-mono tabular-nums text-slate-400">
                          {org.period}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white mb-1.5">
                        {org.roleOrName}
                      </h4>

                      {org.institution && (
                        <p className="text-xs font-medium text-emerald-300/90 mb-2">
                          {org.institution}
                        </p>
                      )}

                      {org.details && (
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {org.details}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Status: Terverifikasi</span>
                      <span className="text-teal-400">Aktif Berkontribusi</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. SECTION: KARYA INOVASI & PROGRAM UNGGULAN */}
        {(activeTab === 'all' || activeTab === 'inovasi') && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                  Kreativitas & Program Unggulan
                </span>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2.5 mt-1">
                  <Lightbulb className="h-6 w-6 text-amber-400" />
                  <span>Karya Inovasi & Program Unggulan</span>
                </h3>
              </div>

              {/* Action: Open Add Innovation Modal */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Unggah / Tambah Karya Inovasi</span>
              </button>
            </div>

            {/* Innovation Cards Grid or Empty State with Upload Option */}
            {innovationList.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-3xl border border-dashed border-emerald-500/40 bg-slate-900/60 backdrop-blur-md text-center max-w-2xl mx-auto my-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto mb-4 border border-emerald-500/30">
                  <Lightbulb className="h-7 w-7" />
                </div>
                <h4 className="text-lg font-bold text-white">
                  Karya Inovasi Masih Kosong
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 mb-6 leading-relaxed max-w-lg mx-auto">
                  Ruang ini disediakan khusus untuk mendokumentasikan karya inovasi, media pembelajaran digital interaktif, modul ajar, dan program ekstrakurikuler unggulan Anda.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-emerald-950/50 transition-all hover:scale-102"
                >
                  <Plus className="h-4 w-4" />
                  <span>Unggah / Tambah Karya Inovasi Baru</span>
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {innovationList.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-slate-900/75 overflow-hidden backdrop-blur-md flex flex-col justify-between hover:border-emerald-400/40 transition-all group"
                    >
                      {/* Image Header if available */}
                      {item.imageUrl && (
                        <div 
                          onClick={() => onOpenLightbox(item.imageUrl!, item.title, item.description)}
                          className="relative aspect-video w-full overflow-hidden bg-slate-800 cursor-pointer"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                          
                          <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white text-xs backdrop-blur-md flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="h-3.5 w-3.5" />
                            <span>Perbesar Foto</span>
                          </div>

                          <div className="absolute bottom-3 left-3">
                            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-700/80 text-white backdrop-blur-md">
                              {item.year}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Body Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                            {item.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                            {item.description}
                          </p>
                        </div>

                        {/* Tags */}
                        <div>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {item.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/10 text-slate-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Footer Actions */}
                          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                            <span className="text-slate-400">
                              Kategori: <strong className="text-slate-200">{item.category.replace('_', ' ')}</strong>
                            </span>

                            <div className="flex items-center gap-3">
                              {item.externalLink && (
                                <a
                                  href={item.externalLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                                >
                                  <span>Buka Tautan</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                              {onDeleteInnovation && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Hapus karya inovasi "${item.title}"?`)) {
                                      onDeleteInnovation(item.id);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors p-1 rounded-md hover:bg-rose-500/10"
                                  title="Hapus Karya Inovasi"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span className="text-[11px]">Hapus</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Add Prompt */}
                <div className="mt-8 p-6 rounded-2xl border border-dashed border-emerald-500/40 bg-emerald-950/20 text-center">
                  <Lightbulb className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <h4 className="text-base font-semibold text-white">
                    Ingin Menambahkan Karya Inovasi Lainnya?
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-1 mb-4">
                    Anda dapat menambahkan judul program, modul, tautan Google Drive/YouTube, atau mengunggah foto kegiatan kapan saja.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Karya Inovasi Sekarang</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      </div>

      {/* MODAL: Form Tambah Karya Inovasi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-bold">Tambah Karya Inovasi & Program</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitInnovation} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul Karya / Program Inovasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Video Pembelajaran Interaktif PAI..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kategori Program
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="media_digital">Media Digital & Smart Screen</option>
                    <option value="ekstrakurikuler">Ekstrakurikuler & Seni Rebana</option>
                    <option value="karakter">Pembinaan Karakter & Pramuka</option>
                    <option value="modul_ajar">Modul Ajar & Kurikulum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tahun Pelaksanaan
                  </label>
                  <input
                    type="text"
                    placeholder="2025"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Deskripsi Lengkap Kegiatan / Inovasi
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan tujuan, metode, dan dampak bagi peserta didik..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kata Kunci / Tag (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Smart TV, PAI, Siswa Aktif, Kurikulum Merdeka"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tautan Eksternal / Dokumen / Drive (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... atau https://youtube.com/..."
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Unggah Foto Kegiatan (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:text-xs hover:file:bg-emerald-700 cursor-pointer"
                />
                {newImagePreview && (
                  <div className="mt-2 h-24 w-full rounded-lg overflow-hidden border border-slate-700">
                    <img src={newImagePreview} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md"
                >
                  Simpan Karya Inovasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
