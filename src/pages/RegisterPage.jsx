import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../schemas/authSchema';
import { UserPlus, Mail, Lock, User, ArrowLeft } from 'lucide-react';

export const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await registerAuth(data);
      toast.success('Â¡Cuenta creada con Ã©xito!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 px-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-surface-800 rounded-xl shadow-lg p-8 border border-surface-200 dark:border-surface-700 relative">
        
        {/* Botón Volver */}
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-1 text-sm font-medium text-text-muted hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        <div className="text-center mb-8 mt-4">
          <h2 className="text-3xl font-bold text-text-main dark:text-white mb-2">Crear Cuenta</h2>
          <p className="text-text-muted">Sumate a ViajesAR</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                {...register('nombre')}
                className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                placeholder="Tu nombre"
              />
            </div>
            {errors.nombre && <span className="text-danger text-sm mt-1">{errors.nombre.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="email"
                {...register('email')}
                className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                placeholder="tu@email.com"
              />
            </div>
            {errors.email && <span className="text-danger text-sm mt-1">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="password"
                {...register('password')}
                className="w-full bg-surface-50 dark:bg-surface-900 text-text-main dark:text-white border border-surface-200 dark:border-surface-700 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none transition-colors"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            {errors.password && <span className="text-danger text-sm mt-1">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creando cuenta...' : (
              <><UserPlus className="w-5 h-5" /> Registrarse</>
            )}
          </button>
        </form>

        <p className="text-center text-text-muted mt-6">
          ¿Ya tenés cuenta? <Link to="/login" className="text-primary-600 hover:underline">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
};
