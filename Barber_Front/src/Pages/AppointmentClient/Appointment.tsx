import { useEffect, useState } from 'react';
import { api } from '../../lib/Api';
import { 
  Calendar, 
  Clock, 
  Scissors, 
  Trash2, 
  ChevronLeft, 
  AlertCircle
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
}

export function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

      <main className="max-w-3xl mx-auto px-6 py-8">
        {appointments.length === 0 ? (
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
          <div className="space-y-4">
            {appointments.map((app) => (
              <div 
                key={app.id}
                className="group relative bg-zinc-900 border border-zinc-800 rounded-[2rem] p-5 transition-all hover:border-amber-500/40 hover:bg-zinc-900/80"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-5">
                    {/* Bloco de Data - Estilo Minimalista */}
                    <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex flex-col items-center justify-center min-w-[75px] border border-zinc-700 transition-colors group-hover:border-amber-500/30">
                      <span className="text-[10px] uppercase font-black text-amber-500 tracking-tighter">
                        {new Date(app.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                      </span>
                      <span className="text-2xl font-black">
                        {new Date(app.date).toLocaleDateString('pt-BR', { day: '2-digit' })}
                      </span>
                    </div>

                    {/* Informações Principais */}
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100 group-hover:text-amber-500 transition-colors">
                        {app.service?.name}
                      </h3>
                      
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Clock className="w-4 h-4 text-amber-500/70" />
                          <span className="text-sm font-medium">
                            {new Date(app.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Scissors className="w-4 h-4 text-amber-500/70" />
                          <span className="text-sm">
                            Profissional: <span className="text-zinc-200 font-semibold">{app.barber?.name || 'A definir'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preço e Botão de Cancelar */}
                  <div className="flex flex-col items-end justify-between h-[100px]">
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest block mb-1">Total</span>
                      <span className="text-xl font-black text-amber-500">R$ {app.service?.price}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleCancel(app.id)}
                      className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                      title="Cancelar Horário"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Footer Discreto do Card */}
                <div className="mt-5 pt-4 border-t border-zinc-800/50 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                    Agendamento Confirmado
                  </span>
                </div>
              </div>
            ))}

            {/* Banner de Aviso de Política de Cancelamento */}
            <div className="mt-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex items-start gap-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-200 uppercase mb-1">Política da Barbearia</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Cancelamentos permitidos com até 2 horas de antecedência. 
                  Chegue 5 minutos antes para garantir sua vaga e o padrão de qualidade Barber Pro.
                </p>
              </div>
            </div>
          </div>
        )}
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