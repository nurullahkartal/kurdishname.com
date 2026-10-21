'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';

interface NameItem {
  id: string;
  name: string;
  gender: string;
  letter: string;
  meaning: string;
}

interface ShareRecord {
  shared: boolean;
  date: string;
}

interface ItemTracker {
  instagram?: ShareRecord;
  tiktok?: ShareRecord;
  youtube?: ShareRecord;
}

type TrackerDatabase = Record<string, ItemTracker>;

const STORAGE_KEY = 'kurdishname_social_tracker_db';
const AUTH_KEY = 'kurdishname_admin_pin_unlocked';
const PIN_HASH_KEY = 'kurdishname_admin_custom_pin';
const DEFAULT_PIN = '47';

export default function SocialTrackerClient() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [changePinOpen, setChangePinOpen] = useState<boolean>(false);
  const [newPinInput, setNewPinInput] = useState<string>('');

  const [names, setNames] = useState<NameItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trackerDb, setTrackerDb] = useState<TrackerDatabase>({});

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Status message
  const [toastMsg, setToastMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check PIN auth on mount
  useEffect(() => {
    const unlocked = sessionStorage.getItem(AUTH_KEY);
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  // Load tracker db & search_index.json
  useEffect(() => {
    // 1. Load LocalStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTrackerDb(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse tracker db', e);
    }

    // 2. Fetch names
    fetch('/search_index.json')
      .then((res) => res.json())
      .then((data: NameItem[]) => {
        setNames(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load names', err);
        setIsLoading(false);
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Save trackerDb to localStorage
  const saveDb = (updated: TrackerDatabase) => {
    setTrackerDb(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem(PIN_HASH_KEY) || DEFAULT_PIN;
    if (pinInput.trim() === storedPin) {
      setIsUnlocked(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      setPinError('');
    } else {
      setPinError('Hatalı PIN Kodu!');
    }
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem(AUTH_KEY);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length < 2) {
      alert('PIN en az 2 karakter olmalıdır.');
      return;
    }
    localStorage.setItem(PIN_HASH_KEY, newPinInput);
    setChangePinOpen(false);
    setNewPinInput('');
    showToast('PIN başarıyla güncellendi!');
  };

  const getTodayString = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const togglePlatform = (id: string, platform: 'instagram' | 'tiktok' | 'youtube') => {
    const current = trackerDb[id] || {};
    const platformData = current[platform] || { shared: false, date: '' };
    const willBeShared = !platformData.shared;

    const updated: TrackerDatabase = {
      ...trackerDb,
      [id]: {
        ...current,
        [platform]: {
          shared: willBeShared,
          date: willBeShared ? getTodayString() : '',
        },
      },
    };
    saveDb(updated);
  };

  const changeDate = (id: string, platform: 'instagram' | 'tiktok' | 'youtube', dateStr: string) => {
    const current = trackerDb[id] || {};

    const updated: TrackerDatabase = {
      ...trackerDb,
      [id]: {
        ...current,
        [platform]: {
          shared: dateStr.trim() !== '',
          date: dateStr,
        },
      },
    };
    saveDb(updated);
  };

  // Canvas Card Downloader (1080x1080)
  const downloadCard = (item: NameItem) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    if (item.gender === 'female') {
      grad.addColorStop(0, '#2d1124');
      grad.addColorStop(0.5, '#4a153b');
      grad.addColorStop(1, '#1b0915');
    } else {
      grad.addColorStop(0, '#0a192f');
      grad.addColorStop(0.5, '#172a45');
      grad.addColorStop(1, '#050c1a');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Decorative frame
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(60, 60, 960, 960);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(75, 75, 930, 930);

    // Header tagline
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KURDISHNAME.COM', 540, 180);

    // Name Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 96px serif';
    ctx.fillText(item.name, 540, 360);

    // Gender badge
    ctx.fillStyle = item.gender === 'female' ? '#f472b6' : '#60a5fa';
    ctx.font = '600 36px sans-serif';
    const genderLabel = item.gender === 'female' ? 'Kız İsmi' : item.gender === 'male' ? 'Erkek İsmi' : 'Unisex İsim';
    ctx.fillText(`• ${genderLabel} •`, 540, 440);

    // Meaning text wrap
    ctx.fillStyle = '#f3f4f6';
    ctx.font = '500 40px sans-serif';
    const meaning = item.meaning || '';
    const words = meaning.split(' ');
    let line = '';
    let y = 560;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 800 && n > 0) {
        ctx.fillText(line.trim(), 540, y);
        line = words[n] + ' ';
        y += 60;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), 540, y);

    // Footer Watermark
    ctx.fillStyle = '#9ca3af';
    ctx.font = '500 28px sans-serif';
    ctx.fillText('En Kapsamlı Kürtçe İsimler Arşivi & Telaffuz Rehberi', 540, 940);

    // Download trigger
    const link = document.createElement('a');
    link.download = `${item.id}-kurdishname-kart.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast(`📸 ${item.name} görseli 1080x1080 formatında indirildi!`);
  };

  // Export to CSV
  const exportToCsv = () => {
    let csv = '\uFEFF'; // UTF-8 BOM
    csv += 'ID,İsim,Cinsiyet,Harf,Anlam,Instagram Paylaşıldı Mı,Instagram Tarihi,TikTok Paylaşıldı Mı,TikTok Tarihi,YouTube Paylaşıldı Mı,YouTube Tarihi\n';

    names.forEach((item) => {
      const rec = trackerDb[item.id] || {};
      const ig = rec.instagram || { shared: false, date: '' };
      const tt = rec.tiktok || { shared: false, date: '' };
      const yt = rec.youtube || { shared: false, date: '' };

      const safeMeaning = `"${(item.meaning || '').replace(/"/g, '""')}"`;
      csv += `${item.id},${item.name},${item.gender},${item.letter},${safeMeaning},${ig.shared ? 'EVET' : 'HAYIR'},${ig.date || ''},${tt.shared ? 'EVET' : 'HAYIR'},${tt.date || ''},${yt.shared ? 'EVET' : 'HAYIR'},${yt.date || ''}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kurdishname-sosyal-medya-takip-${getTodayString()}.csv`;
    link.click();
    showToast('📊 Excel/CSV tablosu başarıyla indirildi!');
  };

  // Export JSON Backup
  const exportJsonBackup = () => {
    const dataStr = JSON.stringify(trackerDb, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `kurdishname-sosyal-medya-yedek-${getTodayString()}.json`;
    link.click();
    showToast('💾 JSON veritabanı yedeği indirildi!');
  };

  // Import JSON Backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (typeof parsed === 'object') {
          saveDb(parsed);
          showToast('✅ Yedek başarıyla yüklendi ve uygulandı!');
        }
      } catch (err) {
        alert('Geçersiz JSON dosyası!');
      }
    };
    reader.readAsText(file);
  };

  // Statistics Calculation
  const stats = useMemo(() => {
    let igCount = 0;
    let ttCount = 0;
    let ytCount = 0;
    let allCompletedCount = 0;
    let notSharedCount = 0;

    names.forEach((item) => {
      const rec = trackerDb[item.id] || {};
      const ig = rec.instagram?.shared || false;
      const tt = rec.tiktok?.shared || false;
      const yt = rec.youtube?.shared || false;

      if (ig) igCount++;
      if (tt) ttCount++;
      if (yt) ytCount++;

      if (ig && tt && yt) {
        allCompletedCount++;
      } else if (!ig && !tt && !yt) {
        notSharedCount++;
      }
    });

    return {
      total: names.length,
      igCount,
      ttCount,
      ytCount,
      allCompletedCount,
      notSharedCount,
    };
  }, [names, trackerDb]);

  // Filtered names
  const filteredNames = useMemo(() => {
    return names.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchId = item.id.toLowerCase().includes(q);
        const matchMeaning = (item.meaning || '').toLowerCase().includes(q);
        if (!matchName && !matchId && !matchMeaning) return false;
      }

      // 2. Letter Filter
      if (selectedLetter !== 'ALL' && item.letter !== selectedLetter) {
        return false;
      }

      // 3. Gender Filter
      if (selectedGender !== 'ALL' && item.gender !== selectedGender) {
        return false;
      }

      // 4. Status Filter
      const rec = trackerDb[item.id] || {};
      const ig = rec.instagram?.shared || false;
      const tt = rec.tiktok?.shared || false;
      const yt = rec.youtube?.shared || false;

      if (statusFilter === 'NOT_SHARED') {
        return !ig && !tt && !yt;
      }
      if (statusFilter === 'SHARED_ANY') {
        return ig || tt || yt;
      }
      if (statusFilter === 'ALL_COMPLETED') {
        return ig && tt && yt;
      }
      if (statusFilter === 'IG_ONLY') {
        return ig;
      }
      if (statusFilter === 'TT_ONLY') {
        return tt;
      }
      if (statusFilter === 'YT_ONLY') {
        return yt;
      }

      return true;
    });
  }, [names, searchQuery, selectedLetter, selectedGender, statusFilter, trackerDb]);

  // Pagination slice
  const paginatedNames = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredNames.slice(start, start + pageSize);
  }, [filteredNames, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredNames.length / pageSize) || 1;

  // Letters present in DB
  const letters = useMemo(() => {
    const set = new Set<string>();
    names.forEach((n) => set.add(n.letter));
    return Array.from(set).sort();
  }, [names]);

  // PIN Login Screen
  if (!isUnlocked) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
          <div className="text-4xl sm:text-5xl mb-3">🔒</div>
          <h1 className="text-xl sm:text-2xl font-black mb-2 text-[var(--text)]">Sosyal Medya Takip Paneli</h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-6">
            Yönetici paneline erişmek için PIN kodunuzu girin.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="PIN Kodu Girin"
              maxLength={12}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full py-3 px-4 text-center text-xl tracking-widest font-mono rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              autoFocus
            />

            {pinError && (
              <div className="text-red-500 text-xs sm:text-sm font-semibold">{pinError}</div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 text-sm sm:text-base font-bold bg-[var(--accent)] text-white rounded-xl shadow-md hover:opacity-95 transition-all cursor-pointer"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[var(--text)] text-[var(--bg)] px-4 py-2.5 rounded-xl shadow-2xl font-bold text-xs sm:text-sm z-50 animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Top Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-[var(--border)] mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">📊</span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--text)]">
              Sosyal Medya Paylaşım Takip Paneli
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            4.709 Kürtçe ismin Instagram, TikTok ve YouTube paylaşım durumunu mobil ve masaüstünden yönetin.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportToCsv}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl border border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold text-xs sm:text-sm hover:bg-emerald-500/20 transition-colors cursor-pointer"
          >
            📥 Excel (CSV)
          </button>

          <button
            onClick={exportJsonBackup}
            className="flex items-center justify-center py-2 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] font-semibold text-xs sm:text-sm hover:border-[var(--text-muted)] transition-colors cursor-pointer"
          >
            💾 Yedekle
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center py-2 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] font-semibold text-xs sm:text-sm hover:border-[var(--text-muted)] transition-colors cursor-pointer"
          >
            📤 Yükle
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportJson}
          />

          <button
            onClick={() => setChangePinOpen(!changePinOpen)}
            className="py-2 px-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] text-xs sm:text-sm hover:border-[var(--text-muted)] transition-colors cursor-pointer"
            title="PIN Değiştir"
          >
            ⚙️ PIN
          </button>

          <button
            onClick={handleLogout}
            className="py-2 px-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-500 font-bold text-xs sm:text-sm hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            Çıkış
          </button>
        </div>
      </div>

      {/* Change PIN Drawer */}
      {changePinOpen && (
        <div className="bg-[var(--surface-alt)] border border-[var(--border)] p-3 sm:p-4 rounded-2xl mb-5 flex flex-wrap items-center gap-3">
          <span className="font-bold text-xs sm:text-sm text-[var(--text)]">Yeni PIN Belirle:</span>
          <input
            type="text"
            placeholder="Yeni PIN"
            value={newPinInput}
            onChange={(e) => setNewPinInput(e.target.value)}
            className="py-1.5 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-sm"
          />
          <button
            onClick={handleChangePin}
            className="py-1.5 px-3.5 bg-[var(--accent)] text-white text-xs sm:text-sm font-bold rounded-lg cursor-pointer"
          >
            Kaydet
          </button>
          <button
            onClick={() => setChangePinOpen(false)}
            className="py-1.5 px-3 border border-[var(--border)] text-[var(--text-muted)] text-xs sm:text-sm rounded-lg cursor-pointer"
          >
            İptal
          </button>
        </div>
      )}

      {/* Metrics Cards Grid (Responsive 2 / 3 / 6 cols) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5 mb-5 sm:mb-6">
        {/* Total */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            TOPLAM İSİM
          </span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--text)] my-1">
            {stats.total.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">Aktif isim arşivi</span>
        </div>

        {/* Instagram */}
        <div className="bg-[var(--surface)] border border-[#e1306c]/40 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-[#e1306c] uppercase tracking-wider flex items-center gap-1">
            <span>📸</span> Instagram
          </span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[#e1306c] my-1">
            {stats.igCount.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">
            %{((stats.igCount / (stats.total || 1)) * 100).toFixed(1)} paylaşıldı
          </span>
        </div>

        {/* TikTok */}
        <div className="bg-[var(--surface)] border border-[#00f2fe]/40 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-[#00f2fe] uppercase tracking-wider flex items-center gap-1">
            <span>🎵</span> TikTok
          </span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--text)] my-1">
            {stats.ttCount.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">
            %{((stats.ttCount / (stats.total || 1)) * 100).toFixed(1)} paylaşıldı
          </span>
        </div>

        {/* YouTube */}
        <div className="bg-[var(--surface)] border border-[#ff0000]/40 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-[#ff0000] uppercase tracking-wider flex items-center gap-1">
            <span>🎥</span> YouTube
          </span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[#ff0000] my-1">
            {stats.ytCount.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">
            %{((stats.ytCount / (stats.total || 1)) * 100).toFixed(1)} paylaşıldı
          </span>
        </div>

        {/* All Done */}
        <div className="bg-[var(--surface)] border border-emerald-500/40 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
            <span>✅</span> 3&apos;ü Bitenler
          </span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-500 my-1">
            {stats.allCompletedCount.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">Tüm platformlar</span>
        </div>

        {/* Not Shared */}
        <div className="bg-[var(--surface)] border border-amber-500/40 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
            <span>⏳</span> Bekleyenler
          </span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-500 my-1">
            {stats.notSharedCount.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs text-[var(--text-muted)]">Hiç paylaşılmayan</span>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 sm:p-5 mb-5 sm:mb-6 space-y-3 sm:space-y-4">
        <div className="flex flex-col lg:flex-row gap-2.5 sm:gap-3 items-stretch lg:items-center">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="🔍 İsim veya anlamda ara (Örn: Rojîn, Berfîn, ışık...)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2.5 pl-3.5 pr-8 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] text-xs sm:text-sm focus:outline-none focus:border-[var(--accent)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="py-2.5 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] text-xs sm:text-sm cursor-pointer focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="ALL">📌 Tüm Paylaşım Durumları</option>
              <option value="NOT_SHARED">⏳ Henüz Hiç Paylaşılmayanlar</option>
              <option value="SHARED_ANY">🚀 En Az Birinde Paylaşılanlar</option>
              <option value="ALL_COMPLETED">✅ 3 Platformda da Bitenler</option>
              <option value="IG_ONLY">📸 Instagram Paylaşılanlar</option>
              <option value="TT_ONLY">🎵 TikTok Paylaşılanlar</option>
              <option value="YT_ONLY">🎥 YouTube Paylaşılanlar</option>
            </select>

            {/* Gender */}
            <select
              value={selectedGender}
              onChange={(e) => {
                setSelectedGender(e.target.value);
                setCurrentPage(1);
              }}
              className="py-2.5 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] text-xs sm:text-sm cursor-pointer focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="ALL">Tüm Cinsiyetler</option>
              <option value="female">Kız İsimleri</option>
              <option value="male">Erkek İsimleri</option>
              <option value="unisex">Unisex İsimler</option>
            </select>

            {/* Page Size */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="py-2.5 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] text-xs sm:text-sm cursor-pointer focus:outline-none focus:border-[var(--accent)]"
            >
              <option value={25}>Sayfa başı 25</option>
              <option value={50}>Sayfa başı 50</option>
              <option value={100}>Sayfa başı 100</option>
              <option value={200}>Sayfa başı 200</option>
            </select>
          </div>
        </div>

        {/* Alphabet Bar (Horizontally scrollable on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap py-1 scrollbar-none">
          <span className="text-[10px] sm:text-xs font-bold text-[var(--text-muted)] mr-1 shrink-0">
            HARFLER:
          </span>
          <button
            onClick={() => {
              setSelectedLetter('ALL');
              setCurrentPage(1);
            }}
            className={`py-1 px-2.5 text-xs font-bold rounded-lg border border-[var(--border)] transition-colors shrink-0 cursor-pointer ${
              selectedLetter === 'ALL'
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--surface-alt)] text-[var(--text)] hover:border-[var(--text-muted)]'
            }`}
          >
            TÜMÜ
          </button>
          {letters.map((char) => (
            <button
              key={char}
              onClick={() => {
                setSelectedLetter(char);
                setCurrentPage(1);
              }}
              className={`py-1 px-2 text-xs font-semibold rounded-lg border border-[var(--border)] transition-colors shrink-0 cursor-pointer ${
                selectedLetter === char
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--surface-alt)] text-[var(--text)] hover:border-[var(--text-muted)]'
              }`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* Summary info and pagination top */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 text-xs sm:text-sm text-[var(--text-muted)]">
        <div>
          Toplam <strong className="text-[var(--text)] font-black">{filteredNames.length}</strong> isim bulundu.{' '}
          <span className="text-[11px] sm:text-xs">(Sayfa {currentPage} / {totalPages})</span>
        </div>

        {/* Compact pagination buttons */}
        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="py-1 px-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-alt)] cursor-pointer"
          >
            ← Önceki
          </button>
          <span className="px-1 text-xs font-bold text-[var(--text)]">
            {currentPage}/{totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="py-1 px-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-alt)] cursor-pointer"
          >
            Sonraki →
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MASAÜSTÜ GENİŞ EXCEL TABLOSU (hidden on mobile, visible on md and up) */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-[var(--surface-alt)] shadow-sm">
            <tr className="border-b-2 border-[var(--border)] text-[var(--text-muted)] text-[11px] uppercase tracking-wider font-bold">
              <th className="py-3 px-3.5 w-12 text-center">#</th>
              <th className="py-3 px-4 min-w-[150px]">İsim</th>
              <th className="py-3 px-3 w-24">Cinsiyet</th>
              <th className="py-3 px-4 min-w-[220px]">Anlam</th>
              <th className="py-3 px-4 min-w-[190px] border-l border-[var(--border)] text-[#e1306c]">
                📸 Instagram
              </th>
              <th className="py-3 px-4 min-w-[190px] border-l border-[var(--border)] text-[#00f2fe]">
                🎵 TikTok
              </th>
              <th className="py-3 px-4 min-w-[190px] border-l border-[var(--border)] text-[#ff0000]">
                🎥 YouTube
              </th>
              <th className="py-3 px-3 w-28 text-center border-l border-[var(--border)]">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[var(--text-muted)]">
                  ⏳ 4.709 Kürtçe isim yükleniyor...
                </td>
              </tr>
            ) : paginatedNames.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[var(--text-muted)]">
                  Arama kriterlerine uygun isim bulunamadı.
                </td>
              </tr>
            ) : (
              paginatedNames.map((item, idx) => {
                const globalIndex = (currentPage - 1) * pageSize + idx + 1;
                const rec = trackerDb[item.id] || {};
                const ig = rec.instagram || { shared: false, date: '' };
                const tt = rec.tiktok || { shared: false, date: '' };
                const yt = rec.youtube || { shared: false, date: '' };
                const isAllDone = ig.shared && tt.shared && yt.shared;

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-[var(--surface-alt)]/50 ${
                      isAllDone ? 'bg-emerald-500/5' : ''
                    }`}
                  >
                    <td className="py-3 px-3.5 text-center text-xs text-[var(--text-muted)]">
                      {globalIndex}
                    </td>

                    <td className="py-3 px-4">
                      <Link
                        href={`/tr/isim/${item.id}`}
                        target="_blank"
                        className="font-extrabold text-base text-[var(--text)] hover:text-[var(--accent)] transition-colors"
                      >
                        {item.name}
                      </Link>
                      <div className="text-[11px] text-[var(--text-muted)]">/{item.id}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                          item.gender === 'female'
                            ? 'bg-pink-500/15 text-pink-500'
                            : item.gender === 'male'
                            ? 'bg-blue-500/15 text-blue-500'
                            : 'bg-purple-500/15 text-purple-500'
                        }`}
                      >
                        {item.gender === 'female' ? 'Kız' : item.gender === 'male' ? 'Erkek' : 'Unisex'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-xs text-[var(--text-muted)] max-w-xs leading-relaxed">
                      {item.meaning}
                    </td>

                    {/* Instagram Desktop */}
                    <td className="py-3 px-4 border-l border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={ig.shared}
                          onChange={() => togglePlatform(item.id, 'instagram')}
                          className="w-5 h-5 rounded cursor-pointer accent-[#e1306c]"
                        />
                        <input
                          type="date"
                          value={ig.date || ''}
                          onChange={(e) => changeDate(item.id, 'instagram', e.target.value)}
                          className={`text-xs p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] ${
                            ig.shared ? 'bg-[#e1306c]/10 font-bold' : ''
                          }`}
                        />
                      </div>
                    </td>

                    {/* TikTok Desktop */}
                    <td className="py-3 px-4 border-l border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={tt.shared}
                          onChange={() => togglePlatform(item.id, 'tiktok')}
                          className="w-5 h-5 rounded cursor-pointer accent-[#00f2fe]"
                        />
                        <input
                          type="date"
                          value={tt.date || ''}
                          onChange={(e) => changeDate(item.id, 'tiktok', e.target.value)}
                          className={`text-xs p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] ${
                            tt.shared ? 'bg-[#00f2fe]/10 font-bold' : ''
                          }`}
                        />
                      </div>
                    </td>

                    {/* YouTube Desktop */}
                    <td className="py-3 px-4 border-l border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={yt.shared}
                          onChange={() => togglePlatform(item.id, 'youtube')}
                          className="w-5 h-5 rounded cursor-pointer accent-[#ff0000]"
                        />
                        <input
                          type="date"
                          value={yt.date || ''}
                          onChange={(e) => changeDate(item.id, 'youtube', e.target.value)}
                          className={`text-xs p-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] ${
                            yt.shared ? 'bg-[#ff0000]/10 font-bold' : ''
                          }`}
                        />
                      </div>
                    </td>

                    {/* Actions Desktop */}
                    <td className="py-3 px-3 text-center border-l border-[var(--border)]">
                      <button
                        onClick={() => downloadCard(item)}
                        className="py-1 px-2.5 text-xs font-bold rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer inline-flex items-center gap-1"
                        title="1080x1080 Kart İndir"
                      >
                        <span>📸</span> Görsel
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBİL DOKUNMATİK KART DÜZENİ (visible on mobile, hidden on md and up) */}
      {/* ========================================================================= */}
      <div className="block md:hidden space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
            ⏳ 4.709 Kürtçe isim yükleniyor...
          </div>
        ) : paginatedNames.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
            Arama kriterlerine uygun isim bulunamadı.
          </div>
        ) : (
          paginatedNames.map((item, idx) => {
            const globalIndex = (currentPage - 1) * pageSize + idx + 1;
            const rec = trackerDb[item.id] || {};
            const ig = rec.instagram || { shared: false, date: '' };
            const tt = rec.tiktok || { shared: false, date: '' };
            const yt = rec.youtube || { shared: false, date: '' };
            const isAllDone = ig.shared && tt.shared && yt.shared;

            return (
              <div
                key={item.id}
                className={`bg-[var(--surface)] border rounded-2xl p-3.5 space-y-3 shadow-sm transition-all ${
                  isAllDone
                    ? 'border-emerald-500/50 bg-emerald-500/[0.03]'
                    : 'border-[var(--border)]'
                }`}
              >
                {/* Mobile Card Top Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[var(--text-muted)]">#{globalIndex}</span>
                      <Link
                        href={`/tr/isim/${item.id}`}
                        target="_blank"
                        className="text-lg font-black text-[var(--text)] hover:text-[var(--accent)]"
                      >
                        {item.name}
                      </Link>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          item.gender === 'female'
                            ? 'bg-pink-500/15 text-pink-500'
                            : item.gender === 'male'
                            ? 'bg-blue-500/15 text-blue-500'
                            : 'bg-purple-500/15 text-purple-500'
                        }`}
                      >
                        {item.gender === 'female' ? 'Kız' : item.gender === 'male' ? 'Erkek' : 'Unisex'}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>

                  {/* 1080x1080 Card Download Touch Button */}
                  <button
                    onClick={() => downloadCard(item)}
                    className="shrink-0 py-2 px-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] text-xs font-bold active:scale-95 transition-transform flex items-center gap-1 cursor-pointer"
                    title="1080x1080 Görsel İndir"
                  >
                    <span>📸</span>
                    <span className="text-[11px]">İndir</span>
                  </button>
                </div>

                {/* Mobile Card Platform Grid (3 Equal Columns with large touch targets) */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)]">
                  {/* Instagram Box */}
                  <div
                    onClick={() => togglePlatform(item.id, 'instagram')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-colors cursor-pointer select-none ${
                      ig.shared
                        ? 'bg-[#e1306c]/15 border-[#e1306c]'
                        : 'bg-[var(--surface-alt)] border-[var(--border)] opacity-80'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#e1306c] flex items-center gap-1">
                      📸 IG {ig.shared ? '✓' : ''}
                    </span>
                    <input
                      type="checkbox"
                      checked={ig.shared}
                      onChange={() => {}}
                      className="w-5 h-5 mt-1 accent-[#e1306c] pointer-events-none"
                    />
                    <div
                      className="w-full mt-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="date"
                        value={ig.date || ''}
                        onChange={(e) => changeDate(item.id, 'instagram', e.target.value)}
                        className={`w-full text-[10px] p-1 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] ${
                          ig.shared ? 'font-bold' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* TikTok Box */}
                  <div
                    onClick={() => togglePlatform(item.id, 'tiktok')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-colors cursor-pointer select-none ${
                      tt.shared
                        ? 'bg-[#00f2fe]/15 border-[#00f2fe]'
                        : 'bg-[var(--surface-alt)] border-[var(--border)] opacity-80'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#00f2fe] flex items-center gap-1">
                      🎵 TT {tt.shared ? '✓' : ''}
                    </span>
                    <input
                      type="checkbox"
                      checked={tt.shared}
                      onChange={() => {}}
                      className="w-5 h-5 mt-1 accent-[#00f2fe] pointer-events-none"
                    />
                    <div
                      className="w-full mt-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="date"
                        value={tt.date || ''}
                        onChange={(e) => changeDate(item.id, 'tiktok', e.target.value)}
                        className={`w-full text-[10px] p-1 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] ${
                          tt.shared ? 'font-bold' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* YouTube Box */}
                  <div
                    onClick={() => togglePlatform(item.id, 'youtube')}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-colors cursor-pointer select-none ${
                      yt.shared
                        ? 'bg-[#ff0000]/15 border-[#ff0000]'
                        : 'bg-[var(--surface-alt)] border-[var(--border)] opacity-80'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#ff0000] flex items-center gap-1">
                      🎥 YT {yt.shared ? '✓' : ''}
                    </span>
                    <input
                      type="checkbox"
                      checked={yt.shared}
                      onChange={() => {}}
                      className="w-5 h-5 mt-1 accent-[#ff0000] pointer-events-none"
                    />
                    <div
                      className="w-full mt-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="date"
                        value={yt.date || ''}
                        onChange={(e) => changeDate(item.id, 'youtube', e.target.value)}
                        className={`w-full text-[10px] p-1 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] ${
                          yt.shared ? 'font-bold' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Responsive Bottom Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-5 pt-3 text-xs sm:text-sm text-[var(--text-muted)]">
        <div className="text-center sm:text-left text-xs">
          Gösterilen: <strong className="text-[var(--text)]">{Math.min(filteredNames.length, (currentPage - 1) * pageSize + 1)}</strong> -{' '}
          <strong className="text-[var(--text)]">{Math.min(filteredNames.length, currentPage * pageSize)}</strong> (Toplam {filteredNames.length})
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(1)}
            className="py-1.5 px-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-alt)] cursor-pointer"
          >
            « İlk
          </button>
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="py-1.5 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-alt)] cursor-pointer"
          >
            ← Önceki
          </button>
          <span className="px-2 text-xs font-bold text-[var(--text)]">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="py-1.5 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-alt)] cursor-pointer"
          >
            Sonraki →
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="py-1.5 px-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-alt)] cursor-pointer"
          >
            Son »
          </button>
        </div>
      </div>
    </div>
  );
}
