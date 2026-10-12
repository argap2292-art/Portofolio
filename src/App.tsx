/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { ProfileSection } from './components/ProfileSection';
import { PortfolioSection } from './components/PortfolioSection';
import { PublicationSection } from './components/PublicationSection';
import { Footer } from './components/Footer';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { ContactModal } from './components/ContactModal';
import { PhotoManagerModal } from './components/PhotoManagerModal';
import { 
  INITIAL_PROFILE, 
  INITIAL_EDUCATION, 
  INITIAL_ORGANIZATIONS, 
  INITIAL_INNOVATIONS, 
  INITIAL_PUBLICATIONS,
  DEFAULT_PHOTOS 
} from './data/portfolioData';
import { InnovationItem, PublicationItem } from './types';

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

  // Innovations list state
  const [innovations, setInnovations] = useState<InnovationItem[]>(() => {
    const saved = localStorage.getItem('arga_portfolio_innovations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_INNOVATIONS;
      }
    }
    return INITIAL_INNOVATIONS;
  });

  // Publications list state
  const [publications, setPublications] = useState<PublicationItem[]>(() => {
    const saved = localStorage.getItem('arga_portfolio_publications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PUBLICATIONS;
      }
    }
    return INITIAL_PUBLICATIONS;
  });

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
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);

  // Sync photos to LocalStorage
  const handleUpdatePhoto = (
    slotKey: 'gambar1' | 'gambar2' | 'gambar3' | 'gambar4' | 'profilSaya',
    newUrl: string
  ) => {
    setPhotos((prev: typeof DEFAULT_PHOTOS) => {
      const updated = { ...prev, [slotKey]: newUrl };
      localStorage.setItem('arga_portfolio_photos_v2', JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetPhotos = () => {
    setPhotos(DEFAULT_PHOTOS);
    localStorage.removeItem('arga_portfolio_photos_v2');
  };

  // Add Innovation handler
  const handleAddInnovation = (item: Omit<InnovationItem, 'id'>) => {
    const newItem: InnovationItem = {
      ...item,
      id: `inv-${Date.now()}`,
    };
    setInnovations((prev) => {
      const updated = [newItem, ...prev];
      localStorage.setItem('arga_portfolio_innovations', JSON.stringify(updated));
      return updated;
    });
  };

  // Add Publication handler
  const handleAddPublication = (item: Omit<PublicationItem, 'id'>) => {
    const newItem: PublicationItem = {
      ...item,
      id: `pub-${Date.now()}`,
    };
    setPublications((prev) => {
      const updated = [newItem, ...prev];
      localStorage.setItem('arga_portfolio_publications', JSON.stringify(updated));
      return updated;
    });
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
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 64;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Intersection observer to track active section while scrolling
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'profile', 'portofolio', 'publikasi'];
      const scrollPosition = window.scrollY + 100;

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
      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenPhotoManager={() => setIsPhotoManagerOpen(true)}
      />

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
        />

        {/* 4. Halaman / Bagian Publikasi: Tesis S-2, Jurnal, Skripsi, Prosiding, & Space Interaktif */}
        <PublicationSection
          publications={publications}
          onAddPublication={handleAddPublication}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenContact={() => setIsContactOpen(true)}
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

      <PhotoManagerModal
        isOpen={isPhotoManagerOpen}
        photos={photos}
        onUpdatePhoto={handleUpdatePhoto}
        onResetPhotos={handleResetPhotos}
        onClose={() => setIsPhotoManagerOpen(false)}
        onOpenLightbox={handleOpenLightbox}
      />
    </div>
  );
}
