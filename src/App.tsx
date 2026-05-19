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
const Widget = lazy(() => import('./pages/Widget'));
const Suggest = lazy(() => import('./pages/Suggest'));
const Admin = lazy(() => import('./pages/Admin'));
const Compare = lazy(() => import('./pages/Compare'));
const NotFound = lazy(() => import('./pages/NotFound'));


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

function AdSenseManager() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parts = location.pathname.split('/').filter(Boolean);
    // Homepage path is either empty ("/") or just the language code (e.g., "/tr")
    const isHome = parts.length <= 1;

    let script = document.querySelector('script[src*="adsbygoogle.js"]');

    if (!isHome) {
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('async', '');
        script.setAttribute('src', 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6367485410843937');
        script.setAttribute('crossorigin', 'anonymous');
        document.head.appendChild(script);
      }
    } else {
      if (script) {
        script.remove();
      }
    }
  }, [location.pathname]);

  return null;
}

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
          <AdSenseManager />
          <Suspense fallback={
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
              <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontSize: "1rem" }}>
                Yükleniyor...
              </p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<LangRedirect />} />


              {languages.map(lang => {
                const routes = routeTranslations[lang];
                return (
                  <Route key={lang} path={`/${lang}`} element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path={`${routes.category}/:type`} element={<Category />} />
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
                    <Route path={`${routes.widget}`} element={<Widget />} />
                    <Route path={`${routes.suggest}`} element={<Suggest />} />
                    <Route path={`${routes.compare}`} element={<Compare />} />
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
