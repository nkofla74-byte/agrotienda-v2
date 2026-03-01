// src/app/actions/pedidos.ts
'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function registrarPedidoAction(datos: {
  nombre: string,
  direccion: string,
  total: number,
  items: any[]
}) {
  const supabase = await createClient();

  try {
    // 1. Insertar el pedido directamente con su detalle JSON
    // Esto coincide con tu esquema: tabla 'pedidos', columna 'detalle_pedido'
    const { data: pedido, error: errorPedido } = await supabase
      .from('pedidos')
      .insert([{
        cliente_nombre: datos.nombre,
        cliente_direccion: datos.direccion,
        total: datos.total,
        estado: 'pendiente',
        detalle_pedido: datos.items // Guardamos el array de productos aquí
      }])
      .select()
      .single();

    if (errorPedido) throw new Error(errorPedido.message);

    // 2. Notificar al Admin para que refresque los datos
    revalidatePath('/admin');

    return { success: true, pedidoId: pedido.id };
  } catch (error: any) {
    console.error("Error registrando pedido:", error);
    return { success: false, error: error.message };
  }
}