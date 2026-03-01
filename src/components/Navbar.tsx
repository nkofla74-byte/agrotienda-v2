'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  // Traemos también cartTotal para mostrar el dinero en el carrito
  const { cartCount, cartTotal, setIsCartOpen, isHydrated } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const prevCountRef = useRef(0); 
  const [isAnimating, setIsAnimating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

  useEffect(() => {
    if (isHydrated && cartCount > prevCountRef.current) {
      setIsAnimating(true);
      setShowToast(true);
      const timerAnim = setTimeout(() => setIsAnimating(false), 500); 
      const timerToast = setTimeout(() => setShowToast(false), 2500); 
      prevCountRef.current = cartCount;
      return () => { clearTimeout(timerAnim); clearTimeout(timerToast); };
    } else if (isHydrated && cartCount < prevCountRef.current) {
      prevCountRef.current = cartCount;
    }
  }, [cartCount, isHydrated]);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-sm fixed w-full z-40 transition-all border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center relative">
        
        {/* Logo interactivo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-2.5 rounded-xl shadow-lg shadow-green-500/30 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.5,2.5C15.5,2.5 13.5,3.5 12,5C10.5,3.5 8.5,2.5 6.5,2.5C3,2.5 0,5.5 0,9C0,14 12,22 12,22C12,22 24,14 24,9C24,5.5 21,2.5 17.5,2.5Z"/></svg>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl text-slate-800 tracking-tight leading-none group-hover:text-green-600 transition-colors">La Floresta</span>
            <span className="text-[10px] text-green-600 uppercase tracking-widest font-bold">Fresno, Tolima</span>
          </div>
        </Link>

        {/* Desktop Menu - Enlaces con animación de subrayado y color */}
        <div className="hidden md:flex items-center space-x-10">
          {['Inicio', 'Productos', '¿Cómo pedir?', 'Nuestra Historia'].map((item, idx) => {
            const id = item.toLowerCase().replace(/¿|\?/g, '').replace(/\s+/g, '-');
            return (
              <Link 
                key={idx} 
                href={`#${id}`} 
                className="relative group py-2 text-slate-600 font-bold hover:text-green-600 transition-colors duration-300"
              >
                {item}
                {/* La magia de la animación del borde inferior */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 ease-out group-hover:w-full"></span>
              </Link>
            )
          })}
        </div>

        {/* Contenedor del Carrito */}
        <div className="flex items-center gap-3 relative">
          
          {/* NUEVO BOTÓN DEL CARRITO: Diseño "Pill" moderno */}
          <button 
            id="btn-carrito" 
            onClick={() => setIsCartOpen(true)}
            className={`group flex items-center gap-3 px-5 py-2.5 rounded-full font-bold transition-all duration-300 shadow-md active:scale-95
              ${isAnimating 
                ? 'bg-green-500 text-white shadow-green-500/50 scale-105 -translate-y-1' 
                : 'bg-slate-900 text-white hover:bg-green-600 hover:shadow-green-500/30'
              }`}
          >
            {/* Ícono de carrito */}
            <svg className={`w-5 h-5 fill-current transition-transform duration-300 ${isAnimating ? 'rotate-12 scale-125' : 'group-hover:-rotate-12'}`} viewBox="0 0 24 24"><path d="M17,18A2,2 0 0,1 19,20A2,2 0 0,1 17,22C15.89,22 15,21.1 15,20C15,18.89 15.89,18 17,18M1,2H4.27L5.21,4H20A1,1 0 0,1 21,5C21,5.17 20.95,5.34 20.88,5.5L17.3,11.97C16.96,12.58 16.3,13 15.55,13H8.1L7.2,14.63L7.17,14.75A0.25,0.25 0 0,0 7.42,15H19V17H7C5.89,17 5,16.1 5,15C5,14.65 5.09,14.32 5.24,14.04L6.6,11.59L3,4H1V2M7,18A2,2 0 0,1 9,20A2,2 0 0,1 7,22C5.89,22 5,21.1 5,20C5,18.89 5.89,18 7,18Z" /></svg>
            
            {/* Texto dinámico: Solo aparece en escritorio */}
            <span className="hidden sm:block">
              {isHydrated && cartCount > 0 ? formatMoney(cartTotal) : 'Mi Canasto'}
            </span>
            
            {/* Badge de cantidad integrado en el botón */}
            {isHydrated && cartCount > 0 && (
              <span className={`bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full transition-all duration-300
                ${isAnimating ? 'bg-white text-green-600 scale-125' : ''}
              `}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Toast Notification Premium */}
          <div className={`absolute top-full right-0 mt-4 w-max bg-slate-800 text-white text-sm font-bold px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-500 flex items-center gap-3 transform origin-top border border-slate-700 pointer-events-none
            ${showToast ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 -translate-y-4'}
          `}>
            <div className="bg-green-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-inner">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" /></svg>
            </div>
            Agregado a tu canasto
          </div>

        </div>
      </div>
    </nav>
  );
}