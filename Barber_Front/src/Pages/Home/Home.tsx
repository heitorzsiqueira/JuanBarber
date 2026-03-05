import { useEffect, useState } from 'react';
import { supabase } from '../../lib/Supabase'; 
import { api } from '../../lib/Api'; 
import { LogOut, Calendar, User, Scissors, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Seguindo a mesma interface que você usa no Dashboard
interface UserProfile {
  id: string;
  name: string;
  role: 'BARBER' | 'CLIENT';
}

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUserData() {
      try {
        // Usando a sua rota de sessão para pegar os dados reais do banco
        const response = await api.get('/sessions/me');
        setUser(response.data);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/'; // Redireciona para o login
  }

  // Estado de carregamento para evitar flicker de conteúdo
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Header / Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Scissors className="w-8 h-8 text-amber-500" />
              <span className="text-xl font-bold tracking-tighter uppercase">Barber Pro</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Botão Condicional: Só aparece se for BARBER */}
              {user?.role === 'BARBER' && (
                <button 
                  onClick={() => navigate('/barber-dashboard')}
                  className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 px-4 py-2 rounded-lg border border-amber-500/30 transition-all text-sm font-bold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Painel Barbeiro</span>
                </button>
              )}

              <div className="hidden sm:flex flex-col items-end text-sm">
                <span className="font-medium text-zinc-100">{user?.name}</span>
                <span className="text-zinc-500 text-xs capitalize">{user?.role === 'BARBER' ? 'Barbeiro' : 'Cliente'}</span>
              </div>

              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-red-500"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
                Bem-vindo, <br />
                <span className="text-black/80">{user?.name?.split(' ')[0]}!</span>
              </h1>
              <p className="text-amber-100 text-lg max-w-md mb-6">
                Seu estilo é a nossa prioridade. Agende seu próximo corte em poucos segundos.
              </p>
              <button onClick={() => navigate('/appointment')} className="bg-zinc-950 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-900 transition-all shadow-lg">
                <Calendar className="w-5 h-5" />
                Agendar Agora
              </button>
            </div>
            <Scissors className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 rotate-12" />
          </div>
        </section>

        {/* Grid de Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={() => navigate('/my-appointments')} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-amber-500/50 transition-all group cursor-pointer">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
              <Calendar className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Meus Agendamentos</h3>
            <p className="text-zinc-500">Veja seus horários marcados e histórico de cortes.</p>
          </div>

          <div onClick={() => navigate('/services')} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-amber-500/50 transition-all group cursor-pointer">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
              <Scissors className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Serviços & Preços</h3>
            <p  className="text-zinc-500">Cabelo, barba, sobrancelha.</p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 hover:border-amber-500/50 transition-all group cursor-pointer">
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
              <User className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Meu Perfil</h3>
            <p className="text-zinc-500">Gerencie seus dados e preferências de contato.</p>
          </div>
        </div>
      </main>

      {/* Footer Mobile */}
      <footer className="md:hidden fixed bottom-0 w-full bg-zinc-900 border-t border-zinc-800 p-4 flex justify-around text-zinc-500">
        <Calendar className="w-6 h-6 hover:text-amber-500 cursor-pointer" />
        <Scissors 
          className={`w-6 h-6 cursor-pointer ${user?.role === 'BARBER' ? 'text-amber-500' : ''}`} 
          onClick={() => user?.role === 'BARBER' && navigate('/barber_dashboard')}
        />
        <User className="w-6 h-6 hover:text-amber-500 cursor-pointer" />
      </footer>
    </div>
  );
}