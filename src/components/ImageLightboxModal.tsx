import React, { useEffect } from 'react';
import { X, ZoomIn, Download, ExternalLink } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  description: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  imageUrl,
  title,
  description,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
      {/* Close button top right */}
      <button
        onClick={onClose}
        aria-label="Tutup foto"
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center">
        {/* Main Image Frame */}
        <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-950 max-h-[75vh] w-auto shadow-2xl flex items-center justify-center">
          <img
            src={imageUrl}
            alt={title}
            referrerPolicy="no-referrer"
            className="max-h-[75vh] max-w-full object-contain"
          />
        </div>

        {/* Caption and Details */}
        <div className="w-full mt-4 px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">{title}</h3>
            {description && (
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Buka Resolusi Asli</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
