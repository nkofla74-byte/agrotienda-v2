'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipado estricto para evitar errores en producción
export type CartItem = {
  uniqueId: string;
  id: number;
  nombre: string;
  imagen: string;
  variantName: string;
  precio: number;
  quantity: number;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, variantIndex: number, quantity: number) => void;
  removeFromCart: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, delta: number) => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (val: boolean) => void;
  isHydrated: boolean;
  clearCart: () => void; // <-- 1. Función definida en el tipado
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Evitar error de hidratación: Solo cargar datos de localStorage una vez montado
  useEffect(() => {
    const savedCart = localStorage.getItem('agrotienda_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error al procesar el carrito:", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Guardar en localStorage cada vez que el carrito cambie, pero SOLO si ya se hidrató
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('agrotienda_cart', JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  // --- LAS FUNCIONES ORIGINALES QUE FALTABAN ---

  const addToCart = (product: any, variantIndex: number, quantityToAdd: number) => {
    const variant = product.variantes[variantIndex];
    if (!variant) return;

    if (variant.stock_disponible === false) {
      alert("Esta presentación está agotada temporalmente.");
      return;
    }

    const uniqueId = `${product.id}-${variantIndex}`;
    
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.uniqueId === uniqueId);
      if (existingItem) {
        return prevCart.map(item => 
          item.uniqueId === uniqueId 
            ? { ...item, quantity: item.quantity + quantityToAdd } 
            : item
        );
      } else {
        return [...prevCart, {
          uniqueId,
          id: product.id,
          nombre: product.nombre,
          imagen: product.imagen_url || '/vite.svg',
          variantName: variant.unidad,
          precio: variant.precio,
          quantity: quantityToAdd
        }];
      }
    });
    
    // NOTA: Se eliminó setIsCartOpen(true) para que el carrito no se abra 
    // automáticamente y permita al usuario seguir comprando.
  };

  const updateQuantity = (uniqueId: string, delta: number) => {
    setCart((prevCart) => prevCart.map(item => {
      if (item.uniqueId === uniqueId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0)); // Si llega a 0, se elimina solo
  };

  const removeFromCart = (uniqueId: string) => {
    setCart((prevCart) => prevCart.filter(item => item.uniqueId !== uniqueId));
  };

  // --- 2. LA NUEVA FUNCIÓN PARA VACIAR EL CARRITO ---
  const clearCart = () => {
    setCart([]);
  };

  // ----------------------------------------------

  const cartTotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,     // <-- 3. Expuesta aquí para que otros componentes la puedan usar
      cartTotal, 
      cartCount, 
      isCartOpen, 
      setIsCartOpen, 
      isHydrated 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
};