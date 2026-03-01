'use client';

import { useState } from 'react';

export default function UneteComoProductor() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [vereda, setVereda] = useState('');
  const [cultivo, setCultivo] = useState('');
  const [volumen, setVolumen] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre || !telefono || !vereda || !cultivo) {
      alert("Por favor completa los campos obligatorios para poder contactarte.");
      return;
    }

    const mensaje = `🚜 *NUEVO PRODUCTOR INTERESADO* 🌿\n\n¡Hola equipo de La Floresta!\n\nSoy *${nombre}*, de la vereda/municipio *${vereda}*.\n📱 *Mi WhatsApp/Teléfono es:* ${telefono}\n\nActualmente produzco/cultivo: *${cultivo}*.\n📦 *Frecuencia/Volumen:* ${volumen || 'No especificado'}\n\nMe gustaría conocer cómo podemos trabajar juntos para vender mis productos. Quedo atento.`;
    
    const urlWhatsApp = `https://wa.me/573182359277?text=${encodeURIComponent(mensaje)}`;
    
    // Usamos location.href para evitar el bloqueo de ventanas emergentes (pop-ups) en móviles
    window.location.href = urlWhatsApp;
    
    // Limpiamos el formulario (aunque la página cambiará a WhatsApp)
    setNombre('');
    setTelefono('');
    setVereda('');
    setCultivo('');
    setVolumen('');
  };

  return (
    <section id="soy-productor" className="py-24 bg-gradient-to-b from-slate-50 to-green-50 relative overflow-hidden border-t border-green-100">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row">
          
          {/* Lado de Información */}
          <div className="bg-green-600 p-10 md:p-14 text-white lg:w-5/12 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/fresnolog.jpg')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
            <div className="relative z-10">
              <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-widest uppercase mb-6 shadow-sm border border-white/10">
                Red de Campesinos
              </span>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
                ¿Cultivas en la región? <span className="text-yellow-300">Únete a nosotros.</span>
              </h2>
              <p className="text-green-50 mb-8 leading-relaxed text-lg">
                Queremos que tus cosechas lleguen directamente a más mesas, pagando lo justo por tu trabajo y sin intermediarios.
              </p>
              <ul className="space-y-5 font-medium text-green-100">
                <li className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/5">
                  <span className="bg-green-500 p-2 rounded-xl text-white shadow-inner">🤝</span> 
                  <span>Venta directa y precio justo</span>
                </li>
                <li className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/5">
                  <span className="bg-green-500 p-2 rounded-xl text-white shadow-inner">🚚</span> 
                  <span>Nosotros apoyamos la logística</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Lado del Formulario Mejorado */}
          <div className="p-10 md:p-14 lg:w-7/12 bg-white">
            <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Cuéntanos sobre ti</h3>
            <p className="text-slate-500 mb-8 text-base">Déjanos tus datos y nos pondremos en contacto contigo rápidamente.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-bold text-slate-700 mb-2">Nombre completo *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400">👤</span>
                    </div>
                    <input 
                      type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required
                      className="w-full pl-11 pr-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-medium text-slate-700"
                      placeholder="Ej: Don Carlos Pérez"
                    />
                  </div>
                </div>
                
                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="block text-sm font-bold text-slate-700 mb-2">WhatsApp / Celular *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400">📱</span>
                    </div>
                    <input 
                      type="tel" id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required
                      className="w-full pl-11 pr-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-medium text-slate-700"
                      placeholder="Ej: 300 123 4567"
                    />
                  </div>
                </div>
              </div>

              {/* Vereda */}
              <div>
                <label htmlFor="vereda" className="block text-sm font-bold text-slate-700 mb-2">Vereda o Municipio *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400">📍</span>
                  </div>
                  <input 
                    type="text" id="vereda" value={vereda} onChange={(e) => setVereda(e.target.value)} required
                    className="w-full pl-11 pr-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-medium text-slate-700"
                    placeholder="Ej: Vereda La Floresta, Fresno"
                  />
                </div>
              </div>

              {/* Cultivo */}
              <div>
                <label htmlFor="cultivo" className="block text-sm font-bold text-slate-700 mb-2">¿Qué cultivas o produces? *</label>
                <div className="relative">
                  <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                    <span className="text-slate-400">🌱</span>
                  </div>
                  <textarea 
                    id="cultivo" value={cultivo} onChange={(e) => setCultivo(e.target.value)} required
                    className="w-full pl-11 pr-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-medium text-slate-700 resize-none h-24"
                    placeholder="Ej: Tengo cultivos de aguacate hass y limón mandarino..."
                  ></textarea>
                </div>
              </div>

              {/* Frecuencia / Volumen */}
              <div>
                <label htmlFor="volumen" className="block text-sm font-bold text-slate-700 mb-2">Frecuencia o cantidad de cosecha (Opcional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-400">📦</span>
                  </div>
                  <input 
                    type="text" id="volumen" value={volumen} onChange={(e) => setVolumen(e.target.value)}
                    className="w-full pl-11 pr-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-medium text-slate-700"
                    placeholder="Ej: Saco 5 canastillas cada 15 días"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-slate-900 hover:bg-green-600 text-white font-black py-4 rounded-xl shadow-[0_10px_20px_-10px_rgba(0,0,0,0.2)] hover:shadow-green-500/30 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 mt-4 text-lg"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                Enviar información por WhatsApp
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}