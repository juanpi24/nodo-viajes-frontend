import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { favoriteApi } from '../api/favoriteApi';
import { useAuth } from './AuthContext';

// El contexto nunca se exporta.
const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshFavorites = useCallback(async () => {
    if (!user || user?.rol !== 'cliente') {
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const data = await favoriteApi.getAll();
      setFavorites(data);
    } catch (error) {
      console.error('Error al cargar favoritos', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      refreshFavorites();
    }, 0);
    return () => clearTimeout(timer);
  }, [refreshFavorites]);

  const toggleFavorite = async (packageId) => {
    if (!user || user?.rol !== 'cliente') return false;
    
    const isFav = favorites.some(f => f._id === packageId);
    
    try {
      if (isFav) {
        await favoriteApi.remove(packageId);
        setFavorites(prev => prev.filter(f => f._id !== packageId));
      } else {
        await favoriteApi.add(packageId);
        await refreshFavorites();
      }
      return true;
    } catch (error) {
      console.error('Error al actualizar favorito', error);
      return false;
    }
  };

  const isFavorite = (packageId) => favorites.some(f => f._id === packageId);

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      loading, 
      toggleFavorite, 
      isFavorite, 
      refreshFavorites,
      favCount: favorites.length 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Hook consumidor con guardia.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const contexto = useContext(FavoritesContext);

  if (!contexto) {
    throw new Error('useFavorites() tiene que usarse adentro de <FavoritesProvider>');
  }

  return contexto;
}
