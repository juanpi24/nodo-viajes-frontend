import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { CatalogPage } from '../pages/CatalogPage';
import { PackageDetailPage } from '../pages/PackageDetailPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { CartPage } from '../pages/CartPage';
import { PaymentResultPage } from '../pages/PaymentResultPage';
import { ProfilePage } from '../pages/ProfilePage';
import { MyOrdersPage } from '../pages/MyOrdersPage';
import { AdminPackagesPage } from '../pages/admin/AdminPackagesPage';
import { AdminPackageFormPage } from '../pages/admin/AdminPackageFormPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminUserFormPage } from '../pages/admin/AdminUserFormPage';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { NoEncontrado } from '../components/ui/NoEncontrado';

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

        {/* Rutas de Clientes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/favoritos" element={<FavoritesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/mis-compras" element={<MyOrdersPage />} />
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
          <Route path="/admin/users/new" element={<AdminUserFormPage />} />
          <Route path="/admin/users/:id/edit" element={<AdminUserFormPage />} />
        </Route>
      </Route>

      {/* Página no encontrada 404 */}
      <Route
        path="*"
        element={
          <div className="container mx-auto px-4 py-10">
            <NoEncontrado
              titulo="Página no encontrada"
              mensaje="La ruta que estás buscando no existe, fue movida de lugar o no tenés los permisos necesarios."
            />
          </div>
        }
      />
    </Routes>
  );
};
