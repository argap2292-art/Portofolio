import React, { useState } from 'react';
import { PublicationItem } from '../types';
import { 
  BookOpen, 
  Search, 
  Plus, 
  ExternalLink, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Calendar, 
  Sparkles,
  Bookmark,
  Share2,
  Trash2
} from 'lucide-react';

interface PublicationSectionProps {
  publications: PublicationItem[];
  onAddPublication: (item: Omit<PublicationItem, 'id'>) => void;
  onDeletePublication?: (id: string) => void;
}

export const PublicationSection: React.FC<PublicationSectionProps> = ({
  publications,
  onAddPublication,
  onDeletePublication,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeReadingItem, setActiveReadingItem] = useState<PublicationItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states for new publication
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<PublicationItem['type']>('Jurnal');
  const [newPublisher, setNewPublisher] = useState('');
  const [newYear, setNewYear] = useState('2025');
  const [newAbstract, setNewAbstract] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newDoi, setNewDoi] = useState('');
  const [newTags, setNewTags] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileDataUrl, setUploadedFileDataUrl] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedFileDataUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAddPublication({
      title: newTitle.trim(),
      type: newType,
      publisherOrInstitution: newPublisher.trim() || 'UIN Ponorogo',
      year: newYear.trim() || '2025',
      abstract: newAbstract.trim() || 'Karya tulis ilmiah dalam bidang Pendidikan Agama Islam.',
      externalUrl: newLink.trim() || undefined,
      fileUrl: uploadedFileDataUrl || undefined,
      doiOrIssn: newDoi.trim() || undefined,
      tags: tagsArray.length > 0 ? tagsArray : ['PAI', 'Karya Ilmiah'],
    });

    // Reset
    setNewTitle('');
    setNewPublisher('');
    setNewYear('2025');
    setNewAbstract('');
    setNewLink('');
    setNewDoi('');
    setNewTags('');
    setUploadedFileName('');
    setUploadedFileDataUrl('');
    setIsAddModalOpen(false);
  };

  const handleCopyCitation = (pub: PublicationItem) => {
    const citation = `Pratama, A. P. (${pub.year}). ${pub.title}. ${pub.publisherOrInstitution}.`;
    navigator.clipboard.writeText(citation);
    setCopiedId(pub.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredPublications = publications.filter((pub) => {
    const matchesSearch =
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.publisherOrInstitution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || pub.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <section id="publikasi" className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">
              <BookOpen className="h-4 w-4" />
              <span>Karya Tulis Ilmiah & Jurnal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-sans-body">
              Publikasi Akademik
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Dokumentasi karya tulis ilmiah, tesis magister, skripsi, serta artikel jurnal hasil penelitian dan praktik baik pendidikan Islam.
            </p>
          </div>

          {/* Action to add new publication */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs sm:text-sm shadow-sm transition-all self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah / Lampirkan Publikasi Baru</span>
          </button>
        </div>

        {/* If no publications exist yet (clean empty state as requested) */}
        {publications.length === 0 ? (
          <div className="p-8 sm:p-14 rounded-3xl border border-dashed border-emerald-400/80 bg-white shadow-xs text-center max-w-2xl mx-auto my-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 mx-auto mb-4 border border-emerald-200">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Daftar Publikasi Masih Kosong
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 mb-6 leading-relaxed max-w-lg mx-auto">
              Ruang ini disediakan khusus untuk Anda melampirkan karya tulis ilmiah, skripsi, tesis magister (S-2), artikel jurnal terindeks, dokumen PDF, dan prosiding seminar.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs sm:text-sm shadow-md transition-all hover:scale-102"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah / Lampirkan Publikasi Baru</span>
            </button>
          </div>
        ) : (
          <>
            {/* Search & Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari judul, topik, atau kata kunci..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-800"
                />
              </div>

              {/* Type Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['all', 'Tesis', 'Skripsi', 'Jurnal', 'Prosiding'].map((typeKey) => (
                  <button
                    key={typeKey}
                    onClick={() => setSelectedType(typeKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedType === typeKey
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {typeKey === 'all' ? 'Semua Kategori' : typeKey}
                  </button>
                ))}
              </div>
            </div>

            {/* Publications List */}
            <div className="space-y-5">
              {filteredPublications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
                  <FileText className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-slate-800">Tidak ada publikasi yang cocok dengan pencarian</h3>
                  <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci lain atau pilih Semua Kategori.</p>
                </div>
              ) : (
                filteredPublications.map((pub) => (
                  <div
                    key={pub.id}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Metadata Header */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-md font-semibold ${
                            pub.type === 'Tesis'
                              ? 'bg-purple-100 text-purple-800'
                              : pub.type === 'Jurnal'
                              ? 'bg-emerald-100 text-emerald-800'
                              : pub.type === 'Prosiding'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {pub.type}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums text-slate-600">{pub.year}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-700 font-medium">{pub.publisherOrInstitution}</span>
                          {pub.doiOrIssn && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono text-slate-500">{pub.doiOrIssn}</span>
                            </>
                          )}
                        </div>

                        {/* Title */}
                        <h3 
                          onClick={() => setActiveReadingItem(pub)}
                          className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors cursor-pointer"
                        >
                          {pub.title}
                        </h3>

                        {/* Abstract preview */}
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {pub.abstract}
                        </p>

                        {/* Tags */}
                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                          {pub.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <button
                          onClick={() => setActiveReadingItem(pub)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium text-xs transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>Baca Abstrak</span>
                        </button>

                        <button
                          onClick={() => handleCopyCitation(pub)}
                          title="Salin Sitasi Format APA"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs transition-colors"
                        >
                          {copiedId === pub.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-medium">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 text-slate-400" />
                              <span>Salin Sitasi</span>
                            </>
                          )}
                        </button>

                        {pub.fileUrl && (
                          <a
                            href={pub.fileUrl}
                            download={`${pub.title}.pdf`}
                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 text-xs transition-colors font-medium"
                          >
                            <Download className="h-3 w-3" />
                            <span>Unduh File</span>
                          </a>
                        )}

                        {pub.externalUrl && (
                          <a
                            href={pub.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 text-xs transition-colors"
                          >
                            <span>Tautan Luar</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}

                        {onDeletePublication && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Hapus publikasi "${pub.title}"?`)) {
                                onDeletePublication(pub.id);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 text-xs transition-colors pt-1"
                            title="Hapus Publikasi"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Hapus</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Space/Callout Khusus Lampirkan Publikasi Baru */}
            <div className="mt-12 p-8 rounded-3xl border border-dashed border-emerald-300 bg-emerald-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Punya Publikasi Jurnal atau File Karya Ilmiah Tambahan?
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                    Sistem ini menyediakan slot interaktif untuk mendokumentasikan dokumen PDF, tautan repositori universitas, DOI jurnal, atau ringkasan penelitian terbaru Anda.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs sm:text-sm shadow-sm transition-all whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                <span>Unggah / Lampirkan Sekarang</span>
              </button>
            </div>
          </>
        )}

      </div>

      {/* MODAL: BACA ABSTRAK & DETAIL PUBLIKASI */}
      {activeReadingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-900">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  {activeReadingItem.type} · {activeReadingItem.year}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {activeReadingItem.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Penulis: <strong>Arga Putra Pratama, M.Pd.</strong> · {activeReadingItem.publisherOrInstitution}
                </p>
              </div>
              <button
                onClick={() => setActiveReadingItem(null)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Abstrak Karya Ilmiah
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {activeReadingItem.abstract}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Sitasi Rekomendasi (Format APA 7th Edition)
                </h4>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700">
                  <span className="truncate mr-2">
                    Pratama, A. P. ({activeReadingItem.year}). {activeReadingItem.title}. {activeReadingItem.publisherOrInstitution}.
                  </span>
                  <button
                    onClick={() => handleCopyCitation(activeReadingItem)}
                    className="shrink-0 p-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-700"
                    title="Salin Sitasi"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Dokumen Resmi Terverifikasi
              </span>
              <div className="flex items-center gap-2">
                {activeReadingItem.externalUrl && (
                  <a
                    href={activeReadingItem.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Buka Tautan Repositori / Jurnal</span>
                  </a>
                )}
                <button
                  onClick={() => setActiveReadingItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH PUBLIKASI BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-slate-900">Unggah / Lampirkan Publikasi Ilmiah</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNew} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Judul Karya Ilmiah / Jurnal / Tesis *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Efektivitas Media Pembelajaran Interaktif..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Jenis Karya
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Tesis">Tesis Magister (S-2)</option>
                    <option value="Skripsi">Skripsi Sarjana (S-1)</option>
                    <option value="Jurnal">Artikel Jurnal Ilmiah</option>
                    <option value="Prosiding">Prosiding Seminar</option>
                    <option value="Buku / Modul">Buku / Modul Ajar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tahun Terbit / Disahkan
                  </label>
                  <input
                    type="text"
                    placeholder="2025"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Penerbit / Institusi / Nama Jurnal
                  </label>
                  <input
                    type="text"
                    placeholder="UIN Ponorogo / Jurnal Tarbiyah..."
                    value={newPublisher}
                    onChange={(e) => setNewPublisher(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nomor ISSN / DOI (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="ISSN 2745-9821 atau 10.1234/..."
                    value={newDoi}
                    onChange={(e) => setNewDoi(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Abstrak / Ringkasan Penelitian
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan latar belakang singkat, metodologi, dan temuan utama..."
                  value={newAbstract}
                  onChange={(e) => setNewAbstract(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tautan File / Link Repository Luar (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://etheses.iainponorogo.ac.id/... atau Google Drive"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Lampirkan File Dokumen / PDF (Opsional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-800 file:text-white file:text-xs hover:file:bg-slate-700 cursor-pointer"
                />
                {uploadedFileName && (
                  <p className="text-xs text-emerald-700 mt-1 font-medium">
                    ✓ File dipilih: {uploadedFileName}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium shadow-sm"
                >
                  Simpan Publikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
