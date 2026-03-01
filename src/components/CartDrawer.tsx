'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link'; // <-- 1. Importamos Link para la navegación

export default function CartDrawer() {
  // Importamos la nueva función clearCart
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // (Opcional a futuro: Cambiar estos prompt por un formulario modal bonito)
    const nombre = prompt("👤 Por favor, ingresa tu Nombre Completo para el pedido:");
    if (!nombre || nombre.trim() === "") return; 

    const direccion = prompt("📍 Ingresa tu Dirección de Entrega (Conjunto/Torre/Apto):");
    if (!direccion || direccion.trim() === "") return;

    let message = `¡Hola amigos de La Floresta! 👋\n\nSoy *${nombre}*. Me gustaría pedir:\n\n`;
    cart.forEach(item => {
      message += `✅ *${item.quantity} x ${item.nombre}* - ${item.variantName}\n   └ Ref: ${formatMoney(item.precio * item.quantity)}\n`;
    });
    message += `\n💰 *VALOR APROXIMADO: ${formatMoney(cartTotal)}*\n_(Entiendo que este valor es una referencia)_\n`;
    message += `\n📍 *Dirección:* ${direccion}\n🤝 Pago Contra Entrega.`;

    const urlWhatsApp = `https://wa.me/573182359277?text=${encodeURIComponent(message)}`;
    
    // 1. Abrimos WhatsApp
    window.open(urlWhatsApp, '_blank');
    
    // 2. Cerramos el panel lateral
    setIsCartOpen(false);
    
    // 3. VACIAR EL CARRITO AUTOMÁTICAMENTE
    // Le ponemos un pequeño retraso de medio segundo para que el carrito 
    // no se vea desaparecer de golpe mientras el panel se está deslizando para cerrarse.
    setTimeout(() => {
      clearCart();
    }, 500);
  };

  return (
    <>
      {/* Overlay oscuro de fondo con desenfoque premium */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-50 transition-all backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Panel lateral derecho (UI Mejorada) */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-slate-50 shadow-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header del Carrito */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-green-500/10 pointer-events-none"></div>
          <h2 className="text-xl font-black flex items-center gap-3 relative z-10">
            <span className="text-2xl">🛒</span> Mi Canasto
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500 hover:text-white transition-colors relative z-10"
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <span className="text-6xl grayscale opacity-50">🧺</span>
              <p className="font-medium text-lg">Tu canasto está esperando por ti.</p>
              
              {/* 2. Modificamos el botón por un Link que apunta a la sección de productos */}
              <Link 
                href="#productos" 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-2 bg-green-100 text-green-700 font-bold rounded-full hover:bg-green-200 transition-colors text-center"
              >
                Ir a comprar
              </Link>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.uniqueId} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                    <Image 
                      src={item.imagen} 
                      alt={item.nombre} 
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-800 leading-tight mb-1">{item.nombre}</h5>
                    <p className="text-xs text-green-600 font-bold mb-2 bg-green-50 w-fit px-2 py-0.5 rounded-md">{item.variantName}</p>
                    
                    {/* Controles de Cantidad Modernos */}
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-200 w-fit">
                      <button 
                        onClick={() => updateQuantity(item.uniqueId, -1)} 
                        className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-slate-500 hover:text-green-600 hover:shadow-sm transition-all"
                      >
                        -
                      </button>
                      <span className="text-xs font-black w-4 text-center text-slate-700">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.uniqueId, 1)} 
                        className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-slate-500 hover:text-green-600 hover:shadow-sm transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full gap-4">
                  <button 
                    onClick={() => removeFromCart(item.uniqueId)} 
                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    title="Eliminar producto"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
                  </button>
                  <span className="font-black text-sm text-slate-800 tracking-tight">
                    {formatMoney(item.precio * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer del Carrito (Checkout) */}
        <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-end mb-6">
            <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total estimado</span>
            <span className="text-3xl font-black text-green-600 tracking-tight">{formatMoney(cartTotal)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="relative w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl shadow-lg shadow-green-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3 overflow-hidden group"
          >
            {/* Efecto de brillo al pasar el mouse */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            
            <svg className="w-6 h-6 fill-current relative z-10" viewBox="0 0 24 24"><path d="M16.75,22.16L14,19.41L15.41,18L16.75,19.34L20.84,15.25L22.25,16.66L16.75,22.16M6.62,10.79C8.06,13.62 10.38,15.93 13.21,17.38L15.41,15.18C15.68,14.9 16.08,14.82 16.43,14.94C17.55,15.31 18.76,15.51 20,15.51C20.55,15.51 21,15.96 21,16.51V20C21,20.55 20.55,21 20,21C10.61,21 3,13.39 3,4C3,3.45 3.45,3 4,3H7.5C8.05,3 8.5,3.45 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/></svg>
            <span className="relative z-10">Enviar Pedido</span>
          </button>
          <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-widest">
            Pago seguro contra entrega 🤝
          </p>
        </div>
      </aside>
    </>
  );
}