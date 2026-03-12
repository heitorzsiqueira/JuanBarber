import { useEffect, useState } from 'react';
import { api } from '../../lib/Api'; 
import { CheckCircle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  duration_minutes: number; 
}
interface Client {
  name: string;
}

interface Appointment {
  id: string;
  client: Client;
  date: string;
  service: Service;
  status: 'PENDING' | 'SERVED';
}

interface UserProfile {
  id: string;
  name: string;
  role: 'BARBER' | 'CLIENT' | 'JUAN';
}

export function BarberDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  
  const [activeTab, setActiveTab] = useState<'PENDING' | 'SERVED'>('PENDING');

  useEffect(() => {
    async function loadData() {
      try {
        const userResponse = await api.get('/sessions/me');
        const userData = userResponse.data;
        setUser(userData);

        if (userData.role === 'BARBER' || userData.role === 'JUAN') {
          const appointmentsResponse = await api.get('/appointments/schedule', {
            params: { barber_id: userData.id }
          });
          setAppointments(appointmentsResponse.data);
        }
      } catch (err) {
        console.error("Erro na autenticação:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtro puro e simples
  const filteredAppointments = appointments.filter(app => app.status === activeTab);

  async function handleComplete(id: string) {
    try {

      const appointment = appointments.find(app => app.id === id);

      if (appointment) {
        const appointmentDate = new Date(appointment.date);
        const now = new Date();

        if (appointmentDate > now) {
          alert("⚠️ Não é possível concluir um atendimento antes do horário marcado.");
          return;
        }
      }
      await api.put(`/appointments/put/${id}`);
      // Atualiza o status local para ele mudar de aba
      setAppointments(prev => prev.map(app => 
        app.id === id ? { ...app, status: 'SERVED' } : app
      ));
      alert("✅ Atendimento concluído!");
    } catch (err) {
      alert("Erro ao atualizar status.");
    }
  }

  async function handleCancel(id: string) {
    if (window.confirm("Deseja realmente cancelar este agendamento?")) {
      try {
        await api.delete(`/appointments/${id}`);
        setAppointments(prev => prev.filter(app => app.id !== id));
        alert("Agendamento cancelado com sucesso!");
      } catch (err) {
        alert("Erro ao cancelar.");
      }
    }
  }

  if (loading) return <div className="h-screen bg-gray-900 flex items-center justify-center text-white">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Olá, {user?.name}!</h1>
          <p className="text-gray-400">Aqui estão os seus agendamentos.</p>
        </div>
        <div className="bg-blue-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
          {user?.role}
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
            <div className="text-center py-20 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700">
              <p className="text-gray-500 text-lg">Nenhum registro encontrado aqui. 🪒</p>
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
                    <span className="font-semibold text-lg">{app.client.name}</span>
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
                        onClick={() => handleComplete(app.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white border border-green-600/50 px-6 py-2 rounded-md font-bold transition-all"
                      >
                        <CheckCircle size={18} />
                        Concluir
                      </button>

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
    </div>
  );
}