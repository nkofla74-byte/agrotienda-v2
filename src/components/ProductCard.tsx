'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Producto } from '@/types'; 

export default function ProductCard({ product }: { product: Producto }) {
  const { addToCart } = useCart();
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeVariant = product.variantes?.[variantIndex] || { precio: 0, unidad: 'Unidad', stock_disponible: true, calidad: 'Estándar' };

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

  return (
    <>
      <div 
        onClick={(e) => {
          if (!(e.target instanceof HTMLButtonElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLInputElement || (e.target as HTMLElement).closest('button'))) {
            setIsModalOpen(true);
          }
        }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group relative cursor-pointer"
      >
        
        <div className="relative h-56 w-full overflow-hidden bg-white dark:bg-slate-700">
          <Image 
            src={product.imagen_url || '/fresnolog.jpg'} 
            alt={`Imagen de ${product.nombre}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-700 ease-in-out ${!activeVariant.stock_disponible ? 'grayscale group-hover:scale-100' : 'group-hover:scale-110'}`}
            priority={false}
          />
          
          <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black text-green-800 dark:text-green-400 shadow-sm border border-white dark:border-slate-700 z-10">
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
          <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-2">{product.nombre}</h3>
          
          <div className="mb-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium line-clamp-2 h-10 mb-2">
              {product.descripcion}
            </p>
            
            {product.es_canasta && (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                className="text-xs font-black text-green-700 dark:text-green-400 hover:text-green-800 flex items-center gap-1 transition-colors uppercase tracking-tighter"
              >
                🔍 Ver productos incluidos
              </button>
            )}
          </div>

          <div className="mt-auto space-y-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            
            {/* SELECT CORREGIDO: Fondo blanco puro y borde sutil */}
            <select 
              className="tour-variante w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-green-500 focus:border-green-500 block p-3 outline-none font-bold cursor-pointer transition-colors"
              value={variantIndex}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                setVariantIndex(Number(e.target.value));
                setQuantity(1); 
              }}
            >
              {product.variantes?.map((v, index) => (
                <option 
                  key={v.id || index} 
                  value={index}
                  className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {v.unidad} - {formatMoney(v.precio)}
                </option>
              ))}
            </select>

            <div className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
              <span className={`text-2xl font-black transition-all duration-300 ${activeVariant.stock_disponible ? 'text-green-700 dark:text-green-400' : 'text-slate-400 line-through'}`}>
                {formatMoney(activeVariant.precio * quantity)}
              </span>
              
              <div className={`tour-cantidad flex items-center gap-1 rounded-full p-1 border border-gray-200 dark:border-slate-600 ${activeVariant.stock_disponible ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 opacity-50 pointer-events-none'}`}>
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 flex items-center justify-center text-slate-900 dark:text-white hover:bg-green-50 shadow-sm transition-colors text-lg font-bold"
                  disabled={!activeVariant.stock_disponible}
                >-</button>
                <input 
                  type="number" 
                  className="w-8 text-center bg-transparent text-sm font-black text-slate-900 dark:text-white outline-none appearance-none" 
                  value={quantity}
                  readOnly
                />
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 flex items-center justify-center text-slate-900 dark:text-white hover:bg-green-50 shadow-sm transition-colors text-lg font-bold"
                  disabled={!activeVariant.stock_disponible}
                >+</button>
              </div>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, variantIndex, quantity);
                setQuantity(1); 
              }}
              disabled={!activeVariant.stock_disponible}
              className={`tour-agregar w-full font-black py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2
                ${activeVariant.stock_disponible 
                  ? 'bg-green-600 hover:bg-green-700 text-white active:scale-95' 
                  : 'bg-gray-200 text-slate-500 cursor-not-allowed opacity-80'}`}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17,18A2,2 0 0,1 19,20A2,2 0 0,1 17,22C15.89,22 15,21.1 15,20C15,18.89 15.89,18 17,18M1,2H4.27L5.21,4H20A1,1 0 0,1 21,5C21,5.17 20.95,5.34 20.88,5.5L17.3,11.97C16.96,12.58 16.3,13 15.55,13H8.1L7.2,14.63L7.17,14.75A0.25,0.25 0 0,0 7.42,15H19V17H7C5.89,17 5,16.1 5,15C5,14.65 5.09,14.32 5.24,14.04L6.6,11.59L3,4H1V2M7,18A2,2 0 0,1 9,20A2,2 0 0,1 7,22C5.89,22 5,21.1 5,20C5,18.89 5.89,18 7,18Z" /></svg>
              {activeVariant.stock_disponible ? 'Agregar al Canasto' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DETALLADO CON ESTILO CLARO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col md:flex-row max-h-[90vh]">
            <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-white dark:bg-slate-800">
               <Image 
                src={product.imagen_url || '/fresnolog.jpg'} 
                alt={product.nombre}
                fill
                className="object-cover"
              />
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 w-10 h-10 rounded-full flex items-center justify-center shadow-lg md:hidden text-slate-900 dark:text-white font-bold"
              >✕</button>
            </div>

            <div className="w-full md:w-1/2 flex flex-col">
              <div className="bg-green-600 p-6 text-white relative">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="hidden md:flex absolute top-4 right-4 bg-white/20 hover:bg-white/40 w-8 h-8 rounded-full items-center justify-center transition-colors font-bold"
                >✕</button>
                <span className="text-green-100 text-[10px] font-black uppercase tracking-[0.2em]">
                  {product.categorias?.nombre || 'Producto'}
                </span>
                <h2 className="text-2xl font-black mt-1 leading-tight">{product.nombre}</h2>
              </div>

              <div className="p-6 overflow-y-auto flex-grow bg-white dark:bg-slate-900">
                <p className="text-slate-800 dark:text-slate-200 font-medium text-sm mb-6 leading-relaxed">
                  {product.descripcion || "Producto fresco cosechado en Fresno, Tolima."}
                </p>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-bold text-[10px] uppercase">Precio actual</span>
                    <span className="text-3xl font-black text-green-700 dark:text-green-400">{formatMoney(activeVariant.precio * quantity)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl p-1 border border-gray-300 dark:border-slate-700">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 flex items-center justify-center shadow-sm font-bold text-slate-900 dark:text-white"
                      >-</button>
                      <span className="w-8 text-center font-black text-slate-900 dark:text-white">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 flex items-center justify-center shadow-sm font-bold text-slate-900 dark:text-white"
                      >+</button>
                    </div>
                    
                    <button 
                      onClick={() => {
                        addToCart(product, variantIndex, quantity);
                        setIsModalOpen(false);
                        setQuantity(1);
                      }}
                      className="flex-grow bg-green-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-green-700 transition-all active:scale-95 text-sm"
                    >Agregar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}