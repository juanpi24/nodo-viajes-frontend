import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { CatalogPage } from '../pages/CatalogPage';
import { PackageDetailPage } from '../pages/PackageDetailPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { CartPage } from '../pages/CartPage';
import { PaymentResultPage } from '../pages/PaymentResultPage';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';

const AdminTemporal = () => <div className="text-2xl font-bold">Panel de Administración (Próximamente)</div>;

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<MainLayout />}>
        {/* Catálogo y Detalle son PÚBLICOS */}
        <Route path="/" element={<CatalogPage />} />
        <Route path="/packages/:id" element={<PackageDetailPage />} />
        {/* Ruta pública para recibir el retorno de Mercado Pago */}
        <Route path="/payment-result" element={<PaymentResultPage />} />

        {/* Rutas Protegidas (Clientes) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        {/* Rutas Protegidas (Admin) */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminTemporal />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
