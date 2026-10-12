export interface EducationItem {
  id: string;
  stage: string;
  institution: string;
  years: string;
  description?: string;
  degree?: string;
}

export interface OrganizationItem {
  id: string;
  category: 'luar_sekolah' | 'pekerjaan';
  roleOrName: string;
  period: string;
  institution?: string;
  details?: string;
}

export interface InnovationItem {
  id: string;
  title: string;
  category: 'media_digital' | 'ekstrakurikuler' | 'modul_ajar' | 'karakter';
  year: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  documentUrl?: string;
  externalLink?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  type: 'Tesis' | 'Skripsi' | 'Jurnal' | 'Prosiding' | 'Buku / Modul';
  publisherOrInstitution: string;
  year: string;
  doiOrIssn?: string;
  abstract: string;
  fileUrl?: string;
  externalUrl?: string;
  tags: string[];
}

export interface ProfileData {
  fullName: string;
  titleDegree: string;
  shortGreeting: string;
  mottoQuote: string;
  birthPlaceAndDate: string;
  currentAddress: string;
  hobbies: string[];
  lifeMotivationJavanese: string;
  lifeMotivationIndonesian: string;
  email: string;
  phoneOrWa: string;
}
