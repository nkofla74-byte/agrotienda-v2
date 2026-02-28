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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Evitar error de hidratación: Solo cargar datos de localStorage una vez montado
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('agrotienda_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('agrotienda_cart', JSON.stringify(cart));
    }
  }, [cart, isMounted]);

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
    
    // Aquí implementaremos el Toast dinámico visual más adelante
    setIsCartOpen(true); 
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

  const cartTotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount, isCartOpen, setIsCartOpen 
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