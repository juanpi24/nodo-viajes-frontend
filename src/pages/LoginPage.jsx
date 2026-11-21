import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../schemas/authSchema';
import { LogIn, Mail, Lock } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await login(data);
      toast.success(`¡Bienvenido/a, ${res.user.nombre}!`);
      if (res.user.rol === 'admin') navigate('/admin');
      else navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h2>
          <p className="text-gray-400">Ingresá a tu cuenta de ViajesAR</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="email" {...register('email')} className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="tu@email.com" />
            </div>
            {errors.email && <span className="text-red-400 text-sm mt-1">{errors.email.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="password" {...register('password')} className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
            </div>
            {errors.password && <span className="text-red-400 text-sm mt-1">{errors.password.message}</span>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            {isSubmitting ? 'Ingresando...' : <><LogIn className="w-5 h-5" /> Ingresar</>}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          ¿No tenés cuenta? <Link to="/register" className="text-blue-400 hover:underline">Registrate acá</Link>
        </p>
      </div>
    </div>
  );
};
