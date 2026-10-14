import { EducationItem, InnovationItem, OrganizationItem, ProfileData, PublicationItem } from '../types';

export const INITIAL_PROFILE: ProfileData = {
  fullName: 'Arga Putra Pratama',
  titleDegree: 'M.Pd.',
  shortGreeting: 'Hai, namaku Arga.',
  mottoQuote: 'Berproses dengan ikhlas, mengabdi dengan hati, dan terus menebar manfaat.',
  birthPlaceAndDate: 'Ponorogo, 11 Januari 2001',
  currentAddress: 'Jl. Poncowolo No. 5 Kelurahan Pakunden Kecamatan Ponorogo',
  hobbies: ['Badminton', 'Bersepeda', 'Bermain game online'],
  lifeMotivationJavanese: 'dadio wong seng rumongso cukup ben ora rumongso kurang ae neng urip',
  lifeMotivationIndonesian: 'Jadilah orang yang merasa cukup, agar tidak selalu merasa kurang dalam menjalani kehidupan.',
  email: 'argap2292@gmail.com',
  phoneOrWa: '+62 812-3281-2521',
};

export const SOCIAL_LINKS = {
  instagram: {
    name: 'Instagram',
    username: '@putrap.11',
    url: 'https://instagram.com/putrap.11',
  },
  tiktok: {
    name: 'TikTok',
    username: '@_argap11',
    url: 'https://www.tiktok.com/@_argap11',
  },
  facebook: {
    name: 'Facebook',
    username: 'Putra Tama',
    url: 'https://facebook.com/Putra Tama',
  },
  whatsapp: {
    name: 'WhatsApp',
    number: '+62 812-3281-2521',
    url: 'https://wa.me/6281232812521?text=Halo%20Mas%20Arga,%20saya%20menghubungi%20Anda%20melalui%20website%20portofolio.',
  },
};

export const INITIAL_EDUCATION: EducationItem[] = [
  {
    id: 'edu-7',
    stage: 'Magister (S-2)',
    institution: 'UIN Ponorogo',
    years: '2023 - 2025',
    degree: 'Magister Pendidikan (M.Pd.) - Pendidikan Agama Islam (PAI)',
    description: 'Fokus kajian pengembangan metodologi pembelajaran PAI interaktif berbasis teknologi digital dan penguatan karakter peserta didik.',
  },
  {
    id: 'edu-6',
    stage: 'Sarjana (S-1)',
    institution: 'UIN Ponorogo',
    years: '2019 - 2023',
    degree: 'Sarjana Pendidikan (S.Pd.) - Pendidikan Agama Islam (PAI)',
    description: 'Menempuh studi kependidikan Islam dengan fokus pedagogi, perancangan kurikulum, dan integrasi kegiatan kepanduan dalam pendidikan keagamaan.',
  },
  {
    id: 'edu-5',
    stage: 'Madrasah Aliyah',
    institution: 'MAN 2 Ponorogo',
    years: '2016 - 2019',
    description: 'Aktif dalam kegiatan kepramukaan Dewan Ambalan PRADAPO dan pembinaan kepemimpinan pemuda.',
  },
  {
    id: 'edu-4',
    stage: 'Sekolah Menengah Pertama',
    institution: 'SMPN 4 Ponorogo',
    years: '2013 - 2016',
    description: 'Mengembangkan minat olahraga, keagamaan, dan kedisiplinan organisasi pramuka sekolah.',
  },
  {
    id: 'edu-3',
    stage: 'Sekolah Dasar',
    institution: 'SDN 1 Pakunden',
    years: '2007 - 2013',
    description: 'Pendidikan dasar di lingkungan Pakunden, Ponorogo.',
  },
  {
    id: 'edu-2',
    stage: 'Taman Kanak-Kanak',
    institution: 'TK Perwanida Pakunden',
    years: '2005 - 2007',
    description: 'Pondasi awal pendidikan pra-sekolah di Pakunden.',
  },
  {
    id: 'edu-1',
    stage: 'Pendidikan Anak Usia Dini',
    institution: 'PAUD Perwanida',
    years: '2004 - 2005',
    description: 'Masa awal belajar sosialisasi dan motorik anak usia dini.',
  },
];

export const INITIAL_ORGANIZATIONS: OrganizationItem[] = [
  // Organisasi di luar sekolah
  {
    id: 'org-ls-1',
    category: 'luar_sekolah',
    roleOrName: 'Karang Taruna Abdi Praja Kelurahan Pakunden',
    period: '2025 - 2030',
    institution: 'Kelurahan Pakunden, Kec. Ponorogo',
    details: 'Pengurus aktif dalam pemberdayaan pemuda, kegiatan sosial kemasyarakatan, dan perayaan hari besar nasional/Islam.',
  },
  {
    id: 'org-ls-2',
    category: 'luar_sekolah',
    roleOrName: 'Karang Taruna Pandji Gading',
    period: 'Sampai sekarang',
    institution: 'Komunitas Pemuda Pandji Gading',
    details: 'Mendorong peran aktif generasi muda dalam pelestarian budaya lokal dan gotong royong warga.',
  },
  {
    id: 'org-ls-3',
    category: 'luar_sekolah',
    roleOrName: 'Dewan Ambalan PRADAPO',
    period: '2017 - 2018',
    institution: 'Gugus Depan MAN 2 Ponorogo',
    details: 'Mengkoordinasi kegiatan kepanduan penegak, perkemahan, dan pelatihan kecakapan hidup kepramukaan.',
  },
  {
    id: 'org-ls-4',
    category: 'luar_sekolah',
    roleOrName: 'Saka Bhayangkara Gelombang 39',
    period: 'Anggota Aktif',
    institution: 'Satuan Karya Pramuka Bhayangkara (Kepolisian)',
    details: 'Pelatihan ketertiban masyarakat, penanganan kebencanaan dasar, dan kedisiplinan baris-berbaris kepolisian.',
  },
  {
    id: 'org-ls-5',
    category: 'luar_sekolah',
    roleOrName: 'Pramuka Garuda Laksana',
    period: '2018',
    institution: 'Kwartir Cabang Ponorogo',
    details: 'Meraih predikat Pramuka Garuda jenjang Penegak Laksana sebagai bukti keteladanan watak, keterampilan, dan kepemimpinan pramuka.',
  },

  // Organisasi di pekerjaan
  {
    id: 'org-pek-1',
    category: 'pekerjaan',
    roleOrName: 'Kelompok Kerja Guru (KKG) PAI Kecamatan Mlarak',
    period: 'Aktif',
    institution: 'Kecamatan Mlarak, Ponorogo',
    details: 'Forum musyawarah guru PAI untuk sinkronisasi kurikulum merdeka, asesmen terpadu, dan pelatihan media digital inovatif.',
  },
  {
    id: 'org-pek-2',
    category: 'pekerjaan',
    roleOrName: 'GTT Non Dapodik Kecamatan Mlarak',
    period: 'Aktif',
    institution: 'Kecamatan Mlarak',
    details: 'Wadah silaturahmi dan advokasi guru tidak tetap tingkat kecamatan untuk peningkatan kompetensi mengajar.',
  },
  {
    id: 'org-pek-3',
    category: 'pekerjaan',
    roleOrName: 'GTT Non Dapodik Kabupaten Ponorogo',
    period: 'Aktif',
    institution: 'Kabupaten Ponorogo',
    details: 'Jaringan guru tidak tetap se-Kabupaten Ponorogo dalam mendukung pemerataan mutu pendidikan sekolah dasar.',
  },
];

export const INITIAL_INNOVATIONS: InnovationItem[] = [];

export const INITIAL_PUBLICATIONS: PublicationItem[] = [];

export const DEFAULT_PHOTOS = {
  gambar1: '/images/gambar-1.jpg', // Prestasi Siaga Pramuka Kwarran
  gambar2: '/images/gambar-2.jpg', // Mengajar interaktif smart display
  gambar3: '/images/gambar-3.jpg', // Hadrah rebana
  gambar4: '/images/gambar-4.jpg', // Smartboard di kelas
  profilSaya: '/images/profil-saya.jpg', // Foto formal Arga Putra Pratama, M.Pd.
};
