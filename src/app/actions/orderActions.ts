'use server'

import { createClient } from "@/utils/supabase/server";

export async function registrarPedidoAction(datos: {
  nombre: string,
  direccion: string,
  total: number,
  items: any[]
}) {
  const supabase = await createClient();

  try {
    // 1. Insertar el pedido principal
    const { data: pedido, error: errorPedido } = await supabase
      .from('pedidos')
      .insert([{
        cliente_nombre: datos.nombre,
        cliente_direccion: datos.direccion,
        total: datos.total,
        estado: 'pendiente' // Estado inicial
      }])
      .select()
      .single();

    if (errorPedido) throw new Error(errorPedido.message);

    // 2. Insertar los detalles (qué compró exactamente)
    const detalles = datos.items.map(item => ({
      pedido_id: pedido.id,
      producto_nombre: item.nombre,
      variante_nombre: item.variantName,
      cantidad: item.quantity,
      precio_unitario: item.precio
    }));

    const { error: errorDetalles } = await supabase
      .from('detalles_pedido')
      .insert(detalles);

    if (errorDetalles) throw new Error(errorDetalles.message);

    return { success: true, pedidoId: pedido.id };
  } catch (error: any) {
    console.error("Error registrando pedido:", error);
    return { success: false, error: error.message };
  }
}