'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm fixed w-full z-40 transition-all border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-green-600 text-white p-2.5 rounded-full shadow-md group-hover:scale-110 transition duration-300">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.5,2.5C15.5,2.5 13.5,3.5 12,5C10.5,3.5 8.5,2.5 6.5,2.5C3,2.5 0,5.5 0,9C0,14 12,22 12,22C12,22 24,14 24,9C24,5.5 21,2.5 17.5,2.5Z"/></svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-green-900 tracking-tight leading-none">La Floresta</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Agrotienda V2</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-gray-600 font-medium">
          <Link href="#inicio" className="hover:text-green-600 transition">Inicio</Link>
          <Link href="#productos" className="hover:text-green-600 transition">Productos</Link>
          <Link href="#como-funciona" className="hover:text-green-600 transition">¿Cómo pedir?</Link>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-3">
          // Reemplaza la línea del botón actual por esta:
          <button 
            id="btn-carrito" 
            onClick={() => setIsCartOpen(true)}
            className="relative group p-3 bg-gray-100 rounded-full hover:bg-green-100 transition text-gray-700 hover:text-green-600"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75L7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z"/></svg>
            
            {/* Badge Dinámico del carrito */}
            <span className={`absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md transition-transform duration-200 border-2 border-white ${cartCount === 0 ? 'scale-0' : 'scale-100'}`}>
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}