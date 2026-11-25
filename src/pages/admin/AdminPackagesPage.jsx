import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { packageApi } from '../../api/packageApi';
import { formatearPrecio } from '../../utils/formato';
import { toast } from 'react-toastify';
import {
  PlusCircle,
  Edit,
  Trash2,
  CloudDownload,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { SafeImage } from '../../components/ui/SafeImage';

export const AdminPackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const [packageToDelete, setPackageToDelete] = useState(null);

  const fetchPackages = useCallback(async () => {
    try {
      const res = await packageApi.getAll({ limit: 100 });
      setPackages(res.data);
    } catch {
      toast.error('Error al cargar paquetes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const res = await packageApi.getAll({ limit: 100 });
        if (isMounted) setPackages(res.data);
      } catch {
        if (isMounted) toast.error('Error al cargar paquetes');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async () => {
    if (!packageToDelete) return;
    try {
      await packageApi.remove(packageToDelete._id);
      toast.success('Paquete eliminado correctamente');
      setPackages(packages.filter((p) => p._id !== packageToDelete._id));
      setPackageToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      const res = await packageApi.importFromApi();
      //Acá mostramos los datos exactos que devuelve el backend
      toast.success(
        `Importación exitosa: ${res.nuevos} nuevos, ${res.actualizados} actualizados.`,
      );
      fetchPackages();
    } catch {
      toast.error('Error al importar desde la API');
    } finally {
      setImporting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main dark:text-white">
            Administrar Paquetes
          </h1>
          <p className="text-text-muted mt-1">
            Gestioná el catálogo de viajes de ViajesAR.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleImport}
            disabled={importing}
            className="px-4 py-2 border-2 border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400 font-medium rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {importing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CloudDownload className="w-4 h-4" />
            )}
            Importar de API
          </button>

          <Link
            to="/admin/packages/new"
            className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
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
              <th className="px-6 py-4 w-16">#</th>{' '}
              {/* <-- NUEVA COLUMNA DE NUMERACIÓN */}
              <th className="px-6 py-4">Paquete</th>
              <th className="px-6 py-4">Destino</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Agregamos 'index' al map */}
            {packages.map((pkg, index) => (
              <tr
                key={pkg._id}
                className="border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50"
              >
                <td className="px-6 py-4 font-medium text-text-muted">
                  {index + 1}
                </td>{' '}
                {/* <-- MOSTRAMOS EL ÍNDICE + 1 */}
                <td className="px-6 py-4 flex items-center gap-3">
                  <SafeImage
                    src={pkg.imagen}
                    alt={pkg.titulo}
                    className="w-10 h-10 rounded-md shrink-0"
                    iconSize="w-4 h-4"
                    fallbackText=""
                  />
                  <span className="font-medium line-clamp-1">{pkg.titulo}</span>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {packageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-2xl max-w-sm w-full p-6 text-center border border-surface-200 dark:border-surface-700 animate-in fade-in zoom-in duration-200">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-danger" />
            </div>
            <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
              ¿Eliminar paquete?
            </h3>
            <p className="text-text-muted mb-6">
              Estás a punto de eliminar{' '}
              <strong>{packageToDelete.titulo}</strong>. Esta acción no se puede
              deshacer.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setPackageToDelete(null)}
                className="px-4 py-2 bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-text-main dark:text-white font-medium rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-danger hover:bg-red-600 text-white font-medium rounded-lg transition-colors cursor-pointer"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
