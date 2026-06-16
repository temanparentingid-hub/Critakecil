export interface Dongeng {
  id: string;
  judul: string;
  usia: string; // 'Dalam Kandungan' | 'Newborn' | '0–6 Bulan' | '7–12 Bulan' | '1–2 Tahun' | '2–3 Tahun' | '3–5 Tahun'
  deskripsi: string;
  durasi: string;
  nilaiCerita: string;
  isi: string[]; // List of paragraphs for high-readability
  tipsMembacakan: string;
}

export interface Ucapan {
  id: string;
  judul: string;
  situasi: string;
  untuk: 'Moms' | 'Dads' | 'Keduanya';
  contohUtama: string;
  kalimatList: string[]; // 5 to 10 ready-to-read sentences
  tipsMenatural: string;
  kategori: string[]; // ['Untuk Kandungan', 'Dari Moms', 'Dari Dads', 'Pagi', 'Malam', 'Saat Bayi Bergerak', 'Menjelang Lahiran', 'Doa', 'Afirmasi']
}

export interface IdeBermain {
  id: string;
  judul: string;
  usia: string; // 'Dalam Kandungan' | 'Newborn' | '0–3 Bulan' | '3–6 Bulan' | '6–12 Bulan' | '1–2 Tahun' | '2–3 Tahun' | '3–5 Tahun'
  areaStimulasi: string;
  durasi: string;
  alat: string;
  deskripsi: string;
  langkahLangkah: string[]; // Steps 1 to N
  manfaatStimulasi: string;
  tipsKeamanan: string;
}
