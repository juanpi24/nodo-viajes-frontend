import { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ abierto, onCerrar, children }) => {
  // Cerrar con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCerrar();
    };
    if (abierto) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo oscuro (Backdrop) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onCerrar}
      ></div>

      {/* Caja del Modal */}
      <div className="relative bg-white dark:bg-surface-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-surface-200 dark:border-surface-700 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onCerrar}
          className="absolute top-4 right-4 p-1 text-text-muted hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};
