import { useFavorites } from '../context/FavoritesContext';
import { PackageCard } from '../components/packages/PackageCard';
import { Loader2, HeartOff, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FavoritesPage = () => {
  // Usamos el contexto global que creamos
  const { favorites, loading } = useFavorites();

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
          Mis Favoritos <Heart className="w-8 h-8 text-red-500" />
        </h1>
        <p className="text-text-muted mt-1">
          Los paquetes que guardaste para tu próximo viaje.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col items-center">
          <HeartOff className="h-12 w-12 text-gray-400 mb-4"/>
          <p className="text-xl text-text-muted mb-6">
            Todavía no guardaste ningún paquete.
          </p>
          <Link
            to="/"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Explorar paquetes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
};
