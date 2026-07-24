import React, { useState, useEffect } from 'react';
import { loadAllNames } from '../utils/nameLoader';
import { NameData } from '../data/names';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { generatePath } from '../utils/routes';
import { useTranslation } from 'react-i18next';

const normalizeText = (text: string) => {
  return text.toLowerCase()
    .replace(/î/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/ê/g, 'e')
    .replace(/û/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o');
};

interface TrackerData {
  date: string;
  link: string;
}

export default function InstagramTracker() {
  const { i18n } = useTranslation();
  const lng = i18n.language || 'tr';

  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [names, setNames] = useState<NameData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, shared, unshared
  const [filterGender, setFilterGender] = useState('all'); // all, male, female, unisex
  const [tickedNames, setTickedNames] = useState<Record<string, TrackerData>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 100;

  useEffect(() => {
    // Sadece fallback olarak ilk açılışta localStorage'dan alıyoruz
    const stored = localStorage.getItem('instagramTrackerData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTickedNames(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const syncToCloud = async (data: Record<string, TrackerData>) => {
    try {
      await fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error('Buluta kaydedilemedi', e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('Hatalı şifre');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    const allNames = await loadAllNames();
    setNames(allNames);

    // Bulut veritabanından çek (Cloudflare KV)
    try {
      const res = await fetch('/api/tracker');
      if (res.ok) {
        const cloudData = await res.json();
        if (Object.keys(cloudData).length > 0) {
          setTickedNames(cloudData);
          localStorage.setItem('instagramTrackerData', JSON.stringify(cloudData));
        }
      }
    } catch (e) {
      console.error('Bulut veri çekilemedi', e);
    }

    setIsLoading(false);
  };

  const handleTick = (id: string) => {
    setTickedNames(prev => {
      const newTicked = { ...prev };
      if (newTicked[id]) {
        delete newTicked[id]; // Untick
      } else {
        // YYYY-MM-DD for date input
        newTicked[id] = { 
          date: new Date().toISOString().split('T')[0],
          link: ''
        };
      }
      localStorage.setItem('instagramTrackerData', JSON.stringify(newTicked));
      syncToCloud(newTicked);
      return newTicked;
    });
  };

  const handleDataChange = (id: string, field: 'date' | 'link', value: string) => {
    setTickedNames(prev => {
      const newTicked = { ...prev };
      if (newTicked[id]) {
        newTicked[id] = { ...newTicked[id], [field]: value };
        localStorage.setItem('instagramTrackerData', JSON.stringify(newTicked));
        syncToCloud(newTicked);
      }
      return newTicked;
    });
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Helmet><title>Instagram Tracker Login</title></Helmet>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Instagram Takip Tablosu</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Şifre"
            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
          />
          <button type="submit" style={{ padding: '0.8rem', background: '#000', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  const filteredNames = names.filter(n => {
    // 1. Arama
    const matchesSearch = normalizeText(n.name).includes(normalizeText(searchTerm));
    
    // 2. Durum Filtresi
    const isTicked = !!tickedNames[n.id];
    let matchesStatus = true;
    if (filterStatus === 'shared') matchesStatus = isTicked;
    if (filterStatus === 'unshared') matchesStatus = !isTicked;

    // 3. Cinsiyet Filtresi
    let matchesGender = true;
    if (filterGender !== 'all') matchesGender = n.gender === filterGender;

    return matchesSearch && matchesStatus && matchesGender;
  });

  const paginatedNames = filteredNames.slice(0, page * itemsPerPage);

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <Helmet><title>Instagram Tracker</title></Helmet>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Instagram İsim Paylaşım Takibi</h2>
        <div style={{ fontWeight: 'bold', background: '#f0f0f0', padding: '0.5rem 1rem', borderRadius: '8px' }}>
          Toplam Paylaşılan: {Object.keys(tickedNames).length} / {names.length}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input 
          type="text"
          placeholder="İsim ara..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          style={{ flex: '1 1 300px', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
        />
        
        <select 
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
        >
          <option value="all">Tümü (Paylaşılan + Paylaşılmayan)</option>
          <option value="shared">Sadece Paylaşılanlar</option>
          <option value="unshared">Sadece Paylaşılmayanlar</option>
        </select>

        <select 
          value={filterGender}
          onChange={(e) => { setFilterGender(e.target.value); setPage(1); }}
          style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
        >
          <option value="all">Tüm Cinsiyetler</option>
          <option value="female">Kız</option>
          <option value="male">Erkek</option>
          <option value="unisex">Üniseks</option>
        </select>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Yükleniyor... (Lütfen bekleyin, isim listesi oluşturuluyor)</div>
      ) : (
        <>
          <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee', background: '#fafafa' }}>
                  <th style={{ padding: '1rem', width: '60px', textAlign: 'center' }}>Durum</th>
                  <th style={{ padding: '1rem', width: '20%' }}>İsim</th>
                  <th style={{ padding: '1rem', width: '20%' }}>Cinsiyet</th>
                  <th style={{ padding: '1rem' }}>Paylaşım Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedNames.map(n => {
                  const isTicked = !!tickedNames[n.id];
                  const data = tickedNames[n.id];
                  return (
                    <tr key={n.id} style={{ borderBottom: '1px solid #eee', background: isTicked ? 'rgba(76, 175, 80, 0.08)' : 'transparent', transition: 'background 0.2s' }}>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={isTicked}
                          onChange={() => handleTick(n.id)}
                          style={{ width: '1.5rem', height: '1.5rem', cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        <Link 
                          to={generatePath(lng, 'name', n.id)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', textDecoration: 'none' }}
                          onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                          {n.name}
                        </Link>
                      </td>
                      <td style={{ padding: '1rem', color: '#555' }}>
                        {n.gender === 'male' ? 'Erkek' : n.gender === 'female' ? 'Kız' : 'Üniseks'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {isTicked ? (
                          <input 
                            type="date" 
                            value={data?.date || ''} 
                            onChange={(e) => handleDataChange(n.id, 'date', e.target.value)}
                            style={{ width: '100%', maxWidth: '300px', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
                          />
                        ) : (
                          <span style={{ color: '#888' }}>-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {paginatedNames.length < filteredNames.length && (
            <button 
              onClick={() => setPage(p => p + 1)}
              style={{ width: '100%', padding: '1rem', marginTop: '1rem', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
            >
              Daha Fazla Göster ({filteredNames.length - paginatedNames.length} isim kaldı)
            </button>
          )}
        </>
      )}
    </div>
  );
}
