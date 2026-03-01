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
    
    revalidatePath('/admin');
    revalidatePath('/'); 
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ESTA ES LA FUNCIÓN QUE EL NAVEGADOR DICE QUE NO EXISTE
// Asegúrate de copiarla tal cual:
export async function eliminarProductoDefinitivamente(id: number) {
  try {
    const supabase = await verifyAdmin();

    // 1. Borrar variantes primero (por integridad referencial)
    const { error: varError } = await supabase
      .from('variantes')
      .delete()
      .eq('producto_id', id);
    
    if (varError) throw new Error("Error al borrar variantes: " + varError.message);

    // 2. Borrar el producto
    const { error: prodError } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (prodError) throw new Error("Error al borrar producto: " + prodError.message);
    
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error("Error en eliminarProducto:", error);
    return { success: false, error: error.message };
  }
}

export async function crearProductoAction(formData: FormData) {
  try {
    const supabase = await verifyAdmin(); 

    const nombre = formData.get('nombre') as string;
    const descripcion = formData.get('descripcion') as string;
    const categoria_id = parseInt(formData.get('categoria_id') as string);
    const es_canasta = formData.get('es_canasta') === 'true';
    const imagen = formData.get('imagen') as File | null;
    
    const variantesStr = formData.get('variantes') as string;
    const variantes = JSON.parse(variantesStr);

    let imageUrl = null;

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

    const variantesAInsertar = variantes.map((v: any) => ({
      producto_id: prodData.id,
      unidad: v.unidad,
      precio: parseFloat(v.precio),
      stock_disponible: true
    }));

    const { error: varError } = await supabase.from('variantes').insert(variantesAInsertar);
    
    if (varError) {
      await supabase.from('productos').delete().eq('id', prodData.id);
      throw new Error(`Error al crear variantes: ${varError.message}`);
    }

    revalidatePath('/admin');
    revalidatePath('/');

    return { success: true };
  } catch (error: any) {
    console.error("Error en crearProductoAction:", error);
    return { success: false, error: error.message };
  }
}

export async function actualizarPrecioVariante(varianteId: number, nuevoPrecio: number) {
  try {
    const supabase = await verifyAdmin();
    const { error } = await supabase.from('variantes').update({ precio: nuevoPrecio }).eq('id', varianteId);
    if (error) throw new Error(error.message);
    
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleStockProducto(productoId: number, agotar: boolean) {
  try {
    const supabase = await verifyAdmin();
    const { error } = await supabase.from('variantes').update({ stock_disponible: !agotar }).eq('producto_id', productoId);
    if (error) throw new Error(error.message);
    
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Mantengo esta por si acaso algún otro componente la llama, 
// pero ahora hace lo mismo que eliminar.
export async function archivarProducto(id: number) {
  return eliminarProductoDefinitivamente(id);
}