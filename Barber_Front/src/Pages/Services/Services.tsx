import { useEffect, useState } from 'react';
import { api } from '../../lib/Api';
import { Scissors, Zap, Crown, ArrowLeft, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration_minutes: number;

}

export function Services() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadServices() {
            try {
                const response = await api.get('/list/services');
                setServices(response.data);
            } catch (err) {
                console.error("Erro ao carregar serviços:", err);
            } finally {
                setLoading(false);
            }
        }
        loadServices();
    }, []);

    // Ícones dinâmicos baseados no nome ou categoria
    const getServiceIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('barba')) return <Zap className="w-6 h-6 text-amber-500" />;
        if (n.includes('completo') || n.includes('vip')) return <Crown className="w-6 h-6 text-amber-500" />;
        return <Scissors className="w-6 h-6 text-amber-500" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-20">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-zinc-400 hover:text-amber-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Voltar</span>
                    </button>
                    <span className="text-xl font-bold tracking-tighter uppercase">Barber Pro</span>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                        NOSSOS SERVIÇOS
                    </h1>
                    <p className="text-zinc-400 max-w-xl mx-auto italic">
                        "A excelência está nos detalhes. Escolha o cuidado que você merece."
                    </p>
                </div>

                {/* Grid de Serviços */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="relative group bg-zinc-900 border border-zinc-800 rounded-3xl p-1 overflow-hidden transition-all hover:border-amber-500/50 hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)]"
                        >
                            <div className="bg-zinc-900 rounded-[22px] p-6 h-full flex flex-col justify-between relative z-10">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-zinc-800 rounded-2xl group-hover:scale-110 transition-transform">
                                            {getServiceIcon(service.name)}
                                        </div>
                                        <div className="flex items-center gap-1 text-2xl font-black text-amber-500">
                                            <span className="text-sm font-normal text-zinc-500">R$</span>
                                            {service.price}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-amber-500 transition-colors">
                                        {service.name}
                                    </h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                                        {service.description || "Técnica exclusiva com acabamento impecável e produtos de primeira linha."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-zinc-800 pt-6 mt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                                            <Clock className="w-4 h-4" />
                                            {service.duration_minutes} min
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate('/appointment', { state: { serviceId: service.id } })}
                                        className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2 rounded-full font-bold text-sm transition-all active:scale-95"
                                    >
                                        AGENDAR
                                    </button>
                                </div>
                            </div>

                            {/* Efeito de brilho no fundo ao passar o mouse */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>

                {/* Banner de aviso VIP */}
                <section className="mt-20 p-8 rounded-3xl bg-zinc-900 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                            <Crown className="w-8 h-8 text-amber-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-2xl font-black tracking-tight">Pacote Mensal VIP</h4>
                                <span className="bg-amber-500/20 text-amber-500 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-amber-500/30">
                                    Best Seller
                                </span>
                            </div>
                            <p className="text-zinc-500 text-sm max-w-sm">
                                Cortes ilimitados, barba e sobrancelha com prioridade total na agenda e atendimento exclusivo.
                            </p>
                        </div>
                    </div>

                    {/* Valor com a mesma formatação dos cards de cima */}
                    <div className="flex items-center gap-1 text-4xl font-black text-amber-500 relative z-10">
                        <span className="text-sm font-normal text-zinc-500">R$</span>
                        125
                        <span className="text-xs font-medium text-zinc-600 ml-1 uppercase tracking-tighter">/mês</span>
                    </div>

                    {/* Efeito de luz de fundo para o VIP */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />
                </section>
            </main>
        </div>
    );
}