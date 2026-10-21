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
const DEFAULT_PIN = '4709';

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
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); // ALL, NOT_SHARED, SHARED_ANY, ALL_COMPLETED, IG_ONLY, TT_ONLY, YT_ONLY
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
      setPinError('Hatalı PIN! (Varsayılan PIN: 4709)');
    }
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem(AUTH_KEY);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length < 4) {
      alert('PIN en az 4 karakter olmalıdır.');
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
    const platformData = current[platform] || { shared: false, date: '' };

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

  if (!isUnlocked) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div
          style={{
            maxWidth: '420px',
            width: '100%',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-xl)',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Sosyal Medya Takip Paneli</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Bu ekran yetkili yönetici girişi gerektirir. Devam etmek için PIN kodunuzu girin.
          </p>

          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              placeholder="PIN Kodu (Varsayılan: 4709)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '1.1rem',
                textAlign: 'center',
                letterSpacing: '0.2em',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--border)',
                background: 'var(--surface-alt)',
                color: 'var(--text)',
                marginBottom: '1rem',
              }}
              autoFocus
            />

            {pinError && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                {pinError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 700,
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--r-md)',
                cursor: 'pointer',
              }}
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--text)',
            color: 'var(--bg)',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--r-lg)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
            fontWeight: 700,
            zIndex: 9999,
            transition: 'all 0.3s ease',
          }}
        >
          {toastMsg}
        </div>
      )}

      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem' }}>📊</span>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, margin: 0 }}>
              Sosyal Medya Paylaşım Takip Paneli
            </h1>
          </div>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            4.709 Kürtçe ismin Instagram, TikTok ve YouTube paylaşım durumunu Excel gibi takip edin ve yönetin.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={exportToCsv}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--r-md)',
              border: '1px solid #10b981',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            📥 Excel (CSV) İndir
          </button>

          <button
            onClick={exportJsonBackup}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--border)',
              background: 'var(--surface-alt)',
              color: 'var(--text)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            💾 JSON Yedekle
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--border)',
              background: 'var(--surface-alt)',
              color: 'var(--text)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            📤 Yedeği Yükle
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImportJson}
          />

          <button
            onClick={() => setChangePinOpen(!changePinOpen)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--border)',
              background: 'var(--surface-alt)',
              color: 'var(--text)',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
            title="PIN Değiştir"
          >
            ⚙️ PIN
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--r-md)',
              border: '1px solid #ef4444',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Change PIN Modal / Drawer */}
      {changePinOpen && (
        <div
          style={{
            background: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            padding: '1rem',
            borderRadius: 'var(--r-lg)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Yeni PIN Belirle:</span>
          <input
            type="text"
            placeholder="En az 4 haneli yeni PIN"
            value={newPinInput}
            onChange={(e) => setNewPinInput(e.target.value)}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '0.9rem',
            }}
          />
          <button
            onClick={handleChangePin}
            style={{
              padding: '0.45rem 1rem',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--r-md)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Kaydet
          </button>
          <button
            onClick={() => setChangePinOpen(false)}
            style={{
              padding: '0.45rem 0.75rem',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)',
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            İptal
          </button>
        </div>
      )}

      {/* Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOPLAM İSİM</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text)' }}>
            {stats.total.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sitedeki aktif isim havuzu</div>
        </div>

        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid #e1306c',
            borderRadius: 'var(--r-lg)',
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e1306c' }}>📸 INSTAGRAM</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#e1306c' }}>
            {stats.igCount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            %{((stats.igCount / (stats.total || 1)) * 100).toFixed(1)} paylaşıldı
          </div>
        </div>

        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid #00f2fe',
            borderRadius: 'var(--r-lg)',
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00f2fe' }}>🎵 TIKTOK</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text)' }}>
            {stats.ttCount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            %{((stats.ttCount / (stats.total || 1)) * 100).toFixed(1)} paylaşıldı
          </div>
        </div>

        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid #ff0000',
            borderRadius: 'var(--r-lg)',
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ff0000' }}>🎥 YOUTUBE</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ff0000' }}>
            {stats.ytCount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            %{((stats.ytCount / (stats.total || 1)) * 100).toFixed(1)} paylaşıldı
          </div>
        </div>

        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid #10b981',
            borderRadius: 'var(--r-lg)',
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>✅ 3'Ü DE BİTENLER</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#10b981' }}>
            {stats.allCompletedCount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tüm platformlarda paylaşıldı</div>
        </div>

        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: '1rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#eab308' }}>⏳ HİÇ PAYLAŞILMAYAN</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#eab308' }}>
            {stats.notSharedCount.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>İçerik bekleyen isimler</div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <input
              type="text"
              placeholder="🔍 İsim veya anlamda ara (Örn: Rojîn, Berfîn, ışık...)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--border)',
                background: 'var(--surface-alt)',
                color: 'var(--text)',
                fontSize: '0.9rem',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--border)',
              background: 'var(--surface-alt)',
              color: 'var(--text)',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">📌 Tüm Paylaşım Durumları</option>
            <option value="NOT_SHARED">⏳ Henüz Hiç Paylaşılmayanlar</option>
            <option value="SHARED_ANY">🚀 En Az Birinde Paylaşılanlar</option>
            <option value="ALL_COMPLETED">✅ 3 Platformda da Bitenler</option>
            <option value="IG_ONLY">📸 Instagram Paylaşılanlar</option>
            <option value="TT_ONLY">🎵 TikTok Paylaşılanlar</option>
            <option value="YT_ONLY">🎥 YouTube Paylaşılanlar</option>
          </select>

          {/* Gender Select */}
          <select
            value={selectedGender}
            onChange={(e) => {
              setSelectedGender(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--border)',
              background: 'var(--surface-alt)',
              color: 'var(--text)',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">Tüm Cinsiyetler</option>
            <option value="female">Kız İsimleri</option>
            <option value="male">Erkek İsimleri</option>
            <option value="unisex">Unisex İsimler</option>
          </select>

          {/* Page Size Select */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{
              padding: '0.65rem 0.75rem',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--border)',
              background: 'var(--surface-alt)',
              color: 'var(--text)',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <option value={25}>Sayfa başı 25</option>
            <option value={50}>Sayfa başı 50</option>
            <option value={100}>Sayfa başı 100</option>
            <option value={200}>Sayfa başı 200</option>
          </select>
        </div>

        {/* Alphabet Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.5rem' }}>
            HARFLER:
          </span>
          <button
            onClick={() => {
              setSelectedLetter('ALL');
              setCurrentPage(1);
            }}
            style={{
              padding: '0.2rem 0.5rem',
              fontSize: '0.75rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border)',
              background: selectedLetter === 'ALL' ? 'var(--accent)' : 'var(--surface-alt)',
              color: selectedLetter === 'ALL' ? '#fff' : 'var(--text)',
              cursor: 'pointer',
              fontWeight: 700,
            }}
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
              style={{
                padding: '0.2rem 0.45rem',
                fontSize: '0.75rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--border)',
                background: selectedLetter === char ? 'var(--accent)' : 'var(--surface-alt)',
                color: selectedLetter === char ? '#fff' : 'var(--text)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
        }}
      >
        <div>
          Toplam <strong style={{ color: 'var(--text)' }}>{filteredNames.length}</strong> isim bulundu. (Sayfa{' '}
          {currentPage} / {totalPages})
        </div>

        {/* Pagination buttons */}
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage <= 1 ? 0.5 : 1,
              fontSize: '0.8rem',
            }}
          >
            ← Önceki
          </button>
          <span style={{ fontSize: '0.8rem', padding: '0 0.5rem' }}>
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage >= totalPages ? 0.5 : 1,
              fontSize: '0.8rem',
            }}
          >
            Sonraki →
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)',
          overflowX: 'auto',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr
              style={{
                background: 'var(--surface-alt)',
                borderBottom: '2px solid var(--border)',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <th style={{ padding: '0.75rem 1rem', width: '50px' }}>#</th>
              <th style={{ padding: '0.75rem 1rem', minWidth: '150px' }}>İsim</th>
              <th style={{ padding: '0.75rem 1rem', width: '90px' }}>Cinsiyet</th>
              <th style={{ padding: '0.75rem 1rem', minWidth: '220px' }}>Anlam</th>
              <th style={{ padding: '0.75rem 1rem', minWidth: '190px', borderLeft: '1px solid var(--border)' }}>
                📸 Instagram
              </th>
              <th style={{ padding: '0.75rem 1rem', minWidth: '190px', borderLeft: '1px solid var(--border)' }}>
                🎵 TikTok
              </th>
              <th style={{ padding: '0.75rem 1rem', minWidth: '190px', borderLeft: '1px solid var(--border)' }}>
                🎥 YouTube
              </th>
              <th style={{ padding: '0.75rem 1rem', width: '120px', textAlign: 'center', borderLeft: '1px solid var(--border)' }}>
                İşlem
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  ⏳ 4.709 Kürtçe isim yükleniyor, lütfen bekleyin...
                </td>
              </tr>
            ) : paginatedNames.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
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
                    style={{
                      borderBottom: '1px solid var(--border)',
                      background: isAllDone
                        ? 'rgba(16, 185, 129, 0.04)'
                        : idx % 2 === 0
                        ? 'transparent'
                        : 'rgba(255, 255, 255, 0.015)',
                    }}
                  >
                    {/* Index */}
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {globalIndex}
                    </td>

                    {/* Name */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <Link
                        href={`/tr/isim/${item.id}`}
                        target="_blank"
                        style={{
                          fontWeight: 800,
                          fontSize: '1rem',
                          color: 'var(--text)',
                          textDecoration: 'none',
                        }}
                      >
                        {item.name}
                      </Link>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{item.id}</div>
                    </td>

                    {/* Gender badge */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--r-sm)',
                          fontWeight: 700,
                          background:
                            item.gender === 'female'
                              ? 'rgba(244, 114, 182, 0.15)'
                              : item.gender === 'male'
                              ? 'rgba(96, 165, 250, 0.15)'
                              : 'rgba(168, 85, 247, 0.15)',
                          color:
                            item.gender === 'female'
                              ? '#f472b6'
                              : item.gender === 'male'
                              ? '#60a5fa'
                              : '#c084fc',
                        }}
                      >
                        {item.gender === 'female' ? 'Kız' : item.gender === 'male' ? 'Erkek' : 'Unisex'}
                      </span>
                    </td>

                    {/* Meaning */}
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                        lineHeight: 1.4,
                        maxWidth: '300px',
                      }}
                    >
                      {item.meaning}
                    </td>

                    {/* Instagram */}
                    <td style={{ padding: '0.75rem 1rem', borderLeft: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={ig.shared}
                          onChange={() => togglePlatform(item.id, 'instagram')}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            accentColor: '#e1306c',
                          }}
                        />
                        <input
                          type="date"
                          value={ig.date || ''}
                          onChange={(e) => changeDate(item.id, 'instagram', e.target.value)}
                          style={{
                            padding: '0.25rem 0.4rem',
                            fontSize: '0.75rem',
                            borderRadius: 'var(--r-sm)',
                            border: '1px solid var(--border)',
                            background: ig.shared ? 'rgba(225, 48, 108, 0.1)' : 'var(--surface-alt)',
                            color: 'var(--text)',
                          }}
                        />
                      </div>
                    </td>

                    {/* TikTok */}
                    <td style={{ padding: '0.75rem 1rem', borderLeft: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={tt.shared}
                          onChange={() => togglePlatform(item.id, 'tiktok')}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            accentColor: '#00f2fe',
                          }}
                        />
                        <input
                          type="date"
                          value={tt.date || ''}
                          onChange={(e) => changeDate(item.id, 'tiktok', e.target.value)}
                          style={{
                            padding: '0.25rem 0.4rem',
                            fontSize: '0.75rem',
                            borderRadius: 'var(--r-sm)',
                            border: '1px solid var(--border)',
                            background: tt.shared ? 'rgba(0, 242, 254, 0.1)' : 'var(--surface-alt)',
                            color: 'var(--text)',
                          }}
                        />
                      </div>
                    </td>

                    {/* YouTube */}
                    <td style={{ padding: '0.75rem 1rem', borderLeft: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={yt.shared}
                          onChange={() => togglePlatform(item.id, 'youtube')}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            accentColor: '#ff0000',
                          }}
                        />
                        <input
                          type="date"
                          value={yt.date || ''}
                          onChange={(e) => changeDate(item.id, 'youtube', e.target.value)}
                          style={{
                            padding: '0.25rem 0.4rem',
                            fontSize: '0.75rem',
                            borderRadius: 'var(--r-sm)',
                            border: '1px solid var(--border)',
                            background: yt.shared ? 'rgba(255, 0, 0, 0.1)' : 'var(--surface-alt)',
                            color: 'var(--text)',
                          }}
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'center',
                        borderLeft: '1px solid var(--border)',
                      }}
                    >
                      <button
                        onClick={() => downloadCard(item)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          borderRadius: 'var(--r-sm)',
                          border: '1px solid var(--border)',
                          background: 'var(--surface-alt)',
                          color: 'var(--text)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                        title="1080x1080 Kare Kart Görselini İndir"
                      >
                        📸 Görsel
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1.25rem',
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          Toplam <strong style={{ color: 'var(--text)' }}>{filteredNames.length}</strong> isimden{' '}
          {Math.min(filteredNames.length, (currentPage - 1) * pageSize + 1)} -{' '}
          {Math.min(filteredNames.length, currentPage * pageSize)} arası gösteriliyor.
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(1)}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage <= 1 ? 0.5 : 1,
              fontSize: '0.8rem',
            }}
          >
            « İlk
          </button>
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage <= 1 ? 0.5 : 1,
              fontSize: '0.8rem',
            }}
          >
            ← Önceki
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 0.5rem', color: 'var(--text)' }}>
            Sayfa {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage >= totalPages ? 0.5 : 1,
              fontSize: '0.8rem',
            }}
          >
            Sonraki →
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(totalPages)}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage >= totalPages ? 0.5 : 1,
              fontSize: '0.8rem',
            }}
          >
            Son »
          </button>
        </div>
      </div>
    </div>
  );
}
