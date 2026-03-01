'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Producto } from '@/types'; // Importamos el tipado estricto

export default function ProductCard({ product }: { product: Producto }) {
  const { addToCart } = useCart();
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Asegurarnos de que haya variantes para evitar errores en productos mal creados
  const activeVariant = product.variantes?.[variantIndex] || { precio: 0, unidad: 'Unidad', stock_disponible: true, calidad: 'Estándar' };

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col group relative">
      {/* Contenedor de la Imagen */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        <Image 
          src={product.imagen_url || '/vite.svg'} 
          alt={`Imagen de ${product.nombre}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          priority={false}
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-green-700 shadow-sm border border-white z-10">
          {product.categorias?.nombre || 'Varios'}
        </div>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2">{product.nombre}</h3>
        {product.descripcion && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10" title={product.descripcion}>
            {product.descripcion}
          </p>
        )}

        {/* Zona Interactiva (Variantes, Cantidad y Botón) */}
        <div className="mt-auto space-y-4 pt-4 border-t border-gray-50">
          
          {/* 1. Selector de Variante (Ej: Libra, Canasta, Kilo) */}
          <select 
            className="w-full bg-slate-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block p-3 outline-none font-medium cursor-pointer transition-colors hover:bg-slate-100"
            value={variantIndex}
            onChange={(e) => {
              setVariantIndex(Number(e.target.value));
              setQuantity(1); // Si cambia la presentación, devolvemos la cantidad a 1
            }}
          >
            {product.variantes?.map((v, index) => (
              <option key={v.id || index} value={index}>
                {v.unidad} {v.calidad && v.calidad !== 'Estándar' ? `(${v.calidad})` : ''} - {formatMoney(v.precio)}
              </option>
            ))}
          </select>

          {/* 2. Precio Total Dinámico y Selector numérico */}
          <div className="flex justify-between items-center">
            {/* El precio se multiplica por la cantidad para mayor claridad del cliente */}
            <span className="text-2xl font-black text-green-600 transition-all duration-300">
              {formatMoney(activeVariant.precio * quantity)}
            </span>
            
            <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1 border border-gray-200">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 shadow-sm transition-colors text-lg font-medium"
                aria-label="Disminuir cantidad"
              >-</button>
              <input 
                type="number" 
                className="w-8 text-center bg-transparent text-sm font-bold text-gray-800 outline-none appearance-none" 
                value={quantity}
                readOnly
              />
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 shadow-sm transition-colors text-lg font-medium"
                aria-label="Aumentar cantidad"
              >+</button>
            </div>
          </div>

          {/* 3. Botón Principal */}
          <button 
            onClick={() => {
              addToCart(product, variantIndex, quantity);
              setQuantity(1); // Resetear contador de la tarjeta tras agregar
            }}
            disabled={!activeVariant.stock_disponible}
            className={`w-full font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2
              ${activeVariant.stock_disponible 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-70'}`}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17,18A2,2 0 0,1 19,20A2,2 0 0,1 17,22C15.89,22 15,21.1 15,20C15,18.89 15.89,18 17,18M1,2H4.27L5.21,4H20A1,1 0 0,1 21,5C21,5.17 20.95,5.34 20.88,5.5L17.3,11.97C16.96,12.58 16.3,13 15.55,13H8.1L7.2,14.63L7.17,14.75A0.25,0.25 0 0,0 7.42,15H19V17H7C5.89,17 5,16.1 5,15C5,14.65 5.09,14.32 5.24,14.04L6.6,11.59L3,4H1V2M7,18A2,2 0 0,1 9,20A2,2 0 0,1 7,22C5.89,22 5,21.1 5,20C5,18.89 5.89,18 7,18Z" /></svg>
            {activeVariant.stock_disponible ? 'Agregar al Canasto' : 'Agotado Temporalmente'}
          </button>
        </div>
      </div>
    </div>
  );
}