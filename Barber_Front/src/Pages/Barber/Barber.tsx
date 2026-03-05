import { useEffect, useState } from 'react';
import { api } from '../../lib/Api'; 


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
}

interface UserProfile {
  id: string;
  name: string;
  role: 'BARBER' | 'CLIENT';
}

export function BarberDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        
        const userResponse = await api.get('/sessions/me');
        const userData = userResponse.data;
        setUser(userData);

        
        if (userData.role === 'BARBER') {
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

  // Função para deletar agendamento
  async function handleCancel(id: string) {
    if (window.confirm("Deseja realmente cancelar este agendamento?")) {
      try {
        await api.delete(`/appointments/${id}`);
        // Atualiza a lista na tela removendo o cancelado
        setAppointments(prev => prev.filter(app => app.id !== id));
        alert("Agendamento cancelado com sucesso!");
      } catch (err) {
        alert("Erro ao cancelar. Tente novamente.");
      }
    }
  }

  // 3. Gerenciamento de Estados de Tela
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <p className="text-xl animate-pulse">Carregando painel do barbeiro...</p>
      </div>
    );
  }

  if (user?.role !== 'BARBER') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white p-4">
        <h1 className="text-2xl font-bold bg-red-600 p-4 rounded shadow">
          🚫 Acesso Negado. Esta área é restrita para o Juan e sua equipe.{user?.role ?? 'N/A'}
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Olá, {user.name}!</h1>
          <p className="text-gray-400">Aqui estão os seus agendamentos.</p>
        </div>
        <div className="bg-blue-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
          Barbeiro
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="grid gap-6">
          {appointments.length === 0 ? (
            <div className="text-center py-20 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700">
              <p className="text-gray-500 text-lg">Nenhum cliente agendado por enquanto. 🪒</p>
            </div>
          ) : (
            appointments.map((app) => (
              <div 
                key={app.id} 
                className="bg-gray-800 border-l-4 border-blue-500 p-5 rounded-r-lg shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-transform hover:scale-[1.01]"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-blue-400 font-mono font-bold text-lg whitespace-nowrap">
                      {/* Alterado para exibir Data e Hora */}
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

                <button 
                  onClick={() => handleCancel(app.id)}
                  className="w-full md:w-auto bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 px-6 py-2 rounded-md font-medium transition-all"
                >
                  Cancelar Cliente
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}