import React from 'react';
import { Heart, MapPin, Mail, ArrowUp } from 'lucide-react';
import { FaInstagram, FaTiktok, FaFacebookF, FaWhatsapp } from 'react-icons/fa6';
import { SOCIAL_LINKS } from '../data/portfolioData';

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
              Arga Putra Pratama
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

          {/* Social Icons & Back to top button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3">
              <a
                href={SOCIAL_LINKS.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all"
                title="WhatsApp: 0812-3281-2521"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-600 hover:text-white transition-all"
                title="Instagram: @putrap.11"
                aria-label="Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-900 hover:text-white transition-all"
                title="TikTok: @_argap11"
                aria-label="TikTok"
              >
                <FaTiktok className="h-4 w-4" />
              </a>
              <a
                href={encodeURI(SOCIAL_LINKS.facebook.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all"
                title="Facebook: Putra Tama"
                aria-label="Facebook"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>
            </div>

            <button
              onClick={scrollToTop}
              aria-label="Kembali ke atas"
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
              title="Kembali ke atas"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quiet Copyright & Location */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Arga Putra Pratama. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-2 text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-emerald-700" />
            <span>Pakunden, Ponorogo, Jawa Timur</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
