import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { formatearPrecio } from '../utils/formato';
import { Loader2, Package, Calendar, ShoppingBag, XCircle } from 'lucide-react'; 
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmationModal } from '../components/ui/ConfirmationModal'; 
import { toast } from 'react-toastify'; 

export const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // <-- estado para la orden que se quiere cancelar
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api
      .get('/orders/mis-ordenes')
      .then(({ data }) => {
        if (isMounted) setOrders(data.data);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // <-- funcion para manejar la cancelación de la orden
  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      await api.post(`/orders/${orderToCancel._id}/cancel`);
      toast.success('Orden cancelada correctamente');

      // Actualizamos el estado local de esa orden sin recargar toda la página
      setOrders(
        orders.map((o) =>
          o._id === orderToCancel._id ? { ...o, estado: 'cancelled' } : o,
        ),
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Error al cancelar la orden',
      );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-text-main dark:text-white">
        Mis Compras
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
          <EmptyState
            titulo="Todavía no realizaste compras"
            mensaje="Cuando compres un paquete, vas a poder ver tu historial y los detalles del pago acá."
            icono={ShoppingBag}
            textoBoton="Explorar paquetes"
            linkBoton="/"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-surface-100 dark:border-surface-700 pb-4 mb-4 gap-4">
                <div>
                  <p className="text-sm text-text-muted flex items-center gap-1">
                    <Calendar className="w-4 h-4" />{' '}
                    {new Date(order.createdAt).toLocaleDateString('es-AR')}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Orden: #{order._id.slice(-6).toUpperCase()}
                  </p>
                </div>

                {/* Contenedor de acciones y estado */}
                <div className="flex items-center gap-3">
                  {/* Botón de cancelar (Solo si está pendiente) */}
                  {order.estado === 'pending' && (
                    <button
                      onClick={() => setOrderToCancel(order)}
                      className="text-sm font-medium text-danger hover:text-red-700 transition-colors flex items-center gap-1 cursor-pointer bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg"
                    >
                      <XCircle className="w-4 h-4" /> Cancelar
                    </button>
                  )}

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.estado === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : order.estado === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.estado === 'cancelled'
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {order.estado.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={item._id || item.package?._id || index}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-text-muted" />
                      <span className="text-text-main dark:text-white">
                        {item.cantidad}x{' '}
                        {item.package?.titulo || 'Paquete eliminado'}
                      </span>
                    </div>
                    <span className="font-medium text-text-muted">
                      {formatearPrecio(item.precioUnitario * item.cantidad)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-700 flex justify-between items-center">
                <span className="font-bold text-text-main dark:text-white">
                  Total pagado
                </span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {formatearPrecio(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación de cancelación */}
      <ConfirmationModal
        abierto={!!orderToCancel}
        onCerrar={() => setOrderToCancel(null)}
        onConfirmar={handleCancelOrder}
        titulo="¿Cancelar esta orden?"
        mensaje={
          <>
            Estás a punto de cancelar la orden{' '}
            <strong>#{orderToCancel?._id.slice(-6).toUpperCase()}</strong>. Esta
            acción no se puede deshacer.
          </>
        }
        textoConfirmar="Sí, cancelar"
      />
    </div>
  );
};
