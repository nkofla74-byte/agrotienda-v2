import { createClient } from "@/utils/supabase/server";
import LoginForm from "@/components/admin/LoginForm";

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Verificamos en el backend si existe una sesión activa
  const { data: { user }, error } = await supabase.auth.getUser();

  // Si no hay usuario, retornamos el formulario de login.
  // El código del panel de control nunca llegará al navegador.
  if (error || !user) {
    return <LoginForm />;
  }

  // --- ÁREA PROTEGIDA ---
  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Panel de Control</h1>
          <p className="text-green-600 font-bold mt-1">Conectado como: {user.email}</p>
        </div>
        {/* En el próximo paso agregaremos aquí el botón de cerrar sesión */}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-400">
        <svg className="w-16 h-16 mx-auto mb-4 fill-current text-green-200" viewBox="0 0 24 24">
          <path d="M13,2.03V2.05L13,2.05V10H20.84C20.67,6.03 17.5,2.78 13.5,2.15C13.34,2.11 13.17,2.07 13,2.03M11,2.06C6.55,2.57 3,6.41 3,11H11V2.06M21,12H13V21C17.42,20.47 21,16.63 21,12M11,21V12H3C3,16.63 6.58,20.47 11,21Z" />
        </svg>
        <p className="text-lg">Dashboard asegurado exitosamente.</p>
        <p className="text-sm mt-2">Próximo paso: Cargar las pestañas de Pedidos e Inventario.</p>
      </div>
    </div>
  );
}