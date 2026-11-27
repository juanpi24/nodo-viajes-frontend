import { useFavorites } from '../context/FavoritesContext';
import { PackageCard } from '../components/packages/PackageCard';
import { Loader2, HeartOff, Heart } from 'lucide-react';
// import { Link } from 'react-router'; <-- Lo saqué porque el botón ahora lo maneja el EmptyState
import { EmptyState } from '../components/ui/EmptyState';

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
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
          <EmptyState
            titulo="Todavía no guardaste ningún paquete"
            mensaje="Explorá el catálogo y guardá tus destinos favoritos para tenerlos siempre a mano."
            icono={HeartOff}
            textoBoton="Explorar paquetes"
            linkBoton="/"
          />
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
