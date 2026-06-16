import { useState } from 'react';
import { ShieldCheck, Heart, Info, Users, HelpCircle, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface TentangViewProps {
  hasUnlockedPremium: boolean;
  onVerifyCode: (code: string) => boolean;
  onResetLicense: () => void;
  onTriggerPremium: () => void;
}

export default function TentangView({
  hasUnlockedPremium,
  onVerifyCode,
  onResetLicense,
  onTriggerPremium,
}: TentangViewProps) {
  const [licenseInput, setLicenseInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleVerify = () => {
    setErrorMessage('');
    setSuccessMessage('');
    const isValid = onVerifyCode(licenseInput);
    if (isValid) {
      setSuccessMessage('Premium berhasil diaktifkan! Terima kasih, Moms & Dads! 🎉');
      setLicenseInput('');
    } else {
      setErrorMessage('Kode lisensi tidak valid. Silakan hubungi admin Teman Parenting.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="pb-24 px-4 pt-4 flex flex-col gap-6"
    >
      {/* App Header Logo badge */}
      <div className="flex flex-col items-center text-center gap-2 mt-4">
        <div className="bg-brand-mint text-brand-teal p-4 rounded-3xl w-16 h-16 flex items-center justify-center text-3xl font-extrabold shadow-sm border border-brand-teal/15 animate-bounce">
          🐣
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-brand-dark">Critakecil</h1>
          <a
            href="https://temanparenting.web.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-teal font-semibold tracking-wider uppercase block hover:underline"
          >
            by Teman Parenting
          </a>
        </div>
        <p className="text-xs text-gray-500 max-w-xs mt-1 leading-relaxed">
          Teman setia Moms & Dads mendampingi proses tumbuh kembang buah hati sejak hari-hari pertama di kandungan.
        </p>
      </div>

      {/* App Philosophy */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-sm font-bold text-brand-dark">
          <Heart size={16} className="text-rose-500 fill-rose-100" />
          <span>Tujuan Aplikasi</span>
        </div>
        <p className="text-xs text-brand-dark/90 leading-relaxed font-sans">
          Critakecil dirancang khusus untuk mempermudah Moms & Dads—terutama Dads yang seringkali merasa bingung harus berkata apa—untuk membisikkan kalimat hangat, membacakan dongeng pendek, serta mengajari permainan interaktif sesuai rentang usia si kecil.
        </p>
        <div className="border-t border-gray-50 pt-2.5 flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">W wording and values:</span>
          <ul className="text-xs text-brand-dark/95 flex flex-col gap-1.5 list-disc pl-4 font-sans leading-relaxed">
            <li>“Mulai dari satu kalimat dulu, Dads.”</li>
            <li>“Tidak harus panjang, yang penting hadir dan konsisten.”</li>
            <li>“Setiap anak memiliki ritme tumbuh yang berbeda.”</li>
          </ul>
        </div>
      </div>

      {/* Status Lisensi Aplikasi */}
      <div className="bg-[#FFFDF6] rounded-3xl p-5 border border-amber-200 shadow-xs flex flex-col gap-4 font-sans">
        <div className="flex items-center gap-1.5 text-sm font-bold text-amber-900 border-b border-amber-100/50 pb-2">
          <span>🔑 Status Lisensi Aplikasi</span>
        </div>

        {!hasUnlockedPremium ? (
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-extrabold text-amber-955 flex items-center gap-1.5">
                <span>🔒 Akses Gratis Terbatas</span>
              </h3>
              <p className="text-xs text-[#5C4D3C] leading-relaxed font-sans text-justify">
                Saat ini Anda berada dalam mode gratis. Beberapa bagian penting dilindungi kunci premium. Dapatkan kunci lisensi premium lifetime hanya dengan <span className="font-extrabold text-amber-950">Rp 25.000</span> saja (Promo Coret dari <span className="line-through text-gray-400">Rp 105.000</span>).
              </p>
            </div>

            {/* Buttons Row */}
            <div className="mt-1">
              <button
                onClick={onTriggerPremium}
                className="w-full bg-brand-teal text-white text-xs font-bold py-3 px-4 rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
              >
                <span>Masukan Kode Lisensi 🔑</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5 bg-gradient-to-br from-emerald-50/40 via-amber-50/10 to-transparent p-1 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 p-1.5 rounded-full text-xs">✨</span>
              <h3 className="text-base font-extrabold text-amber-950">
                Critakecil Premium Aktif
              </h3>
            </div>
            
            <p className="text-xs text-[#5C4D3C] leading-relaxed font-sans text-justify">
              Selamat, Moms & Dads! Terima kasih banyak atas dukungan Anda. Seluruh kumpulan fitur premium dan panduan interaktif tumbuh kembang si kecil telah terbuka penuh selamanya:
            </p>

            <div className="grid grid-cols-1 gap-3.5 mt-1 mr-1">
              <div className="flex items-start gap-2.5 text-xs text-[#5C4D3C]">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-amber-950 block">Akses Seluruh Dongeng Pilihan</span>
                  <span className="text-gray-500 font-sans text-[11px] block mt-0.5 leading-normal">
                    Kumpulan cerita asuh analog berkualitas tinggi untuk dibisikkan dengan penuh emosi hangat sebelum si kecil terlelap.
                  </span>
                </div>
              </div>
              
              <div className="flex items-start gap-2.5 text-xs text-[#5C4D3C]">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-amber-950 block">Puluhan Ucapan Berpola Batin Hangat</span>
                  <span className="text-gray-500 font-sans text-[11px] block mt-0.5 leading-normal">
                    Latihan kalimat demi kalimat bermakna bagi Moms & Dads untuk mengajari cinta kasih demi pondasi mental terbaik buah hati.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-[#5C4D3C]">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-amber-950 block">Seluruh Ide Bermain Lengkap</span>
                  <span className="text-gray-500 font-sans text-[11px] block mt-0.5 leading-normal">
                    Ide kreatif aktivitas fisik sensori-motorik, latihan koordinasi motorik halus, serta koordinasi kasar sesuai usia si kecil.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-[#5C4D3C]">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-amber-950 block">Akses Lifetime Seumur Hidup</span>
                  <span className="text-gray-500 font-sans text-[11px] block mt-0.5 leading-normal">
                    Satu kali aktivasi selamanya tanpa langganan bulanan—termasuk pembaruan konten dan fitur baru di masa mendatang.
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-amber-100/50 pt-3.5 mt-2 flex justify-between items-center font-sans">
              <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <span>🛡️ Lisensi Terverifikasi</span>
              </p>
              <button
                onClick={onResetLicense}
                className="text-[11px] text-amber-800 hover:text-rose-600 transition-all font-semibold underline cursor-pointer"
              >
                Reset Lisensi (Ubah ke Gratis)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Positioning & Disclaimer statement */}
      <div className="bg-brand-lavender/30 rounded-3xl p-5 border border-indigo-100/50 flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-indigo-900">
          <HeartHandshake size={16} className="text-indigo-600" />
          <span>Positioning & Nilai Kami</span>
        </div>
        <p className="text-xs text-indigo-950/90 leading-relaxed font-sans">
          <strong>Critakecil bukan aplikasi medis, bukan alat terapi, dan tidak menjamin anak pasti menjadi lebih pintar atau cerdas.</strong>
        </p>
        <p className="text-xs text-indigo-900/85 leading-relaxed font-sans">
          Critakecil adalah murni aplikasi bonding keluarga dan stimulasi asuh ringan. Kami percaya kemajuan terbaik diperoleh lewat kehadiran yang konstan dan kedekatan penuh tutur bahasa yang lembut.
        </p>
      </div>

      {/* Content Safety Checklist */}
      <div className="bg-[#FFFDF9] rounded-3xl p-5 border border-amber-200/40 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-sm font-bold text-amber-900">
          <ShieldCheck size={16} className="text-brand-teal" />
          <span>Catatan Keamanan Bermain</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed bg-white/70 p-3.5 rounded-2xl border border-white/40">
          Untuk bayi dan balita, selalu dampingi fisik anak saat beraktivitas bermain. Jauhkan aneka benda mainan berukuran sangat kecil yang berisiko tertelan atau menghalangi pernapasan anak.
        </p>
      </div>

      {/* Rigorous Medical Warning Disclaimer */}
      <div className="bg-rose-50 rounded-3xl p-5 border border-rose-100 flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-sm font-bold text-rose-800">
          <Info size={16} className="text-rose-500" />
          <span>Disclaimer Medis</span>
        </div>
        <p className="text-xs text-rose-700/90 leading-relaxed bg-white/70 p-3.5 rounded-2xl border border-rose-100/40 font-mono">
          Konten di dalam Critakecil sepenuhnya bersifat edukatif-sensori dasar dan <strong>tidak ditujukan untuk menggantikan konsultasi profesional langsung</strong> dengan dokter spesialis anak, bidan terapis, psikolog anak, ahli gizi, atau profesional kesehatan terakreditasi lainnya.
        </p>
      </div>

      {/* Credit section */}
      <div className="flex flex-col items-center text-center gap-1 py-4 text-[10px] text-gray-400 font-mono">
        <span>
          © 2026{' '}
          <a
            href="https://temanparenting.web.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-brand-teal font-semibold"
          >
            Teman Parenting
          </a>{' '}
          • Critakecil v1.0
        </span>
        <span>Membangun Bonding Satu Kalimat Lebih Dekat.</span>
      </div>
    </motion.div>
  );
}
