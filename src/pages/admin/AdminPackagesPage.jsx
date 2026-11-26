import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { packageApi } from '../../api/packageApi';
import { formatearPrecio } from '../../utils/formato';
import { toast } from 'react-toastify';
import { PlusCircle, Edit, Trash2, CloudDownload, Loader2 } from 'lucide-react';
import { SafeImage } from '../../components/ui/SafeImage';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { SearchBar } from '../../components/ui/SearchBar'; // <-- IMPORT
import { Pagination } from '../../components/ui/Pagination'; // <-- IMPORT

export const AdminPackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  // Estados de búsqueda y paginación
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Función de carga con parámetros
  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await packageApi.getAll({ page, limit: 8, search });
      setPackages(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      toast.error('Error al cargar paquetes');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  // Efecto con debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPackages();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchPackages]);

  // Si busca algo, volvemos a la página 1
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!packageToDelete) return;
    try {
      await packageApi.remove(packageToDelete._id);
      toast.success('Paquete eliminado correctamente');
      // Recargamos la página actual para mantener la consistencia
      fetchPackages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      const res = await packageApi.importFromApi();
      toast.success(
        `Importación exitosa: ${res.nuevos} nuevos, ${res.actualizados} actualizados.`,
      );
      setPage(1); // Volvemos a la página 1 al importar
      fetchPackages();
    } catch {
      toast.error('Error al importar desde la API');
    } finally {
      setImporting(false);
    }
  };

  if (loading && packages.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header con Buscador */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-white">
            Administrar Paquetes
          </h1>
          <p className="text-text-muted mt-1">
            Gestioná el catálogo de viajes de ViajesAR.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Buscar paquete..."
          />

          <button
            onClick={handleImport}
            disabled={importing}
            className="px-4 py-2 border-2 border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400 font-medium rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            {importing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CloudDownload className="w-4 h-4" />
            )}
            Importar API
          </button>

          <Link
            to="/admin/packages/new"
            className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" /> Nuevo Paquete
          </Link>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 overflow-x-auto">
        <table className="w-full text-left text-sm text-text-main dark:text-white">
          <thead className="text-xs text-text-muted uppercase bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
            <tr>
              <th className="px-6 py-4 w-16">#</th>
              <th className="px-6 py-4">Paquete</th>
              <th className="px-6 py-4">Destino</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {packages.length === 0 && !loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-text-muted"
                >
                  No se encontraron paquetes con esos filtros.
                </td>
              </tr>
            ) : (
              packages.map((pkg, index) => (
                <tr
                  key={pkg._id}
                  className="border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50"
                >
                  <td className="px-6 py-4 font-medium text-text-muted">
                    {(page - 1) * 8 + index + 1}{' '}
                    {/* <-- Numeración correcta entre páginas */}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <SafeImage
                      src={pkg.imagen}
                      alt={pkg.titulo}
                      className="w-10 h-10 rounded-md shrink-0"
                      iconSize="w-4 h-4"
                      fallbackText=""
                    />
                    <span className="font-medium line-clamp-1">
                      {pkg.titulo}
                    </span>
                  </td>
                  <td className="px-6 py-4">{pkg.destino}</td>
                  <td className="px-6 py-4">{formatearPrecio(pkg.precio)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${pkg.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {pkg.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-2">
                      <Link
                        to={`/admin/packages/${pkg._id}/edit`}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setPackageToDelete(pkg)}
                        className="p-2 text-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Modal Reutilizable */}
      <ConfirmationModal
        abierto={!!packageToDelete}
        onCerrar={() => setPackageToDelete(null)}
        onConfirmar={handleDelete}
        titulo="¿Eliminar paquete?"
        mensaje={
          <>
            Estás a punto de eliminar <strong>{packageToDelete?.titulo}</strong>
            . Esta acción no se puede deshacer.
          </>
        }
      />
    </div>
  );
};
