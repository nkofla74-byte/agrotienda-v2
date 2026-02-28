'use client';

import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
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
    window.open(urlWhatsApp, '_blank');
    setIsCartOpen(false);
  };

  return (
    <>
      {/* Overlay oscuro de fondo */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Panel lateral derecho */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-slate-50 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 bg-green-900 text-white flex justify-between items-center shadow-md">
          <h2 className="text-xl font-bold flex items-center gap-2">Tu Canasta</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-white/80 hover:text-white transition text-2xl">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p>Tu canasta está vacía</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.uniqueId} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={item.imagen} alt={item.nombre} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                  <div>
                    <h5 className="font-bold text-sm text-gray-800">{item.nombre}</h5>
                    <p className="text-xs text-green-600 font-bold">{item.variantName}</p>
                    <div className="flex items-center gap-3 mt-2 bg-gray-50 rounded-full px-1 w-fit border border-gray-200">
                      <button onClick={() => updateQuantity(item.uniqueId, -1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-green-600">-</button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.uniqueId, 1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-green-600">+</button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold text-sm text-gray-700">~{formatMoney(item.precio * item.quantity)}</span>
                  <button onClick={() => removeFromCart(item.uniqueId)} className="text-red-400 text-[10px] hover:text-red-600 hover:underline">Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-medium">Total:</span>
            <span className="text-2xl font-bold text-green-900">{formatMoney(cartTotal)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition disabled:opacity-50"
          >
            Confirmar Pedido (WhatsApp)
          </button>
        </div>
      </aside>
    </>
  );
}