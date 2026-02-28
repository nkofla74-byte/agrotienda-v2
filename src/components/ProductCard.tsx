'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Asegurarnos de que haya variantes para evitar errores
  const activeVariant = product.variantes?.[variantIndex] || { precio: 0, unidad: 'Unidad', stock_disponible: true };

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col group relative">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={product.imagen_url || '/vite.svg'} 
          alt={product.nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-sm border border-white/50">
          {product.categorias?.nombre || 'Varios'}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1">{product.nombre}</h3>
        {product.descripcion && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8">{product.descripcion}</p>
        )}

        <div className="mt-auto space-y-4">
          <select 
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block p-2.5 outline-none font-medium appearance-none"
            value={variantIndex}
            onChange={(e) => setVariantIndex(Number(e.target.value))}
          >
            {product.variantes?.map((v: any, index: number) => (
              <option key={v.id} value={index}>
                {v.unidad} {v.calidad && v.calidad !== 'Estándar' ? `(${v.calidad})` : ''}
              </option>
            ))}
          </select>

          <div className="flex justify-between items-center">
            <span className="text-2xl font-black text-green-600 transition-all duration-300">
              {formatMoney(activeVariant.precio)}
            </span>
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 border border-gray-200">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-green-600 shadow-sm"
              >-</button>
              <input 
                type="number" 
                className="w-8 text-center bg-transparent text-sm font-bold text-gray-800 outline-none appearance-none" 
                value={quantity}
                readOnly
              />
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-green-600 shadow-sm"
              >+</button>
            </div>
          </div>

          <button 
            onClick={() => {
              addToCart(product, variantIndex, quantity);
              setQuantity(1); // Resetear contador de la tarjeta tras agregar
            }}
            disabled={!activeVariant.stock_disponible}
            className="w-full bg-green-900 hover:bg-green-800 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activeVariant.stock_disponible ? 'Agregar al Canasto' : 'Agotado temporalmente'}
          </button>
        </div>
      </div>
    </div>
  );
}