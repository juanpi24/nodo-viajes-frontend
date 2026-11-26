import { Search } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = 'Buscar...' }) => {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-colors"
      />
    </div>
  );
};
