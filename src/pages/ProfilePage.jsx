import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';

export const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-text-main dark:text-white">
        Mi Perfil
      </h1>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
          <User className="w-12 h-12" />
        </div>

        <div className="grow text-center md:text-left space-y-2">
          <h2 className="text-2xl font-bold text-text-main dark:text-white">
            {user.nombre}
          </h2>
          <p className="text-text-muted flex items-center justify-center md:justify-start gap-2">
            <Mail className="w-4 h-4" /> {user.email}
          </p>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
            <Shield className="w-3 h-3" /> Rol: {user.rol.toUpperCase()}
          </span>
        </div>
      </div>

      {user.rol === 'cliente' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/favoritos"
            className="bg-white dark:bg-surface-800 p-6 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 hover:border-primary-500 transition-colors flex items-center gap-4 group"
          >
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-text-main dark:text-white">
                Mis Favoritos
              </h3>
              <p className="text-sm text-text-muted">Ver paquetes guardados</p>
            </div>
          </Link>

          <Link
            to="/mis-compras"
            className="bg-white dark:bg-surface-800 p-6 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 hover:border-primary-500 transition-colors flex items-center gap-4 group"
          >
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-text-main dark:text-white">
                Mis Compras
              </h3>
              <p className="text-sm text-text-muted">Historial de órdenes</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};
