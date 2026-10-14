/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { ProfileSection } from './components/ProfileSection';
import { PortfolioSection } from './components/PortfolioSection';
import { PublicationSection } from './components/PublicationSection';
import { Footer } from './components/Footer';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { ContactModal } from './components/ContactModal';
import { SupabaseStatusModal } from './components/SupabaseStatusModal';
import { 
  INITIAL_PROFILE, 
  INITIAL_EDUCATION, 
  INITIAL_ORGANIZATIONS, 
  INITIAL_INNOVATIONS, 
  INITIAL_PUBLICATIONS,
  DEFAULT_PHOTOS 
} from './data/portfolioData';
import { InnovationItem, PublicationItem } from './types';
import {
  fetchPublicationsFromSupabase,
  insertPublicationToSupabase,
  deletePublicationFromSupabase,
  fetchInnovationsFromSupabase,
  insertInnovationToSupabase,
  deleteInnovationFromSupabase,
  updateInnovationPhotoInSupabase,
  fetchProfileAvatarFromSupabase,
  saveProfileAvatarToSupabase,
  TABLE_PENGATURAN_PROFIL,
  supabase,
} from './lib/supabase';
import { Database, ShieldAlert, Sparkles, Check } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');

  // Photo slots with LocalStorage fallback
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('arga_portfolio_photos_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PHOTOS;
      }
    }
    return DEFAULT_PHOTOS;
  });

  // Innovations list state (synced with Supabase)
  const [innovations, setInnovations] = useState<InnovationItem[]>(() => {
    try {
      const saved = localStorage.getItem('arga_portfolio_innovations_empty_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      return INITIAL_INNOVATIONS;
    }
    return INITIAL_INNOVATIONS;
  });

  // Publications list state (synced with Supabase)
  const [publications, setPublications] = useState<PublicationItem[]>(() => {
    try {
      const saved = localStorage.getItem('arga_portfolio_publications_empty_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      return INITIAL_PUBLICATIONS;
    }
    return INITIAL_PUBLICATIONS;
  });

  // Supabase sync states
  const [isSupabaseLoading, setIsSupabaseLoading] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [showRlsBanner, setShowRlsBanner] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    description: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
    description: '',
  });

  const [isContactOpen, setIsContactOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------------------
  // Fetch from Supabase (Publications, Innovations, & Profile Avatar)
  // -------------------------------------------------------------------------
  const loadDataFromSupabase = useCallback(async () => {
    setIsSupabaseLoading(true);
    setSupabaseError(null);

    try {
      const [pubRes, invRes, avatarRes] = await Promise.all([
        fetchPublicationsFromSupabase(),
        fetchInnovationsFromSupabase(),
        fetchProfileAvatarFromSupabase(),
      ]);

      if (pubRes.error || invRes.error) {
        const errMsg = pubRes.error?.message || invRes.error?.message || 'Gagal sinkronisasi';
        setSupabaseError(errMsg);
        if (pubRes.needsRlsFix || invRes.needsRlsFix) {
          setShowRlsBanner(true);
        }
      } else {
        setPublications(pubRes.data);
        localStorage.setItem(
          'arga_portfolio_publications_empty_v1',
          JSON.stringify(pubRes.data)
        );

        setInnovations(invRes.data);
        localStorage.setItem(
          'arga_portfolio_innovations_empty_v1',
          JSON.stringify(invRes.data)
        );

        // Sinkronisasi foto profil dari Supabase (avatar_url)
        if (avatarRes.avatarUrl) {
          setPhotos((prev: typeof DEFAULT_PHOTOS) => {
            const updated = { ...prev, profilSaya: avatarRes.avatarUrl! };
            localStorage.setItem('arga_portfolio_photos_v2', JSON.stringify(updated));
            return updated;
          });
        }

        setLastSyncTime(new Date());
        setShowRlsBanner(false);
      }
    } catch (err: any) {
      setSupabaseError(err.message || 'Eror koneksi Supabase');
    } finally {
      setIsSupabaseLoading(false);
    }
  }, []);

  // Fetch on mount and subscribe to realtime changes across tables
  useEffect(() => {
    loadDataFromSupabase();

    // Setup Supabase Realtime Channel
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Publikasi' },
        () => {
          fetchPublicationsFromSupabase().then((res) => {
            if (!res.error) setPublications(res.data);
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Karya Inovasi' },
        () => {
          fetchInnovationsFromSupabase().then((res) => {
            if (!res.error) setInnovations(res.data);
          });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE_PENGATURAN_PROFIL },
        () => {
          fetchProfileAvatarFromSupabase().then((res) => {
            if (res.avatarUrl) {
              setPhotos((prev: typeof DEFAULT_PHOTOS) => {
                const updated = { ...prev, profilSaya: res.avatarUrl! };
                localStorage.setItem('arga_portfolio_photos_v2', JSON.stringify(updated));
                return updated;
              });
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadDataFromSupabase]);

  // Sync photos to State, LocalStorage, and Supabase for profile photo
  const handleUpdatePhoto = async (
    slotKey: 'gambar1' | 'gambar2' | 'gambar3' | 'gambar4' | 'profilSaya',
    newUrl: string
  ) => {
    setPhotos((prev: typeof DEFAULT_PHOTOS) => {
      const updated = { ...prev, [slotKey]: newUrl };
      localStorage.setItem('arga_portfolio_photos_v2', JSON.stringify(updated));
      return updated;
    });

    // Jika yang diubah adalah foto profil saya, simpan ke tabel Pengaturan _Profil di Supabase
    if (slotKey === 'profilSaya') {
      const res = await saveProfileAvatarToSupabase(newUrl);
      if (res.error) {
        console.warn('[Supabase DB] Catatan sinkronisasi foto profil:', res.error.message);
      } else {
        showToast('Foto profil berhasil disinkronkan ke seluruh perangkat!');
      }
    }
  };

  // -------------------------------------------------------------------------
  // Add & Delete Innovation handlers (Online to Supabase)
  // -------------------------------------------------------------------------
  const handleAddInnovation = async (
    item: Omit<InnovationItem, 'id'>,
    file?: File | null
  ): Promise<{ success: boolean; error?: string; storageWarning?: string | null }> => {
    setIsSupabaseLoading(true);
    setSupabaseError(null);

    try {
      showToast(
        file
          ? 'Mengunggah berkas inovasi & menyimpan data ke Supabase...'
          : 'Menyimpan karya inovasi ke Supabase Cloud...'
      );

      const res = await insertInnovationToSupabase(item, file);

      if (res.error) {
        console.error('[Supabase] Gagal menyimpan karya inovasi:', res.error);
        const errMsg = res.error.message;
        setSupabaseError(errMsg);

        if (res.needsRlsFix) {
          setShowRlsBanner(true);
          setIsSupabaseModalOpen(true);
        }

        showToast(`Gagal ke Supabase: ${errMsg}`);
        return { success: false, error: errMsg };
      }

      if (res.data) {
        const savedItem = res.data;
        // Update live state dengan baris nyata dari Supabase
        setInnovations((prev) => [savedItem, ...prev]);
        setLastSyncTime(new Date());

        // Update local backup cache
        try {
          const cached = JSON.parse(
            localStorage.getItem('arga_portfolio_innovations_empty_v1') || '[]'
          );
          localStorage.setItem(
            'arga_portfolio_innovations_empty_v1',
            JSON.stringify([savedItem, ...cached.filter((i: any) => i.id !== savedItem.id)])
          );
        } catch (_) {}

        if (res.storageWarning) {
          showToast(`Karya inovasi tersimpan (${res.storageWarning})`);
        } else if (file) {
          showToast('Berkas & Karya inovasi berhasil disimpan ke Supabase Cloud!');
        } else {
          showToast('Karya inovasi berhasil disimpan ke Supabase Cloud!');
        }

        return { success: true, storageWarning: res.storageWarning };
      }

      return { success: false, error: 'Tidak ada data respons dari database' };
    } catch (err: any) {
      const errMsg = err.message || 'Terjadi kesalahan sistem';
      showToast(`Eror: ${errMsg}`);
      return { success: false, error: errMsg };
    } finally {
      setIsSupabaseLoading(false);
    }
  };

  const handleDeleteInnovation = async (id: string) => {
    showToast('Menghapus karya inovasi dari Supabase...');
    const res = await deleteInnovationFromSupabase(id);
    if (!res.success && res.error) {
      console.warn('Gagal menghapus dari Supabase:', res.error.message);
      showToast(`Gagal menghapus: ${res.error.message}`);
    } else {
      setInnovations((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        try {
          localStorage.setItem('arga_portfolio_innovations_empty_v1', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
      showToast('Karya inovasi berhasil dihapus');
    }
  };

  const handleUpdateInnovationPhoto = async (id: string, fileOrUrl: File | string) => {
    showToast('Mengunggah foto kegiatan ke Supabase Storage (Berkas Karya)...');
    const res = await updateInnovationPhotoInSupabase(id, fileOrUrl);
    if (!res.success && res.error) {
      console.warn('Gagal menyimpan foto:', res.error.message);
      if (res.needsRlsFix) {
        setShowRlsBanner(true);
        setIsSupabaseModalOpen(true);
      }
      showToast(`Gagal menyimpan foto: ${res.error.message}`);
    } else {
      showToast('Foto kegiatan berhasil disimpan ke Supabase Storage dan terhubung ke kartu!');
      if (res.url) {
        setInnovations((prev) => {
          const updated = prev.map((item) =>
            item.id === id ? { ...item, imageUrl: res.url, externalLink: res.url } : item
          );
          try {
            localStorage.setItem('arga_portfolio_innovations_empty_v1', JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });
      }
    }
  };

  // -------------------------------------------------------------------------
  // Add & Delete Publication handlers (Online to Supabase)
  // -------------------------------------------------------------------------
  const handleAddPublication = async (
    item: Omit<PublicationItem, 'id'>,
    file?: File | null
  ): Promise<{ success: boolean; error?: string; storageWarning?: string | null }> => {
    setIsSupabaseLoading(true);
    setSupabaseError(null);

    try {
      showToast(
        file
          ? 'Mengunggah berkas PDF & menyimpan data ke Supabase...'
          : 'Menyimpan data publikasi ke Supabase...'
      );

      const res = await insertPublicationToSupabase(item, file);

      if (res.error) {
        console.error('[Supabase] Gagal menyimpan publikasi:', res.error);
        const errMsg = res.error.message;
        setSupabaseError(errMsg);

        if (res.needsRlsFix) {
          setShowRlsBanner(true);
          setIsSupabaseModalOpen(true);
        }

        showToast(`Gagal ke Supabase: ${errMsg}`);
        return { success: false, error: errMsg };
      }

      if (res.data) {
        const savedItem = res.data;
        // Update live state dengan data nyata dari Supabase
        setPublications((prev) => [savedItem, ...prev]);
        setLastSyncTime(new Date());

        if (res.storageWarning) {
          showToast(`Publikasi tersimpan (${res.storageWarning})`);
        } else if (file) {
          showToast('Berkas PDF & Publikasi berhasil disimpan ke Supabase Cloud!');
        } else {
          showToast('Publikasi berhasil disimpan ke Supabase Cloud!');
        }

        return {
          success: true,
          storageWarning: res.storageWarning,
        };
      }

      return { success: false, error: 'Tidak ada data kembali dari Supabase' };
    } catch (err: any) {
      console.error('[App] Exception:', err);
      return { success: false, error: err.message || 'Kesalahan jaringan' };
    } finally {
      setIsSupabaseLoading(false);
    }
  };

  const handleDeletePublication = async (id: string) => {
    setPublications((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem('arga_portfolio_publications_empty_v1', JSON.stringify(updated));
      return updated;
    });

    showToast('Menghapus publikasi...');
    const res = await deletePublicationFromSupabase(id);
    if (!res.success && res.error) {
      console.warn('Gagal menghapus dari Supabase:', res.error.message);
    } else {
      showToast('Data publikasi terhapus');
    }
  };

  // Lightbox opener
  const handleOpenLightbox = (imageUrl: string, title: string, description: string) => {
    setLightboxData({
      isOpen: true,
      imageUrl,
      title,
      description,
    });
  };

  // Smooth Navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'profile', 'portofolio', 'publikasi'];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Navigation Bar with Supabase Online indicator */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenSupabaseStatus={() => setIsSupabaseModalOpen(true)}
      />

      {/* RLS Policy Notice Banner (if anon insert policy is needed) */}
      {showRlsBanner && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-medium text-center flex items-center justify-center gap-2 shadow-sm">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>
            Database Supabase terhubung! Klik di sini untuk melihat 1-click script SQL agar data tersimpan publik.
          </span>
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className="underline font-bold hover:text-black ml-1"
          >
            Buka Panduan SQL & Status
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Halaman Utama (Home): Sapaan, Motivasi, & Kolaborasi Estetik Gambar 1 & Gambar 2 */}
        <HomeSection
          photoGambar1={photos.gambar1}
          photoGambar2={photos.gambar2}
          onNavigate={handleNavigate}
          onOpenLightbox={handleOpenLightbox}
        />

        {/* 2. Halaman / Bagian Profile: Bingkai Khusus Foto "profil saya", Biodata, Hobi, & Motivasi Hidup */}
        <ProfileSection
          profile={INITIAL_PROFILE}
          photoProfilSaya={photos.profilSaya}
          onOpenLightbox={handleOpenLightbox}
          onOpenContact={() => setIsContactOpen(true)}
          onNavigateToPortfolio={() => handleNavigate('portofolio')}
          onUpdatePhoto={(newUrl) => handleUpdatePhoto('profilSaya', newUrl)}
        />

        {/* 3. Halaman / Bagian Portofolio: Background Kolaboratif Gambar 3 & 4, Pendidikan, Organisasi, & Inovasi */}
        <PortfolioSection
          educationList={INITIAL_EDUCATION}
          organizationList={INITIAL_ORGANIZATIONS}
          innovationList={innovations}
          photoGambar3={photos.gambar3}
          photoGambar4={photos.gambar4}
          onOpenLightbox={handleOpenLightbox}
          onAddInnovation={handleAddInnovation}
          onDeleteInnovation={handleDeleteInnovation}
          onUpdateInnovationPhoto={handleUpdateInnovationPhoto}
          onOpenSupabaseStatus={() => setIsSupabaseModalOpen(true)}
        />

        {/* 4. Halaman / Bagian Publikasi: Tesis S-2, Jurnal, Skripsi, Prosiding, & Space Interaktif */}
        <PublicationSection
          publications={publications}
          onAddPublication={handleAddPublication}
          onDeletePublication={handleDeletePublication}
          onOpenSupabaseStatus={() => setIsSupabaseModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Supabase Status Modal */}
      <SupabaseStatusModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onRefresh={loadDataFromSupabase}
        isLoading={isSupabaseLoading}
        pubCount={publications.length}
        invCount={innovations.length}
        lastSyncTime={lastSyncTime}
        errorMessage={supabaseError}
      />

      {/* Modals */}
      <ImageLightboxModal
        isOpen={lightboxData.isOpen}
        imageUrl={lightboxData.imageUrl}
        title={lightboxData.title}
        description={lightboxData.description}
        onClose={() => setLightboxData((prev) => ({ ...prev, isOpen: false }))}
      />

      <ContactModal
        isOpen={isContactOpen}
        profile={INITIAL_PROFILE}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
