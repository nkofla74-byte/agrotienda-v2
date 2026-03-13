'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Producto } from '@/types'; 

export default function ProductCard({ product }: { product: Producto }) {
  const { addToCart } = useCart();
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Estado para controlar la apertura del modal detallado
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeVariant = product.variantes?.[variantIndex] || { precio: 0, unidad: 'Unidad', stock_disponible: true, calidad: 'Estándar' };

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group relative">
        
        {/* Contenedor de la Imagen */}
        <div className="relative h-56 w-full overflow-hidden bg-gray-100">
          <Image 
            src={product.imagen_url || '/fresnolog.jpg'} 
            alt={`Imagen de ${product.nombre}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-700 ease-in-out ${!activeVariant.stock_disponible ? 'grayscale group-hover:scale-100' : 'group-hover:scale-110'}`}
            priority={false}
          />
          
          {/* Badge de Categoría */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black text-green-700 shadow-sm border border-white z-10">
            {product.es_canasta ? '🧺 CANASTA FAMILIAR' : (product.categorias?.nombre || 'Varios')}
          </div>

          {!activeVariant.stock_disponible && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
              <span className="bg-red-600 text-white font-black px-6 py-2 rounded-xl text-xl tracking-widest uppercase shadow-2xl transform -rotate-12 border-4 border-white">
                Agotado
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2">{product.nombre}</h3>
          
          {/* Descripción limitada con opción de ver más si es canasta */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-2">
              {product.descripcion}
            </p>
            
            {product.es_canasta && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-black text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors uppercase tracking-tighter"
              >
                🔍 Ver productos incluidos
              </button>
            )}
          </div>

          <div className="mt-auto space-y-4 pt-4 border-t border-gray-50">
            
            <select 
              className="tour-variante w-full bg-slate-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block p-3 outline-none font-medium cursor-pointer transition-colors hover:bg-slate-100"
              value={variantIndex}
              onChange={(e) => {
                setVariantIndex(Number(e.target.value));
                setQuantity(1); 
              }}
            >
              {product.variantes?.map((v, index) => (
                <option key={v.id || index} value={index}>
                  {v.unidad} {v.calidad && v.calidad !== 'Estándar' ? `(${v.calidad})` : ''} - {formatMoney(v.precio)}
                </option>
              ))}
            </select>

            <div className="flex justify-between items-center">
              <span className={`text-2xl font-black transition-all duration-300 ${activeVariant.stock_disponible ? 'text-green-600' : 'text-gray-400 line-through'}`}>
                {formatMoney(activeVariant.precio * quantity)}
              </span>
              
              <div className={`tour-cantidad flex items-center gap-1 rounded-full p-1 border border-gray-200 ${activeVariant.stock_disponible ? 'bg-slate-100' : 'bg-gray-50 opacity-50 pointer-events-none'}`}>
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-50 shadow-sm transition-colors text-lg font-medium"
                  disabled={!activeVariant.stock_disponible}
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
                  disabled={!activeVariant.stock_disponible}
                >+</button>
              </div>
            </div>

            <button 
              onClick={() => {
                addToCart(product, variantIndex, quantity);
                setQuantity(1); 
              }}
              disabled={!activeVariant.stock_disponible}
              className={`tour-agregar w-full font-black py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2
                ${activeVariant.stock_disponible 
                  ? 'bg-green-600 hover:bg-green-700 text-white active:scale-95' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-80'}`}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17,18A2,2 0 0,1 19,20A2,2 0 0,1 17,22C15.89,22 15,21.1 15,20C15,18.89 15.89,18 17,18M1,2H4.27L5.21,4H20A1,1 0 0,1 21,5C21,5.17 20.95,5.34 20.88,5.5L17.3,11.97C16.96,12.58 16.3,13 15.55,13H8.1L7.2,14.63L7.17,14.75A0.25,0.25 0 0,0 7.42,15H19V17H7C5.89,17 5,16.1 5,15C5,14.65 5.09,14.32 5.24,14.04L6.6,11.59L3,4H1V2M7,18A2,2 0 0,1 9,20A2,2 0 0,1 7,22C5.89,22 5,21.1 5,20C5,18.89 5.89,18 7,18Z" /></svg>
              {activeVariant.stock_disponible ? 'Agregar al Canasto' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DETALLADO DE CANASTA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay oscuro */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Tarjeta del Modal */}
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header del Modal */}
            <div className="bg-green-600 p-6 text-white relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 w-8 h-8 rounded-full flex items-center justify-center transition-colors font-bold"
              >
                ✕
              </button>
              <h2 className="text-2xl font-black flex items-center gap-3">
                <span className="text-3xl">🧺</span> Detalle de Canasta
              </h2>
              <p className="text-green-100 text-sm font-medium mt-1 uppercase tracking-wider">
                {product.nombre}
              </p>
            </div>

            {/* Contenido del Modal */}
            <div className="p-8">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-inner mb-6">
                <h4 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                  Productos incluidos
                </h4>
                
                {/* Mostramos la descripción estructurada que creamos en el paso anterior */}
                <div className="space-y-4">
                  {product.descripcion?.includes('Contenido:') ? (
                    // Si detectamos el formato estructurado, lo limpiamos para mostrarlo mejor
                    product.descripcion.split('Contenido: ')[1].split(', ').map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg flex items-center justify-center font-black text-sm">
                    {item.split('x ')[0]} libras
                     </span>
                        <span className="font-bold text-slate-700 text-base">
                          {item.split('x ')[1]}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600 font-medium italic">{product.descripcion}</p>
                  )}
                </div>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-widest text-sm"
              >
                Cerrar detalle
              </button>
            </div>
            
            {/* Footer decorativo */}
            <div className="bg-slate-50 py-3 text-center border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Cosecha fresca directa del campo 🌿
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}