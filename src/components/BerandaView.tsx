import { motion } from 'motion/react';
import { BookOpen, MapPin, MessageSquare, Handshake, Compass, Sparkles, ChevronRight, Star, Heart, Volume2 } from 'lucide-react';
import { DONGENG_DATA, UCAPAN_DATA, IDE_BERMAIN_DATA } from '../data';

interface BerandaViewProps {
  onNavigateTab: (tab: 'beranda' | 'dongeng' | 'ucapan' | 'bermain' | 'tentang') => void;
  onSelectDongeng: (id: string) => void;
  onSelectUcapan: (id: string) => void;
  onSelectIdeBermain: (id: string) => void;
  onSelectDadsUcapanCategory: () => void;
  isPremium: boolean;
  onTriggerPremium: () => void;
}

export default function BerandaView({
  onNavigateTab,
  onSelectDongeng,
  onSelectUcapan,
  onSelectIdeBermain,
  onSelectDadsUcapanCategory,
  isPremium,
  onTriggerPremium,
}: BerandaViewProps) {
  const isDongengLocked = (id: string) => {
    if (isPremium) return false;
    const idx = DONGENG_DATA.findIndex(item => item.id === id);
    return idx >= 2;
  };

  const isBermainLocked = (id: string) => {
    if (isPremium) return false;
    const idx = IDE_BERMAIN_DATA.findIndex(item => item.id === id);
    return idx >= 2;
  };

  const isUcapanLocked = (id: string) => {
    if (isPremium) return false;
    const idx = UCAPAN_DATA.findIndex(item => item.id === id);
    return idx >= 2;
  };

  // Static content pick for recommendations & popular tabs
  const featuredDongeng = DONGENG_DATA.find(d => d.id === 'suara-ayah-di-pagi-hari') || DONGENG_DATA[3];
  const featuredBermain = IDE_BERMAIN_DATA.find(i => i.id === 'sentuhan-lembut-perut-ibu') || IDE_BERMAIN_DATA[1];

  const popularCilukba = IDE_BERMAIN_DATA.find(i => i.id === 'cilukba') || IDE_BERMAIN_DATA[6];
  const popularUcapan = UCAPAN_DATA.find(u => u.id === 'pagi-untuk-bayi-dalam-kandungan') || UCAPAN_DATA[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="pb-24 px-4 pt-4 flex flex-col gap-6"
    >
      {/* Brand Logotype */}
      <div className="flex flex-col gap-0.5 mt-2">
        <a
          href="https://temanparenting.web.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] uppercase font-mono tracking-widest font-bold text-brand-teal bg-brand-mint text-center py-1 px-3.5 rounded-full w-fit self-start hover:opacity-90 hover:underline transition-all cursor-pointer"
        >
          by Teman Parenting
        </a>
        <h1 className="font-display font-extrabold text-3xl tracking-tight text-brand-dark mt-1">
          Critakecil
        </h1>
      </div>

      {/* Hero Headline Section */}
      <div className="bg-brand-cream/60 rounded-3xl p-6 border border-amber-100 flex flex-col gap-3 relative overflow-hidden shadow-xs">
        <div className="absolute right-[-20px] bottom-[-20px] w-28 h-28 bg-brand-lavender/35 rounded-full blur-2xl"></div>
        
        <h2 className="font-display font-bold text-xl text-brand-dark leading-snug">
          Dongeng, Ucapan Afirmasi, dan ide bermain untuk si kecil.
        </h2>
        
        <p className="text-xs text-brand-dark/90 leading-relaxed pr-6">
          Bantu Moms & Dads mulai bercerita, menyapa, dan bermain dengan anak dari dalam kandungan sampai masa balita.
        </p>
        
        <button
          onClick={() => onNavigateTab('dongeng')}
          className="mt-2 text-xs font-semibold bg-brand-teal text-white py-3 px-5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all self-start flex items-center gap-1.5 shadow-sm"
        >
          <span>Mulai Baca</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Category Card Grid */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-xs font-extrabold text-brand-dark/75 tracking-wider uppercase px-1">
          Pilih Kategori Utama
        </h3>
        
        <div className="grid grid-cols-1 gap-2.5">
          {/* Dongeng card */}
          <div
            onClick={() => onNavigateTab('dongeng')}
            className="bg-white border hover:border-brand-teal/20 active:border-brand-teal rounded-2xl p-4 flex items-start gap-4 cursor-pointer transition-all shadow-xs"
          >
            <div className="bg-brand-mint p-3 rounded-xl text-brand-dark shrink-0">
              <BookOpen size={18} className="text-brand-teal" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <span className="font-display font-bold text-sm text-brand-dark">Dongeng</span>
                <ChevronRight size={12} className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Cerita pendek yang bisa dibacakan sesuai usia si kecil.
              </p>
            </div>
          </div>

          {/* Ucapan Warm Card */}
          <div
            onClick={() => onNavigateTab('ucapan')}
            className="bg-white border hover:border-brand-teal/20 active:border-brand-teal rounded-2xl p-4 flex items-start gap-4 cursor-pointer transition-all shadow-xs"
          >
            <div className="bg-brand-lavender/45 p-3 rounded-xl text-brand-dark shrink-0">
              <Volume2 size={18} className="text-indigo-600" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <span className="font-display font-bold text-sm text-brand-dark">Ucapan Afirmasi</span>
                <ChevronRight size={12} className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Kalimat sederhana untuk Moms & Dads saat ingin menyapa si kecil.
              </p>
            </div>
          </div>

          {/* Play Idea Card */}
          <div
            onClick={() => onNavigateTab('bermain')}
            className="bg-white border hover:border-brand-teal/20 active:border-brand-teal rounded-2xl p-4 flex items-start gap-4 cursor-pointer transition-all shadow-xs"
          >
            <div className="bg-brand-cream/60 p-3 rounded-xl text-brand-dark shrink-0">
              <Compass size={18} className="text-amber-700" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <span className="font-display font-bold text-sm text-brand-dark">Ide Bermain</span>
                <ChevronRight size={12} className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Aktivitas ringan untuk bonding dan stimulasi sesuai usia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mulai Dari Dads Banner */}
      <div className="bg-brand-teal text-white rounded-3xl p-5 relative overflow-hidden flex flex-col gap-2">
        <div className="absolute right-4 bottom-[-15px] text-5xl opacity-20">👨‍👦</div>
        <span className="text-[10px] font-bold tracking-widest uppercase text-brand-mint bg-white/10 w-fit px-2 py-0.5 rounded-full">
          Dukungan Istimewa untuk Ayah
        </span>
        <h4 className="font-display font-bold text-base leading-snug">
          Bingung mau ngomong apa ke si kecil? Mulai dari satu kalimat dulu, Dads.
        </h4>
        <p className="text-[11px] text-brand-mint leading-relaxed mr-14">
          Tidak harus panjang atau puitis, kehadiran suara berat Ayah adalah berkah stimulasi tak tergantikan.
        </p>
        <button
          onClick={onSelectDadsUcapanCategory}
          className="mt-1 bg-white text-brand-teal text-xs font-semibold py-2 px-4 rounded-xl hover:bg-brand-mint hover:text-brand-dark transition-colors self-start shadow-xs flex items-center gap-1"
        >
          <span>Ucapkan Sesuatu 👨</span>
        </button>
      </div>

      {/* Rekomendasi Hari Ini */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1 px-1">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <h3 className="text-xs font-extrabold text-brand-dark/75 tracking-wider uppercase">
            Rekomendasi Hari Ini
          </h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Recommended Story Card */}
          <div
            onClick={() => {
              if (isDongengLocked(featuredDongeng.id)) {
                onTriggerPremium();
              } else {
                onSelectDongeng(featuredDongeng.id);
              }
            }}
            className="bg-[#FFFDFB] border border-orange-100/60 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer hover:border-brand-teal/20 transition-all shadow-xs relative"
          >
            <div className="flex justify-between items-center text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-700 bg-brand-cream/80 px-2.5 py-0.5 rounded-full font-semibold">
                  Saran Dongeng 📖
                </span>
                {isDongengLocked(featuredDongeng.id) && (
                  <span className="bg-amber-100/80 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
                    🔒 Premium
                  </span>
                )}
              </div>
              <span className="text-gray-400 font-mono">{featuredDongeng.durasi}</span>
            </div>
            <h4 className="font-display font-bold text-sm text-brand-dark">
              {featuredDongeng.judul}
            </h4>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {featuredDongeng.deskripsi}
            </p>
            <div className="flex justify-end mt-1">
              {isDongengLocked(featuredDongeng.id) ? (
                <span className="text-xs font-bold text-amber-700 flex items-center gap-0.5 border border-amber-200 bg-amber-50/50 px-2.5 py-1 rounded-xl">
                  <span>Buka Kunci</span>
                  <span>🔒</span>
                </span>
              ) : (
                <span className="text-xs font-bold text-brand-teal flex items-center gap-0.5">
                  <span>Baca Dongeng</span>
                  <ChevronRight size={13} />
                </span>
              )}
            </div>
          </div>

          {/* Recommended Play Card */}
          <div
            onClick={() => {
              if (isBermainLocked(featuredBermain.id)) {
                onTriggerPremium();
              } else {
                onSelectIdeBermain(featuredBermain.id);
              }
            }}
            className="bg-[#FAFFFC] border border-emerald-100/60 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer hover:border-brand-teal/20 transition-all shadow-xs relative"
          >
            <div className="flex justify-between items-center text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="text-brand-dark bg-brand-mint px-2.5 py-0.5 rounded-full font-semibold border border-brand-teal/10">
                  Aktivitas Main ✨
                </span>
                {isBermainLocked(featuredBermain.id) && (
                  <span className="bg-amber-100/80 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">
                    🔒 Premium
                  </span>
                )}
              </div>
              <span className="text-gray-400 font-mono">{featuredBermain.durasi}</span>
            </div>
            <h4 className="font-display font-bold text-sm text-brand-dark">
              {featuredBermain.judul}
            </h4>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {featuredBermain.deskripsi}
            </p>
            <div className="flex justify-end mt-1">
              {isBermainLocked(featuredBermain.id) ? (
                <span className="text-xs font-bold text-amber-700 flex items-center gap-0.5 border border-amber-200 bg-amber-50/50 px-2.5 py-1 rounded-xl">
                  <span>Buka Kunci</span>
                  <span>🔒</span>
                </span>
              ) : (
                <span className="text-xs font-bold text-brand-teal flex items-center gap-0.5">
                  <span>Lihat Cara Main</span>
                  <ChevronRight size={13} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Konten Populer */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1 px-1">
          <Sparkles size={14} className="text-brand-teal" />
          <h3 className="text-xs font-extrabold text-brand-dark/75 tracking-wider uppercase">
            Konten Populer Terpilih
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1 */}
          <div
            onClick={() => {
              if (isBermainLocked(popularCilukba.id)) {
                onTriggerPremium();
              } else {
                onSelectIdeBermain(popularCilukba.id);
              }
            }}
            className="bg-white border hover:border-brand-teal/25 rounded-2xl p-3.5 flex flex-col gap-2 cursor-pointer transition-all shadow-xs relative overflow-hidden"
          >
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono font-medium text-gray-400 uppercase tracking-wider block">
                {popularCilukba.usia}
              </span>
              {isBermainLocked(popularCilukba.id) && (
                <span className="text-[9px] font-bold text-amber-600 block shrink-0">
                  🔒 Premium
                </span>
              )}
            </div>
            <h4 className="font-display font-bold text-xs text-brand-dark line-clamp-1">
              {popularCilukba.judul}
            </h4>
            <p className="text-[11px] text-gray-500 line-clamp-2 leading-normal">
              {popularCilukba.deskripsi}
            </p>
            <span className="text-[10px] font-semibold text-brand-teal mt-auto pt-1 pointer-events-none">
              {isBermainLocked(popularCilukba.id) ? 'Buka Kunci »' : 'Mulai Main »'}
            </span>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => {
              if (isUcapanLocked(popularUcapan.id)) {
                onTriggerPremium();
              } else {
                onSelectUcapan(popularUcapan.id);
              }
            }}
            className="bg-white border hover:border-brand-teal/25 rounded-2xl p-3.5 flex flex-col gap-2 cursor-pointer transition-all shadow-xs relative overflow-hidden"
          >
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono font-medium text-gray-400 uppercase tracking-wider block">
                Sekitar Pagi 🤰
              </span>
              {isUcapanLocked(popularUcapan.id) && (
                <span className="text-[9px] font-bold text-amber-600 block shrink-0">
                  🔒 Premium
                </span>
              )}
            </div>
            <h4 className="font-display font-bold text-xs text-brand-dark line-clamp-1">
              {popularUcapan.judul}
            </h4>
            <p className="text-[11px] text-gray-500 line-clamp-2 leading-normal">
              {popularUcapan.contohUtama}
            </p>
            <span className="text-[10px] font-semibold text-brand-teal mt-auto pt-1 pointer-events-none">
              {isUcapanLocked(popularUcapan.id) ? 'Buka Kunci »' : 'Bicara Hangat »'}
            </span>
          </div>
        </div>
      </div>

      {/* Small informative advisory card */}
      <div className="border border-dashed border-gray-200 p-4 rounded-2xl text-center text-[11px] text-gray-400 leading-relaxed font-sans bg-white/40">
        “Critakecil adalah aplikasi bonding dan stimulasi ringan. Kami hadir sebagai teman perjalanan mengasuh buah hati Anda, bukan sebagai rujukan medis ataupun terapi klinis.”
      </div>
    </motion.div>
  );
}
