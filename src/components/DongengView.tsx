import { useState, useMemo } from 'react';
import { Dongeng } from '../types';
import { DONGENG_DATA } from '../data';
import { Search, Info, Clock, Heart, BookOpen, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DongengViewProps {
  onSelectDongeng: (id: string) => void;
  isPremium: boolean;
  onTriggerPremium: () => void;
}

export default function DongengView({ onSelectDongeng, isPremium, onTriggerPremium }: DongengViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const isStoryLocked = (id: string) => {
    if (isPremium) return false;
    const globalIdx = DONGENG_DATA.findIndex(item => item.id === id);
    return globalIdx >= 2;
  };

  const ageCategories = [
    'Semua',
    'Dalam Kandungan',
    'Newborn',
    '0–6 Bulan',
    '7–12 Bulan',
    '1–2 Tahun',
    '2–3 Tahun',
    '3–5 Tahun'
  ];

  // Map icons based on id for nice presentation
  const getStoryIcon = (id: string) => {
    switch (id) {
      case 'halo-dari-dalam-perut-ibu': return '🤰';
      case 'bintang-kecil-yang-sabar-menunggu': return '🌟';
      case 'si-kecil-dan-paduan-suara-semesta': return '🌌';
      case 'petualangan-kupu-kupu-emas': return '🦋';
      case 'samudra-hangat-di-perut-ibu': return '🌊';
      case 'bisikan-lembut-angin-malam': return '🍃';
      case 'surat-cinta-dari-masa-depan': return '💌';
      case 'pelukan-pertama-si-kecil': return '👶';
      case 'suara-ayah-di-pagi-hari': return '🌅';
      case 'si-kelinci-belajar-mendengar': return '🐰';
      case 'bola-merah-yang-menggelinding': return '🔴';
      case 'lala-belajar-bilang-tolong': return '🐿️';
      case 'timo-tidak-takut-mencoba': return '🐢';
      case 'hutan-warna-warni': return '🌳';
      case 'nara-dan-sepatu-kecilnya': return '👟';
      case 'awan-lembut-dan-bintang': return '☁️';
      case 'bibi-lebah-yang-rajin': return '🐝';
      case 'anak-gajah-belajar-minum': return '🥤';
      case 'petualangan-kiko-mencari-wortel': return '🥕';
      case 'anak-burung-belajar-terbang': return '🐦';
      case 'ikan-mas-yang-suka-berbagi': return '🐟';
      case 'kancing-baju-si-koko': return '🐱';
      case 'semut-dan-butiran-gula': return '🐜';
      case 'petak-umpet-si-kancil': return '🦌';
      case 'miki-dan-pohon-apel': return '🐒';
      case 'gajah-belalai-tiup': return '🌬️';
      case 'langkah-lambat-eli': return '👣';
      case 'boni-air-mancur': return '⛲';
      case 'gajah-peluk-hangat': return '🫂';
      case 'gigi-kereta-sorong': return '🪵';
      case 'mimi-kucing-pemimpi': return '🐈';
      case 'ciko-petualang-kebun': return '🐾';
      case 'luna-dan-bola-benang': return '🧶';
      case 'piko-kucing-hitam-bintang': return '🐈‍⬛';
      case 'tata-kucing-belon-baik': return '🥛';
      default: return '📖';
    }
  };

  const filteredDongeng = useMemo(() => {
    return DONGENG_DATA.filter(item => {
      // Category filter match
      const isCorrectCategory = activeCategory === 'Semua' || item.usia === activeCategory;
      if (!isCorrectCategory) return false;

      // Text query match (title, desc, value, tags, or ages)
      const q = searchQuery.toLowerCase();
      if (!q) return true;

      return (
        item.judul.toLowerCase().includes(q) ||
        item.deskripsi.toLowerCase().includes(q) ||
        item.usia.toLowerCase().includes(q) ||
        item.nilaiCerita.toLowerCase().includes(q) ||
        // Support semantic tags asked in prompt
        (q === 'cerita' && true) ||
        (q === 'bonding' && item.nilaiCerita.toLowerCase().includes('bonding')) ||
        (q === 'imajinasi' && item.nilaiCerita.toLowerCase().includes('imajinasi')) ||
        (q === 'suara' && item.deskripsi.toLowerCase().includes('suara'))
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
      {/* Title & Help tag */}
      <div className="flex flex-col gap-0.5 mt-2">
        <h1 className="font-display font-extrabold text-2xl text-brand-dark">
          Kumpulan Dongeng
        </h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          Pilih cerita pendek terbaik yang sesuai dengan usia dan momen berharga buah hati Anda.
        </p>
      </div>

      {/* Dynamic Search Bar Component */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari dongeng..."
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

      {/* Horizontal categories list */}
      <div className="flex flex-col gap-1.5 overflow-hidden">
        <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase px-1">
          Pilih Usia Si Kecil
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

      {/* Quick advice banner */}
      <div className="bg-brand-mint/30 border border-brand-teal/10 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-brand-dark/90 leading-normal">
        <Info size={16} className="text-brand-teal shrink-0" />
        <span>“Membaca dongeng mendukung stimulasi pendengaran dan imajinasi cilik secara menyenangkan.”</span>
      </div>

      {/* Main List Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1 text-xs text-gray-500 font-medium">
          <span>Menampilkan {filteredDongeng.length} dongeng</span>
          {activeCategory !== 'Semua' && (
            <button 
              onClick={() => setActiveCategory('Semua')} 
              className="text-brand-teal font-semibold hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {filteredDongeng.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredDongeng.map((story) => (
                <motion.div
                  key={story.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    if (isStoryLocked(story.id)) {
                      onTriggerPremium();
                    } else {
                      onSelectDongeng(story.id);
                    }
                  }}
                  className="bg-white hover:border-brand-teal/20 active:border-brand-teal border border-gray-100 rounded-2xl p-4 cursor-pointer flex gap-4 transition-all shadow-xs relative overflow-hidden group font-sans"
                >
                  {/* Left Side Emoji Frame */}
                  <div className="bg-brand-bg w-14 h-14 rounded-xl shrink-0 flex items-center justify-center text-2xl border border-gray-50 group-hover:scale-105 transition-transform">
                    {getStoryIcon(story.id)}
                  </div>

                  {/* Right Side Info */}
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="bg-brand-mint text-brand-dark px-2 py-0.5 rounded-full font-semibold">
                        {story.usia}
                      </span>
                      {isStoryLocked(story.id) && (
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 border border-amber-200/50">
                          🔒 Premium
                        </span>
                      )}
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 font-mono flex items-center gap-0.5">
                        <Clock size={11} className="text-brand-teal/95" />
                        {story.durasi}
                      </span>
                    </div>

                    <h2 className="font-display font-bold text-sm text-brand-dark group-hover:text-brand-teal transition-colors">
                      {story.judul}
                    </h2>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {story.deskripsi}
                    </p>

                    <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-50">
                      <span className="text-[10px] text-indigo-600 font-medium bg-brand-lavender/30 px-2 py-0.5 rounded-md">
                        ★ {story.nilaiCerita}
                      </span>
                      {isStoryLocked(story.id) ? (
                        <button className="text-[11px] font-bold text-amber-700 flex items-center gap-0.5">
                          <span>Buka Kunci</span>
                          <span>🔒</span>
                        </button>
                      ) : (
                        <button className="text-[11px] font-bold text-brand-teal flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          <span>Baca Dongeng</span>
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
              className="bg-white border rounded-2xl p-8 text-center flex flex-col items-center gap-3 shadow-xs"
            >
              <span className="text-4xl">📚</span>
              <div className="flex flex-col gap-1 max-w-xs">
                <h3 className="font-display font-bold text-sm text-brand-dark">
                  Belum ketemu dongengnya
                </h3>
                <p className="text-xs text-gray-400 leading-normal">
                  Coba kata kunci lain atau pilih usia si kecil yang berbeda ya, Moms.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('Semua');
                }}
                className="bg-brand-mint text-brand-teal hover:bg-brand-teal hover:text-white transition-all text-xs font-semibold py-2 px-4 rounded-xl mt-1.5"
              >
                Tampilkan Semua Dongeng
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
