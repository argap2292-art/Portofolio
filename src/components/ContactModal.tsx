import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Copy, Check, Send, MessageSquare, ExternalLink } from 'lucide-react';
import { FaInstagram, FaTiktok, FaFacebookF, FaWhatsapp } from 'react-icons/fa6';
import { ProfileData } from '../types';
import { SOCIAL_LINKS } from '../data/portfolioData';

interface ContactModalProps {
  isOpen: boolean;
  profile: ProfileData;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  profile,
  onClose,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // In production client-side, we simulate direct dispatch or open mailto
    const subject = encodeURIComponent(`Pesan dari Website Portofolio oleh ${senderName}`);
    const body = encodeURIComponent(`${message}\n\nPengirim: ${senderName} (${senderEmail})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-7 text-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Hubungi {profile.fullName}, {profile.titleDegree}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Mari berdiskusi seputar pendidikan, kepanduan, dan kolaborasi pembelajaran.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup jendela kontak"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 1. WhatsApp Utama & Kontak Cepat */}
        <div className="mt-5 space-y-3">
          {/* WhatsApp Direct Chat */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/50 border border-emerald-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm">
                <FaWhatsapp className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">WhatsApp Resmi</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-900">Chat Aktif</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900">{SOCIAL_LINKS.whatsapp.number}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => handleCopy('+6281232812521', 'whatsapp')}
                className="p-2 rounded-lg hover:bg-emerald-100 text-emerald-800 transition-colors border border-emerald-200"
                title="Salin Nomor WhatsApp"
              >
                {copiedType === 'whatsapp' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
              <a
                href={SOCIAL_LINKS.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-102 cursor-pointer"
              >
                <span>Buka Chat</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Email Resmi */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-slate-500 block">Email Resmi</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate block">{profile.email}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(profile.email, 'email')}
              className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
              title="Salin Email"
            >
              {copiedType === 'email' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          {/* Alamat / Domisili */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-800 shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-medium text-slate-500 block">Alamat / Domisili</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate block">{profile.currentAddress}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(profile.currentAddress, 'alamat')}
              className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
              title="Salin Alamat"
            >
              {copiedType === 'alamat' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* 2. Media Sosial Resmi */}
        <div className="mt-4 pt-3.5 border-t border-slate-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
            Media Sosial Resmi
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Instagram */}
            <a
              href={SOCIAL_LINKS.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-pink-200 bg-pink-50/60 hover:bg-pink-100/80 text-pink-700 text-xs font-medium transition-all group hover:scale-[1.02] cursor-pointer"
              title="Kunjungi Instagram: @putrap.11"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-200 text-pink-700 shrink-0 group-hover:bg-pink-300 transition-colors">
                <FaInstagram className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-slate-800 group-hover:text-pink-700 truncate">Instagram</span>
                <span className="block text-[10px] text-slate-500 truncate">@putrap.11</span>
              </div>
            </a>

            {/* TikTok */}
            <a
              href={SOCIAL_LINKS.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-medium transition-all group hover:scale-[1.02] cursor-pointer"
              title="Kunjungi TikTok: @_argap11"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-slate-900 shrink-0 group-hover:bg-slate-300 transition-colors">
                <FaTiktok className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-slate-800 group-hover:text-slate-950 truncate">TikTok</span>
                <span className="block text-[10px] text-slate-500 truncate">@_argap11</span>
              </div>
            </a>

            {/* Facebook */}
            <a
              href={encodeURI(SOCIAL_LINKS.facebook.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-blue-700 text-xs font-medium transition-all group hover:scale-[1.02] cursor-pointer"
              title="Kunjungi Facebook: Putra Tama"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-200 text-blue-700 shrink-0 group-hover:bg-blue-300 transition-colors">
                <FaFacebookF className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-slate-800 group-hover:text-blue-700 truncate">Facebook</span>
                <span className="block text-[10px] text-slate-500 truncate">Putra Tama</span>
              </div>
            </a>
          </div>
        </div>

        {/* Form Kirim Pesan Cepat */}
        <form onSubmit={handleSendMessage} className="mt-5 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nama Anda *</label>
            <input
              type="text"
              required
              placeholder="Nama lengkap Anda..."
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Anda *</label>
            <input
              type="email"
              required
              placeholder="email@contoh.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Pesan / Topik Diskusi *</label>
            <textarea
              required
              rows={3}
              placeholder="Tuliskan pesan atau ajakan kolaborasi Anda..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {sentSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Membuka aplikasi email Anda untuk mengirim pesan...</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium shadow-sm transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Kirimkan Pesan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
