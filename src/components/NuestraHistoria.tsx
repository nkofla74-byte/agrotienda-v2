// src/components/NuestraHistoria.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const IMAGENES_CARRUSEL = [
  "/fresnolog.jpg",
  "/arbolaguacate.jpg",
  "/fresnopanela.jpeg",
  "/maracuyacultivo.jpg",
  "/cultivomazorcsa.jpeg"
];

export default function NuestraHistoria() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Efecto para cambiar la imagen automáticamente cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % IMAGENES_CARRUSEL.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="nuestra-historia" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Columna de Texto (La Historia) */}
          <div className="w-full lg:w-1/2 space-y-6 z-10">
            <div className="inline-block bg-green-100 text-green-800 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider mb-2">
              Sobre La Floresta 🌿
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Del corazón de <span className="text-green-600">Fresno, Tolima</span> a tu mesa.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              En Agrotienda La Floresta no somos un supermercado más. Somos una conexión directa con las tierras fértiles del norte del Tolima. 
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Trabajamos incansablemente en la vereda La Floresta para cultivar, seleccionar y llevar los mejores alimentos a tu hogar, eliminando intermediarios para garantizarte precios justos y frescura absoluta.
            </p>
            
            <div className="pt-6 grid grid-cols-2 gap-6">
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-black text-2xl text-slate-900">100%</h4>
                <p className="text-sm font-bold text-slate-500 uppercase">Frescura Garantizada</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-black text-2xl text-slate-900">0</h4>
                <p className="text-sm font-bold text-slate-500 uppercase">Intermediarios</p>
              </div>
            </div>
          </div>

          {/* Columna del Carrusel de Imágenes */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl group">
              {IMAGENES_CARRUSEL.map((img, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Image 
                    src={img}
                    alt={`Cosecha de La Floresta ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Gradiente sutil para darle elegancia */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
              ))}

              {/* Controles manuales del carrusel */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
                {IMAGENES_CARRUSEL.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 shadow-md ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Decoración geométrica de fondo */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-100 rounded-full -z-10 blur-2xl"></div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-green-100 rounded-full -z-10 blur-2xl"></div>
          </div>

        </div>
      </div>
    </section>
  );
}