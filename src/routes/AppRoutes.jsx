import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';

// Vistas temporales
const HomeTemporal = () => <div className="text-2xl font-bold">Catálogo de Paquetes (Próximamente)</div>;
const AdminTemporal = () => <div className="text-2xl font-bold">Panel de Administración (Próximamente)</div>;

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas Públicas (sin Layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Rutas con Layout */}
      <Route element={<MainLayout />}>
        
        {/* Rutas Protegidas (Cualquier usuario logueado) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeTemporal />} />
        </Route>

        {/* Rutas Protegidas (Solo Admin) */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminTemporal />} />
        </Route>

      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
