import { EducationItem, InnovationItem, OrganizationItem, ProfileData, PublicationItem } from '../types';

export const INITIAL_PROFILE: ProfileData = {
  fullName: 'Arga Putra Pratama',
  titleDegree: 'M.Pd.',
  shortGreeting: 'Hai, namaku Arga.',
  mottoQuote: 'Berproses dengan ikhlas, mengabdi dengan hati, dan terus menebar manfaat.',
  birthPlaceAndDate: 'Lahir di Kabupaten Ponorogo, Provinsi Jawa Timur',
  currentAddress: 'Jl. Poncowolo No. 5 Kelurahan Pakunden Kecamatan Ponorogo',
  hobbies: ['Badminton', 'Bersepeda', 'Bermain game online'],
  lifeMotivationJavanese: 'dadio wong seng rumongso cukup ben ora rumongso kurang ae neng urip',
  lifeMotivationIndonesian: 'Jadilah orang yang merasa cukup, agar tidak selalu merasa kurang dalam menjalani kehidupan.',
  email: 'argap2292@gmail.com',
  phoneOrWa: '+62 812-3456-7890',
};

export const INITIAL_EDUCATION: EducationItem[] = [
  {
    id: 'edu-7',
    stage: 'Magister (S-2)',
    institution: 'UIN Sunan Kalijaga / UIN Ponorogo',
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

export const INITIAL_INNOVATIONS: InnovationItem[] = [
  {
    id: 'inv-1',
    title: 'Pembelajaran Interaktif PAI Berbasis Smart Screen TV',
    category: 'media_digital',
    year: '2024',
    description: 'Penerapan panel layar pintar interaktif dalam pembelajaran materi tata surya, rukun Islam, dan kisah teladan. Siswa dapat menyentuh langsung elemen visual, menjawab kuis interaktif, dan berpartisipasi aktif tanpa rasa jenuh.',
    tags: ['Interactive Display', 'Kurikulum Merdeka', 'Digital Pedagogi', 'PAI Sekolah Dasar'],
    imageUrl: '/images/gambar-4.jpg',
  },
  {
    id: 'inv-2',
    title: 'Eksplorasi Budaya & Karakter Islami Lewat Seni Hadrah Rebana',
    category: 'ekstrakurikuler',
    year: '2023 - Sekarang',
    description: 'Program pembiasaan seni musik Islam rebana untuk menumbuhkan rasa percaya diri, ketukan ritmis shalawat, serta memperkuat kebersamaan antar siswa dalam bingkai nilai-nilai religius.',
    tags: ['Seni Rebana', 'Pendidikan Karakter', 'Hadrah', 'Pramuka Berbudaya'],
    imageUrl: '/images/gambar-3.jpg',
  },
  {
    id: 'inv-3',
    title: 'Pembinaan Prestasi & Lomba Pengucap Doa Siaga Pramuka',
    category: 'karakter',
    year: '2024',
    description: 'Program akselerasi latihan kecakapan baris-berbaris dan pengucapan doa harian untuk regu Siaga, berhasil mengantarkan peserta didik meraih piala prestasi Siaga di Kwartir Ranting Mlarak.',
    tags: ['Pramuka Siaga', 'Kecakapan Doa', 'Prestasi Kwarran', 'Keteladanan'],
    imageUrl: '/images/gambar-1.jpg',
  },
  {
    id: 'inv-4',
    title: 'Modul Ajar Pembelajaran Berdiferensiasi PAI Kelas Rendah',
    category: 'modul_ajar',
    year: '2024',
    description: 'Modul digital berbasis lembar kerja visual dan audio interaktif yang disesuaikan dengan gaya belajar kinestetik, visual, dan auditori siswa sekolah dasar.',
    tags: ['Modul Ajar', 'Diferensiasi', 'Kearifan Lokal', 'Kurikulum Merdeka'],
    imageUrl: '/images/gambar-2.jpg',
  },
];

export const INITIAL_PUBLICATIONS: PublicationItem[] = [
  {
    id: 'pub-1',
    title: 'Inovasi Media Pembelajaran Interaktif Berbasis Digital dalam Penguatan Pendidikan Karakter Peserta Didik di Sekolah Dasar',
    type: 'Tesis',
    publisherOrInstitution: 'Program Pascasarjana Magister PAI, UIN Ponorogo',
    year: '2025',
    abstract: 'Tesis ini mengkaji pengaruh integrasi smart display dan konten interaktif dalam menanamkan nilai-nilai religius dan kedisiplinan peserta didik di era transformasi digital di sekolah dasar binaan Kabupaten Ponorogo.',
    tags: ['Tesis Magister', 'Smart Board', 'Pendidikan Karakter', 'UIN Ponorogo'],
    externalUrl: 'https://etheses.iainponorogo.ac.id/',
  },
  {
    id: 'pub-2',
    title: 'Integrasi Nilai Kepramukaan dan Pendidikan Agama Islam dalam Membentuk Karakter Mandiri Anak Usia Dasar',
    type: 'Jurnal',
    publisherOrInstitution: 'Jurnal Tarbiyah & Kependidikan Islam Nusantara',
    year: '2024',
    doiOrIssn: 'ISSN 2745-9821',
    abstract: 'Penelitian kualitatif yang menguraikan keselarasan Dwisatya Pramuka Siaga dengan nilai akhlak terpuji Islam, terbukti secara empiris meningkatkan kemandirian dan rasa empati peserta didik.',
    tags: ['Jurnal Ilmiah', 'Kepramukaan', 'Karakter Mandiri', 'Peer-Reviewed'],
    externalUrl: 'https://journal.ponorogo-edu.or.id/',
  },
  {
    id: 'pub-3',
    title: 'Optimalisasi Pembelajaran Aktif Berbantuan Media Visual Interaktif untuk Meningkatkan Motivasi Belajar Siswa PAI',
    type: 'Prosiding',
    publisherOrInstitution: 'Prosiding Seminar Nasional KKG & Pendidikan Dasar Jawa Timur',
    year: '2024',
    abstract: 'Kajian empiris pelaksanaan pembelajaran aktif di Kecamatan Mlarak yang memadukan presentasi visual sentuh dengan simulasi kelompok kecil, meningkatkan ketuntasan belajar secara signifikan.',
    tags: ['Prosiding', 'Seminar Nasional', 'KKG PAI Mlarak', 'Pedagogi Aktif'],
    externalUrl: 'https://seminar.pendidikan.id/',
  },
  {
    id: 'pub-4',
    title: 'Studi Efektivitas Pembelajaran Pendidikan Agama Islam Berbasis Nilai-Nilai Religius di Lingkungan Sekolah Dasar',
    type: 'Skripsi',
    publisherOrInstitution: 'Fakultas Tarbiyah dan Ilmu Keguruan, UIN Ponorogo',
    year: '2023',
    abstract: 'Karya ilmiah sarjana yang meneliti pola habituasi ibadah harian dan keteladanan guru dalam pembentukan religiusitas siswa di lingkungan pendidikan dasar Ponorogo.',
    tags: ['Skripsi S-1', 'Religiusitas', 'Pendidikan Dasar', 'UIN Ponorogo'],
    externalUrl: 'https://repository.iainponorogo.ac.id/',
  },
];

export const DEFAULT_PHOTOS = {
  gambar1: '/images/gambar-1.jpg', // Prestasi Siaga Pramuka Kwarran
  gambar2: '/images/gambar-2.jpg', // Mengajar interaktif smart display
  gambar3: '/images/gambar-3.jpg', // Hadrah rebana
  gambar4: '/images/gambar-4.jpg', // Smartboard di kelas
  profilSaya: '/images/profil-saya.jpg', // Foto formal Arga Putra Pratama, M.Pd.
};
