'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
// Importamos la nueva función de eliminación definitiva
import { eliminarProductoDefinitivamente, actualizarPrecioVariante, toggleStockProducto } from '@/app/actions/adminActions';
import { Producto } from '@/types'; 

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

  const handleEditPrice = async (varianteId: number, precioActual: number, unidad: string) => {
    const nuevoPrecioStr = prompt(`✏️ Ingresa el nuevo precio para (${unidad}):`, precioActual.toString());
    if (!nuevoPrecioStr) return;
    
    const nuevoPrecio = parseFloat(nuevoPrecioStr);
    if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
      alert("❌ Por favor ingresa un precio válido.");
      return;
    }

    setActionLoading(varianteId); 
    const res = await actualizarPrecioVariante(varianteId, nuevoPrecio);
    if (res.success) {
      await loadInventario(); 
    } else {
      alert("Error al actualizar precio: " + res.error);
    }
    setActionLoading(null); 
  };

  const handleToggleStock = async (productoId: number, tieneStock: boolean) => {
    setActionLoading(productoId);
    const res = await toggleStockProducto(productoId, tieneStock);
    if (res.success) {
      await loadInventario(); 
    } else {
      alert("Error: " + res.error);
    }
    setActionLoading(null);
  };

  // MODIFICADO: Ahora confirma eliminación total
  const handleDelete = async (id: number) => {
    if (!confirm("🚨 ¿ELIMINAR DEFINITIVAMENTE?\nEsta acción no se puede deshacer. El producto y sus precios desaparecerán totalmente de la base de datos.")) return;
    
    setActionLoading(id);
    const res = await eliminarProductoDefinitivamente(id);
    if (res.success) {
      await loadInventario();
    } else {
      alert("No se pudo eliminar: El producto podría estar asociado a un pedido ya existente.");
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
          {productos.map(p => {
            const tieneStock = p.variantes?.some((v: any) => v.stock_disponible);

            return (
              <div key={p.id} className={`bg-white p-4 rounded-2xl shadow-sm border ${tieneStock ? 'border-gray-100' : 'border-red-200 bg-red-50/20'} hover:shadow-md transition flex flex-col h-full relative group`}>
                <div className="flex items-start gap-3 mb-3">
                  <img 
                    src={p.imagen_url || '/fresnolog.jpg'}
                    alt={p.nombre}
                    className={`w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-200 ${!tieneStock && 'grayscale opacity-60'}`} 
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1 flex items-center gap-1">
                      {p.es_canasta && <span className="text-orange-500" title="Canasta">🧺</span>}
                      {p.nombre}
                    </h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${tieneStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {tieneStock ? 'Disponible' : 'Agotado'}
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
                    <div key={v.id} className="flex justify-between items-center text-gray-600 font-medium group/var border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                      <span className={v.stock_disponible ? '' : 'line-through text-red-400'}>{v.unidad}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-green-700">{formatMoney(v.precio)}</span>
                        <button 
                          onClick={() => handleEditPrice(v.id, v.precio, v.unidad)}
                          disabled={actionLoading === v.id}
                          className="text-blue-500 hover:text-blue-700 transition p-1 bg-blue-50 rounded-md hover:bg-blue-100"
                          title="Editar Precio"
                        >
                          {actionLoading === v.id ? '⏳' : '✏️'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button 
                    onClick={() => handleToggleStock(p.id, tieneStock)} 
                    disabled={actionLoading === p.id}
                    className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${tieneStock ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                  >
                    {actionLoading === p.id ? '...' : (tieneStock ? 'Agotar' : 'Reabastecer')}
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)} 
                    disabled={actionLoading === p.id}
                    className="flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === p.id ? '...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}