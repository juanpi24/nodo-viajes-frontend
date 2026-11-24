import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Sun, Moon, Plane, Shield, Heart, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return savedTheme === 'dark' || (!savedTheme && prefersDark);
});

  // Lógica simple de Modo Oscuro (después la movemos a un Context)
  useEffect(() => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [isDark]);

 const toggleTheme = () => {
  setIsDark((prev) => {
    const next = !prev;
    localStorage.setItem('theme', next ? 'dark' : 'light');
    return next;
  });
};

  const activeStyle = ({ isActive }) => 
    `font-medium transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-text-muted hover:text-primary-600 dark:hover:text-primary-400'}`;

  return (
    <header className="bg-white dark:bg-surface-800 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-500">
          <Plane className="w-6 h-6" />
          <span>ViajesAR</span>
        </Link>

        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={activeStyle}>Catálogo</NavLink>
          
          {user?.rol === 'admin' && (
            <NavLink to="/admin" className={activeStyle}>
              <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Admin</span>
            </NavLink>
          )}

          {user && user.rol !== 'admin' && (
            <NavLink to="/favoritos" className={activeStyle}>
              <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> Favoritos</span>
            </NavLink>
          )}
        </nav>

        {/* Acciones (Tema y Auth) */}
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-text-muted transition-colors">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium hidden sm:block">Hola, {user.nombre.split(' ')[0]}</span>
              <button onClick={logout} className="flex items-center gap-1 text-sm font-medium text-danger hover:text-red-700 transition-colors">
                <LogOut className="w-4 h-4" /> Salir
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-surface-700 rounded-lg transition-colors">Ingresar</Link>
              <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">Registrarse</Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
