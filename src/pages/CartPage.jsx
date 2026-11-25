import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderApi } from '../api/orderApi';
import { formatearPrecio } from '../utils/formato';
import { SafeImage } from '../components/ui/SafeImage';
import { Trash2, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } =
    useCart();
  const [loading, setLoading] = useState(false);

  // Función para manejar el checkout
  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Mandamos al backend solo los IDs y cantidades
      const items = cart.map((item) => ({
        package: item.package,
        cantidad: item.cantidad,
      }));

      // Creamos la orden en el backend y obtenemos el link de Mercado Pago
      const res = await orderApi.create(items);

      // Guardamos el ID de la orden para verificarla al volver de MP
      localStorage.setItem('last_order_id', res.orderId);

      // Vaciamos el carrito local ANTES de ir a pagar
      clearCart();

      // Redirigimos a la pasarela de Mercado Pago
      window.location.href = res.init_point;
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Error al conectar con Mercado Pago',
      );
      setLoading(false);
    }
  };

  // Si el carrito está vacío, mostramos un mensaje y un enlace al catálogo
  if (cart.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-text-main dark:text-white">
          Tu carrito está vacío
        </h2>
        <p className="text-text-muted">
          ¿Qué esperás para descubrir tu próximo destino?
        </p>
        <Link
          to="/"
          className="inline-block mt-4 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-text-main dark:text-white">
        Tu Carrito
      </h1>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden">
        <ul className="divide-y divide-surface-200 dark:divide-surface-700">
          {cart.map((item) => (
            <li
              key={item.package}
              className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4"
            >
              {/* Imagen adaptada para el carrito */}
              <SafeImage
                src={item.imagen}
                alt={item.titulo}
                className="w-full sm:w-24 h-24 rounded-lg shrink-0"
                iconSize="w-6 h-6"
                fallbackText=""
              />

              <div className="grow text-center sm:text-left">
                <h3 className="font-bold text-lg text-text-main dark:text-white">
                  {item.titulo}
                </h3>
                <p className="text-primary-600 font-medium">
                  {formatearPrecio(item.precio)}
                </p>
              </div>

              {/* Controles de cantidad y botón de eliminar */}
              <div className="flex items-center gap-4">
                {/* Agrupamos el selector y el texto para que se centren juntos */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center border border-surface-300 dark:border-surface-600 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.package, item.cantidad - 1)
                      }
                      disabled={item.cantidad <= 1}
                      className="px-3 py-1 text-text-muted hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-50"
                    >
                      -
                    </button>

                    {/*Mostramos la cantidad actual en el medio*/}
                    <span className="px-4 font-medium text-text-main dark:text-white">
                      {item.cantidad}
                    </span>

                    {/* Botón de aumentar cantidad */}
                    <button
                      onClick={() =>
                        updateQuantity(item.package, item.cantidad + 1)
                      }
                      disabled={item.cantidad >= item.stockMax}
                      className="px-3 py-1 text-text-muted hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  {/* Texto del stock centrado respecto al selector */}
                  <span className="text-[10px] sm:text-xs text-text-muted mt-1 w-full text-center block">
                    {item.stockMax > 0
                      ? `Máx. ${item.stockMax} unidades`
                      : 'Sin stock'}
                  </span>
                </div>
                {/* Botón de eliminar (separado a la derecha) */}
                <button
                  onClick={() => removeFromCart(item.package)}
                  className="p-2 text-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-6 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-text-muted mb-1">Total a pagar</p>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {formatearPrecio(cartTotal)}
          </p>
        </div>

        {/* Botón de checkout con estado de carga */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" /> Pagar con Mercado Pago{' '}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
