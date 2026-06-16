import { useState, useMemo } from 'react';
import { Ucapan } from '../types';
import { UCAPAN_DATA } from '../data';
import { Search, Heart, Quote, Volume2, Sparkles, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UcapanViewProps {
  onSelectUcapan: (id: string) => void;
  overrideCategory?: string | null;
  onClearOverrideCategory?: () => void;
  isPremium: boolean;
  onTriggerPremium: () => void;
}

export default function UcapanView({
  onSelectUcapan,
  overrideCategory,
  onClearOverrideCategory,
  isPremium,
  onTriggerPremium,
}: UcapanViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const isUcapanLocked = (id: string) => {
    if (isPremium) return false;
    const globalIdx = UCAPAN_DATA.findIndex(u => u.id === id);
    return globalIdx >= 2;
  };
  
  // Set default active tab. If parent requested 'Dari Dads' override, we use it!
  const [activeCategory, setActiveCategory] = useState(() => {
    return overrideCategory || 'Semua';
  });

  const categories = [
    'Semua',
    'Untuk Kandungan',
    'Dari Moms',
    'Dari Dads',
    'Pagi',
    'Malam',
    'Saat Bayi Bergerak',
    'Menjelang Lahiran',
    'Doa',
    'Afirmasi'
  ];

  const filteredUcapan = useMemo(() => {
    return UCAPAN_DATA.filter(item => {
      // Category filter check
      const matchesCategory = activeCategory === 'Semua' || item.kategori.includes(activeCategory);
      if (!matchesCategory) return false;

      // Search matching
      const q = searchQuery.toLowerCase();
      if (!q) return true;

      return (
        item.judul.toLowerCase().includes(q) ||
        item.situasi.toLowerCase().includes(q) ||
        item.contohUtama.toLowerCase().includes(q) ||
        item.untuk.toLowerCase().includes(q) ||
        item.kategori.some(tag => tag.toLowerCase().includes(q)) ||
        // support extra requested search topics
        (q === 'doa' && item.kategori.includes('Doa')) ||
        (q === 'afirmasi' && item.kategori.includes('Afirmasi')) ||
        (q === 'suara' && item.situasi.toLowerCase().includes('suara'))
      );
    });
  }, [searchQuery, activeCategory]);

  const getActorEmoji = (untuk: string) => {
    switch (untuk) {
      case 'Moms': return '👩';
      case 'Dads': return '👨';
      default: return '🏡';
    }
  };

  const getActorBadgeStyle = (untuk: string) => {
    switch (untuk) {
      case 'Moms': return 'bg-brand-lavender text-indigo-700 border-indigo-200/50';
      case 'Dads': return 'bg-brand-mint text-brand-dark border-brand-teal/20';
      default: return 'bg-brand-cream text-amber-800 border-amber-200/50';
    }
  };

  const getUcapanEmoji = (id: string) => {
    switch (id) {
      case 'pagi-untuk-bayi-dalam-kandungan': return '🌅';
      case 'malam-sebelum-tidur': return '🌙';
      case 'kalimat-ayah-untuk-si-kecil': return '👨‍👦';
      case 'ibu-saat-mengelus-perut': return '🫄';
      case 'saat-bayi-bergerak': return '👣';
      case 'saat-kontrol-kehamilan': return '🩺';
      case 'menjelang-lahiran': return '🤰';
      case 'doa-singkat-untuk-si-kecil': return '🙏';
      case 'afirmasi-moms-dan-bayi': return '✨';
      case 'ayah-saat-pulang-kerja': return '💼';
      case 'saat-bayi-gumoh': return '🍼';
      case 'ayah-menemani-ibu-menyusui': return '🤱';
      case 'doa-sebelum-ibu-tidur': return '🕊️';
      case 'ketika-membasuh-tubuh-bayi': return '🧼';
      case 'saat-mengganti-popok-si-kecil': return '🧻';
      case 'afirmasi-ketika-anak-tantrum': return '❤️';
      case 'doa-ketika-bayi-demam-ringan': return '🤒';
      case 'menyambut-langkah-pertama': return '👟';
      case 'ciuman-hangat-sebelum-tidur': return '😘';
      case 'ayah-menggendong-setelah-mandi': return '🧖';
      case 'afirmasi-posisi-kepala-persalinan': return '🔄';
      case 'atasi-morning-sickness': return '🍋';
      case 'ayah-weekend-bonding': return '🎈';
      case 'tenangkan-kecemasan-kehamilan': return '🧘';
      case 'saat-mendengar-musik': return '🎵';
      case 'syukur-detak-jantung-janin': return '💓';
      case 'moms-siapkan-perlengkapan': return '🧺';
      case 'doa-ayah-malam-ibu-janin': return '🌌';
      case 'menyapa-saat-hujan': return '🌧️';
      case 'hadapi-braxton-hicks': return '🌬️';
      case 'jalan-pagi-matahari': return '☀️';
      default: return '💬';
    }
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    if (onClearOverrideCategory) {
      onClearOverrideCategory();
    }
  };

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
          Ucapan Afirmasi
        </h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          Tiru untaian sapaan lembut untuk mengawali obrolan menyenangkan batin bersama si kecil sejak di rahim.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari ucapan..."
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

      {/* Horizontal pill navigation */}
      <div className="flex flex-col gap-1.5 overflow-hidden">
        <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase px-1">
          Kategori Ucapan
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide -mx-4 px-4 mask-right">
          {categories.map((cat, idx) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={idx}
                onClick={() => handleCategoryClick(cat)}
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

      {/* Supportive Quote Banner */}
      <div className="bg-brand-cream/40 border border-amber-200/20 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-amber-900/90 items-start">
        <Volume2 size={18} className="text-brand-teal shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-amber-900">“Suara adalah jembatan batin.”</span>
          <p className="text-[11px] text-amber-800">
            Bayi mungkin belum menjawab, tapi suara Moms & Dads bisa menjadi bagian dari momen bonding yang membekas.
          </p>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 text-xs text-gray-500 font-medium">
        <span>Menampilkan {filteredUcapan.length} ucapan</span>
        {(activeCategory !== 'Semua' || searchQuery) && (
          <button 
            onClick={() => {
              setActiveCategory('Semua');
              setSearchQuery('');
              if (onClearOverrideCategory) onClearOverrideCategory();
            }} 
            className="text-brand-teal font-semibold hover:underline"
          >
            Bersihkan Filter
          </button>
        )}
      </div>

      {/* Cards List Layout */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {filteredUcapan.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredUcapan.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    if (isUcapanLocked(item.id)) {
                      onTriggerPremium();
                    } else {
                      onSelectUcapan(item.id);
                    }
                  }}
                  className="bg-white border hover:border-brand-teal/25 border-gray-100 rounded-2xl p-4 cursor-pointer transition-all shadow-xs flex gap-4 relative overflow-hidden group font-sans"
                >
                  {/* Left Side Emoji Frame */}
                  <div className="bg-brand-bg w-14 h-14 rounded-xl shrink-0 flex items-center justify-center text-2xl border border-gray-50 group-hover:scale-105 transition-transform self-start">
                    {getUcapanEmoji(item.id)}
                  </div>

                  {/* Right Side Info */}
                  <div className="flex flex-col gap-2.5 min-w-0 flex-1">
                    {/* Decorative badge top right */}
                    <div className="flex justify-between items-start gap-1">
                      <div className="flex flex-wrap gap-1 items-center">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${getActorBadgeStyle(item.untuk)}`}>
                          {getActorEmoji(item.untuk)} {item.untuk === 'Keduanya' ? 'Moms & Dads' : item.untuk}
                        </span>
                        {isUcapanLocked(item.id) && (
                          <span className="bg-amber-50 border border-amber-200/50 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            🔒 Premium
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-semibold">
                        {item.situasi}
                      </span>
                    </div>

                    {/* Highlight Quote */}
                    <div className="flex items-start gap-2 mt-1 min-w-0">
                      <Quote size={15} className="text-brand-teal/30 shrink-0 mt-0.5" />
                      <h2 className="font-display font-bold text-sm text-brand-dark line-clamp-1 group-hover:text-brand-teal transition-colors">
                        {item.judul}
                      </h2>
                    </div>

                    {/* Featured sentence example */}
                    <p className="text-xs text-gray-500 italic bg-brand-bg/50 border border-gray-100 p-2.5 rounded-xl">
                      “{item.contohUtama}”
                    </p>

                    {/* Actions details bar */}
                    <div className="flex items-center justify-between border-t border-gray-50 pt-2 text-[10px] text-gray-400">
                      <span className="truncate text-gray-400">Tersedia {item.kalimatList.length} contoh ucapan</span>
                      {isUcapanLocked(item.id) ? (
                        <button className="text-amber-700 font-bold flex items-center gap-0.5 shrink-0">
                          <span>Buka Kunci 🔒</span>
                        </button>
                      ) : (
                        <button className="text-brand-teal font-bold flex items-center gap-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform">
                          <span>Lihat Ucapan</span>
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
              className="bg-white border rounded-2xl p-8 text-center flex flex-col items-center gap-3 shadow-sm"
            >
              <span className="text-4xl">💬</span>
              <div className="flex flex-col gap-1 max-w-xs">
                <h3 className="font-display font-bold text-sm text-brand-dark">
                  Belum ketemu ucapannya
                </h3>
                <p className="text-xs text-gray-400 leading-normal">
                  Coba kata kunci lain atau pilih momen situasi sapaan lainnya, Moms & Dads.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('Semua');
                  if (onClearOverrideCategory) onClearOverrideCategory();
                }}
                className="bg-brand-mint text-brand-teal hover:bg-brand-teal hover:text-white transition-all text-xs font-semibold py-2 px-4 rounded-xl mt-1.5"
              >
                Tampilkan Semua Ucapan
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
