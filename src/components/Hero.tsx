'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const GALERIA_INFINITA = [

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

      {/* 3. CÓMO FUNCIONA */}
      <section id="cómo-pedir" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-center">
            
            {/* Tarjeta 1: WhatsApp */}
            <div className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800/80 hover:border-green-500/30 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)] active:scale-95 cursor-default">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg text-white transition-transform duration-300 transform rotate-3 group-hover:rotate-0 group-hover:scale-110">
                <svg className="w-9 h-9 fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zM223.9 414.9c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.1l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Pides por aquí</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Armas tu pedido desde nuestro sitio web, navegas, escoges los productos y nos envías el pedido por WhatsApp.</p>
            </div>

            {/* Tarjeta 2: Truck */}
            <div className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800/80 hover:border-white/30 hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)] active:scale-95 cursor-default">
              <div className="w-16 h-16 bg-white text-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-transform duration-300 transform -rotate-3 group-hover:rotate-0 group-hover:scale-110">
                <svg className="w-9 h-9 fill-current" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M48 112c-26.5 0-48 21.5-48 48V352c0 26.5 21.5 48 48 48H64c0 35.3 28.7 64 64 64s64-28.7 64-64H384c0 35.3 28.7 64 64 64s64-28.7 64-64h32c26.5 0 48-21.5 48-48V267.5c0-17-6.7-33.3-18.7-45.3L504 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h42.7c5.7 0 11.1 2.2 15.1 6.2l58.5 58.5c4 4 6.2 9.4 6.2 15.1V320H416V160zm-288 288c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Te lo llevamos</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Una vez recibido tu pedido validamos disponibilidad y lo llevamos a la puerta de tu casa. Entregas: <strong className="text-yellow-300">Miércoles y Sábados</strong>.</p>
            </div>

            {/* Tarjeta 3: Hand Holding Dollar */}
            <div className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800/80 hover:border-green-500/30 hover:shadow-[0_20px_40px_-15px_rgba(34,197,94,0.15)] active:scale-95 cursor-default">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg text-white transition-transform duration-300 transform rotate-3 group-hover:rotate-0 group-hover:scale-110">
                <svg className="w-9 h-9 fill-current" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M312 24V34.5c6.4 1.2 12.6 2.7 18.2 4.2c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17c-10.9-2.9-21.1-4.9-30.2-5c-7.3-.1-14.7 1.7-19.4 4.4c-2.1 1.3-3.1 2.4-3.5 3c-.3 .5-.7 1.2-.7 2.8c0 .3 0 .5 0 .6c.2 .2 .9 1.2 3.3 2.6c5.8 3.5 14.4 6.2 27.4 10.1l.9 .3c11.1 3.3 25.9 7.8 37.9 15.3c13.7 8.6 26.1 22.9 26.4 44.9c.3 22.5-11.4 38.9-26.7 48.5c-6.7 4.1-13.9 7-21.3 8.8V232c0 13.3-10.7 24-24 24s-24-10.7-24-24v-9.5c-6.4-1.2-12.6-2.7-18.2-4.2c-12.8-3.4-20.4-16.6-17-29.4s16.6-20.4 29.4-17c10.9 2.9 21.1 4.9 30.2 5c7.3 .1 14.7-1.7 19.4-4.4c2.1-1.3 3.1-2.4 3.5-3c.3-.5 .7-1.2 .7-2.8c0-.3 0-.5 0-.6c-.2-.2-.9-1.2-3.3-2.6c-5.8-3.5-14.4-6.2-27.4-10.1l-.9-.3c-11.1-3.3-25.9-7.8-37.9-15.3c-13.7-8.6-26.1-22.9-26.4-44.9c-.3-22.5 11.4-38.9 26.7-48.5c6.7-4.1 13.9-7 21.3-8.8V24c0-13.3 10.7-24 24-24s24 10.7 24 24zM568.2 336.3c13.1 17.8 9.3 42.8-8.5 55.9L433.1 485.5c-23.4 17.2-51.6 26.5-80.7 26.5H192 32c-17.7 0-32-14.3-32-32V416c0-17.7 14.3-32 32-32H68.8l44.9-36c22.7-18.2 50.9-28 80-28H272h16 64c17.7 0 32 14.3 32 32s-14.3 32-32 32H288 272c-8.8 0-16 7.2-16 16s7.2 16 16 16H392.6l119.7-88.2c17.8-13.1 42.8-9.3 55.9 8.5zM193.6 384l0 0-.9 0c.3 0 .6 0 .9 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Verificas y Pagas</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Recibes, revisas calidad y pagas por Nequi, Daviplata, Bancolombia o en Efectivo.</p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}