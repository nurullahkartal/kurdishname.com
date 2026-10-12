import { useState, useEffect } from "react";
import { Share2, Copy, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CustomContextMenu() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Allow context menu in admin panel
      if (window.location.pathname.startsWith('/NKadmin')) return;

      e.preventDefault();
      
      // Calculate position so it doesn't go off-screen
      let x = e.clientX;
      let y = e.clientY;
      
      if (window.innerWidth - x < 200) {
        x -= 200;
      }
      if (window.innerHeight - y < 150) {
        y -= 150;
      }

      setPosition({ x, y });
      setIsVisible(true);
    };

    const handleClick = () => {
      if (isVisible) setIsVisible(false);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, [isVisible]);

  const handleShare = () => {
    const url = window.location.href;
    const text = "Bu siteye bir göz at!";
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    setIsVisible(false);
  };

  const handleCopy = async () => {
    try {
      const selection = window.getSelection()?.toString();
      const textToCopy = selection || window.location.href;
      await navigator.clipboard.writeText(textToCopy);
    } catch (err) {
      console.error('Failed to copy', err);
    }
    setIsVisible(false);
  };

  const handleHome = () => {
    const lang = i18n.language || 'tr';
    navigate(`/${lang}`);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="menu"
      tabIndex={-1}
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl py-2 w-48 text-sm"
      style={{ top: position.y, left: position.x }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        onClick={handleShare}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleShare();
          }
        }}
        role="menuitem"
        tabIndex={0}
        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
      >
        <Share2 size={16} />
        <span>İsmi Paylaş</span>
      </button>
      <button
        onClick={handleCopy}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCopy();
          }
        }}
        role="menuitem"
        tabIndex={0}
        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
      >
        <Copy size={16} />
        <span>Kopyala</span>
      </button>
      <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
      <button
        onClick={handleHome}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleHome();
          }
        }}
        role="menuitem"
        tabIndex={0}
        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
      >
        <Home size={16} />
        <span>Ana Sayfaya Dön</span>
      </button>
    </div>
  );
}
