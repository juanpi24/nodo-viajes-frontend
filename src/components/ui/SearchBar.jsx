import { Search, X } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = 'Buscar...' }) => {
  return (
    <div className="relative w-full sm:w-72">
      {/* Ícono de lupa a la izquierda */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        /* Agregamos pr-10 para que el texto no se superponga con la X */
        className="w-full pl-10 pr-10 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-colors"
      />

      {/* Botón de limpiar (solo aparece si hay texto) */}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-danger dark:hover:text-red-400 transition-colors cursor-pointer rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
          title="Limpiar búsqueda"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
