import { useState, useEffect } from 'react';
import { DONGENG_DATA, UCAPAN_DATA, IDE_BERMAIN_DATA } from './data';
import { Home, BookOpen, Volume2, Compass, Info, Heart, X, Sparkles, Check, Key, CheckCircle2, AlertTriangle, ExternalLink, Users } from 'lucide-react';
import BerandaView from './components/BerandaView';
import DongengView from './components/DongengView';
import UcapanView from './components/UcapanView';
import IdeBermainView from './components/IdeBermainView';
import TentangView from './components/TentangView';
import AksesView from './components/AksesView';
import DetailDongeng from './components/DetailDongeng';
import DetailUcapan from './components/DetailUcapan';
import DetailIdeBermain from './components/DetailIdeBermain';
import { AnimatePresence, motion } from 'motion/react';

type TabType = 'beranda' | 'dongeng' | 'ucapan' | 'bermain' | 'tentang' | 'akses';
type DetailViewType = {
  type: 'list' | 'detail-dongeng' | 'detail-ucapan' | 'detail-bermain';
  id: string;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('beranda');
  const [detailView, setDetailView] = useState<DetailViewType>({ type: 'list', id: '' });
  const [overrideUcapanCategory, setOverrideUcapanCategory] = useState<string | null>(null);

  const [hasUnlockedPremium, setHasUnlockedPremium] = useState<boolean>(() => {
    return localStorage.getItem('critakecil_premium') === '2506CK-3' || localStorage.getItem('critakecil_unlocked') === 'true';
  });
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    const storedActive = localStorage.getItem('critakecil_premium_active');
    if (storedActive !== null) {
      return storedActive === 'true';
    }
    return localStorage.getItem('critakecil_premium') === '2506CK-3' || localStorage.getItem('critakecil_unlocked') === 'true';
  });
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');

  const isAdmin = localStorage.getItem('critakecil_premium') === '2506CK-3';

  const handleVerifyLicenseCode = async (code: string): Promise<boolean> => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === '250CK-3' || trimmed === '2506CK-3') {
      setHasUnlockedPremium(true);
      setIsPremium(true);
      localStorage.setItem('critakecil_premium', '2506CK-3');
      localStorage.setItem('critakecil_unlocked', 'true');
      localStorage.setItem('critakecil_premium_active', 'true');
      setIsPremiumModalOpen(false);
      setModalError('');
      return true;
    }

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: trimmed })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.valid) {
          setHasUnlockedPremium(true);
          setIsPremium(true);
          localStorage.setItem('critakecil_premium', trimmed);
          localStorage.setItem('critakecil_unlocked', 'true');
          localStorage.setItem('critakecil_premium_active', 'true');
          setIsPremiumModalOpen(false);
          setModalError('');
          return true;
        }
      }
      setModalError('Kode lisensi tidak valid. Silakan hubungi admin Teman Parenting.');
      return false;
    } catch (err) {
      console.error(err);
      setModalError('Gagal memverifikasi kode. Silakan periksa koneksi internet Anda.');
      return false;
    }
  };

  const handleSetPremiumActive = (active: boolean) => {
    setIsPremium(active);
    localStorage.setItem('critakecil_premium_active', active ? 'true' : 'false');
  };

  const handleResetLicense = () => {
    setHasUnlockedPremium(false);
    setIsPremium(false);
    localStorage.removeItem('critakecil_premium');
    localStorage.removeItem('critakecil_unlocked');
    localStorage.removeItem('critakecil_premium_active');
  };

  // Auto-scroll to top on navigation/detail transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, detailView.type, detailView.id]);

  // Lock scroll background when premium modal is opened & reset modalError
  useEffect(() => {
    if (isPremiumModalOpen) {
      document.body.style.overflow = 'hidden';
      setModalError('');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPremiumModalOpen]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setDetailView({ type: 'list', id: '' });
    if (tab !== 'ucapan') {
      setOverrideUcapanCategory(null);
    }
  };

  const handleSelectDongeng = (id: string) => {
    setDetailView({ type: 'detail-dongeng', id });
    setActiveTab('dongeng');
  };

  const handleSelectUcapan = (id: string) => {
    setDetailView({ type: 'detail-ucapan', id });
    setActiveTab('ucapan');
  };

  const handleSelectIdeBermain = (id: string) => {
    setDetailView({ type: 'detail-bermain', id });
    setActiveTab('bermain');
  };

  const handleSelectDadsUcapanCategory = () => {
    setOverrideUcapanCategory('Dari Dads');
    setDetailView({ type: 'list', id: '' });
    setActiveTab('ucapan');
  };

  // Back action generator inside detail views
  const handleBackToList = () => {
    setDetailView({ type: 'list', id: '' });
  };

  // Let "Read Next / Read other" pick a random story that isn't the same one
  const handleReadOtherDongeng = () => {
    const currentId = detailView.id;
    const items = DONGENG_DATA.filter(item => item.id !== currentId);
    if (items.length > 0) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setDetailView({ type: 'detail-dongeng', id: randomItem.id });
    }
  };

  // Render the center screen body depending on state
  const renderContent = () => {
    // If a detail view is active, render the specific detail view
    if (detailView.type === 'detail-dongeng') {
      const selectedStory = DONGENG_DATA.find(item => item.id === detailView.id);
      if (selectedStory) {
        return (
          <DetailDongeng
            dongeng={selectedStory}
            onBack={handleBackToList}
            onReadOther={handleReadOtherDongeng}
          />
        );
      }
    }

    if (detailView.type === 'detail-ucapan') {
      const selectedGreeting = UCAPAN_DATA.find(item => item.id === detailView.id);
      if (selectedGreeting) {
        return (
          <DetailUcapan
            ucapan={selectedGreeting}
            onBack={handleBackToList}
          />
        );
      }
    }

    if (detailView.type === 'detail-bermain') {
      const selectedGame = IDE_BERMAIN_DATA.find(item => item.id === detailView.id);
      if (selectedGame) {
        return (
          <DetailIdeBermain
            ideBermain={selectedGame}
            onBack={handleBackToList}
          />
        );
      }
    }

    // Otherwise render standard tab view dashboards
    switch (activeTab) {
      case 'beranda':
        return (
          <BerandaView
            onNavigateTab={handleTabChange}
            onSelectDongeng={handleSelectDongeng}
            onSelectUcapan={handleSelectUcapan}
            onSelectIdeBermain={handleSelectIdeBermain}
            onSelectDadsUcapanCategory={handleSelectDadsUcapanCategory}
            isPremium={isPremium}
            onTriggerPremium={() => setIsPremiumModalOpen(true)}
          />
        );
      case 'dongeng':
        return (
          <DongengView
            onSelectDongeng={handleSelectDongeng}
            isPremium={isPremium}
            onTriggerPremium={() => setIsPremiumModalOpen(true)}
          />
        );
      case 'ucapan':
        return (
          <UcapanView
            onSelectUcapan={handleSelectUcapan}
            overrideCategory={overrideUcapanCategory}
            onClearOverrideCategory={() => setOverrideUcapanCategory(null)}
            isPremium={isPremium}
            onTriggerPremium={() => setIsPremiumModalOpen(true)}
          />
        );
      case 'bermain':
        return (
          <IdeBermainView
            onSelectIdeBermain={handleSelectIdeBermain}
            isPremium={isPremium}
            onTriggerPremium={() => setIsPremiumModalOpen(true)}
          />
        );
      case 'tentang':
        return (
          <TentangView
            hasUnlockedPremium={hasUnlockedPremium}
            onVerifyCode={handleVerifyLicenseCode}
            onResetLicense={handleResetLicense}
            onTriggerPremium={() => setIsPremiumModalOpen(true)}
          />
        );
      case 'akses':
        if (isAdmin) {
          return <AksesView adminCode="2506CK-3" />;
        }
        return (
          <BerandaView
            onNavigateTab={handleTabChange}
            onSelectDongeng={handleSelectDongeng}
            onSelectUcapan={handleSelectUcapan}
            onSelectIdeBermain={handleSelectIdeBermain}
            onSelectDadsUcapanCategory={handleSelectDadsUcapanCategory}
            isPremium={isPremium}
            onTriggerPremium={() => setIsPremiumModalOpen(true)}
          />
        );
      default:
        return (
          <BerandaView
            onNavigateTab={handleTabChange}
            onSelectDongeng={handleSelectDongeng}
            onSelectUcapan={handleSelectUcapan}
            onSelectIdeBermain={handleSelectIdeBermain}
            onSelectDadsUcapanCategory={handleSelectDadsUcapanCategory}
            isPremium={isPremium}
            onTriggerPremium={() => setIsPremiumModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-[#2F3A3A] font-sans flex flex-col justify-start selection:bg-brand-mint selection:text-brand-dark">
      {/* Container holding compact mobile-first frame vertically centered on large displays */}
      <div className="flex-1 w-full max-w-xl mx-auto bg-white min-h-screen shadow-lg border-x border-gray-100/60 flex flex-col justify-between relative">
        
        {/* Top Header Logo on Main directory lists */}
        {detailView.type === 'list' && (
          <header className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-5 py-3.5 border-b border-gray-100/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐣</span>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-brand-dark text-base leading-none">
                  Critakecil
                </span>
                <a 
                  href="https://temanparenting.web.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-brand-teal font-medium tracking-wider hover:underline"
                >
                  by Teman Parenting
                </a>
              </div>
            </div>
            
            {/* Clean top-right access mode indicator */}
            {isPremium ? (
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100/50 flex items-center gap-1 uppercase tracking-wider font-sans">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                mode premium
              </span>
            ) : (
              <button
                onClick={() => setIsPremiumModalOpen(true)}
                className="bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-200/55 flex items-center gap-1 transition-colors cursor-pointer uppercase tracking-wider font-sans animate-bounce-subtle"
              >
                mode gratis 🔒
              </button>
            )}
          </header>
        )}

        {/* Content Section inside the layout context */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${detailView.type}-${detailView.id}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Sticky Mobile Friendly Bottom Navigation Tab Bar */}
        <nav className="sticky bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-150 py-2.5 px-4 flex items-center justify-around z-40 shadow-sm mt-auto">
          {/* Tab 1: Beranda */}
          <button
            onClick={() => handleTabChange('beranda')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'beranda' ? 'text-brand-teal scale-105 font-semibold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Home size={19} className={activeTab === 'beranda' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[10px] leading-tight">Beranda</span>
          </button>

          {/* Tab 2: Dongeng */}
          <button
            onClick={() => handleTabChange('dongeng')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'dongeng' ? 'text-brand-teal scale-105 font-semibold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <BookOpen size={19} className={activeTab === 'dongeng' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[10px] leading-tight">Dongeng</span>
          </button>

          {/* Tab 3: Ucapan */}
          <button
            onClick={() => handleTabChange('ucapan')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'ucapan' ? 'text-brand-teal scale-105 font-semibold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Volume2 size={19} className={activeTab === 'ucapan' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[10px] leading-tight">Ucapan</span>
          </button>

          {/* Tab 4: Ide Bermain */}
          <button
            onClick={() => handleTabChange('bermain')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'bermain' ? 'text-brand-teal scale-105 font-semibold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Compass size={19} className={activeTab === 'bermain' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[10px] leading-tight">Ide Main</span>
          </button>

          {/* Tab 5: Tentang */}
          <button
            onClick={() => handleTabChange('tentang')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'tentang' ? 'text-brand-teal scale-105 font-semibold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Info size={19} className={activeTab === 'tentang' ? 'stroke-[2.5px]' : 'stroke-2'} />
            <span className="text-[10px] leading-tight">Tentang</span>
          </button>

          {/* Tab 6: Akses (Only visible to Admin) */}
          {isAdmin && (
            <button
              onClick={() => handleTabChange('akses')}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeTab === 'akses' ? 'text-brand-teal scale-105 font-semibold' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Users size={19} className={activeTab === 'akses' ? 'stroke-[2.5px]' : 'stroke-2'} />
              <span className="text-[10px] leading-tight">Akses</span>
            </button>
          )}
        </nav>

        {/* Premium Lock Modal Overlay */}
        {isPremiumModalOpen && (
          <div className="fixed inset-0 z-55 bg-[#1e293b]/70 backdrop-blur-xs flex items-center justify-center p-5 font-sans overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm sm:max-w-md border border-gray-100 shadow-2xl flex flex-col gap-4 relative my-auto"
            >
              <button
                onClick={() => setIsPremiumModalOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-stone-950 p-2 rounded-full hover:bg-stone-50 transition-colors cursor-pointer"
                id="close-premium-modal"
              >
                <X size={18} />
              </button>

              {/* Header Icon */}
              <div className="mx-auto bg-[#e5f7f4] text-brand-teal p-3.5 rounded-full w-14 h-14 flex items-center justify-center border border-brand-teal/10 shadow-sm mt-3">
                <Key size={24} className="text-[#007A6E]" />
              </div>

              {/* Title Header */}
              <div className="flex flex-col gap-1.5 text-center px-1">
                <h3 className="font-display font-black text-xl text-stone-950 leading-tight">
                  Aktivasi Critakecil Premium
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto text-center">
                  Dapatkan bimbingan lengkap & aman selamanya tanpa batas!
                </p>
              </div>

              {/* Limit Promo Box Card */}
              <div className="bg-[#FFFDF6] border border-amber-200/80 rounded-3xl p-4 flex flex-col items-center gap-1.5 w-full text-center shadow-xs">
                <span className="bg-[#FFF3D6] text-amber-800 text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full border border-amber-200/50">
                  PROMO TERBATAS
                </span>
                
                <div className="flex items-baseline justify-center gap-2.5 mt-1.5">
                  <span className="line-through text-stone-400 font-semibold text-sm">Rp 105.000</span>
                  <span className="text-[#00665C] font-black text-2xl tracking-tight">Rp 25.000</span>
                </div>
                
                <span className="text-[11px] text-[#5C4D3C] font-semibold">
                  Akses Selamanya (Lifetime Access) • Satu Kali Bayar
                </span>
              </div>

              {/* Features To Open Header */}
              <div className="w-full text-left mt-1">
                <span className="text-[11px] font-extrabold text-[#00A395] tracking-wider uppercase">
                  FITUR YANG AKAN TERBUKA:
                </span>
              </div>

              {/* Feature List Bullet Points */}
              <div className="flex flex-col gap-2.5 px-0.5 font-sans">
                <div className="flex items-start gap-2 text-xs text-stone-700 leading-normal">
                  <Check size={16} className="text-[#00C2B2] shrink-0 stroke-[3px] mt-0.5" />
                  <span className="font-medium">Akses Seluruh Dongeng Pilihan</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-stone-700 leading-normal">
                  <Check size={16} className="text-[#00C2B2] shrink-0 stroke-[3px] mt-0.5" />
                  <span className="font-medium">Akses Seluruh Ucapan Afirmasi</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-stone-700 leading-normal">
                  <Check size={16} className="text-[#00C2B2] shrink-0 stroke-[3px] mt-0.5" />
                  <span className="font-medium">Seluruh Ide Bermain Lengkap</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-stone-700 leading-normal">
                  <Check size={16} className="text-[#00C2B2] shrink-0 stroke-[3px] mt-0.5" />
                  <span className="font-medium text-justify">Akses Selamanya (Lifetime) tanpa biaya langganan bulanan</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-stone-700 leading-normal">
                  <Check size={16} className="text-[#00C2B2] shrink-0 stroke-[3px] mt-0.5" />
                  <span className="font-medium text-justify">Pembaruan berkala konten & rilis dongeng baru gratis</span>
                </div>
              </div>

              {/* License Code Direct Input */}
              <div className="flex flex-col gap-2 pt-3 border-t border-stone-100">
                <label className="text-xs font-extrabold text-[#4B5563] tracking-wider uppercase text-left">
                  MASUKKAN KODE AKSES
                </label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="modal-license-input"
                    placeholder="Contoh: 12345"
                    className="flex-1 bg-[#F8F9FA] border border-stone-200 focus:border-[#007A6E] focus:ring-1 focus:ring-[#007A6E] focus:outline-none rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder:text-gray-400 font-sans tracking-wide"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget;
                        const success = handleVerifyLicenseCode(input.value);
                        if (success) {
                          input.value = '';
                        }
                      }
                    }}
                  />
                  
                  <button
                    onClick={() => {
                      const input = document.getElementById('modal-license-input') as HTMLInputElement;
                      if (input) {
                        const success = handleVerifyLicenseCode(input.value);
                        if (success) {
                          input.value = '';
                        }
                      }
                    }}
                    className="bg-[#00665C] hover:bg-[#005149] text-white text-xs font-bold px-5 py-2.5 rounded-xl active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-sm font-sans"
                  >
                    <span>Aktifkan</span>
                  </button>
                </div>
                
                {modalError && (
                  <span className="text-[11px] text-rose-600 font-bold font-sans text-center mt-1 bg-rose-50 border border-rose-100/50 p-2 rounded-xl">
                    {modalError}
                  </span>
                )}
              </div>

              {/* How to Get Access Code Card (Reference Mockup Section) */}
              <div className="bg-[#FFF9F6] border border-[#FFE7D9] rounded-3xl p-4 flex flex-col gap-4 mt-2 mb-2 shadow-xs text-left">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={17} className="text-[#D97706] shrink-0" />
                  <span className="font-black text-xs sm:text-sm text-[#954F1C]">
                    Bagaimana Cara Mendapatkan Kode?
                  </span>
                </div>

                <div className="relative flex flex-col gap-4 mt-1 pl-1">
                  {/* Step 1 */}
                  <div className="flex gap-3 relative z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-white border border-[#FFBB94] text-[#E65F19] text-xs font-black flex items-center justify-center shrink-0">
                        1
                      </div>
                      <div className="w-[1.5px] bg-[#FFE0D1] flex-1 min-h-[16px] -mb-4 mt-1"></div>
                    </div>
                    <div className="text-xs text-[#5C4D3C] leading-normal pt-0.5 font-medium">
                      Klik tombol <span className="font-extrabold text-[#00A395]">Dapatkan Kode Akses</span> di bawah
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-3 relative z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-white border border-[#FFBB94] text-[#E65F19] text-xs font-black flex items-center justify-center shrink-0">
                        2
                      </div>
                      <div className="w-[1.5px] bg-[#FFE0D1] flex-1 min-h-[16px] -mb-4 mt-1"></div>
                    </div>
                    <div className="text-xs text-[#5C4D3C] leading-normal pt-0.5 font-medium">
                      Klik tombol <span className="font-bold">Buy Now</span> pada halaman tujuan
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-3 relative z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-white border border-[#FFBB94] text-[#E65F19] text-xs font-black flex items-center justify-center shrink-0">
                        3
                      </div>
                      <div className="w-[1.5px] bg-[#FFE0D1] flex-1 min-h-[16px] -mb-4 mt-1"></div>
                    </div>
                    <div className="text-xs text-[#5C4D3C] leading-normal pt-0.5 font-medium">
                      Selesaikan proses pembayaran pada form <span className="font-bold">Checkout</span> (Rp 25.000)
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-3 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-[#EBF9F1] border border-[#A7E2C1] text-[#1E7F45] text-xs font-bold flex items-center justify-center shrink-0">
                      <Check size={14} className="stroke-[3px]" />
                    </div>
                    <div className="text-xs text-[#5C4D3C] leading-normal pt-0.5 font-medium">
                      <span className="font-extrabold text-[#1E7F45]">Selesai!</span> Kode akses premium akan dikirim otomatis ke email Moms & Dads
                    </div>
                  </div>
                </div>

                {/* Secure Payment Lynk Button */}
                <a
                  href="https://lynk.id/temanparenting/e87e47yq2wmg/checkout?token=cGFyYW1zPSU1QiU1RCZ0aWNrZXRzPSU1QiU1RCZiaWRfcHJpY2U9MCZxdHlfcHJvZD0xJnNlc3NpZD0mdG90YWxfcHJpY2U9JnRvdGFsX3VuaXQ9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#00665C] hover:bg-[#005149] text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm mt-3"
                >
                  <span>Dapatkan Kode Akses</span>
                  <ExternalLink size={13} className="text-white shrink-0 stroke-[2px]" />
                </a>

                {/* Inline WhatsApp Helper Link */}
                <div className="text-center text-xs mt-1">
                  <span className="text-stone-500 font-medium">Ada kendala? </span>
                  <a
                    href="https://wa.me/6285111324256?text=hallo%20admin%20teman%20parenting%2C%20aku%20ingin%20akses%20dari%20aplikasi%20Critakecil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00A395] hover:underline font-extrabold"
                  >
                    hubungi admin via Whatsapp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
