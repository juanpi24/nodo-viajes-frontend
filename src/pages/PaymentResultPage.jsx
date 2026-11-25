import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

export const PaymentResultPage = () => {
  const [status, setStatus] = useState('loading'); // loading, approved, rejected, error
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      // Mercado Pago agrega los parámetros payment_id y status en la URL
      const query = new URLSearchParams(location.search);
      const paymentId = query.get('payment_id');
      const mpStatus = query.get('status');
      const orderId = localStorage.getItem('last_order_id');

      // Si Mercado Pago indica que el pago fue rechazado, lo marcamos como rechazado
      if (mpStatus === 'failure') {
        setStatus('rejected');
        return;
      }

    // Si no tenemos paymentId o orderId, marcamos como error
      if (!paymentId || !orderId) {
        setStatus('error');
        return;
      }

      try {
        const order = await orderApi.verify(orderId, paymentId);
        if (order.estado === 'approved') {
          setStatus('approved');
          localStorage.removeItem('last_order_id'); // Limpiamos la orden
        } else {
          setStatus('rejected');
        }
      } catch {
        setStatus('error');
      }
    };

    verifyPayment();
  }, [location]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
      
      {status === 'loading' && (
        <>
          <Loader2 className="w-16 h-16 animate-spin text-primary-500" />
          <h1 className="text-2xl font-bold text-text-main dark:text-white">Verificando tu pago...</h1>
          <p className="text-text-muted">Por favor, no cierres esta ventana.</p>
        </>
      )}

      {status === 'approved' && (
        <>
          <CheckCircle2 className="w-24 h-24 text-accent" />
          <h1 className="text-3xl font-bold text-text-main dark:text-white">¡Pago Exitoso!</h1>
          <p className="text-text-muted text-lg max-w-md">Tu compra ha sido confirmada. ¡Prepárate para tu próximo viaje!</p>
          <Link to="/" className="mt-4 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
            Volver al catálogo <ArrowRight className="w-5 h-5" />
          </Link>
        </>
      )}

      {(status === 'rejected' || status === 'error') && (
        <>
          <XCircle className="w-24 h-24 text-danger" />
          <h1 className="text-3xl font-bold text-text-main dark:text-white">Pago no procesado</h1>
          <p className="text-text-muted text-lg max-w-md">Hubo un problema con tu pago o fue cancelado. Por favor, intentá de nuevo.</p>
          <Link to="/cart" className="mt-4 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
            Volver al carrito
          </Link>
        </>
      )}

    </div>
  );
};