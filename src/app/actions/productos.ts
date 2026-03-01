// src/app/actions/productos.ts (NUEVO ARCHIVO)
'use server'
import { createClient } from "@/utils/supabase/server";

export async function toggleProductoActivo(id: number, estadoActual: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from('productos').update({ activo: !estadoActual }).eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}