import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { CatalogPage } from '../pages/CatalogPage';
import { PackageDetailPage } from '../pages/PackageDetailPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { CartPage } from '../pages/CartPage';
import { PaymentResultPage } from '../pages/PaymentResultPage';
import { AdminPackagesPage } from '../pages/admin/AdminPackagesPage';
import { AdminPackageFormPage } from '../pages/admin/AdminPackageFormPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        {/* Catálogo y Detalle son Públicos */}
        <Route path="/" element={<CatalogPage />} />
        <Route path="/packages/:id" element={<PackageDetailPage />} />
        <Route path="/pago/:status" element={<PaymentResultPage />} />

        {/* Rutas Protegidas (Clientes) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        {/* Rutas de Administrador */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route
            path="/admin"
            element={<Navigate to="/admin/packages" replace />}
          />
          <Route path="/admin/packages" element={<AdminPackagesPage />} />
          <Route
            path="/admin/packages/new"
            element={<AdminPackageFormPage />}
          />
          <Route
            path="/admin/packages/:id/edit"
            element={<AdminPackageFormPage />}
          />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
