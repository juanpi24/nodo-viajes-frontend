import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { packageApi } from '../../api/packageApi';
import { packageSchema } from '../../schemas/packageSchema';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { CATEGORIAS } from '../../constants/destinos';



export const AdminPackageFormPage = () => {
  const { id } = useParams(); // Si hay ID, es edición
  const navigate = useNavigate();
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(packageSchema),
    defaultValues: { destacado: false, coordenadas: { lat: '', lng: '' } },
  });

  useEffect(() => {
    if (isEditing) {
      packageApi
        .getById(id)
        .then((data) => {
          reset({
            ...data,
            coordenadas: {
              lat: data.coordenadas?.lat || '',
              lng: data.coordenadas?.lng || '',
            },
          });
        })
        .catch(() => {
          toast.error('Error al cargar el paquete');
          navigate('/admin/packages');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      // Limpiamos las coordenadas si están vacías
      const payload = { ...data };
      if (!payload.coordenadas?.lat || !payload.coordenadas?.lng) {
        delete payload.coordenadas;
      }

      if (isEditing) {
        await packageApi.update(id, payload);
        toast.success('Paquete actualizado');
      } else {
        await packageApi.create(payload);
        toast.success('Paquete creado');
      }
      navigate('/admin/packages');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/admin/packages"
        className="inline-flex items-center gap-2 text-text-muted hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Volver a la lista
      </Link>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-text-main dark:text-white mb-6">
          {isEditing ? 'Editar Paquete' : 'Crear Nuevo Paquete'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">
                Título
              </label>
              <input
                type="text"
                {...register('titulo')}
                className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              {errors.titulo && (
                <span className="text-danger text-sm">
                  {errors.titulo.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">
                Destino
              </label>
              <input
                type="text"
                {...register('destino')}
                className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              {errors.destino && (
                <span className="text-danger text-sm">
                  {errors.destino.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              {...register('descripcion')}
              rows="3"
              className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            {errors.descripcion && (
              <span className="text-danger text-sm">
                {errors.descripcion.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">
                Precio ($)
              </label>
              <input
                type="number"
                {...register('precio')}
                className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              {errors.precio && (
                <span className="text-danger text-sm">
                  {errors.precio.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">
                Stock
              </label>
              <input
                type="number"
                {...register('stock')}
                className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              {errors.stock && (
                <span className="text-danger text-sm">
                  {errors.stock.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">
                Categoría
              </label>
              <select
                {...register('categoria')}
                className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="">Seleccionar...</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <span className="text-danger text-sm">
                  {errors.categoria.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">
              URL de la Imagen
            </label>
            <input
              type="text"
              {...register('imagen')}
              className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            {errors.imagen && (
              <span className="text-danger text-sm">
                {errors.imagen.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">
                Latitud (Opcional)
              </label>
              <input
                type="number"
                step="any"
                {...register('coordenadas.lat')}
                className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Ej: -41.1335"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">
                Longitud (Opcional)
              </label>
              <input
                type="number"
                step="any"
                {...register('coordenadas.lng')}
                className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Ej: -71.3103"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              {...register('destacado')}
              id="destacado"
              className="w-4 h-4 text-primary-600 rounded"
            />
            <label
              htmlFor="destacado"
              className="text-sm font-medium text-text-main dark:text-gray-300"
            >
              Marcar como DESTACADO
            </label>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-surface-200 dark:border-surface-700 mt-6">
            <Link
              to="/admin/packages"
              className="px-6 py-2.5 bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-text-main dark:text-white font-medium rounded-lg transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />{' '}
              {isSubmitting ? 'Guardando...' : 'Guardar Paquete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
