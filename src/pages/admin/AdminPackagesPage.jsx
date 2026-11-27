import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { packageApi } from '../../api/packageApi';
import { formatearPrecio } from '../../utils/formato';
import { toast } from 'react-toastify';
import {
  PlusCircle,
  Edit,
  Trash2,
  CloudDownload,
  Loader2,
  PackageOpen,
} from 'lucide-react';
import { SafeImage } from '../../components/ui/SafeImage';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { SearchBar } from '../../components/ui/SearchBar';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { ExportButton } from '../../components/ui/ExportButton';

const PAGE_SIZE = 8;

export const AdminPackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  // Estados de búsqueda y paginación
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Total real de paquetes (null si la API no lo informa)
  const [total, setTotal] = useState(null);

  // Función de carga con parámetros
  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await packageApi.getAll({ page, limit: PAGE_SIZE, search });
      setPackages(res.data);
      setTotalPages(res.meta.totalPages);
      // total puede ser null si la API no lo informa, por eso usamos ?? null
      setTotal(res.meta.total ?? null);
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

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!packageToDelete) return;
    try {
      await packageApi.remove(packageToDelete._id);
      toast.success('Paquete eliminado correctamente');
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
      setPage(1);
      fetchPackages();
    } catch {
      toast.error('Error al importar desde la API');
    } finally {
      setImporting(false);
    }
  };

  // Exporta todos los paquetes (sin paginación) o los filtrados por búsqueda.
  // Si falla, el error sube hasta ExportButton, que muestra un único toast.
  const handleExportAll = async () => {
    // Verificá que el backend acepte este límite (sin tope menor a 1000)
    const res = await packageApi.getAll({ limit: 1000, search });
    return res.data.map((p) => ({
      Titulo: p.titulo,
      Destino: p.destino,
      Categoria: p.categoria,
      Precio: p.precio,
      Stock: p.stock,
      Destacado: p.destacado ? 'Sí' : 'No',
    }));
  };

  // Si estamos cargando y no hay paquetes, mostramos un loader centralizado
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
        {/* Caja de búsqueda */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Buscar paquete..."
          />

          {/* Botón de exportación a Excel */}
          <ExportButton
            onFetchData={handleExportAll}
            filename="paquetes-viajesar"
            sheetName="Paquetes"
            disabled={loading || packages.length === 0}
          />

          {/* Botón de importación */}
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

      {/* Condición para mostrar estado vacío */}
      {packages.length === 0 && !loading ? (
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
          {search ? (
            // Si hay una búsqueda activa y no hay resultados
            <EmptyState
              titulo="Sin resultados"
              mensaje={`No se encontraron paquetes con el término "${search}". Probá con otra palabra.`}
              icono={PackageOpen}
              textoBoton="Limpiar búsqueda"
              onBotonClick={() => {
                setSearch('');
                setPage(1);
              }}
            />
          ) : (
            // Si simplemente no hay paquetes en el sistema
            <EmptyState
              titulo="No hay paquetes cargados"
              mensaje="El catálogo está vacío. Podés crear un paquete manualmente o importarlos desde la API."
              icono={PackageOpen}
              textoBoton="Crear primer paquete"
              linkBoton="/admin/packages/new"
            />
          )}
        </div>
      ) : (
        <>
          {/* Total de paquetes */}
          {total !== null && (
            <div className="flex justify-end mb-2">
              <span className="text-sm text-text-muted">
                Total de paquetes: {total}
              </span>
            </div>
          )}

          {/* Tabla de paquetes */}
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 overflow-x-auto">
            <table className="w-full text-left text-sm text-text-main dark:text-white">
              <thead className="text-xs text-text-muted uppercase bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
                <tr>
                  <th className="px-6 py-4 w-16">#</th>
                  <th className="px-6 py-4">Paquete</th>
                  <th className="px-6 py-4">Destino</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg, index) => (
                  <tr
                    key={pkg._id}
                    className="border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50"
                  >
                    <td className="px-6 py-4 font-medium text-text-muted">
                      {(page - 1) * PAGE_SIZE + index + 1}
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
                    <td className="px-6 py-4">{pkg.categoria}</td>
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

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
