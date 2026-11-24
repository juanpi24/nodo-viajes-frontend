import { MapPin, Star, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { toast } from 'react-toastify';
import { SafeImage } from './SafeImage';

export const PackageCard = ({ pkg }) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const isFav = isFavorite(pkg._id);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Inicia sesión para guardar favoritos');
      navigate('/login');
      return;
    }
    if (user.rol === 'admin') {
      toast.info('Los administradores no tienen lista de favoritos');
      return;
    }

    const success = await toggleFavorite(pkg._id);
    if (success) {
      toast.success(isFav ? 'Quitado de favoritos' : 'Agregado a favoritos');
    } else {
      toast.error('Error al actualizar favoritos');
    }
  };

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-surface-100 dark:border-surface-700 group flex flex-col">
      
      <div className="relative h-48 overflow-hidden">
        <SafeImage 
          src={pkg.imagen} 
          alt={pkg.titulo} 
          fallbackText="Imagen del paquete no disponible"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {pkg.destacado && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            DESTACADO
          </span>
        )}
        <button 
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full transition-colors ${
            isFav ? 'bg-red-50 text-red-500 dark:bg-red-900/30' : 'bg-white/80 dark:bg-surface-900/80 text-text-muted hover:text-danger'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex flex-col grow">
        <div className="flex items-center gap-1 text-text-muted text-sm mb-2">
          <MapPin className="w-4 h-4" />
          <span>{pkg.destino}</span>
        </div>
        
        <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 line-clamp-2">
          {pkg.titulo}
        </h3>
        
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium text-text-main dark:text-gray-300">4.8</span>
          <span className="text-xs text-text-muted">(24 reseñas)</span>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-xs text-text-muted mb-1">Precio por persona</p>
            <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
              ${pkg.precio.toLocaleString('es-AR')}
            </p>
          </div>
          <Link 
            to={`/packages/${pkg._id}`}
            className="px-4 py-2 bg-primary-50 dark:bg-surface-700 text-primary-600 dark:text-primary-400 text-sm font-semibold rounded-lg hover:bg-primary-100 dark:hover:bg-surface-600 transition-colors"
          >
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
};
