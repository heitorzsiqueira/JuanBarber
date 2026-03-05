import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/Api'; 

interface Barber {
  id: string;
  name: string;
}

interface BarberService { 
  id: string;
  name: string;
  price: number;
}

export default function Agendamento() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);
  
  const [barberId, setBarberId] = useState('');
  const [serviceId, setServiceId] = useState('');
  
  // Agora dividimos: data é YYYY-MM-DD e time é HH:mm
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<BarberService[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // 1. Carrega barbeiros e serviços
  useEffect(() => {
    async function loadData() {
      try {
        const [barbersRes, servicesRes] = await Promise.all([
          api.get('/list/barbers'), 
          api.get('/list/services')
        ]);
        
        setBarbers(barbersRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        console.error("❌ Erro ao carregar dados:", err);
      }
    }
    loadData();
  }, []);

  // 2. Busca horários disponíveis quando a DATA ou o BARBEIRO mudar
  useEffect(() => {
    async function loadAvailableTimes() {
      if (!selectedDate || !barberId) return;

      setLoadingTimes(true);
      try {
        const response = await api.get('/list/available', {
          params: {
            date: selectedDate,
            barber_id: barberId
          }
        });
        setAvailableTimes(response.data);
      } catch (err) {
        console.error("Erro ao carregar horários:", err);
      } finally {
        setLoadingTimes(false);
      }
    }

    loadAvailableTimes();
  }, [selectedDate, barberId]);

  async function handleCreateAppointment(e: React.FormEvent) {
    e.preventDefault();
    
    if (!selectedTime) {
      alert("Selecione um horário disponível!");
      return;
    }

    const tokenCheck = localStorage.getItem('@Barbearia:token');

    if (!tokenCheck) {
      alert("❌ Erro: Você não está autenticado! Por favor, faça login novamente.");
      navigate('/');
      return;
    }

    setLoading(true);

    try {
      // Combina a data e o horário para o formato ISO que o back espera
      const fullDate = new Date(`${selectedDate}T${selectedTime}:00`);

      await api.post('/appointments/create', {
        barber_id: barberId,
        service_id: serviceId,
        date: fullDate.toISOString(), 
      });

      alert('✅ Agendamento realizado com sucesso!');
      navigate('/home');
    } catch (error: any) {
      console.error("Erro no post:", error.response?.data);
      const message = error.response?.data?.message || 'Erro ao agendar.';
      alert('❌ ' + message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6">
      
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 self-start flex items-center gap-2 text-zinc-400 hover:text-orange-500 transition-colors"
      >
        <span>← Voltar</span>
      </button>

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Agendar Corte</h1>
          <p className="text-zinc-500 text-sm mt-2">Escolha o melhor horário para você</p>
        </header>

        <form onSubmit={handleCreateAppointment} className="space-y-6">
          
          {/* Seleção de Barbeiro */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-400">Barbeiro</label>
            <select 
              required
              value={barberId}
              onChange={e => {
                setBarberId(e.target.value);
                setSelectedTime(''); // Limpa o horário ao trocar de barbeiro
              }}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-600 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Selecione o profissional</option>
              {barbers.map(barber => (
                <option key={barber.id} value={barber.id}>{barber.name}</option>
              ))}
            </select>
          </div>

          {/* Seleção de Serviço */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-400">Serviço</label>
            <select 
              required
              value={serviceId}
              onChange={e => setServiceId(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-600 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">O que vamos fazer?</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} — R$ {service.price}
                </option>
              ))}
            </select>
          </div>

          {/* Seleção de Data (Apenas o dia) */}
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-400">Dia do Agendamento</label>
            <input 
              type="date"
              required
              value={selectedDate}
              onChange={e => {
                setSelectedDate(e.target.value);
                setSelectedTime(''); // Limpa o horário ao trocar de dia
              }}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-600 outline-none transition-all invert-[0.9] hue-rotate-[180deg]"
            />
          </div>

          {/* Seleção de Horário (Grids de botões ou Select) */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-400">
                {loadingTimes ? 'Buscando horários...' : 'Horários Disponíveis'}
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.length > 0 ? (
                  availableTimes.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 rounded-lg text-sm font-bold transition-all border ${
                        selectedTime === time 
                        ? 'bg-orange-600 border-orange-600 text-white' 
                        : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-orange-500'
                      }`}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  !loadingTimes && <p className="col-span-3 text-xs text-zinc-500">Nenhum horário disponível para este dia.</p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !selectedTime}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-900/20 active:scale-[0.98]"
          >
            {loading ? 'Salvando na agenda...' : 'Finalizar Agendamento'}
          </button>
        </form>
      </div>
    </div>
  );
}