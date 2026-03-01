'use client';

// Reemplaza estas rutas con las imágenes reales de tu finca/productos
const IMAGES = [
  '/window.svg', 
  '/globe.svg',  
  '/file.svg',
  '/vercel.svg',
  '/next.svg'
];

// Duplicamos el arreglo para que la cinta transportadora sea infinita y fluida
const MARQUEE_IMAGES = [...IMAGES, ...IMAGES];

export default function AboutUs() {
  return (
    <section id="nosotros" className="pt-16 bg-white border-y border-gray-100 overflow-hidden">
      {/* 1. TEXTO EN LA PARTE SUPERIOR */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-green-900 mb-6">
          Sobre La Floresta
        </h2>
        <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
          <p>
            Somos una iniciativa nacida del amor por el campo. Llevamos la frescura y la calidad de las cosechas directamente desde <strong>Fresno, Tolima</strong> hasta la puerta de tu casa, sin intermediarios.
          </p>
          <p>
            Nuestro compromiso es con el comercio justo, apoyando a nuestros campesinos locales y garantizando que a tu mesa lleguen frutas y verduras cultivadas con dedicación y respeto por la tierra. Cada entrega los miércoles y sábados es un pedacito de nuestro campo en tu hogar.
          </p>
        </div>
        <div className="mt-8">
          <span className="inline-block bg-green-50 text-green-700 font-bold px-6 py-3 rounded-full text-sm shadow-sm border border-green-100">
            🌱 100% Fresco y Natural
          </span>
        </div>
      </div>

      {/* 2. CINTA TRANSPORTADORA EN LA PARTE INFERIOR */}
      <div className="relative w-full overflow-hidden bg-slate-50 border-t border-gray-100 py-10 flex items-center">
        {/* Contenedor animado */}
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] transition-all cursor-pointer">
          {MARQUEE_IMAGES.map((src, index) => (
            <div 
              key={index} 
              className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 mx-4 bg-white rounded-3xl shadow-sm border border-gray-200 p-6 flex items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <img 
                src={src} 
                alt={`Imagen La Floresta ${index}`} 
                className="max-w-full max-h-full object-contain opacity-80"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. ESTILOS DE LA ANIMACIÓN (Inyectados de forma segura) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}} />
    </section>
  );
}