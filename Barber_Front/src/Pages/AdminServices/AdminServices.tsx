import React, { useState, useEffect } from 'react';
import { Scissors, Trash2, Plus, DollarSign, Clock, FileText } from 'lucide-react';
import { api } from '../../lib/Api';
import axios from 'axios';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
}

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  // 1. Listar serviços
  async function loadServices() {
    try {
      const response = await api.get('/list/services');
      setServices(response.data);
    } catch (err) {
      alert("Erro ao carregar serviços.");
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  // 2. Criar serviço
  async function handleCreateService(e: React.FormEvent) {
    e.preventDefault();

    try {
      const data = {
        name,
        description,
        price: Number(price),
        duration_minutes: Number(duration),
      };

      await api.post('/services/create', data);

      // Limpa os campos
      setName('');
      setDescription('');
      setPrice('');
      setDuration('');

      loadServices(); // Atualiza a lista
      alert("Serviço cadastrado!");
    } catch (err) {
      alert("Erro ao cadastrar serviço.");
    }
  }

  // 3. Deletar serviço
  async function handleDeleteService(id: string) {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      await api.delete(`/services/${id}`);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
     
        const mensagem = error.response?.data?.error;
        alert(mensagem);
      } else {
        // Erro genérico (ex: erro de rede ou erro de lógica JS)
        alert("Ocorreu um erro inesperado.");
        console.error(error);
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
            <Scissors className="text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestão de Serviços</h1>
            <p className="text-zinc-400">Juan, aqui você controla o que a barbearia oferece.</p>
          </div>
        </header>

        {/* Formulário de Cadastro */}
        <form onSubmit={handleCreateService} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl mb-10">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Plus className="text-amber-500" size={20} /> Novo Serviço
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Nome do Serviço</label>
              <input
                value={name} onChange={e => setName(e.target.value)} required
                placeholder="Ex: Corte Degradê"
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Preço (R$)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 text-zinc-500" size={18} />
                <input
                  type="number" step="0.01"
                  value={price} onChange={e => setPrice(e.target.value)} required
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 pl-10 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-zinc-400">Descrição</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3.5 text-zinc-500" size={18} />
                <input
                  value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="O que está incluso no serviço?"
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 pl-10 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Duração (minutos)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 text-zinc-500" size={18} />
                <input
                  type="number"
                  value={duration} onChange={e => setDuration(e.target.value)} required
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 pl-10 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <button type="submit" className="md:mt-7 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors p-3">
              Cadastrar Serviço
            </button>
          </div>
        </form>

        {/* Lista de Serviços */}
        <div className="grid grid-cols-1 gap-4">
          <h2 className="text-xl font-semibold mb-2">Serviços Ativos</h2>
          {services.map(service => (
            <div key={service.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl flex items-center justify-between group hover:border-zinc-700 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-800 rounded-lg group-hover:bg-amber-500/10 transition-colors">
                  <Scissors className="text-amber-500" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{service.name}</h3>
                  <p className="text-sm text-zinc-500">{service.description}</p>
                  <div className="flex gap-4 mt-1">
                    <span className="text-xs text-amber-500 font-medium">R$ {Number(service.price).toFixed(2)}</span>
                    <span className="text-xs text-zinc-400 font-medium">{service.duration_minutes} min</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeleteService(service.id)}
                className="p-3 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {services.length === 0 && (
            <p className="text-center text-zinc-600 py-10">Nenhum serviço cadastrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
