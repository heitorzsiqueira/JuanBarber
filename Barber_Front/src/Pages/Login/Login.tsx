import { useState, useEffect } from 'react';
import { supabase } from '../../lib/Supabase';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/Api';
import { Scissors, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleGoogleLogin() {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: { prompt: 'select_account' },
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Erro:', error);
      setIsLoading(false);
    }
  }

  // Função de sincronização com persistência forçada
  async function syncWithApi(session: any) {
    if (!session?.access_token) return;

    try {
      // 1. FIXA O TOKEN NO STORAGE IMEDIATAMENTE
      localStorage.setItem('@Barbearia:token', session.access_token);
      console.log("✅ Token fixado no LocalStorage");

      // 2. TENTA SINCRONIZAR COM O BACK-END
      // O interceptor do seu api.ts já deve estar configurado para ler o token acima
      await api.post('/sessions', {});
      
      console.log("🚀 Back-end sincronizado com sucesso");
      
      // 3. NAVEGAÇÃO
      navigate('/Home');
    } catch (err) {
      console.error('❌ Erro na sincronização com API:', err);
      // Mesmo com erro na API, se temos o token, permitimos a entrada para o agendamento tentar funcionar
      navigate('/Home');
    }
  }

  useEffect(() => {
    // Usamos uma variável fora do escopo do sync para controlar múltiplas chamadas
    let syncProcessed = false;

    const handleAuth = async () => {
      // Busca a sessão atual (caso já venha logado do redirect)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && !syncProcessed) {
        syncProcessed = true;
        await syncWithApi(session);
      }
    };

    handleAuth();

    // Ouve mudanças na autenticação (Login/Logout/Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("⚡ Evento Supabase Auth:", event);
      
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session && !syncProcessed) {
        syncProcessed = true;
        syncWithApi(session);
      }

      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('@Barbearia:token');
        syncProcessed = false;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Detalhe de luz de fundo (Glow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-900/10 blur-[120px] rounded-full" />

      <div className="max-w-[400px] w-full z-10">
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-700 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)] mb-6 rotate-3">
            <Scissors size={40} className="text-zinc-950 -rotate-3" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Juan<span className="text-amber-500">Barber</span>
          </h1>
          <div className="h-1 w-12 bg-amber-500 mt-2 rounded-full" />
        </div>

        {/* Card Principal */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-xl font-semibold text-zinc-100 mb-2 text-center">Bem-vindo de volta</h2>
          <p className="text-zinc-500 text-sm mb-8 text-center px-4">
            Acesse sua conta para gerenciar seus agendamentos.
          </p>

          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="group relative w-full bg-white text-zinc-950 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-amber-500 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 group-hover:brightness-0 transition-all" />
            {isLoading ? 'Conectando...' : 'Entrar com Google'}
          </button>

          {/* Benefícios rápidos */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-zinc-400 text-xs">
              <CheckCircle2 size={16} className="text-amber-500" />
              <span>Agendamento em menos de 1 minuto</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400 text-xs">
              <ShieldCheck size={16} className="text-amber-500" />
              <span>Acesso seguro via Google Auth</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-[10px] text-zinc-600 text-center uppercase tracking-[0.2em]">
          Estilo & Tradição • Desde 2024
        </p>
      </div>
    </div>
  );
}