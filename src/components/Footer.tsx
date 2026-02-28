import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 border-t-[6px] border-green-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h4 className="font-bold text-2xl mb-6 flex items-center gap-2">La Floresta</h4>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Conexión directa entre la fertilidad de las tierras de Fresno y tu hogar.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-green-400">Navegación</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="#inicio" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="#productos" className="hover:text-white transition-colors">Hacer Mercado</Link></li>
              <li><Link href="#como-funciona" className="hover:text-white transition-colors">¿Cómo pedir?</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-green-400">Contáctanos</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <span>Vereda La Floresta<br/>Fresno, Tolima</span>
              </li>
              <li className="flex items-center gap-3 group">
                <a href="https://wa.me/573182359277" target="_blank" rel="noopener noreferrer" className="hover:text-white transition cursor-pointer font-bold text-green-400">
                  +57 3182359277
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center flex flex-col items-center">
          <p className="text-xs text-gray-400">© 2026 Agrotienda La Floresta. Hecho con el 💚 en el norte del Tolima.</p>
          <div className="mt-4">
            <Link href="/admin" className="text-[10px] text-gray-600 hover:text-green-500 transition opacity-50 hover:opacity-100 uppercase font-bold tracking-widest">
              Acceso Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}