import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { packageApi } from '../api/packageApi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { formatearPrecio } from '../utils/formato';
import { SafeImage } from '../components/ui/SafeImage';
import {
  MapPin,
  Star,
  Heart,
  CloudSun,
  Thermometer,
  Wind,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
} from 'lucide-react';

export const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites(); // <--- Importamos el hook de favoritos
  const { addToCart, cart } = useCart(); // <-- Importamos la función para agregar al carrito

  const [pkg, setPkg] = useState(null); // <--- Estado para el paquete
  const [weather, setWeather] = useState(null); // <--- Estado para el clima
  const [loading, setLoading] = useState(true); // <--- Estado para el loading

  const isFav = isFavorite(id); // <--- Verificamos si el paquete es favorito

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await packageApi.getById(id);
        setPkg(data);

        // Buscar el clima en paralelo (sin bloquear la vista principal)
        await packageApi.getWeather(id).then(setWeather).catch(console.error);
      } catch {
        toast.error('No se pudo cargar el paquete');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleToggleFavorite = async () => {
    if (!user || user.rol !== 'cliente') {
      toast.info('Iniciá sesión como cliente para guardar favoritos');
      return;
    }
    const success = await toggleFavorite(id);
    if (success) {
      toast.success(isFav ? 'Eliminado de favoritos' : 'Agregado a favoritos');
    } else {
      toast.error('Error al actualizar favoritos');
    }
  };

  // Función para manejar la adición al carrito
  const handleAddToCart = () => {
    if (!user) {
      toast.info('Iniciá sesión para comprar');
      navigate('/login');
      return;
    }
    if (user.rol === 'admin') {
      toast.info('Los administradores no pueden comprar');
      return;
    }

    // Agregamos 1 unidad al carrito y mostramos el aviso
    addToCart(pkg, 1);
    toast.success('Agregado al carrito');
  };

  // Calculamos cuántos de este paquete hay en el carrito
  const itemEnCarrito = cart.find((item) => item.package === id);
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
  // Restamos el stock original menos lo que ya está en el carrito
  const stockRestante = pkg ? pkg.stock - cantidadEnCarrito : 0;

  if (loading)
    return (
      <div className="text-center py-20 text-xl dark:text-white">
        Cargando detalle...
      </div>
    );
  if (!pkg) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Botón Volver */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-text-muted hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Volver al catálogo
      </Link>

      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl overflow-hidden border border-surface-100 dark:border-surface-700 flex flex-col md:flex-row">
        {/* Imagen izquierda del paquete y etiqueta de destacado */}
        <div className="md:w-1/2 relative h-72 md:h-auto">
          <SafeImage
            src={pkg.imagen}
            alt={pkg.titulo}
            lazy={false}
            iconSize="w-14 h-14"
            fallbackText="Imagen del paquete no disponible"
            className="w-full h-full object-cover"
          />

          {pkg.destacado && (
            <span className="absolute top-4 left-4 bg-accent text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
              DESTACADO
            </span>
          )}
        </div>

        {/* Info Derecha */}
        <div className="md:w-1/2 p-8 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 text-text-muted">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">{pkg.destino}</span>
            </div>
            <span className="bg-primary-50 dark:bg-surface-700 text-primary-600 dark:text-primary-400 text-sm px-3 py-1 rounded-full font-medium">
              {pkg.categoria}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-text-main dark:text-white mb-4">
            {pkg.titulo}
          </h1>

          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-text-main dark:text-white">
              4.8
            </span>
            <span className="text-text-muted">(24 reseñas)</span>
          </div>

          <p className="text-text-muted mb-8 leading-relaxed grow">
            {pkg.descripcion}
          </p>

          {/* Widget del Clima */}
          <div className="bg-blue-50 dark:bg-surface-900 rounded-xl p-4 mb-6 border border-blue-100 dark:border-surface-700">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
              <CloudSun className="w-4 h-4" /> Clima actual en el destino
            </h4>
            {weather?.temperatura !== undefined ? (
              <div className="flex gap-6 text-text-main dark:text-white">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-red-500" />
                  <span className="text-lg font-bold">
                    {weather.temperatura}°C
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-gray-500" />
                  <span>{weather.viento} km/h</span>
                </div>
                <div className="text-sm font-medium self-center text-text-muted">
                  {weather.condicion}
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-muted">
                {weather?.mensaje || 'Cargando clima...'}
              </p>
            )}
          </div>

          {/* Precio y Acciones */}
          <div className="mt-auto pt-6 border-t border-surface-100 dark:border-surface-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
            <div>
              <p className="text-sm text-text-muted">Precio por persona</p>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {formatearPrecio(pkg.precio)}
              </p>
            </div>

            {/* En móvil ocupa todo el ancho (w-full), en PC se ajusta al contenido (sm:w-auto) */}
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleToggleFavorite}
                className={`p-3 rounded-lg border transition-colors shrink-0 ${isFav ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-900/50' : 'border-surface-200 text-text-muted hover:bg-surface-50 dark:border-surface-700 dark:hover:bg-surface-700'}`}
              >
                <Heart className={`w-6 h-6 ${isFav ? 'fill-current' : ''}`} />
              </button>

              {/* En móvil crece para ocupar el espacio restante (flex-1), en PC vuelve a su tamaño (sm:flex-none) */}
              <button
                onClick={handleAddToCart}
                disabled={stockRestante <= 0}
                className="flex-1 sm:flex-none justify-center px-4 sm:px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {stockRestante <= 0 ? 'Sin cupos' : 'Comprar Paquete'}
              </button>
            </div>
          </div>

          {/* Texto con stockRestante */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            {stockRestante > 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-accent" />{' '}
                <span className="text-text-muted">
                  Hay {stockRestante} cupos disponibles
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-danger" />{' '}
                <span className="text-danger font-medium">
                  Alcanzaste el límite de cupos en tu carrito
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
