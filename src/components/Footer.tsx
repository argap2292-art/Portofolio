import React from 'react';
import { Heart, MapPin, Mail, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenContact }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          
          {/* Brand Info */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Arga Putra Pratama, <span className="font-serif-display font-medium text-emerald-800">M.Pd.</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              Pendidik Agama Islam & Penggiat Karakter Kepanduan · Kabupaten Ponorogo, Jawa Timur
            </p>
          </div>

          {/* Clean Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
            <button onClick={() => onNavigate('home')} className="hover:text-emerald-800 transition-colors">
              Home
            </button>
            <button onClick={() => onNavigate('profile')} className="hover:text-emerald-800 transition-colors">
              Profile
            </button>
            <button onClick={() => onNavigate('portofolio')} className="hover:text-emerald-800 transition-colors">
              Portofolio
            </button>
            <button onClick={() => onNavigate('publikasi')} className="hover:text-emerald-800 transition-colors">
              Publikasi
            </button>
            <button onClick={onOpenContact} className="hover:text-emerald-800 transition-colors">
              Kontak
            </button>
          </nav>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            aria-label="Kembali ke atas"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
            title="Kembali ke atas"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>

        {/* Quiet Copyright & Location */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Arga Putra Pratama, M.Pd. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-2 text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-emerald-700" />
            <span>Pakunden, Ponorogo, Jawa Timur</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
