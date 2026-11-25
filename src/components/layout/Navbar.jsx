import { useState } from 'react'; 
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useThemeContext } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import {
  LogOut,
  Sun,
  Moon,
  Plane,
  Shield,
  Heart,
  ShoppingCart,
  Menu, 
  X,
} from 'lucide-react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // <-- Estado del menú móvil
  const { user, logout } = useAuth();
  const { favCount } = useFavorites();
  const { isDark, toggleTheme } = useThemeContext(); // Usamos el hook para obtener el estado del tema y la función para cambiarlo
  const { cartCount } = useCart(); // <-- Contador del carrito

  const closeMenu = () => setIsMenuOpen(false);

  const activeStyle = ({ isActive }) =>
    `font-medium transition-colors ${
      isActive
        ? 'text-primary-600 dark:text-primary-400'
        : 'text-text-muted hover:text-primary-600 dark:hover:text-primary-400'
    }`;

  return (
    <header className="bg-white dark:bg-surface-800 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-500"
        >
          <Plane className="w-6 h-6" />
          <span>ViajesAR</span>
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={activeStyle}>
            Catálogo
          </NavLink>

          {user?.rol === 'admin' && (
            <NavLink to="/admin" className={activeStyle}>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" /> Admin
              </span>
            </NavLink>
          )}

          {user && user.rol !== 'admin' && (
            <NavLink to="/favoritos" className={activeStyle}>
              <span className="flex items-center gap-1 relative">
                <Heart className="w-4 h-4" /> Favoritos
                {favCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-danger text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {favCount}
                  </span>
                )}
              </span>
            </NavLink>
          )}
        </nav>

        {/* Acciones (Tema, Carrito, Auth y Botón Hamburguesa) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-text-muted transition-colors"
            aria-label="Cambiar tema"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Icono del carrito (Solo clientes o público) */}
          {(!user || user.rol === 'cliente') && (
            <Link
              to="/cart"
              onClick={closeMenu}
              className="relative p-2 text-text-muted hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-danger text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Auth en Desktop (oculto en móvil para evitar desbordes) */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  Hola, {user.nombre.split(' ')[0]}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-sm font-medium text-danger hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Salir
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Botón Hamburguesa (solo visible en móvil) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-muted hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            aria-label="Abrir menú"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 pt-3 pb-5 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-3">
            <NavLink to="/" onClick={closeMenu} className={activeStyle}>
              Catálogo
            </NavLink>

            {user?.rol === 'admin' && (
              <NavLink to="/admin" onClick={closeMenu} className={activeStyle}>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Admin
                </span>
              </NavLink>
            )}

            {user && user.rol !== 'admin' && (
              <NavLink to="/favoritos" onClick={closeMenu} className={activeStyle}>
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Favoritos
                  {favCount > 0 && (
                    <span className="bg-danger text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {favCount}
                    </span>
                  )}
                </span>
              </NavLink>
            )}
          </nav>

          {/* Sección de Auth en Móvil */}
          <div className="pt-3 border-t border-gray-100 dark:border-surface-700">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Hola, {user.nombre.split(' ')[0]}
                </span>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex items-center gap-1 text-sm font-medium text-danger hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" /> Salir
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-surface-700 transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
