// src/app/actions/adminActions.ts
'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Verificador centralizado de permisos
async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("No autorizado");
  return supabase;
}

export async function toggleEstadoProducto(id: number, estadoActual: boolean) {
  try {
    const supabase = await verifyAdmin();
    const { error } = await supabase
      .from('productos')
      .update({ activo: !estadoActual })
      .eq('id', id);

    if (error) throw new Error(error.message);
    
    // Invalida la caché para que los cambios se reflejen de inmediato
    revalidatePath('/admin');
    revalidatePath('/'); 
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function archivarProducto(id: number) {
  // SOFT DELETE: En lugar de borrar (.delete()), lo ocultamos permanentemente
  // o podrías agregar una columna 'eliminado_en' en tu BD.
  try {
    const supabase = await verifyAdmin();
    const { error } = await supabase
      .from('productos')
      .update({ activo: false }) // Idealmente: eliminado_en: new Date().toISOString()
      .eq('id', id);

    if (error) throw new Error(error.message);
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
// Añade esto al final de src/app/actions/adminActions.ts

export async function crearProductoAction(formData: FormData) {
  try {
    const supabase = await verifyAdmin(); // Reutilizamos el verificador de sesión

    // 1. Extraer los datos básicos
    const nombre = formData.get('nombre') as string;
    const descripcion = formData.get('descripcion') as string;
    const categoria_id = parseInt(formData.get('categoria_id') as string);
    const es_canasta = formData.get('es_canasta') === 'true';
    const imagen = formData.get('imagen') as File | null;
    
    // Parseamos las variantes que vendrán como un string JSON
    const variantesStr = formData.get('variantes') as string;
    const variantes = JSON.parse(variantesStr);

    let imageUrl = null;

    // 2. Subir imagen a Storage (Desde el servidor, mucho más seguro)
    if (imagen && imagen.size > 0) {
      const fileExt = imagen.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('productos')
        .upload(fileName, imagen);
        
      if (uploadError) throw new Error(`Error al subir imagen: ${uploadError.message}`);
      
      const { data } = supabase.storage.from('productos').getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    // 3. Insertar Producto
    const { data: prodData, error: prodError } = await supabase
      .from('productos')
      .insert([{
        nombre,
        descripcion,
        categoria_id,
        imagen_url: imageUrl,
        activo: true,
        es_canasta
      }])
      .select()
      .single();

    if (prodError) throw new Error(`Error al crear producto: ${prodError.message}`);

    // 4. Insertar Variantes asociadas al producto recién creado
    const variantesAInsertar = variantes.map((v: any) => ({
      producto_id: prodData.id,
      unidad: v.unidad,
      precio: parseFloat(v.precio),
      stock_disponible: true
    }));

    const { error: varError } = await supabase.from('variantes').insert(variantesAInsertar);
    
    // NOTA SENIOR: Si varError ocurre aquí, en un entorno de producción estricto 
    // deberíamos hacer un "rollback" (borrar el producto que acabamos de crear). 
    if (varError) {
      // Intentamos borrar el producto huérfano para mantener la BD limpia
      await supabase.from('productos').delete().eq('id', prodData.id);
      throw new Error(`Error al crear variantes: ${varError.message}`);
    }

    // 5. Revalidar caché para que la tienda se actualice al instante
    revalidatePath('/admin');
    revalidatePath('/');

    return { success: true };
  } catch (error: any) {
    console.error("Error en crearProductoAction:", error);
    return { success: false, error: error.message };
  }
}