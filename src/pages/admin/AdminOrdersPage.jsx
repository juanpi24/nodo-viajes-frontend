import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { formatearPrecio } from '../../utils/formato';
import { Loader2, Package, ClipboardList } from 'lucide-react'; // <-- Agregamos ClipboardList
import { EmptyState } from '../../components/ui/EmptyState'; // <-- IMPORT AGREGADO

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const { data } = await api.get('/orders?limit=50');
        if (isMounted) setOrders(data.data);
      } catch (error) {
        if (isMounted) console.error('Error al cargar órdenes', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-main dark:text-white">
          Órdenes de Compra
        </h1>
        <p className="text-text-muted mt-1">Historial de ventas realizadas.</p>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 overflow-x-auto">
        {/* CONDICIÓN AGREGADA PARA LISTA VACÍA */}
        {orders.length === 0 ? (
          <EmptyState
            titulo="No hay órdenes de compra"
            mensaje="Aún no se han realizado ventas en la plataforma. Las compras de los clientes aparecerán acá."
            icono={ClipboardList}
          />
        ) : (
          <table className="w-full text-left text-sm text-text-main dark:text-white">
            <thead className="text-xs text-text-muted uppercase bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
              <tr>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium">
                      {order.user?.nombre || 'Usuario eliminado'}
                    </div>
                    <div className="text-xs text-text-muted">
                      {order.user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" /> {order.items.length}{' '}
                      paquete(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-primary-600 dark:text-primary-400">
                    {formatearPrecio(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        order.estado === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : order.estado === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {order.estado.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
