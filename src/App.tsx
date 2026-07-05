import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useEffect, lazy, Suspense } from 'react';
import Layout from './components/Layout';
import { routeTranslations } from './utils/routes';
import { FavoritesProvider } from './context/FavoritesContext';

const CustomContextMenu = lazy(() => import('./components/CustomContextMenu'));

// Code splitting pages via React.lazy for premium performance
const Home = lazy(() => import('./pages/Home'));
const Category = lazy(() => import('./pages/Category'));
const NameDetail = lazy(() => import('./pages/NameDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const NameFinder = lazy(() => import('./pages/NameFinder'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Suggest = lazy(() => import('./pages/Suggest'));
const Admin = lazy(() => import('./pages/Admin'));
const Compare = lazy(() => import('./pages/Compare'));
const NotFound = lazy(() => import('./pages/NotFound'));
const EditorialBoard = lazy(() => import('./pages/EditorialBoard'));


function LangRedirect() {
  const { i18n } = useTranslation();
  const rawLang = i18n.language || 'tr';
  const cleanLang = rawLang.split('-')[0].toLowerCase();
  const targetLang = ['tr', 'en', 'de', 'ar'].includes(cleanLang) ? cleanLang : 'tr';
  return <Navigate to={`/${targetLang}`} replace />;
}

function LanguageSync() {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      const matchLang = parts[0];
      if (['tr', 'en', 'de', 'ar'].includes(matchLang)) {
        if (i18n.language !== matchLang) {
          i18n.changeLanguage(matchLang);
        }
      }
    }
  }, [location.pathname, i18n]);

  return null;
}

function ProtectionRules() {
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;
      const originalText = selection.toString();
      if (originalText.length === 0) return;
      const attribution = `\n\nKaynak: KurdishName — https://kurdishname.com`;
      e.clipboardData?.setData('text/plain', originalText + attribution);
      e.preventDefault();
    };
    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, []);
  return null;
}


// ─────────────────────────────────────────────────────────────────────────────
// LEGACY REDIRECT MAP
// Eski/hatalı kategori URL'lerini → doğru URL'e anında (replace) yönlendirir.
// Tarayıcı adres çubuğu da değişir; Google botu 301 olarak işler.
// ─────────────────────────────────────────────────────────────────────────────
const LEGACY_REDIRECTS: { from: string; to: string }[] = [

  // ── TR: Yanlış cinsiyet slug'ı (doğru kategori segment'i) ─────────────────
  { from: '/tr/kategori/girls',    to: '/tr/kategori/kiz'    },
  { from: '/tr/kategori/girl',     to: '/tr/kategori/kiz'    },
  { from: '/tr/kategori/female',   to: '/tr/kategori/kiz'    },
  { from: '/tr/kategori/woman',    to: '/tr/kategori/kiz'    },
  { from: '/tr/kategori/women',    to: '/tr/kategori/kiz'    },
  { from: '/tr/kategori/maedchen', to: '/tr/kategori/kiz'    },
  { from: '/tr/kategori/بنات',     to: '/tr/kategori/kiz'    },
  { from: '/tr/kategori/boys',     to: '/tr/kategori/erkek'  },
  { from: '/tr/kategori/boy',      to: '/tr/kategori/erkek'  },
  { from: '/tr/kategori/male',     to: '/tr/kategori/erkek'  },
  { from: '/tr/kategori/man',      to: '/tr/kategori/erkek'  },
  { from: '/tr/kategori/men',      to: '/tr/kategori/erkek'  },
  { from: '/tr/kategori/jungen',   to: '/tr/kategori/erkek'  },
  { from: '/tr/kategori/ذكور',     to: '/tr/kategori/erkek'  },

  // ── TR: Yanlış kategori segment'i (İngilizce/Almanca segment) ─────────────
  { from: '/tr/category/kiz',      to: '/tr/kategori/kiz'    },
  { from: '/tr/category/erkek',    to: '/tr/kategori/erkek'  },
  { from: '/tr/category/girls',    to: '/tr/kategori/kiz'    },
  { from: '/tr/category/boys',     to: '/tr/kategori/erkek'  },
  { from: '/tr/category/female',   to: '/tr/kategori/kiz'    },
  { from: '/tr/category/male',     to: '/tr/kategori/erkek'  },
  { from: '/tr/category/man',      to: '/tr/kategori/erkek'  },
  { from: '/tr/category/woman',    to: '/tr/kategori/kiz'    },
  { from: '/tr/kategorie/kiz',     to: '/tr/kategori/kiz'    },
  { from: '/tr/kategorie/erkek',   to: '/tr/kategori/erkek'  },
  { from: '/tr/kategorie/girls',   to: '/tr/kategori/kiz'    },
  { from: '/tr/kategorie/boys',    to: '/tr/kategori/erkek'  },

  // ── EN: Yanlış cinsiyet slug'ı (doğru kategori segment'i) ─────────────────
  { from: '/en/category/erkek',    to: '/en/category/boys'   },
  { from: '/en/category/kiz',      to: '/en/category/girls'  },
  { from: '/en/category/kız',      to: '/en/category/girls'  },
  { from: '/en/category/man',      to: '/en/category/boys'   },
  { from: '/en/category/men',      to: '/en/category/boys'   },
  { from: '/en/category/male',     to: '/en/category/boys'   },
  { from: '/en/category/boy',      to: '/en/category/boys'   },
  { from: '/en/category/female',   to: '/en/category/girls'  },
  { from: '/en/category/woman',    to: '/en/category/girls'  },
  { from: '/en/category/women',    to: '/en/category/girls'  },
  { from: '/en/category/girl',     to: '/en/category/girls'  },
  { from: '/en/category/jungen',   to: '/en/category/boys'   },
  { from: '/en/category/maedchen', to: '/en/category/girls'  },
  { from: '/en/category/بنات',     to: '/en/category/girls'  },
  { from: '/en/category/ذكور',     to: '/en/category/boys'   },

  // ── EN: Yanlış kategori segment'i ─────────────────────────────────────────
  { from: '/en/kategori/kiz',      to: '/en/category/girls'  },
  { from: '/en/kategori/erkek',    to: '/en/category/boys'   },
  { from: '/en/kategori/girls',    to: '/en/category/girls'  },
  { from: '/en/kategori/boys',     to: '/en/category/boys'   },
  { from: '/en/kategori/male',     to: '/en/category/boys'   },
  { from: '/en/kategori/female',   to: '/en/category/girls'  },
  { from: '/en/kategorie/kiz',     to: '/en/category/girls'  },
  { from: '/en/kategorie/erkek',   to: '/en/category/boys'   },
  { from: '/en/kategorie/girls',   to: '/en/category/girls'  },
  { from: '/en/kategorie/boys',    to: '/en/category/boys'   },

  // ── DE: Yanlış cinsiyet slug'ı (doğru kategori segment'i) ─────────────────
  { from: '/de/kategorie/erkek',   to: '/de/kategorie/jungen'    },
  { from: '/de/kategorie/kiz',     to: '/de/kategorie/maedchen'  },
  { from: '/de/kategorie/kız',     to: '/de/kategorie/maedchen'  },
  { from: '/de/kategorie/boys',    to: '/de/kategorie/jungen'    },
  { from: '/de/kategorie/boy',     to: '/de/kategorie/jungen'    },
  { from: '/de/kategorie/man',     to: '/de/kategorie/jungen'    },
  { from: '/de/kategorie/men',     to: '/de/kategorie/jungen'    },
  { from: '/de/kategorie/male',    to: '/de/kategorie/jungen'    },
  { from: '/de/kategorie/girl',    to: '/de/kategorie/maedchen'  },
  { from: '/de/kategorie/girls',   to: '/de/kategorie/maedchen'  },
  { from: '/de/kategorie/female',  to: '/de/kategorie/maedchen'  },
  { from: '/de/kategorie/woman',   to: '/de/kategorie/maedchen'  },
  { from: '/de/kategorie/women',   to: '/de/kategorie/maedchen'  },
  { from: '/de/kategorie/بنات',    to: '/de/kategorie/maedchen'  },
  { from: '/de/kategorie/ذكور',    to: '/de/kategorie/jungen'    },

  // ── DE: Yanlış kategori segment'i ─────────────────────────────────────────
  { from: '/de/category/erkek',    to: '/de/kategorie/jungen'    },
  { from: '/de/category/kiz',      to: '/de/kategorie/maedchen'  },
  { from: '/de/category/boys',     to: '/de/kategorie/jungen'    },
  { from: '/de/category/girls',    to: '/de/kategorie/maedchen'  },
  { from: '/de/category/male',     to: '/de/kategorie/jungen'    },
  { from: '/de/category/female',   to: '/de/kategorie/maedchen'  },
  { from: '/de/category/man',      to: '/de/kategorie/jungen'    },
  { from: '/de/category/woman',    to: '/de/kategorie/maedchen'  },
  { from: '/de/kategori/erkek',    to: '/de/kategorie/jungen'    },
  { from: '/de/kategori/kiz',      to: '/de/kategorie/maedchen'  },
  { from: '/de/kategori/boys',     to: '/de/kategorie/jungen'    },
  { from: '/de/kategori/girls',    to: '/de/kategorie/maedchen'  },

  // ── AR: Yanlış cinsiyet slug'ı (doğru kategori segment'i) ─────────────────
  { from: '/ar/فئة/erkek',         to: '/ar/فئة/ذكور'    },
  { from: '/ar/فئة/kiz',           to: '/ar/فئة/بنات'    },
  { from: '/ar/فئة/boys',          to: '/ar/فئة/ذكور'    },
  { from: '/ar/فئة/boy',           to: '/ar/فئة/ذكور'    },
  { from: '/ar/فئة/man',           to: '/ar/فئة/ذكور'    },
  { from: '/ar/فئة/men',           to: '/ar/فئة/ذكور'    },
  { from: '/ar/فئة/male',          to: '/ar/فئة/ذكور'    },
  { from: '/ar/فئة/girls',         to: '/ar/فئة/بنات'    },
  { from: '/ar/فئة/girl',          to: '/ar/فئة/بنات'    },
  { from: '/ar/فئة/female',        to: '/ar/فئة/بنات'    },
  { from: '/ar/فئة/woman',         to: '/ar/فئة/بنات'    },
  { from: '/ar/فئة/women',         to: '/ar/فئة/بنات'    },
  { from: '/ar/فئة/jungen',        to: '/ar/فئة/ذكور'    },
  { from: '/ar/فئة/maedchen',      to: '/ar/فئة/بنات'    },

  // ── AR: Yanlış kategori segment'i ─────────────────────────────────────────
  { from: '/ar/category/kiz',      to: '/ar/فئة/بنات'    },
  { from: '/ar/category/erkek',    to: '/ar/فئة/ذكور'    },
  { from: '/ar/category/girls',    to: '/ar/فئة/بنات'    },
  { from: '/ar/category/boys',     to: '/ar/فئة/ذكور'    },
  { from: '/ar/category/male',     to: '/ar/فئة/ذكور'    },
  { from: '/ar/category/female',   to: '/ar/فئة/بنات'    },
  { from: '/ar/category/man',      to: '/ar/فئة/ذكور'    },
  { from: '/ar/category/woman',    to: '/ar/فئة/بنات'    },
  { from: '/ar/kategori/kiz',      to: '/ar/فئة/بنات'    },
  { from: '/ar/kategori/erkek',    to: '/ar/فئة/ذكور'    },
  { from: '/ar/kategori/girls',    to: '/ar/فئة/بنات'    },
  { from: '/ar/kategori/boys',     to: '/ar/فئة/ذكور'    },
  { from: '/ar/kategorie/kiz',     to: '/ar/فئة/بنات'    },
  { from: '/ar/kategorie/erkek',   to: '/ar/فئة/ذكور'    },
];

export default function App() {
  const languages = ['tr', 'en', 'de', 'ar'] as const;

  return (
    <BrowserRouter>
      <FavoritesProvider>
        <HelmetProvider>
          <ProtectionRules />
          <Suspense fallback={null}>
            <CustomContextMenu />
          </Suspense>
          <LanguageSync />
          <Suspense fallback={
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
              <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontSize: "1rem" }}>
                Yükleniyor...
              </p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<LangRedirect />} />

              {/* ── Statik Legacy Redirects: adres çubuğunu anında doğru URL'e değiştirir ── */}
              {LEGACY_REDIRECTS.map(({ from, to }) => (
                <Route key={from} path={from} element={<Navigate to={to} replace />} />
              ))}

              {languages.map(lang => {
                const routes = routeTranslations[lang];
                return (
                  <Route key={lang} path={`/${lang}`} element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path={`${routes.category}/:type`} element={<Category />} />
                    <Route path={`${routes.category}/:type/:subType`} element={<Category />} />
                    <Route path={`${routes.name}/:id`} element={<NameDetail />} />
                    <Route path={`${routes.blog}`} element={<Blog />} />
                    <Route path={`${routes.blog}/:slug`} element={<BlogPost />} />
                    <Route path={`${routes.finder}`} element={<NameFinder />} />
                    <Route path={routes.favorites} element={<Favorites />} />
                    <Route path={`${routes.privacy}`} element={<Privacy />} />
                    <Route path={`${routes.terms}`} element={<Terms />} />
                    <Route path={`${routes.cookies}`} element={<Cookies />} />
                    <Route path={`${routes.contact}`} element={<Contact />} />
                    <Route path={`${routes.about}`} element={<About />} />
                    <Route path={`${routes.suggest}`} element={<Suggest />} />
                    <Route path={`${routes.compare}`} element={<Compare />} />
                    <Route path={`${routes.editorial}`} element={<EditorialBoard />} />
                    <Route path="admin" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                );
              })}

              {/* Global Admin Panel Shortcut */}
              <Route path="/admin" element={<Layout />}>
                <Route index element={<Admin />} />
              </Route>

              <Route path="*" element={<LangRedirect />} />
            </Routes>
          </Suspense>
        </HelmetProvider>
      </FavoritesProvider>
    </BrowserRouter>
  );
}
