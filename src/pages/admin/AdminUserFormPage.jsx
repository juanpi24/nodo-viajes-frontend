import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router';
import api from '../../api/axiosInstance';
import { createUserSchema, updateUserSchema } from '../../schemas/authSchema';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export const AdminUserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);

  // Configuración de react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    // Si estamos editando, usamos el que permite dejar el password vacío
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: { rol: 'cliente' },
  });

  // Cargar datos del usuario si estamos editando
  useEffect(() => {
    if (isEditing) {
      api
        .get(`/users/${id}`)
        .then(({ data }) => {
          reset({
            nombre: data.user.nombre,
            email: data.user.email,
            rol: data.user.rol,
            password: '',
          });
        })
        .catch(() => {
          toast.error('Error al cargar usuario');
          navigate('/admin/users');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      // Si estamos editando y el password está vacío, lo borramos para no sobreescribirlo
      const payload = { ...data };
      if (isEditing && !payload.password) {
        delete payload.password;
      }

      {
        /* Guardamos el usuario (crear o actualizar según corresponda) */
      }
      if (isEditing) {
        await api.put(`/users/${id}`, payload);
        toast.success('Usuario actualizado');
      } else {
        await api.post('/users', payload);
        toast.success('Usuario creado');
      }
      navigate('/admin/users');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar usuario');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-text-muted hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Volver a la lista
      </Link>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-text-main dark:text-white mb-6">
          {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              {...register('nombre')}
              className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            {errors.nombre && (
              <span className="text-danger text-sm">
                {errors.nombre.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            {errors.email && (
              <span className="text-danger text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">
              Contraseña{' '}
              {isEditing && (
                <span className="text-xs text-text-muted font-normal">
                  (Dejar en blanco para no cambiar)
                </span>
              )}
            </label>
            <input
              type="password"
              {...register('password')}
              autoComplete="new-password"
              className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <span className="text-danger text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">
              Rol del Usuario
            </label>
            <select
              {...register('rol')}
              className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="pt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-surface-200 dark:border-surface-700 mt-6">
            <Link
              to="/admin/users"
              className="w-full sm:w-auto px-6 py-2.5 bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-text-main dark:text-white font-medium rounded-lg transition-colors text-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              <Save className="w-4 h-4 shrink-0" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Usuario'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
