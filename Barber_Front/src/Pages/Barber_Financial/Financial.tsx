import { useEffect, useState } from 'react';
import { api } from '../../lib/Api';
import { ArrowLeft, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FinanceData {
  totalDay: number;
  totalWeek: number;
  totalMonth: number;
  totalAppointments: number;
}

export default function Financas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [finance, setFinance] = useState<FinanceData>({
    totalDay: 0,
    totalWeek: 0,
    totalMonth: 0,
    totalAppointments: 0
  });

  useEffect(() => {
    let isMounted = true;

    async function loadFinance() {
      try {
        // O loading começa aqui
        setLoading(true);
        
        // Chamada para a rota que agora recebe o ID via Token (Middleware)
        const response = await api.get('/finance/stats');
        
        if (isMounted) {
          setFinance(response.data);
        }
      } catch (err: any) {
        console.error("Erro ao carregar finanças:", err);
        
        // Se o Back-end retornar 401 (Unauthorized), limpamos o acesso
        if (err.response?.status === 401) {
          alert("Sessão expirada. Por favor, faça login novamente.");
          navigate('/'); // Redireciona para a Home/Login
          return;
        }
      } finally {
        // O finally garante que o loading pare, independente de erro ou sucesso
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFinance();

    // Cleanup function: evita atualizar estado em componente desmontado
    return () => { isMounted = false };
  }, [navigate]);

  // Tela de Loading Customizada
  if (loading) {
    return (
      <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-400 animate-pulse">Buscando faturamento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-2 transition-all"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
          <h1 className="text-3xl font-bold text-white">Meu Faturamento</h1>
          <p className="text-gray-400">Controle seus lucros, negão. 💸</p>
        </div>
        <div className="bg-green-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-green-900/20">
          Financeiro
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          {/* Card Hoje */}
          <div className="bg-gray-800 border-l-4 border-green-500 p-6 rounded-r-lg shadow-xl hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-3 mb-4 text-gray-400">
              <DollarSign size={20} className="text-green-500" />
              <span className="font-medium uppercase text-[10px] tracking-widest">Faturamento Hoje</span>
            </div>
            <h2 className="text-4xl font-bold text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finance.totalDay)}
            </h2>
          </div>

          {/* Card Semana */}
          <div className="bg-gray-800 border-l-4 border-blue-500 p-6 rounded-r-lg shadow-xl hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-3 mb-4 text-gray-400">
              <TrendingUp size={20} className="text-blue-500" />
              <span className="font-medium uppercase text-[10px] tracking-widest">Faturamento Semana</span>
            </div>
            <h2 className="text-4xl font-bold text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finance.totalWeek)}
            </h2>
          </div>

          {/* Card Mês */}
          <div className="bg-gray-800 border-l-4 border-purple-500 p-6 rounded-r-lg shadow-xl hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-3 mb-4 text-gray-400">
              <Calendar size={20} className="text-purple-500" />
              <span className="font-medium uppercase text-[10px] tracking-widest">Faturamento Mês</span>
            </div>
            <h2 className="text-4xl font-bold text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finance.totalMonth)}
            </h2>
          </div>

          {/* Card Total Atendimentos */}
          <div className="bg-gray-800 border-l-4 border-orange-500 p-6 rounded-r-lg shadow-xl text-center md:text-left hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-3 mb-4 text-gray-400">
              <span className="font-medium uppercase text-[10px] tracking-widest">Cortes Realizados (Mês)</span>
            </div>
            <h2 className="text-4xl font-bold text-white">
              {finance.totalAppointments} <span className="text-lg text-gray-500 font-normal">clientes</span>
            </h2>
          </div>

        </div>

        {/* Banner de Feedback */}
        <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-lg text-center backdrop-blur-sm">
          <p className="text-blue-400 font-medium italic">
            "Foca no degradê que o faturamento vem!" 🪒🔥
          </p>
        </div>
      </main>
    </div>
  );
}