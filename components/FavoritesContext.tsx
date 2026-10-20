"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { NameData } from '@/lib/names-data';

interface FavoritesContextType {
  favorites: NameData[];
  addFavorite: (name: NameData) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (name: NameData) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<NameData[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kurdishname_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('kurdishname_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites, hydrated]);

  const addFavorite = (name: NameData) => {
    setFavorites((prev) => {
      if (prev.some((item) => item.id === name.id)) return prev;
      return [name, ...prev];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id);
  };

  const toggleFavorite = (name: NameData) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === name.id);
      if (exists) {
        return prev.filter((item) => item.id !== name.id);
      } else {
        return [name, ...prev];
      }
    });
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export function FavoriteButton({
  item,
  addLabel = 'Favorilere ekle',
  removeLabel = 'Favorilerden çıkar',
  size = 18,
}: {
  item: NameData;
  addLabel?: string;
  removeLabel?: string;
  size?: number;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(item.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(item);
      }}
      aria-label={active ? removeLabel : addLabel}
      title={active ? removeLabel : addLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.45rem',
        borderRadius: '9999px',
        border: '1px solid var(--border)',
        background: active ? 'var(--female-dim)' : 'var(--surface)',
        color: active ? 'var(--female)' : 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'all 150ms',
      }}
    >
      <Heart size={size} fill={active ? 'var(--female)' : 'none'} />
    </button>
  );
}
