import { createClient } from "@/utils/supabase/server";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";
import NuestraHistoria from "@/components/NuestraHistoria";
import UneteComoProductor from "@/components/UneteComoProductor"; // <-- 1. LO IMPORTAMOS
import Footer from "@/components/Footer";

export default async function Home() {
  const supabase = await createClient();

  const { data: productos, error } = await supabase
    .from('productos')
    .select(`*, variantes(*), categorias(nombre)`)
    .eq('activo', true)
    .order('id', { ascending: true });

  if (error) {
    return <div className="p-10 text-red-500 text-center">Error al cargar el catálogo.</div>;
  }

  return (
    <>
      <Hero /> 
      <NuestraHistoria />

      <main id="productos" className="min-h-screen p-8 bg-slate-50">
        <div className="max-w-7xl mx-auto py-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h3 className="text-4xl font-bold text-gray-900">Cosecha de la Semana</h3>
              <p className="text-gray-500 mt-2 text-lg">Próximas entregas: <strong>Miércoles y Sábados</strong></p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productos?.map((producto) => (
              <ProductCard key={producto.id} product={producto} />
            ))}
          </div>
        </div>
      </main>

      {/* 4. SECCIÓN PARA CAMPESINOS */}
      <UneteComoProductor /> 

      <Footer />
    </>
  );
}