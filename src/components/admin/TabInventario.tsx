'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toggleEstadoProducto, archivarProducto } from '@/app/actions/adminActions';
import { Producto } from '@/types'; // Importamos el tipo

export default function TabInventario() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const supabase = createClient();

  const loadInventario = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('productos')
      .select('*, variantes(*)')
      .order('created_at', { ascending: false });
    
    if (!error && data) setProductos(data as Producto[]);
    setLoading(false);
  };

  useEffect(() => {
    loadInventario();
  }, []);

  const handleToggle = async (id: number, estadoActual: boolean) => {
    setActionLoading(id); // Bloqueamos los botones de este producto
    const res = await toggleEstadoProducto(id, estadoActual);
    if (res.success) {
      await loadInventario(); // Recargamos para ver el cambio
    } else {
      alert("Error: " + res.error);
    }
    setActionLoading(null); // Desbloqueamos
  };

  const handleDelete = async (id: number) => {
    if (!confirm("⚠️ ¿Archivar este producto/canasta?\nDesaparecerá de la tienda pero se mantendrá en el historial de base de datos.")) return;
    setActionLoading(id);
    const res = await archivarProducto(id);
    if (res.success) {
      await loadInventario();
    } else {
      alert("Error al archivar: " + res.error);
    }
    setActionLoading(null);
  };

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

  if (loading) {
    return <div className="p-10 text-center text-green-600 font-bold animate-pulse">Cargando inventario...</div>;
  }

  return (
    <div className="animate-in fade-in duration-300">
      {productos.length === 0 ? (
        <p className="bg-white p-10 rounded-2xl border border-gray-100 text-center text-gray-500 shadow-sm">Inventario vacío.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map(p => (
            <div key={p.id} className={`bg-white p-4 rounded-2xl shadow-sm border ${p.activo ? 'border-gray-100' : 'border-red-100 bg-red-50/30'} hover:shadow-md transition flex flex-col h-full relative group`}>
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src={p.imagen_url || '/vite.svg'} 
                  alt={p.nombre}
                  className={`w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-200 ${!p.activo && 'grayscale opacity-60'}`} 
                />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1 flex items-center gap-1">
                    {p.es_canasta && <span className="text-orange-500" title="Canasta">🧺</span>}
                    {p.nombre}
                  </h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${p.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.activo ? 'Visible' : 'Oculto'}
                  </span>
                </div>
              </div>

              <div className="flex-1 bg-gray-50 rounded-xl p-3 mb-4 text-xs space-y-2 overflow-hidden border border-gray-100">
                {p.descripcion && (
                  <p className="italic text-gray-500 mb-2 border-b border-gray-200 pb-2 line-clamp-2" title={p.descripcion}>
                    {p.descripcion}
                  </p>
                )}
                {p.variantes?.map((v: any) => (
                  <div key={v.id} className="flex justify-between text-gray-600 font-medium">
                    <span>{v.unidad}</span>
                    <span className="font-mono font-bold text-green-700">{formatMoney(v.precio)}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-auto">
                <button 
                  onClick={() => handleToggle(p.id, p.activo)} 
                  disabled={actionLoading === p.id}
                  className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${p.activo ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                >
                  {actionLoading === p.id ? 'Cargando...' : (p.activo ? 'Ocultar' : 'Mostrar')}
                </button>
                <button 
                  onClick={() => handleDelete(p.id)} 
                  disabled={actionLoading === p.id}
                  className="flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === p.id ? '...' : 'Archivar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}