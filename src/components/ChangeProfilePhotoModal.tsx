import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  RotateCcw, 
  Check, 
  AlertCircle,
  Sparkles,
  Smartphone,
  CloudUpload,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { uploadProfilePhoto, saveProfileAvatarToSupabase } from '../lib/supabase';

interface ChangeProfilePhotoModalProps {
  isOpen: boolean;
  currentPhotoUrl: string;
  onSelectPhoto: (newUrl: string) => Promise<boolean | void> | void;
  onResetDefault: () => Promise<boolean | void> | void;
  onClose: () => void;
}

export const ChangeProfilePhotoModal: React.FC<ChangeProfilePhotoModalProps> = ({
  isOpen,
  currentPhotoUrl,
  onSelectPhoto,
  onResetDefault,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'device' | 'camera' | 'url' | 'presets'>('device');
  const [previewUrl, setPreviewUrl] = useState<string>(currentPhotoUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [urlError, setUrlError] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatusText, setUploadStatusText] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string>('');

  // Camera stream refs & state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(currentPhotoUrl);
      setSelectedFile(null);
      setCapturedBlob(null);
      setUrlInput('');
      setUrlError('');
      setGeneralError('');
      setIsSuccess(false);
      setIsUploading(false);
    }
  }, [isOpen, currentPhotoUrl]);

  const presetPhotos = [
    {
      id: 'p1',
      title: 'Varian Presisi 1 (Rekomendasi)',
      desc: 'Pasfoto resmi seragam PGRI dan peci hitam rapi',
      url: '/images/profil-resmi.jpg',
    },
    {
      id: 'p2',
      title: 'Varian Presisi 2',
      desc: 'Pose tegak lurus dengan lambang PGRI proporsional',
      url: '/images/profil-varian2.jpg',
    },
    {
      id: 'p3',
      title: 'Foto Profil Utama',
      desc: 'File standar profil saya di sistem website',
      url: '/images/profil-saya.jpg',
    },
  ];

  // Stop camera when closing or switching tab
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  // Handle local file selection from device (computer or smartphone)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCapturedBlob(null);
      setGeneralError('');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const res = event.target.result as string;
          setPreviewUrl(res);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Start device camera
  const handleStartCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      setCameraError('Tidak dapat mengakses kamera perangkat. Pastikan izin kamera telah diberikan di browser.');
    }
  };

  // Capture photo from camera
  const handleCaptureCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 480;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCapturedBlob(blob);
            setSelectedFile(null);
            setGeneralError('');
            const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
            setPreviewUrl(dataUrl);
            stopCamera();
          }
        },
        'image/jpeg',
        0.92
      );
    }
  };

  // Handle URL input
  const handleApplyUrl = () => {
    setUrlError('');
    setGeneralError('');
    if (!urlInput.trim()) {
      setUrlError('Masukkan URL gambar terlebih dahulu.');
      return;
    }
    const testImg = new Image();
    testImg.onload = () => {
      setPreviewUrl(urlInput.trim());
      setSelectedFile(null);
      setCapturedBlob(null);
    };
    testImg.onerror = () => {
      setUrlError('URL gambar tidak valid atau tidak dapat diakses secara publik.');
    };
    testImg.src = urlInput.trim();
  };

  // Save selected photo with automatic Supabase Storage & Database sync
  const handleSavePhoto = async () => {
    setIsUploading(true);
    setGeneralError('');
    setUploadStatusText('Menyiapkan foto profil...');

    try {
      let finalAvatarUrl = previewUrl;

      // 1. Jika ada file dari perangkat atau jepretan kamera, unggah ke Supabase Storage bucket 'profil'
      if (selectedFile || capturedBlob) {
        setUploadStatusText('Mengunggah ke Supabase Storage (bucket "profil")...');
        const uploadTarget = selectedFile || capturedBlob!;
        const uploadRes = await uploadProfilePhoto(uploadTarget);

        if (uploadRes.error) {
          console.warn('[Supabase Storage] Gagal unggah:', uploadRes.error.message);
          // Jika gagal unggah ke storage (misal RLS belum dibuka), tetap beritahu pengguna
          setGeneralError(
            `Peringatan Storage: ${uploadRes.error.message}. Foto diterapkan di sesi ini.`
          );
        } else if (uploadRes.url) {
          finalAvatarUrl = uploadRes.url;
        }
      }

      // 2. Simpan URL avatar ke tabel database Supabase ('Pengaturan _Profil')
      setUploadStatusText('Menyimpan tautan foto ke database Supabase...');
      const dbRes = await saveProfileAvatarToSupabase(finalAvatarUrl);

      if (dbRes.error) {
        console.warn('[Supabase DB] Gagal simpan ke tabel:', dbRes.error.message);
        if (!generalError) {
          setGeneralError(`Catatan Database: ${dbRes.error.message}`);
        }
      }

      // 3. Panggil callback onSelectPhoto untuk memperbarui tampilan di seluruh halaman
      await onSelectPhoto(finalAvatarUrl);

      setIsSuccess(true);
      setUploadStatusText('Foto profil berhasil disinkronkan ke Supabase!');

      setTimeout(() => {
        setIsSuccess(false);
        setIsUploading(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Error saat menyimpan foto profil:', err);
      setGeneralError(err.message || 'Terjadi kesalahan sistem.');
      setIsUploading(false);
    }
  };

  // Reset to default photo with Supabase sync
  const handleResetToDefault = async () => {
    setIsUploading(true);
    setUploadStatusText('Mengembalikan ke foto profil resmi default...');
    const defaultUrl = '/images/profil-resmi.jpg';
    setPreviewUrl(defaultUrl);
    setSelectedFile(null);
    setCapturedBlob(null);

    try {
      await saveProfileAvatarToSupabase(defaultUrl);
      await onResetDefault();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsUploading(false);
        onClose();
      }, 900);
    } catch {
      await onResetDefault();
      setIsUploading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-900 flex flex-col justify-between">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                  <ImageIcon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-slate-900">Ganti Foto Profil Anda</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Pilih sumber foto: dari perangkat Anda, kamera langsung, tautan online, atau koleksi foto resmi.
              </p>
            </div>
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              aria-label="Tutup"
              className="text-slate-400 hover:text-slate-700 p-1 rounded-xl"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-medium">
            <button
              onClick={() => {
                stopCamera();
                setActiveTab('device');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
                activeTab === 'device'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Dari Perangkat</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('camera');
                handleStartCamera();
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
                activeTab === 'camera'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Kamera HP/PC</span>
            </button>

            <button
              onClick={() => {
                stopCamera();
                setActiveTab('url');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
                activeTab === 'url'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Tautan Online</span>
            </button>

            <button
              onClick={() => {
                stopCamera();
                setActiveTab('presets');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
                activeTab === 'presets'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Foto Bawaan</span>
            </button>
          </div>

          {/* Tab Content & Live Preview Container */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* LEFT: Live Preview Frame (5 columns) */}
            <div className="sm:col-span-5 flex flex-col items-center">
              <div className="relative aspect-[3/4] w-40 sm:w-48 rounded-2xl overflow-hidden bg-slate-100 border-2 border-emerald-500/60 shadow-lg">
                <img
                  src={previewUrl}
                  alt="Pratinjau Foto Profil"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-center">
                  <span className="text-[10px] font-semibold text-white tracking-wide">
                    Pratinjau Foto Aktif
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-500 mt-2">Format Pasfoto 3:4</span>
            </div>

            {/* RIGHT: Input Controls (7 columns) */}
            <div className="sm:col-span-7 space-y-4">
              
              {/* TAB 1: DARI PERANGKAT (UPLOAD) */}
              {activeTab === 'device' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    Pilih File Foto dari Perangkat Anda
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Unggah foto dari galeri HP atau dokumen laptop Anda (mendukung PNG, JPG, JPEG, atau WEBP).
                  </p>

                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl bg-emerald-50/40 hover:bg-emerald-50/70 cursor-pointer transition-all text-center group">
                    <div className="p-3 rounded-full bg-emerald-100 text-emerald-700 group-hover:scale-110 transition-transform mb-2">
                      <Upload className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800">
                      Klik untuk Memilih File Foto
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Pilih file seperti <em>profil saya.png</em>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}

              {/* TAB 2: AMBIL DARI KAMERA */}
              {activeTab === 'camera' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    Ambil Foto Langsung dengan Kamera
                  </h4>
                  <p className="text-xs text-slate-600">
                    Gunakan kamera HP atau webcam laptop Anda untuk mengambil potret baru secara langsung.
                  </p>

                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-300">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
                    />
                    {!isCameraActive && (
                      <div className="text-center p-4 text-slate-400">
                        <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <span className="text-xs block">Kamera belum aktif</span>
                        {cameraError && (
                          <span className="text-[11px] text-rose-400 mt-1 block">{cameraError}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isCameraActive ? (
                      <button
                        onClick={handleStartCamera}
                        className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center justify-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Buka / Izinkan Kamera</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleCaptureCamera}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Camera className="h-4 w-4" />
                          <span>Ambil Jepretan Foto</span>
                        </button>
                        <button
                          onClick={stopCamera}
                          className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium"
                        >
                          Hentikan
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: TAUTAN ONLINE / URL LAINNYA */}
              {activeTab === 'url' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    Gunakan Tautan / URL Gambar Online
                  </h4>
                  <p className="text-xs text-slate-600">
                    Tempelkan tautan langsung file gambar dari internet, Google Drive (direct link), atau penyimpanan cloud lainnya.
                  </p>

                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="https://contoh.com/foto-profil.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    {urlError && (
                      <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>{urlError}</span>
                      </p>
                    )}
                    <button
                      onClick={handleApplyUrl}
                      className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
                    >
                      Tinjau & Pasang Tautan
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: FOTO PRESET BAWAAN */}
              {activeTab === 'presets' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    Pilihan Foto Resmi Berkualitas Tinggi
                  </h4>
                  <div className="space-y-2">
                    {presetPhotos.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setPreviewUrl(preset.url)}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          previewUrl === preset.url
                            ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                        }`}
                      >
                        <div className="h-10 w-8 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                          <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {preset.title}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {preset.desc}
                          </span>
                        </div>
                        {previewUrl === preset.url && (
                          <Check className="h-4 w-4 text-emerald-700 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Status & Error Feedback */}
        {(uploadStatusText || generalError) && (
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            {uploadStatusText && (
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                )}
                <span>{uploadStatusText}</span>
              </div>
            )}
            {generalError && (
              <div className="flex items-start gap-2 mt-1.5 text-amber-700">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <span>{generalError}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleResetToDefault}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Kembalikan ke Foto Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSavePhoto}
              disabled={isSuccess || isUploading}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-semibold shadow-sm disabled:opacity-60 transition-all cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan ke Supabase...</span>
                </>
              ) : isSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Foto Tersimpan Online!</span>
                </>
              ) : (
                <>
                  <CloudUpload className="h-4 w-4" />
                  <span>Simpan & Sinkronkan Online</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
