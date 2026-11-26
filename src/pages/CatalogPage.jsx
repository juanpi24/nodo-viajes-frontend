import { useState, useEffect } from 'react';
import { packageApi } from '../api/packageApi';
import { favoriteApi } from '../api/favoriteApi';
import { PackageCard } from '../components/packages/PackageCard';
import { SlidersHorizontal, Loader2, SearchX } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { CATEGORIAS } from '../constants/destinos.js';
import { SearchBar } from '../components/ui/SearchBar';
import { Pagination } from '../components/ui/Pagination';
import { useDebounce } from '../hooks/useDebounce';

export const CatalogPage = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) setLoading(true);

      try {
        const params = { page, limit: 8 };
        if (debouncedSearch) params.search = debouncedSearch;
        if (categoria !== 'Todas') params.categoria = categoria;

        const res = await packageApi.getAll(params);

        if (isMounted) {
          setPackages(res.data);
          setTotalPages(res.meta.totalPages);
        }

        if (user && user.rol === 'cliente') {
          const favs = await favoriteApi.getAll();
          if (isMounted) setFavoriteIds(favs.map((f) => f._id));
        }
      } catch {
        if (isMounted) toast.error('Error al cargar el catálogo');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [page, debouncedSearch, categoria, user]); // Dependencias directas, sin funciones externas

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-white">
            Explorá Argentina
          </h1>
          <p className="text-text-muted mt-1">
            Descubrí los mejores destinos para tu próxima aventura.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Buscar destino..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <SlidersHorizontal className="w-5 h-5 text-text-muted mr-2 shrink-0" />
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategoria(cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
              categoria === cat
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-surface-800 text-text-muted hover:bg-surface-100 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col items-center">
          <SearchX className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-xl text-text-muted mb-6">
            No se encontraron paquetes con esos filtros.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategoria('Todas');
            }}
            className="bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg._id}
                pkg={pkg}
                initialIsFav={favoriteIds.includes(pkg._id)}
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};
