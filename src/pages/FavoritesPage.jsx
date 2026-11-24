import { useState, useEffect } from 'react';
import { favoriteApi } from '../api/favoriteApi';
import { PackageCard } from '../components/packages/PackageCard';
import { Loader2, HeartOff } from 'lucide-react';
import { toast } from 'react-toastify';

export const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Buena práctica para evitar fugas de memoria
    
    const loadFavorites = async () => {
      try {
        const data = await favoriteApi.getAll();
        if (isMounted) setFavorites(data);
      } catch {
        if (isMounted) toast.error('Error al cargar tus favoritos');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFavorites();

    return () => {
      isMounted = false; // Se ejecuta si el componente se desmonta antes de que termine la petición
    };
  }, []);

  // Muestra el spinner mientras carga
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-main dark:text-white flex items-center gap-3">
          Mis Favoritos <HeartOff className="w-8 h-8 text-red-500" />
        </h1>
        <p className="text-text-muted mt-1">Los paquetes que guardaste para tu próximo viaje.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
          <p className="text-xl text-text-muted">Todavía no guardaste ningún paquete.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} initialIsFav={true} />
          ))}
        </div>
      )}
    </div>
  );
};
