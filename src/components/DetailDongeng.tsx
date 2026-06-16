import { Dongeng } from '../types';
import { BookOpen, Clock, Heart, BookMarked, Sparkles, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface DetailDongengProps {
  dongeng: Dongeng;
  onBack: () => void;
  onReadOther: () => void;
}

export default function DetailDongeng({ dongeng, onBack, onReadOther }: DetailDongengProps) {
  // Map icons based on rating or name
  const getHeaderIcon = (id: string) => {
    switch (id) {
      case 'halo-dari-dalam-perut-ibu': return '🤰';
      case 'bintang-kecil-yang-sabar-menunggu': return '🌟';
      case 'pelukan-pertama-si-kecil': return '👶';
      case 'suara-ayah-di-pagi-hari': return '🌅';
      case 'si-kelinci-belajar-mendengar': return '🐰';
      case 'bola-merah-yang-menggelinding': return '🔴';
      case 'lala-belajar-bilang-tolong': return '🐿️';
      case 'timo-tidak-takut-mencoba': return '🐢';
      case 'hutan-warna-warni': return '🌳';
      case 'nara-dan-sepatu-kecilnya': return '👟';
      default: return '📖';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pb-24 px-4 pt-4 flex flex-col gap-6"
    >
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-brand-teal hover:opacity-85 transition-opacity"
        >
          <ArrowLeft size={16} />
          <span>Kembali</span>
        </button>
        <span className="text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-100 shadow-xs">
          ID: {dongeng.id}
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col gap-3">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cream/40 rounded-bl-full -z-10 flex items-start justify-end p-4">
          <span className="text-4xl">{getHeaderIcon(dongeng.id)}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="bg-brand-mint text-brand-dark font-medium text-[11px] px-2.5 py-1 rounded-full border border-brand-teal/20">
            {dongeng.usia}
          </span>
          <span className="bg-brand-lavender/30 text-indigo-700 font-medium text-[11px] px-2.5 py-1 rounded-full">
            {dongeng.nilaiCerita}
          </span>
        </div>

        <h1 className="font-display font-bold text-2xl text-brand-dark pr-16 leading-snug">
          {dongeng.judul}
        </h1>

        <div className="flex items-center gap-4 mt-2 pt-3 border-t border-gray-50 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={13} className="text-brand-teal" />
            <span>Saran baca: {dongeng.durasi}</span>
          </span>
          <span className="flex items-center gap-1">
            <BookMarked size={13} className="text-brand-teal" />
            <span>Misi: Mempererat Bonding</span>
          </span>
        </div>
      </div>

      {/* Reading Panel */}
      <div className="bg-[#FFFDF9] border border-orange-100 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col gap-5">
        <div className="flex items-center gap-1.5 text-xs text-orange-600 font-medium tracking-wide uppercase">
          <BookOpen size={14} />
          <span>Mulai Membaca Dongeng</span>
        </div>

        {/* Narrative */}
        <div className="flex flex-col gap-5">
          {dongeng.isi.map((paragraf, index) => (
            <p
              key={index}
              className="text-brand-dark/95 text-base md:text-[17px] leading-relaxed tracking-normal font-sans"
            >
              {paragraf}
            </p>
          ))}
        </div>

        {/* Ending separator */}
        <div className="flex justify-center items-center gap-1.5 py-4">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
          <div className="w-8 h-px bg-brand-teal/30" />
          <Heart size={14} className="text-rose-400 fill-rose-100" />
          <div className="w-8 h-px bg-brand-teal/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
        </div>
      </div>

      {/* Tips section */}
      <div className="bg-brand-mint/40 rounded-3xl p-5 border border-brand-teal/10 flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-dark">
          <Sparkles size={16} className="text-brand-teal animate-pulse" />
          <span>Tips Membacakannya</span>
        </div>
        <p className="text-xs text-brand-dark/85 leading-relaxed bg-white/75 p-3.5 rounded-2xl border border-white/60">
          {dongeng.tipsMembacakan}
        </p>
        <div className="text-[11px] text-gray-500 italic px-1 mt-1 text-center">
          “Setiap anak memiliki ritme tumbuh yang berbeda, kehadiran Anda saat bercerita adalah stimulasi terbaik.”
        </div>
      </div>

      {/* Action footer */}
      <div className="flex flex-col gap-2.5 mt-2">
        <button
          onClick={onReadOther}
          className="w-full bg-brand-teal text-white font-medium text-sm py-3.5 px-6 rounded-2xl hover:opacity-90 transform active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <RefreshCw size={15} />
          <span>Baca Dongeng Lain</span>
        </button>
        <button
          onClick={onBack}
          className="w-full bg-white text-brand-dark border border-gray-200 font-medium text-sm py-3 px-6 rounded-2xl hover:bg-gray-50 transition-colors"
        >
          Kembali ke Daftar Dongeng
        </button>
      </div>
    </motion.div>
  );
}
