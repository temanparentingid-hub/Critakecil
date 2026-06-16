import { useState, useMemo } from 'react';
import { IdeBermain } from '../types';
import { IDE_BERMAIN_DATA } from '../data';
import { Search, Compass, Clock, Activity, Wrench, ChevronRight, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IdeBermainViewProps {
  onSelectIdeBermain: (id: string) => void;
  isPremium: boolean;
  onTriggerPremium: () => void;
}

export default function IdeBermainView({ onSelectIdeBermain, isPremium, onTriggerPremium }: IdeBermainViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const isBermainLocked = (id: string) => {
    if (isPremium) return false;
    const globalIdx = IDE_BERMAIN_DATA.findIndex(u => u.id === id);
    return globalIdx >= 2;
  };

  const ageCategories = [
    'Semua',
    'Dalam Kandungan',
    'Newborn',
    '0–3 Bulan',
    '3–6 Bulan',
    '6–12 Bulan',
    '1–2 Tahun',
    '2–3 Tahun',
    '3–5 Tahun'
  ];

  const getBermainIcon = (id: string) => {
    switch (id) {
      case 'pijat-melodi-minyak-alami': return '🧴';
      case 'getaran-suara-bariton-ayah': return '🗣️';
      case 'respons-ketukan-ritmis-janin': return '🫳';
      case 'meditasi-visualisasi-cahaya': return '🧘';
      case 'musik-klasik-terapi-cerdas': return '🎻';
      case 'suara-ayah-dan-ibu': return '💑';
      case 'sentuhan-lembut-perut-ibu': return '🫄';
      case 'tatap-wajah-dan-bicara-pelan': return '😊';
      case 'kontras-hitam-putih': return '🏁';
      case 'tummy-time-singkat': return '🚼';
      case 'main-bunyi-bunyian': return '🔔';
      case 'cilukba': return '🫣';
      case 'ambil-dan-masukkan-bola': return '📥';
      case 'susun-balok-besar': return '🧱';
      case 'tebak-nama-benda': return '🧸';
      case 'sortir-warna': return '🎨';
      case 'pura-pura-masak': return '🍳';
      case 'cari-bentuk-di-rumah': return '🔍';
      case 'cerita-bergantian': return '🗣️';
      case 'misi-kecil-hari-ini': return '🚀';
      case 'jejak-langkah-kaki-warna': return '👣';
      case 'sentuhan-tekstur-berbeda': return '🖐️';
      case 'petak-umpet-sederhana': return '🫣';
      case 'tiup-gelembung-sabun-lembut': return '🫧';
      case 'bunyi-marakas-botol-bekas': return '🪇';
      default: return '✨';
    }
  };

  const filteredIdeBermain = useMemo(() => {
    return IDE_BERMAIN_DATA.filter(item => {
      // Age group match
      const matchesCategory = activeCategory === 'Semua' || item.usia === activeCategory;
      if (!matchesCategory) return false;

      // Text query match
      const q = searchQuery.toLowerCase();
      if (!q) return true;

      return (
        item.judul.toLowerCase().includes(q) ||
        item.areaStimulasi.toLowerCase().includes(q) ||
        item.alat.toLowerCase().includes(q) ||
        item.deskripsi.toLowerCase().includes(q) ||
        item.usia.toLowerCase().includes(q) ||
        // support tag matching
        (q === 'motorik' && item.areaStimulasi.toLowerCase().includes('motorik')) ||
        (q === 'bahasa' && item.areaStimulasi.toLowerCase().includes('bahasa')) ||
        (q === 'kognitif' && item.areaStimulasi.toLowerCase().includes('kognitif')) ||
        (q === 'imajinasi' && item.areaStimulasi.toLowerCase().includes('imajinasi')) ||
        (q === 'bonding' && item.areaStimulasi.toLowerCase().includes('bonding')) ||
        (q === 'stimulasi' && true)
      );
    });
  }, [searchQuery, activeCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="pb-24 px-4 pt-4 flex flex-col gap-5"
    >
      {/* Title Header */}
      <div className="flex flex-col gap-0.5 mt-2">
        <h1 className="font-display font-extrabold text-2xl text-brand-dark">
          Ide Bermain
        </h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          Temukan aneka aktivitas motorik, bahasa, dan kognitif ringan untuk bonding berkualitas di rumah.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari ide bermain..."
          className="w-full bg-white border border-gray-200 focus:border-brand-teal focus:outline-none rounded-2xl py-3 px-4 pl-11 text-sm text-brand-dark shadow-xs transition-colors placeholder:text-gray-400"
        />
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark p-1"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Horizontal horizontal Categories navigation */}
      <div className="flex flex-col gap-1.5 overflow-hidden">
        <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase px-1">
          Kategori Rentang Usia
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide -mx-4 px-4 mask-right">
          {ageCategories.map((cat, idx) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-150 hover:bg-brand-mint/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick reassurance banner */}
      <div className="bg-brand-lavender/30 border border-indigo-100/40 rounded-2xl p-3.5 flex gap-2.5 text-xs text-brand-dark/90 items-start leading-normal">
        <Activity size={16} className="text-indigo-600 shrink-0 mt-0.5" />
        <span>“Permainan ini bertujuan mendukung stimulasi batiniah, bukan membuat anak harus tumbuh melompati anak lain.”</span>
      </div>

      {/* Results heading status */}
      <div className="flex items-center justify-between px-1 text-xs text-gray-500 font-medium">
        <span>Menampilkan {filteredIdeBermain.length} ide bermain</span>
        {(activeCategory !== 'Semua' || searchQuery) && (
          <button 
            onClick={() => {
              setActiveCategory('Semua');
              setSearchQuery('');
            }} 
            className="text-brand-teal font-semibold hover:underline"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Main activities layout */}
      <div className="flex flex-col gap-3.5">
        <AnimatePresence mode="popLayout">
          {filteredIdeBermain.length > 0 ? (
            <div className="flex flex-col gap-3.5">
              {filteredIdeBermain.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    if (isBermainLocked(item.id)) {
                      onTriggerPremium();
                    } else {
                      onSelectIdeBermain(item.id);
                    }
                  }}
                  className="bg-white border hover:border-brand-teal/25 border-gray-100 rounded-3xl p-5 cursor-pointer flex gap-4 transition-colors shadow-xs relative group overflow-hidden font-sans"
                >
                  {/* Left Side Emoji Frame */}
                  <div className="bg-brand-bg w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center text-2xl border border-gray-50 group-hover:scale-105 transition-transform self-start">
                    {getBermainIcon(item.id)}
                  </div>

                  {/* Right Side Info */}
                  <div className="flex flex-col gap-3 min-w-0 flex-1">
                    {/* Category ages & duration row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5 font-sans">
                        <span className="bg-brand-mint text-brand-dark border border-brand-teal/15 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                          {item.usia}
                        </span>
                        <span className="bg-brand-lavender/40 text-indigo-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                          {item.areaStimulasi}
                        </span>
                        {isBermainLocked(item.id) && (
                          <span className="bg-amber-50 border border-amber-200/50 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                            🔒 Premium
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono flex items-center gap-0.5 shrink-0">
                        <Clock size={11} className="text-gray-400" />
                        {item.durasi}
                      </span>
                    </div>

                    {/* Title and descriptions */}
                    <div className="flex flex-col gap-1 mt-0.5">
                      <h2 className="font-display font-bold text-sm md:text-base text-brand-dark group-hover:text-brand-teal transition-colors">
                        {item.judul}
                      </h2>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {item.deskripsi}
                      </p>
                    </div>

                    {/* Tools needed box */}
                    <div className="flex items-center gap-1 bg-brand-bg border border-gray-50 px-3 py-2 rounded-xl text-[11px] text-gray-600 mt-0.5">
                      <Wrench size={12} className="text-brand-teal shrink-0" />
                      <span className="truncate">
                        <strong>Alat:</strong> {item.alat}
                      </span>
                    </div>

                    {/* Complete footer CTA row */}
                    <div className="flex items-center justify-between border-t border-gray-50 pt-3 text-[10px] text-gray-400 animate-none">
                      <span>Mendukung {item.langkahLangkah.length} petunjuk interaktif</span>
                      {isBermainLocked(item.id) ? (
                        <button className="text-[11px] font-bold text-amber-700 flex items-center gap-0.5 shadow-sm">
                          <span>Buka Kunci 🔒</span>
                        </button>
                      ) : (
                        <button className="text-[11px] font-bold text-brand-teal flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          <span>Lihat Cara Main</span>
                          <span>»</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border rounded-2xl p-8 text-center flex flex-col items-center gap-3 shadow-md"
            >
              <span className="text-4xl">🎨</span>
              <div className="flex flex-col gap-1 max-w-xs">
                <h3 className="font-display font-bold text-sm text-brand-dark">
                  Belum ketemu permainannya
                </h3>
                <p className="text-xs text-gray-400 leading-normal">
                  Coba kata kunci lain atau pilih jenjang umur si kecil yang berbeda, Moms & Dads.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('Semua');
                }}
                className="bg-brand-mint text-brand-teal hover:bg-brand-teal hover:text-white transition-all text-xs font-semibold py-2 px-4 rounded-xl mt-1.5"
              >
                Tampilkan Semua Permainan
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
