'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('Credenciales incorrectas o error de conexión.');
      setIsLoading(false);
    } else {
      // Si el login es exitoso, forzamos al servidor a recargar la página
      // para que evalúe la nueva sesión y nos deje entrar al Dashboard.
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full border border-gray-100">
        <div className="mb-4 text-green-600 flex justify-center">
          <svg className="w-16 h-16 fill-current" viewBox="0 0 24 24">
            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black mb-6 text-slate-800">Admin La Floresta</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Usuario..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-green-500 outline-none transition-all" 
            required 
          />
          <input 
            type="password" 
            placeholder="Contraseña..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl text-center focus:ring-2 focus:ring-green-500 outline-none transition-all" 
            required 
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? 'VERIFICANDO...' : 'ENTRAR'}
          </button>
        </form>
        {errorMsg && <p className="text-red-500 text-sm mt-4 font-bold animate-pulse">{errorMsg}</p>}
      </div>
    </div>
  );
}