'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const GALERIA_INFINITA = [
  "/canasta.jpg",
  "/aguacatehas.jpeg",
  "/platano.jpg",
  "/panela.jpeg",
  "/cafe.webp",
  "/maiztierno.jpg",
  "/maraculla.jpeg",
  "/yuca.jpeg"
];

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
      {/* 1. SECCIÓN HERO */}
      <header id="inicio" className="relative pt-32 pb-24 text-center min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
        
        <div className="absolute inset-0 z-0">
          <Image
            src="/fresnolog.jpg" 
            alt="Paisaje de Fresno, Tolima"
            fill
            priority 
            className="object-cover" 
          />
        </div>

        <div className="absolute inset-0 z-10 bg-green-950/80 backdrop-blur-[1px]"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-20 flex flex-col items-center">
          
          <div className="mb-8 mx-auto max-w-2xl transform hover:scale-105 transition-transform duration-300 cursor-default">
            <div className={`backdrop-blur-md border-l-4 shadow-2xl rounded-r-xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-left ${esUrgente ? 'bg-red-50/95 border-red-500' : 'bg-white/95 border-orange-500'}`}>
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

          <div className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-8 tracking-wide uppercase shadow-lg">
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
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-4">
            <a href="#productos" className="inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white px-10 py-5 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-green-500/50 backdrop-blur-sm">
              Pedir Mercado
            </a>
          </div>
        </div>
      </header>

      {/* 2. CINTA TRANSPORTADORA */}
      <div className="bg-white py-8 border-b border-gray-100 relative overflow-hidden flex">
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex animate-scroll-infinite">
          {[...GALERIA_INFINITA, ...GALERIA_INFINITA].map((img, index) => (
            <div key={index} className="relative w-64 h-40 md:w-80 md:h-48 mx-3 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm group">
              <Image 
                src={img} 
                alt={`Productos de la finca ${index}`}
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                sizes="(max-width: 768px) 250px, 320px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. CÓMO FUNCIONA (Actualizado con Tarjetas Animadas y UX Móvil) */}
      <section id="como-funciona" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        
        {/* Decoración de fondo sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-green-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              ¿Cómo realizar tu <span className="text-green-400">pedido</span>?
            </h2>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Llevar la frescura de La Floresta hasta la puerta de tu casa en Mosquera es un proceso rápido y sencillo. Sigue estos tres pasos para disfrutar del campo en tu mesa:
            </p>
          </div>

          {/* Grid modificado: Quitamos 'divide' y agregamos 'gap' amplio para separar las tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-center">
            
            {/* Tarjeta 1 */}
            <div className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800/80 hover:border-green-500/30 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)] active:scale-95 cursor-default">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg text-white font-black transition-transform duration-300 transform rotate-3 group-hover:rotate-0 group-hover:scale-110">1</div>
              <h3 className="text-xl font-bold mb-3 text-white">Pides por aquí</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Armas tu pedido desde nuestro sitio web, navegas, escoges los productos y nos envías el pedido por WhatsApp.</p>
            </div>

            {/* Tarjeta 2 */}
            <div className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800/80 hover:border-white/30 hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)] active:scale-95 cursor-default">
              <div className="w-16 h-16 bg-white text-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg font-black transition-transform duration-300 transform -rotate-3 group-hover:rotate-0 group-hover:scale-110">2</div>
              <h3 className="text-xl font-bold mb-3 text-white">Te lo llevamos</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Una vez recibido tu pedido validamos disponibilidad y lo llevamos a la puerta de tu casa. Entregas: <strong className="text-yellow-300">Miércoles y Sábados</strong>.</p>
            </div>

            {/* Tarjeta 3 */}
            <div className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800/80 hover:border-green-500/30 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)] active:scale-95 cursor-default">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg text-white font-black transition-transform duration-300 transform rotate-3 group-hover:rotate-0 group-hover:scale-110">3</div>
              <h3 className="text-xl font-bold mb-3 text-white">Verificas y Pagas</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Recibes, revisas calidad y pagas por Nequi, Daviplata, Bancolombia o en Efectivo.</p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}