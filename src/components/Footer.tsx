'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    // Se aclaró el color de fondo a slate-800 para que no sea tan oscuro
    <footer className="bg-slate-800 text-slate-100 pt-20 pb-10 border-t-[8px] border-green-500 relative overflow-hidden">
      
      {/* Decoración de fondo suave */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-400/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Usamos un grid de 4 columnas en pantallas grandes para acomodar el mapa */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16">
          
          {/* Columna 1: Marca y Redes Sociales */}
          <div className="lg:pr-4">
            <h4 className="font-black text-3xl mb-4 flex items-center gap-2 tracking-tight text-white">
              La Floresta <span className="text-green-400">🌿</span>
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Del campo a tu mesa 🚜. Cultivamos con amor en Fresno, Tolima para llevar la mejor calidad directamente a tu hogar en Mosquera 🥑🍅.
            </p>
            
            {/* NUEVO: Botones de Redes Sociales */}
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="bg-slate-700/50 p-3 rounded-full hover:bg-green-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-green-500/50">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="bg-slate-700/50 p-3 rounded-full hover:bg-green-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-green-500/50">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/></svg>
              </a>
              <a href="https://wa.me/573182359277" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="bg-slate-700/50 p-3 rounded-full hover:bg-green-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm hover:shadow-green-500/50">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M16.75,22.16L14,19.41L15.41,18L16.75,19.34L20.84,15.25L22.25,16.66L16.75,22.16M6.62,10.79C8.06,13.62 10.38,15.93 13.21,17.38L15.41,15.18C15.68,14.9 16.08,14.82 16.43,14.94C17.55,15.31 18.76,15.51 20,15.51C20.55,15.51 21,15.96 21,16.51V20C21,20.55 20.55,21 20,21C10.61,21 3,13.39 3,4C3,3.45 3.45,3 4,3H7.5C8.05,3 8.5,3.45 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/></svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-green-400 uppercase tracking-widest flex items-center gap-2">
              Navegación 🧭
            </h4>
            <ul className="space-y-4 text-sm text-slate-300 font-medium">
              {['Inicio', 'Productos', 'Nuestra Historia', '¿Cómo pedir?'].map((item, idx) => {
                const id = item.toLowerCase().replace(/¿|\?/g, '').replace(/\s+/g, '-');
                return (
                  <li key={idx}>
                    <Link href={`#${id}`} className="group flex items-center gap-2 hover:text-white transition-colors duration-300">
                      <span className="text-green-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">▹</span>
                      <span className="transform group-hover:translate-x-2 transition-transform duration-300">{item}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Columna 3: Contacto Dinámico */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-green-400 uppercase tracking-widest flex items-center gap-2">
              Contacto 📞
            </h4>
            <ul className="space-y-6 text-sm text-slate-300">
              <li className="flex items-start gap-3 group cursor-default">
                <span className="text-2xl mt-1">📍</span>
                <div>
                  <strong className="block text-white mb-1">Punto de Origen</strong>
                  Vereda La Floresta<br/>Fresno, Tolima
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl mt-1">💬</span>
                <div>
                  <strong className="block text-white mb-1">Línea de Pedidos</strong>
                  <a href="https://wa.me/573182359277" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors duration-300 text-lg font-black tracking-wide">
                    +57 3182359277
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* NUEVA Columna 4: El Mapa Interactivo */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-lg mb-6 text-green-400 uppercase tracking-widest flex items-center gap-2">
              Nuestra Ubicación 🗺️
            </h4>
            {/* Contenedor del mapa con un marco bonito */}
            <div className="bg-slate-700/50 p-2 rounded-2xl shadow-inner border border-slate-600/50">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31766.17387431252!2d-75.0503024564254!3d5.150493649692482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e47515d18d41db3%3A0xc0fb1d7c34ef1bbd!2sFresno%2C%20Tolima!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco" 
                className="w-full h-36 md:h-40 rounded-xl grayscale hover:grayscale-0 transition-all duration-500" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de Fresno, Tolima"
              ></iframe>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center italic">El corazón de nuestra cosecha 🌱</p>
          </div>

        </div>
        
        {/* Línea Divisoria y Copyright con Créditos JRXDEVS */}
        <div className="border-t border-slate-700/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          
          <p className="text-sm text-slate-400 font-medium">
            © {new Date().getFullYear()} Agrotienda La Floresta 🌻. Todos los derechos reservados.
          </p>
          
          {/* CRÉDITOS DEL DESARROLLADOR */}
          <p className="text-sm text-slate-400 font-medium flex items-center gap-1.5">
            Sitio web creado por 
            <a href="#" className="text-green-400 font-black tracking-wider hover:text-white transition-colors bg-green-500/10 hover:bg-green-500 px-2 py-0.5 rounded-md">
              JRXDEVS
            </a> 🚀
          </p>

          <Link href="/admin" className="px-4 py-1.5 rounded-full border border-slate-600 text-[10px] text-slate-400 hover:text-white hover:border-slate-400 hover:bg-slate-700 transition-all uppercase font-bold tracking-widest mt-2 md:mt-0 flex items-center gap-1">
            Panel Admin 🔐
          </Link>
          
        </div>
      </div>
    </footer>
  );
}