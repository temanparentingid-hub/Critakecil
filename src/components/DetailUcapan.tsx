import { Ucapan } from '../types';
import { Sparkles, ArrowLeft, Copy, Check, Quote, Heart, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DetailUcapanProps {
  ucapan: Ucapan;
  onBack: () => void;
}

export default function DetailUcapan({ ucapan, onBack }: DetailUcapanProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const getActorLabel = (untuk: string) => {
    switch (untuk) {
      case 'Moms': return 'Khusus Moms 👩';
      case 'Dads': return 'Khusus Dads 👨';
      default: return 'Moms & Dads 🏡';
    }
  };

  const getActorBadgeStyle = (untuk: string) => {
    switch (untuk) {
      case 'Moms': return 'bg-brand-lavender text-indigo-700 border-indigo-200';
      case 'Dads': return 'bg-brand-mint text-brand-dark border-brand-teal';
      default: return 'bg-brand-cream text-amber-800 border-amber-300';
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
          Situasi: {ucapan.situasi}
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-3 relative">
        <div className="flex flex-wrap gap-2">
          <span className={`font-semibold text-[10px] px-2.5 py-1 rounded-full border ${getActorBadgeStyle(ucapan.untuk)}`}>
            {getActorLabel(ucapan.untuk)}
          </span>
          {ucapan.kategori.map((tag, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-600 font-medium text-[10px] px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="font-display font-bold text-xl text-brand-dark leading-snug">
          {ucapan.judul}
        </h1>

        <p className="text-xs text-gray-500 italic mt-1 leading-relaxed">
          Gunakan kalimat-kalimat di bawah ini untuk berbisik, menyentuh, atau memejamkan mata sembari berinteraksi dengan si kecil di kandungan atau buaian.
        </p>
      </div>

      {/* Sentence Templates */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-bold text-brand-dark/70 tracking-widest uppercase px-1">
          Contoh Kalimat Siap Baca ({ucapan.kalimatList.length})
        </h2>

        <div className="flex flex-col gap-3">
          {ucapan.kalimatList.map((sentence, idx) => (
            <div
              key={idx}
              className="bg-[#FFFDFB] hover:bg-white border hover:border-brand-teal/20 transition-all rounded-2xl p-4 flex flex-col gap-3 shadow-xs relative group"
            >
              <div className="flex items-start gap-2.5">
                <Quote size={18} className="text-brand-teal/25 shrink-0 mt-0.5" />
                <p className="text-brand-dark font-sans text-sm md:text-base leading-relaxed">
                  {sentence}
                </p>
              </div>

              {/* Action buttons on card footer */}
              <div className="flex items-center justify-end border-t border-gray-50 pt-2 mt-1">
                <button
                  onClick={() => handleCopy(sentence, idx)}
                  className="flex items-center gap-1.5 text-xs text-brand-teal hover:bg-brand-mint/40 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check size={12} className="text-emerald-500" />
                      <span className="text-emerald-600 font-medium">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span className="font-medium">Salin Kalimat</span>
                    </>
                  )}
                </button>
              </div>

              {/* Toast notifier for copying */}
              <AnimatePresence>
                {copiedIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-[11px] font-medium py-1.5 px-3 rounded-full shadow-md z-10 flex items-center gap-1 shrink-0 whitespace-nowrap"
                  >
                    <span>📋 Berhasil disalin ke kliplat Moms & Dads!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Natural speaking tips */}
      <div className="bg-brand-lavender/30 rounded-3xl p-5 border border-brand-lavender/40 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-dark">
          <Volume2 size={16} className="text-indigo-600" />
          <span>Tips Membaca dengan Natural</span>
        </div>
        <p className="text-xs text-brand-dark/90 leading-relaxed bg-white/70 p-3.5 rounded-2xl border border-white/60">
          {ucapan.tipsMenatural}
        </p>
      </div>

      {/* Gentle constant reminder */}
      <div className="bg-brand-cream/40 rounded-3xl p-5 border border-amber-200/40 flex items-start gap-3">
        <Heart size={20} className="text-rose-500 fill-rose-100 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-amber-900">Catatan Kecil Orang Tua:</span>
          <p className="text-xs text-amber-800/90 leading-relaxed">
            “Tidak harus panjang. Satu kalimat hangat yang dibaca secara konsisten sudah cukup untuk membangun momen bonding.”
          </p>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="w-full bg-brand-teal text-white font-medium text-sm py-3.5 px-6 rounded-2xl hover:opacity-90 transform active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <span>Lihat Ucapan Lainnya</span>
      </button>
    </motion.div>
  );
}
