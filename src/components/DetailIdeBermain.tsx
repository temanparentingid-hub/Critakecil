import { IdeBermain } from '../types';
import { Sparkles, ArrowLeft, ShieldAlert, CheckSquare, Square, ThumbsUp, Wrench, PlayCircle, Eye } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface DetailIdeBermainProps {
  ideBermain: IdeBermain;
  onBack: () => void;
}

export default function DetailIdeBermain({ ideBermain, onBack }: DetailIdeBermainProps) {
  // Track completed steps for fun interactive feedback
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const totalSteps = ideBermain.langkahLangkah.length;
  const doneCount = Object.values(completedSteps).filter(Boolean).length;
  const isAllDone = doneCount === totalSteps;

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
          Stimulasi: {ideBermain.durasi}
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-brand-teal/10 rounded-full blur-xl"></div>
        
        <div className="flex flex-wrap gap-2">
          <span className="bg-brand-mint text-brand-dark font-medium text-[10px] px-2.5 py-1 rounded-full border border-brand-teal/20">
            Usia: {ideBermain.usia}
          </span>
          <span className="bg-brand-lavender/30 text-indigo-700 font-medium text-[10px] px-2.5 py-1 rounded-full">
            {ideBermain.areaStimulasi}
          </span>
        </div>

        <h1 className="font-display font-bold text-xl text-brand-dark leading-snug">
          {ideBermain.judul}
        </h1>

        <p className="text-xs text-gray-500 leading-relaxed mt-1">
          {ideBermain.deskripsi}
        </p>

        {/* Tools panel */}
        <div className="flex items-center gap-2.5 bg-brand-bg p-3 rounded-2xl border border-gray-100/80 mt-2 text-xs">
          <Wrench size={14} className="text-brand-teal shrink-0" />
          <span className="text-brand-dark/80">
            <strong className="text-brand-dark">Alat dibutuhkan:</strong> {ideBermain.alat}
          </span>
        </div>
      </div>

      {/* Interactive step-by-step instructions */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark/70 uppercase tracking-wider">
            <PlayCircle size={15} className="text-brand-teal" />
            <span>Cara Bermain Langkah Demi Langkah</span>
          </div>
          <span className="text-[11px] bg-brand-mint/60 text-brand-teal font-medium px-2 py-0.5 rounded-full">
            Progress: {doneCount}/{totalSteps}
          </span>
        </div>

        {/* Dynamic progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-teal transition-all duration-300 rounded-full" 
            style={{ width: `${(doneCount / totalSteps) * 100}%` }}
          />
        </div>

        {/* Steps List */}
        <div className="flex flex-col gap-3.5 mt-2">
          {ideBermain.langkahLangkah.map((step, index) => {
            const isCompleted = !!completedSteps[index];
            return (
              <div
                key={index}
                onClick={() => toggleStep(index)}
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer select-none transition-all ${
                  isCompleted 
                    ? 'bg-brand-mint/10 border-brand-teal/20 text-brand-dark/70' 
                    : 'bg-[#FAFBFB] border-gray-100 text-brand-dark'
                }`}
              >
                <button className="shrink-0 mt-0.5 text-brand-teal/80 hover:text-brand-teal transition-colors">
                  {isCompleted ? (
                    <CheckSquare size={18} className="fill-brand-mint text-brand-teal" />
                  ) : (
                    <Square size={18} className="text-gray-300" />
                  )}
                </button>
                <div className="flex flex-col gap-0.5">
                  <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${isCompleted ? 'text-brand-teal' : 'text-gray-400'}`}>
                    Langkah {index + 1}
                  </span>
                  <p className={`text-sm leading-relaxed ${isCompleted ? 'line-through decoration-brand-teal/25' : ''}`}>
                    {step}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cheers for completing */}
        {isAllDone && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-brand-mint text-brand-dark text-xs p-4 rounded-2xl border border-brand-teal text-center font-medium mt-1 flex flex-col gap-1 items-center"
          >
            <span className="text-lg">🎉 Hebat sekali, Moms & Dads!</span>
            <span>Anda telah menyelesaikan stimulasi main bersama si kecil hari ini dengan penuh kasih sayang.</span>
          </motion.div>
        )}
      </div>

      {/* Benefits section */}
      <div className="bg-brand-cream/35 rounded-3xl p-5 border border-amber-200/30 flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-900">
          <ThumbsUp size={15} className="text-brand-teal" />
          <span>Manfaat Stimulasi</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed bg-white/60 p-3.5 rounded-2xl border border-white/40">
          {ideBermain.manfaatStimulasi}
        </p>
      </div>

      {/* Safety recommendations */}
      <div className="bg-rose-50 rounded-3xl p-5 border border-rose-100 flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-rose-800">
          <ShieldAlert size={15} className="text-rose-500" />
          <span>Tips Keamanan Bermain</span>
        </div>
        <p className="text-xs text-rose-700/90 leading-relaxed bg-white/70 p-3.5 rounded-2xl border border-rose-100/40">
          {ideBermain.tipsKeamanan}
        </p>
      </div>

      {/* General advisory note */}
      <div className="text-[11px] text-gray-400 italic text-center px-4 leading-relaxed">
        “Setiap anak memiliki ritme tumbuh yang berbeda. Jika Moms & Dads memiliki kekhawatiran khusus terhadap tumbuh kembang si kecil, tanyakan langsung pada dokter anak atau bidan terpercaya Anda.”
      </div>

      {/* Action footer */}
      <button
        onClick={onBack}
        className="w-full bg-brand-teal text-white font-medium text-sm py-3.5 px-6 rounded-2xl hover:opacity-90 transform active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <span>Cari Ide Bermain Lainnya</span>
      </button>
    </motion.div>
  );
}
