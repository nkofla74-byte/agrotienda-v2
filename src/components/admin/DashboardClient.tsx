'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

// IMPORTAMOS LOS COMPONENTES MODULARES
import TabInventario from './TabInventario';
import TabCrearProducto from './TabCrearProducto';

export default function DashboardClient({ userEmail }: { userEmail: string }) {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const loadPedidos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setPedidos(data);
    setLoading(false);
  };

  const marcarDespachado = async (id: number) => {
    if (!confirm('¿Confirmas que este pedido ya fue enviado?')) return;
    const { error } = await supabase.from('pedidos').update({ estado: 'despachado' }).eq('id', id);
    if (!error) loadPedidos();
  };

  const formatMoney = (amount: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

  const escapeHTML = (str: string) => {
    if (!str) return '';
    return str.toString().replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]!);
  };

  useEffect(() => {
    if (activeTab === 'pedidos') loadPedidos();
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen pt-24">
      {/* Header del Dashboard */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Panel de Control</h1>
            <p className="text-sm font-bold text-green-600">Admin: {userEmail}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank" className="bg-slate-100 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200 transition">Ver Tienda</a>
          <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition">Salir</button>
        </div>
      </div>

      {/* Navegación por Pestañas */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('pedidos')} className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm md:text-base shadow-sm transition whitespace-nowrap ${activeTab === 'pedidos' ? 'bg-green-600 text-white' : 'bg-white text-slate-600 border border-gray-200 hover:bg-slate-50'}`}>Pedidos</button>
        <button onClick={() => setActiveTab('crear')} className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm md:text-base shadow-sm transition whitespace-nowrap ${activeTab === 'crear' ? 'bg-green-600 text-white' : 'bg-white text-slate-600 border border-gray-200 hover:bg-slate-50'}`}>Nuevo Producto</button>
        <button onClick={() => setActiveTab('inventario')} className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm md:text-base shadow-sm transition whitespace-nowrap ${activeTab === 'inventario' ? 'bg-green-600 text-white' : 'bg-white text-slate-600 border border-gray-200 hover:bg-slate-50'}`}>Inventario</button>
      </div>

      {/* RENDERIZADO CONDICIONAL DE PESTAÑAS */}
      
      {/* 1. Vista de Pedidos */}
      {activeTab === 'pedidos' && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                  <tr>
                    <th className="p-4 border-b">Fecha</th>
                    <th className="p-4 border-b">Cliente</th>
                    <th className="p-4 border-b">Dirección</th>
                    <th className="p-4 border-b">Detalle</th>
                    <th className="p-4 border-b text-right">Total</th>
                    <th className="p-4 border-b text-center">Estado</th>
                    <th className="p-4 border-b text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={7} className="p-8 text-center text-gray-400">Cargando pedidos...</td></tr>
                  ) : pedidos.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-gray-500 font-medium">No hay pedidos registrados.</td></tr>
                  ) : (
                    pedidos.map(p => {
                      const fecha = new Date(p.created_at).toLocaleString('es-CO', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
                      const safeNombre = escapeHTML(p.cliente_nombre || 'Anónimo');
                      const safeDir = escapeHTML(p.cliente_direccion || '-');
                      
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 text-xs text-gray-500 whitespace-nowrap">{fecha}</td>
                          <td className="p-4 font-bold text-gray-800">{safeNombre}</td>
                          <td className="p-4 text-xs max-w-[150px] truncate" title={safeDir}>{safeDir}</td>
                          <td className="p-4 text-xs text-gray-600">
                            {Array.isArray(p.detalle_pedido) ? p.detalle_pedido.map((i: any, idx: number) => (
                              <div key={idx}>• <b className="text-green-700">{i.quantity}x</b> {escapeHTML(i.nombre)}</div>
                            )) : <span className="italic">Sin detalles</span>}
                          </td>
                          <td className="p-4 text-right font-mono font-bold text-green-700">{formatMoney(p.total)}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${p.estado === 'pendiente' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                              {p.estado}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {p.estado === 'pendiente' ? (
                              <button onClick={() => marcarDespachado(p.id)} className="bg-white border border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm">
                                DESPACHAR
                              </button>
                            ) : (
                              <span className="text-green-500 text-lg">✔</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Vista del Creador de Productos */}
      {activeTab === 'crear' && <TabCrearProducto />}
      
      {/* 3. Vista de Inventario */}
      {activeTab === 'inventario' && <TabInventario />}
    </div>
  );
}