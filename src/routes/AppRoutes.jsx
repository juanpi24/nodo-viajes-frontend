import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProtectedRoute } from './ProtectedRoute';

// Vistas temporales
const HomeTemporal = () => <div className="p-8 text-2xl">Catálogo de Paquetes (Próximamente)</div>;
const AdminTemporal = () => <div className="p-8 text-2xl">Panel de Administración (Próximamente)</div>;

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomeTemporal />} />
      </Route>

      <Route element={<ProtectedRoute adminOnly={true} />}>
        <Route path="/admin" element={<AdminTemporal />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
