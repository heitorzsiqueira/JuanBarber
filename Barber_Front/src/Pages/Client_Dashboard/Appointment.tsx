import { useEffect, useState } from 'react';
import { api } from '../../lib/Api';
import { 
  Calendar, 
  ChevronLeft, 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Interfaces baseadas no  Schema Prisma
interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

interface Barber {
  name: string;
}

interface Appointment {
  id: string;
  date: string;
  barber: Barber; 
  service: Service;
  status: 'PENDING' | 'SERVED';
}

export function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'SERVED'>('PENDING');

  useEffect(() => {
    async function loadAppointments() {
      try {
     
        const response = await api.get('/appointments/client');
        setAppointments(response.data);
      } catch (err) {
        console.error("Erro ao carregar agendamentos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, []);

const filteredAppointments = appointments.filter(app => app.status === activeTab);

  async function handleCancel(id: string) {
    if (window.confirm("Deseja realmente cancelar este agendamento?")) {
      try {
        await api.delete(`/appointments/${id}`);
        // Remove da lista local após deletar no banco
        setAppointments(prev => prev.filter(app => app.id !== id));
        alert("Agendamento cancelado com sucesso.");
      } catch (err) {
        alert("Erro ao cancelar o agendamento. Tente novamente.");
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
          <p className="text-zinc-500 font-medium animate-pulse">Buscando seus horários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-20">
      {/* Header Estiloso */}
      <header className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 hover:bg-zinc-900 rounded-xl transition-all text-zinc-400 hover:text-amber-500"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-amber-500">Meus Cortes</h1>
            <p className="text-[10px] text-zinc-500 uppercase font-bold">Histórico e Próximos</p>
          </div>

          <div className="w-10"></div> {/* Spacer para centralizar o título */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        
        {/* Seletor de visualização - Mantendo o padrão cinza do seu app */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('PENDING')}
            className={`px-4 py-2 rounded font-bold ${activeTab === 'PENDING' ? 'bg-blue-600' : 'bg-gray-800 text-gray-400'}`}
          >
            Pendentes
          </button>
          <button 
            onClick={() => setActiveTab('SERVED')}
            className={`px-4 py-2 rounded font-bold ${activeTab === 'SERVED' ? 'bg-green-600' : 'bg-gray-800 text-gray-400'}`}
          >
            Atendidos
          </button>
        </div>

        <div className="grid gap-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-24 bg-zinc-900/30 rounded-[2rem] border-2 border-dashed border-zinc-800">
            <div className="bg-zinc-900 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
              <Calendar className="w-10 h-10 text-zinc-700" />
            </div>
            <h2 className="text-xl font-bold mb-2">Sua agenda está vazia</h2>
            <p className="text-zinc-500 mb-8 max-w-[240px] mx-auto text-sm leading-relaxed">
              Você ainda não marcou nenhum serviço. Que tal dar um tapa no visual hoje?
            </p>
            <button 
              onClick={() => navigate('/services')}
              className="bg-amber-500 text-black px-8 py-4 rounded-2xl font-black hover:bg-amber-400 transition-all shadow-[0_10px_20px_-10px_rgba(245,158,11,0.5)] active:scale-95 uppercase text-xs"
            >
              Ver Serviços e Preços
            </button>
          </div>
          
          ) : (
            filteredAppointments.map((app) => (
              <div 
                key={app.id} 
                className={`bg-gray-800 border-l-4 ${activeTab === 'PENDING' ? 'border-blue-500' : 'border-green-500'} p-5 rounded-r-lg shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-transform hover:scale-[1.01]`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-blue-400 font-mono font-bold text-lg whitespace-nowrap">
                      {new Date(app.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - {new Date(app.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-gray-500">|</span>
                    <span className="font-semibold text-lg">{app.barber.name}</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Serviço: <span className="text-gray-200">{app.service.name}</span> 
                    <span className="ml-2 text-blue-500/50">({app.service.duration_minutes} min)</span>
                  </p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  {activeTab === 'PENDING' && (
                    <>
                      <button 
                        onClick={() => handleCancel(app.id)}
                        className="flex-1 md:flex-none bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 px-6 py-2 rounded-md font-medium transition-all"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Navegação Rápida Flutuante (Opcional) */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => navigate('/services')}
          className="bg-amber-500 text-black p-4 rounded-2xl shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center gap-2 font-bold"
        >
          <Calendar className="w-6 h-6" />
          <span className="hidden md:block">Novo Corte</span>
        </button>
      </div>
    </div>
  );
}