import React, { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type FavoritesCtx = {
  favoriteIds: Set<number>;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
};

const FavoritesContext = createContext<FavoritesCtx | null>(null);

const LS_KEY = "favorites.userIds";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useLocalStorage<number[]>(LS_KEY, []);

  const favoriteIds = useMemo(() => new Set(ids), [ids]);

  const toggleFavorite = (id: number) => {
    setIds((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return Array.from(s);
    });
  };

  const value: FavoritesCtx = {
    favoriteIds,
    isFavorite: (id) => favoriteIds.has(id),
    toggleFavorite,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
