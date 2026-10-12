import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Copy, Check, Send, MessageSquare } from 'lucide-react';
import { ProfileData } from '../types';

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
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 text-slate-900">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Hubungi Arga Putra Pratama, M.Pd.</h3>
            <p className="text-xs text-slate-500 mt-0.5">Mari berdiskusi seputar pendidikan, kepanduan, dan kolaborasi pembelajaran.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup jendela kontak"
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Contact Chips with Copy */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-500 block">Email Resmi</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">{profile.email}</span>
              </div>
            </div>
            <button
              onClick={() => handleCopy(profile.email, 'email')}
              className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
              title="Salin Email"
            >
              {copiedType === 'email' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-slate-500 block">Alamat / Domisili</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">{profile.currentAddress}</span>
              </div>
            </div>
            <button
              onClick={() => handleCopy(profile.currentAddress, 'alamat')}
              className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
              title="Salin Alamat"
            >
              {copiedType === 'alamat' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
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
