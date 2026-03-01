'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Solo lo usamos para cargar los combos/categorías iniciales
import { crearProductoAction } from '@/app/actions/adminActions';
import { Categoria, Producto } from '@/types'; // Importando los tipos que creamos

export default function TabCrearProducto() {
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productosActivos, setProductosActivos] = useState<Producto[]>([]);

  // Estados del formulario
  const [isBasket, setIsBasket] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);

  // Estados dinámicos
  const [variantes, setVariantes] = useState([{ unidad: 'Libra', precio: '' }]);
  const [basketIngredients, setBasketIngredients] = useState<{nombre: string, qty: number}[]>([]);
  const [basketSelect, setBasketSelect] = useState('');
  const [basketQty, setBasketQty] = useState(1);

  // Carga inicial de datos de referencia
  useEffect(() => {
    const supabase = createClient();
    const cargarDatos = async () => {
      const { data: catData } = await supabase.from('categorias').select('*');
      if (catData) {
        setCategorias(catData as Categoria[]);
        if (catData.length > 0) setCategoriaId(catData[0].id.toString());
      }
      const { data: prodData } = await supabase.from('productos').select('id, nombre').eq('activo', true).order('nombre');
      if (prodData) setProductosActivos(prodData as Producto[]);
    };
    cargarDatos();
  }, []);

  // --- MANEJO DE ESTADOS (Igual a tu código original) ---
  const addVariant = () => setVariantes([...variantes, { unidad: '', precio: '' }]);
  const removeVariant = (index: number) => setVariantes(variantes.filter((_, i) => i !== index));
  const updateVariant = (index: number, field: string, value: string) => {
    const nuevas = [...variantes];
    nuevas[index] = { ...nuevas[index] as any, [field]: value };
    setVariantes(nuevas);
  };

  const addIngredient = () => {
    if (!basketSelect || basketQty < 1) return;
    setBasketIngredients([...basketIngredients, { nombre: basketSelect, qty: basketQty }]);
    setBasketSelect('');
    setBasketQty(1);
  };
  const removeIngredient = (index: number) => setBasketIngredients(basketIngredients.filter((_, i) => i !== index));

  const handleIsBasketChange = (checked: boolean) => {
    setIsBasket(checked);
    setVariantes([{ unidad: checked ? 'Canasta' : 'Libra', precio: '' }]);
  };

  // --- ENVÍO DEL FORMULARIO USANDO SERVER ACTIONS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBasket && basketIngredients.length === 0) return alert("Una canasta debe tener al menos un producto.");
    if (variantes.some(v => !v.unidad || !v.precio)) return alert("Completa todas las variantes.");
    
    // (Opcional) Más adelante cambiaremos este confirm() por un Modal moderno
    if (!confirm(`¿Crear ${isBasket ? 'Canasta' : 'Producto'} "${nombre}"?`)) return;

    setLoading(true);
    
    // Preparamos la descripción final
    const descripcionFinal = isBasket 
      ? "Contiene: " + basketIngredients.map(i => `${i.qty}x ${i.nombre}`).join(', ')
      : descripcion;

    // Usamos FormData nativo de la web para poder enviar el archivo junto con los datos
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcionFinal);
    formData.append('categoria_id', categoriaId);
    formData.append('es_canasta', String(isBasket));
    formData.append('variantes', JSON.stringify(variantes)); // Convertimos array a string JSON
    if (imagen) formData.append('imagen', imagen);

    // Llamamos a la Server Action
    const response = await crearProductoAction(formData);

    if (response.success) {
      alert("✅ Guardado exitosamente"); // Cambiaremos esto por Sonner/Toast luego
      // Resetear formulario
      setNombre(''); setDescripcion(''); setImagen(null); setBasketIngredients([]); setIsBasket(false);
      setVariantes([{ unidad: 'Libra', precio: '' }]);
      const fileInput = document.getElementById('prod-img') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } else {
      alert("Error al guardar: " + response.error);
    }
    
    setLoading(false);
  };

  // El Renderizado JSX se mantiene exactamente igual que tu diseño original
  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
        <h2 className="text-2xl font-black text-slate-800 mb-6">Agregar Nuevo Item</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Toggle Canasta */}
          <div className="flex items-center gap-3 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isBasket} onChange={(e) => handleIsBasketChange(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              <span className="ml-3 text-sm font-bold text-orange-900">¿Es una Canasta / Combo?</span>
            </label>
          </div>

          <input type="text" placeholder="Nombre (ej: Aguacate Hass o Canasta Familiar)" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 transition" required />
          
          {!isBasket ? (
            <textarea placeholder="Descripción breve del producto..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 transition" rows={2} />
          ) : (
            <div className="bg-orange-50/30 p-5 rounded-xl border border-orange-200">
              <h3 className="font-bold text-orange-800 text-sm mb-3 flex items-center gap-2">🧺 Armar Canasta</h3>
              <div className="flex gap-2 mb-4">
                <select value={basketSelect} onChange={(e) => setBasketSelect(e.target.value)} className="flex-1 p-2.5 border border-gray-200 rounded-lg text-sm bg-white outline-none">
                  <option value="">Selecciona un producto...</option>
                  {productosActivos.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                </select>
                <input type="number" value={basketQty} onChange={(e) => setBasketQty(parseInt(e.target.value))} className="w-20 p-2.5 border border-gray-200 rounded-lg text-sm text-center outline-none" min="1" />
                <button type="button" onClick={addIngredient} className="bg-orange-500 text-white px-4 rounded-lg hover:bg-orange-600 transition font-bold">+</button>
              </div>
              <ul className="space-y-2 text-sm bg-white p-3 rounded-lg border border-orange-100 min-h-[60px]">
                {basketIngredients.length === 0 ? <li className="text-gray-400 italic text-center text-xs py-2">Agrega productos aquí...</li> : basketIngredients.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-orange-50 text-orange-900 px-3 py-2 rounded-md font-medium">
                    <span><b>{item.qty}x</b> {item.nombre}</span>
                    <button type="button" onClick={() => removeIngredient(idx)} className="text-red-500 hover:text-red-700 font-black text-lg">&times;</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="p-3 border border-gray-200 rounded-xl outline-none focus:border-green-500 bg-white" required>
              {categorias.map(c => <option key={c.id} value={c.id.toString()}>{c.nombre}</option>)}
            </select>
            <input type="file" id="prod-img" accept="image/*" onChange={(e) => setImagen(e.target.files?.[0] || null)} className="p-2 border border-gray-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-sm mb-4 text-slate-700">Precios y Presentaciones</h3>
            <div className="space-y-3">
              {variantes.map((v, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input type="text" placeholder="Unidad (ej: Libra)" value={v.unidad} onChange={(e) => updateVariant(idx, 'unidad', e.target.value)} className="flex-1 p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" required />
                  <input type="number" placeholder="Precio" value={v.precio} onChange={(e) => updateVariant(idx, 'precio', e.target.value)} className="w-1/3 p-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500" required />
                  {variantes.length > 1 && <button type="button" onClick={() => removeVariant(idx)} className="text-red-400 hover:text-red-600 p-2 transition">✖</button>}
                </div>
              ))}
            </div>
            <button type="button" onClick={addVariant} className="text-green-600 text-sm font-bold mt-4 hover:underline flex items-center gap-1">+ Agregar variante</button>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-black py-4 rounded-xl hover:bg-green-700 transition transform active:scale-95 disabled:opacity-50 mt-4 shadow-md">
            {loading ? 'GUARDANDO EN BASE DE DATOS...' : 'GUARDAR PRODUCTO'}
          </button>
        </form>
      </div>
    </div>
  );
}