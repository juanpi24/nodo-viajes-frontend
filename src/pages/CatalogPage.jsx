import { useState, useEffect, useCallback } from 'react';
import { packageApi } from '../api/packageApi';
import { PackageCard } from '../components/packages/PackageCard';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const CATEGORIAS = ['Todas', 'Naturaleza', 'Lagos y Glaciares', 'Montaña', 'Aventura', 'Ciudad'];

export const CatalogPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (search) params.search = search;
      if (categoria !== 'Todas') params.categoria = categoria;

      const res = await packageApi.getAll(params);
      setPackages(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      toast.error('Error al cargar el catÃ¡logo');
    } finally {
      setLoading(false);
    }
  }, [page, search, categoria]);

  // Efecto para buscar cuando cambia la pagina, búsqueda o categoría
  useEffect(() => {
    // Un pequeño delay (debounce) para no buscar en cada tecla
    const timer = setTimeout(() => {
      fetchPackages();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchPackages]);

 
  return (
    <div className="space-y-8">
      {/* Header y Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-white">Explorá Argentina</h1>
          <p className="text-text-muted mt-1">Descubrí los mejores destinos para tu próxima aventura.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar destino..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Botones de Categoría */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <SlidersHorizontal className="w-5 h-5 text-text-muted mr-2 shrink-0" />
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategoria(cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              categoria === cat
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-surface-800 text-text-muted hover:bg-surface-100 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grilla de Paquetes */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
          <p className="text-xl text-text-muted">No se encontraron paquetes con esos filtros.</p>
          <button onClick={() => { setSearch(''); setCategoria('Todas'); setPage(1); }} className="mt-4 text-primary-600 hover:underline">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg disabled:opacity-50 text-text-main dark:text-white hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
              >
                Anterior
              </button>
              <span className="text-text-muted font-medium">Página {page} de {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg disabled:opacity-50 text-text-main dark:text-white hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
