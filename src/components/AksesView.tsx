import React, { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Search, Users, AlertCircle, Calendar, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AccessCode {
  code: string;
  label?: string;
  created_at: string;
}

interface AksesViewProps {
  adminCode: string;
}

export default function AksesView({ adminCode }: AksesViewProps) {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCode, setNewCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCodes = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/codes', {
        headers: {
          'Authorization': `Bearer ${adminCode}`
        }
      });
      if (!res.ok) {
        throw new Error('Gagal mengambil daftar akses.');
      }
      const data = await res.json();
      
      // Filter out admin code if it was accidentally saved in the database
      const dbCodes = data.filter((item: any) => item.code.toUpperCase() !== adminCode.toUpperCase());
      
      // Prepend the built-in non-deletable admin code
      const adminEntry: AccessCode = {
        code: adminCode,
        created_at: new Date('2026-06-20T10:00:00+07:00').toISOString()
      };
      
      setCodes([adminEntry, ...dbCodes]);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, [adminCode]);

  const handleAddCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const codeUpper = newCode.trim().toUpperCase();

    try {
      const res = await fetch('/api/codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminCode}`
        },
        body: JSON.stringify({
          code: codeUpper,
          label: ''
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menambahkan kode akses.');
      }

      setSuccess(`Kode akses "${codeUpper}" berhasil ditambahkan!`);
      setNewCode('');
      fetchCodes();
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan kode akses.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCode = async (codeToDelete: string) => {
    if (codeToDelete.toUpperCase() === adminCode.toUpperCase()) {
      return;
    }
    
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kode akses "${codeToDelete}"?`)) {
      return;
    }

    setDeletingCode(codeToDelete);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/codes?code=${encodeURIComponent(codeToDelete)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminCode}`
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menghapus kode akses.');
      }

      setSuccess(`Kode akses "${codeToDelete}" berhasil dihapus.`);
      fetchCodes();
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus kode akses.');
    } finally {
      setDeletingCode(null);
    }
  };

  const filteredCodes = codes.filter((item) =>
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
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
      {/* Header Panel */}
      <div className="flex flex-col gap-1.5 mt-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#007A6E]/10 p-2.5 rounded-2xl border border-[#007A6E]/20 text-[#007A6E]">
            <Key size={22} className="stroke-[2.5px]" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl text-brand-dark leading-none">
              Manajemen Akses
            </h1>
            <span className="text-[10px] text-brand-teal font-semibold tracking-widest uppercase mt-1 block">
              Admin Panel
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Kelola kode akses premium pengguna Critakecil. Data disimpan di database Cloudflare.
        </p>
      </div>

      {/* Add New Code Form */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-1.5 text-xs font-black text-[#007A6E] tracking-wider uppercase">
          <Plus size={16} className="stroke-[3px]" />
          <span>Tambah Akses Baru</span>
        </div>

        <form onSubmit={handleAddCode} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Kode Akses (Unique)
            </label>
            <input
              type="text"
              placeholder="Contoh: PREMIUM-BUDI"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="bg-[#F8F9FA] border border-stone-200 focus:border-[#007A6E] focus:ring-1 focus:ring-[#007A6E] focus:outline-none rounded-xl px-4 py-2.5 text-xs text-stone-800 placeholder:text-gray-400 font-sans tracking-wide"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#00665C] hover:bg-[#005149] text-white text-xs font-bold py-3 px-4 rounded-xl active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm mt-1 disabled:opacity-50"
          >
            {isSubmitting ? 'Menambahkan...' : 'Tambah Kode Akses'}
          </button>
        </form>
      </div>

      {/* Success / Error Toast alerts */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2 font-sans">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2 font-sans">
          <AlertCircle size={16} className="text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Registered Codes List */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col gap-4 font-sans">
        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-brand-dark tracking-wider uppercase">
            <Users size={16} className="text-gray-400" />
            <span>Daftar Akses Terdaftar ({filteredCodes.length})</span>
          </div>
          <button
            onClick={fetchCodes}
            disabled={isLoading}
            className="text-gray-400 hover:text-[#007A6E] active:rotate-180 transition-all p-1 rounded-full hover:bg-gray-50 cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Search Filter */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari kode akses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8F9FA] border border-stone-200 focus:border-[#007A6E] focus:ring-1 focus:ring-[#007A6E] focus:outline-none rounded-xl pl-9 pr-4 py-2 text-xs text-stone-800 placeholder:text-gray-400 font-sans"
          />
          <Search size={14} className="text-gray-400 absolute left-3 top-2.5" />
        </div>

        {isLoading && codes.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400 font-mono">
            Memuat data dari database...
          </div>
        ) : filteredCodes.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400 font-mono bg-gray-50/50 rounded-2xl border border-dashed border-gray-150">
            Tidak ada kode akses ditemukan
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
            {filteredCodes.map((item) => (
              <div
                key={item.code}
                className="bg-[#FFFDF9] border border-amber-100 rounded-2xl p-3.5 flex items-center justify-between gap-4 transition-all hover:bg-amber-50/20"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-mono font-bold text-[#00665C] text-sm block tracking-wide select-all">
                    {item.code}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 font-sans">
                    <Calendar size={11} />
                    {formatDate(item.created_at)}
                  </span>
                </div>

                {item.code.toUpperCase() === adminCode.toUpperCase() ? (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider font-sans select-none">
                    Admin
                  </span>
                ) : (
                  <button
                    onClick={() => handleDeleteCode(item.code)}
                    disabled={deletingCode === item.code}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 p-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 shrink-0 border border-rose-100/50"
                    title="Hapus Kode Akses"
                  >
                    {deletingCode === item.code ? (
                      <RefreshCw size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} className="stroke-[2px]" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
