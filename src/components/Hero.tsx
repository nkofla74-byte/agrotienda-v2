'use client';

import { useEffect, useState } from 'react';

export default function Hero() {
  const [deadlineText, setDeadlineText] = useState("Calculando fechas...");
  const [esUrgente, setEsUrgente] = useState(false);

  useEffect(() => {
    const ahora = new Date();
    const diaSemana = ahora.getDay(); 
    const hora = ahora.getHours();
    
    if (diaSemana === 4 || diaSemana === 5 || diaSemana === 6 || (diaSemana === 0 && hora < 18)) {
        setDeadlineText("Haz tu pedido antes del DOMINGO 6:00 PM. Recibes el Martes/Miércoles.");
        if (diaSemana === 0) setEsUrgente(true);
    } else {
        setDeadlineText("Haz tu pedido antes del MIÉRCOLES 6:00 PM. Recibes el Viernes/Sábado.");
        if (diaSemana === 3) setEsUrgente(true);
    }
  }, []);

  return (
    <>
      <header id="inicio" className="relative pt-32 pb-24 text-center min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-green-900">
        {/* Fondo oscuro temporal mientras implementamos el slider dinámico si lo deseas luego */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-green-900/80 to-green-950/90"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-20">
          {/* Banner de Cierre de Pedidos */}
          <div className="mb-8 mx-auto max-w-2xl transform hover:scale-105 transition-transform duration-300 cursor-default">
            <div className={`backdrop-blur-md border-l-4 shadow-2xl rounded-r-xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-left ${esUrgente ? 'bg-red-50 border-red-500' : 'bg-white/90 border-orange-500'}`}>
              <div className={`p-2 rounded-full ${esUrgente ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M17 13.9L16.3 15.2L11 12.3V7H12.5V11.4L17 13.9Z"/></svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-base uppercase tracking-wide flex items-center gap-2">
                  Próximo Cierre de Pedidos
                  {esUrgente && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">¡HOY!</span>}
                </h4>
                <p className="text-gray-600 text-sm font-medium mt-1" dangerouslySetInnerHTML={{ __html: deadlineText }}></p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white text-sm font-bold mb-8 tracking-wide uppercase shadow-lg animate-bounce">
             Norte del Tolima 🇨🇴
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
            El Sabor del Campo <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-yellow-300 drop-shadow-sm">tolimense en tu mesa.</span>
          </h1>
          
          <p className="text-white/90 mb-12 text-xl md:text-2xl max-w-4xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Honramos las manos campesinas del Municipio <strong className="text-yellow-300 font-bold">Fresno</strong>. 
            Sin intermediarios. De la vereda La Floresta directo a tu hogar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <a href="#productos" className="inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white px-10 py-5 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-green-500/50 backdrop-blur-sm">
              Pedir Mercado
            </a>
          </div>
        </div>
      </header>

      {/* Sección: Cómo Funciona */}
      <section id="como-funciona" className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg text-white font-bold">1</div>
              <h3 className="text-xl font-bold mb-2">Pides por aquí</h3>
              <p className="text-green-100 text-sm">Armas tu pedido desde nuestro sitio web, navegas, escoges los productos y nos envías el pedido por WhatsApp.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-white text-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg font-bold">2</div>
              <h3 className="text-xl font-bold mb-2">Te lo llevamos</h3>
              <p className="text-green-100 text-sm">Una vez recibido tu pedido validamos disponibilidad y lo llevamos a la puerta de tu casa. Entregas: <strong className="text-yellow-300">Miércoles y Sábados</strong>.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg font-bold">3</div>
              <h3 className="text-xl font-bold mb-2">Verificas y Pagas</h3>
              <p className="text-green-100 text-sm">Recibes, revisas calidad y pagas por Nequi, Daviplata, Bancolombia o en Efectivo.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}