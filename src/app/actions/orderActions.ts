// src/app/actions/orderActions.ts
'use server'
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function registrarPedidoAction(datos: { nombre: string, direccion: string, total: number, items: any[] }) {
  const supabase = await createClient();

  try {
    // 1. Insertar el pedido principal
    const { data: pedido, error: errorPedido } = await supabase
      .from('pedidos')
      .insert([{ cliente_nombre: datos.nombre, cliente_direccion: datos.direccion, total: datos.total, estado: 'pendiente' }])
      .select().single();

    if (errorPedido) throw new Error(errorPedido.message);

    // 2. Preparar detalles
    const detalles = datos.items.map(item => ({
      pedido_id: pedido.id,
      producto_nombre: item.nombre,
      variante_nombre: item.variantName,
      cantidad: item.quantity,
      precio_unitario: item.precio
    }));

    // 3. Insertar detalles
    const { error: errorDetalles } = await supabase.from('detalles_pedido').insert(detalles);

    if (errorDetalles) {
      // ROLLBACK MANUAL: Si fallan los detalles, borramos el pedido principal
      await supabase.from('pedidos').delete().eq('id', pedido.id);
      throw new Error(`Error guardando detalles. Transacción revertida: ${errorDetalles.message}`);
    }

    revalidatePath('/admin'); // <-- Faltaba esto en orderActions.ts para refrescar el panel
    return { success: true, pedidoId: pedido.id };
  } catch (error: any) {
    console.error("Error registrando pedido:", error);
    return { success: false, error: error.message };
  }
}