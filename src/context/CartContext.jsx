import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';

// El contexto nunca se exporta.
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth(); // <-- Obtenemos el usuario actual
  // Usamos el mismo hook de LocalStorage que en el ThemeContext
  const [cart, setCart] = useLocalStorage('cart-viajesar', []);

  // efecto para limpiar el carrito si el usuario se desloguea
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        setCart([]); // Si no hay usuario, el carrito queda vacío
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [user, setCart]);

  // Agregar producto (respetando el stock)
  const addToCart = (pkg, cantidad = 1) => {
    setCart((prev) => {
      const existe = prev.find((item) => item.package === pkg._id);
      if (existe) {
      // Si ya existe, sumamos la cantidad pero sin superar el stock
        return prev.map((item) =>
          item.package === pkg._id
            ? {
                ...item,
                cantidad: Math.min(item.cantidad + cantidad, pkg.stock),
              }
            : item,
        );
      }
      // Si no existe, lo agregamos al carrito
      return [
        ...prev,
        {
          package: pkg._id,
          titulo: pkg.titulo,
          precio: pkg.precio,
          imagen: pkg.imagen,
          cantidad: Math.min(cantidad, pkg.stock),
          stockMax: pkg.stock,
        },
      ];
    });
  };
  // Quitar producto
  const removeFromCart = (packageId) => {
    setCart((prev) => prev.filter((item) => item.package !== packageId));
  };
  // Modificar cantidad (botones + y -)
  const updateQuantity = (packageId, cantidad) => {
    setCart((prev) =>
      prev.map((item) =>
        item.package === packageId
          ? { ...item, cantidad: Math.min(cantidad, item.stockMax) }
          : item,
      ),
    );
  };
  // Vaciar carrito completo
  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
/**
 * Hook consumidor con guardia.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const contexto = useContext(CartContext);
  if (!contexto)
    throw new Error('useCart() tiene que usarse adentro de <CartProvider>');
  return contexto;
}
