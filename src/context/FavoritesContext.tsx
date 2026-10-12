import React, { createContext, useContext, useState, useEffect } from 'react';
import { NameData } from '../data/names';

interface FavoritesContextType {
  favorites: NameData[];
  addFavorite: (name: NameData) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (name: NameData) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<NameData[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('kurdishname_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load favorites from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kurdishname_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

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
