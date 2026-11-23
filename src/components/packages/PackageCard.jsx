import { MapPin, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PackageCard = ({ pkg }) => {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-surface-100 dark:border-surface-700 group flex flex-col">
      
      {/* Imagen y Badge */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={pkg.imagen} 
          alt={pkg.titulo} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {pkg.destacado && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            DESTACADO
          </span>
        )}
        <button className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-full text-text-muted hover:text-danger transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col grow">
        <div className="flex items-center gap-1 text-text-muted text-sm mb-2">
          <MapPin className="w-4 h-4" />
          <span>{pkg.destino}</span> -  <span>{pkg.categoria}</span>
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
