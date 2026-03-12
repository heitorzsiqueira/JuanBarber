import { prisma } from '../config/Prisma.js';
import { isSameDay } from 'date-fns';

export class ListAvailableTimesService {

    async listAvailableTimes(barber_id: string, date: string) {

        const now = new Date();
        const searchDate = new Date(`${date}T12:00:00Z`);
        const isToday = isSameDay(searchDate, now);

        // 1. BUSCA NO BANCO: Pega todos os agendamentos do barbeiro no dia escolhido
        const appointments = await prisma.appointment.findMany({
            where: {
                barber_id: barber_id,
                date: {
                    // Filtra do início (00:00) até o fim do dia (23:59)
                    gte: new Date(`${date}T00:00:00.000Z`),
                    lte: new Date(`${date}T23:59:59.999Z`),
                }
            },
            // Traz junto os dados do serviço (nome, preço, duração)
            include: {
                service: true
            }
        });

        // 2. GRADE FIXA: Horários padrão que o Juan atende na barbearia
        const JuanSchedule = [
            "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
            "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
            "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
        ];

        // 3. FILTRAGEM: Vamos testar cada horário da grade para ver se está livre
        const available = JuanSchedule.filter(slot => {

            // Converte o texto do slot (ex: "09:30") em números (Hora: 9, Min: 30)
                const timeParts = slot.split(':');
                const slotHour = parseInt(timeParts[0]!);
                const slotMin = parseInt(timeParts[1]!);


            if (isToday) {
                const dateNow = new Date();
                // Subtrai 3 horas para alinhar com o horário de Brasília (BH)
                const now = new Date(dateNow.getTime() - (3 * 60 * 60 * 1000));
                const slotDateTime = new Date(now); // Começa com a data de hoje
                slotDateTime.setHours(slotHour, slotMin, 0, 0);

                // Se o horário do slot for antes ou igual a "agora", marca como ocupado
                if (slotDateTime <= now) {
                    console.log(slotDateTime)
                    return false; 
                }
            }
            // Verifica se este "slot" (ex: "09:00") bate com algum agendamento do banco
            const isOccupied = appointments.some(app => {

                // Ajuste de Fuso: Remove 3 horas do UTC para trabalhar com o horário de Brasília (BRT)
                const startTimeLocal = new Date(app.date.getTime() - (3 * 60 * 60 * 1000));

                // Calcula quando o corte termina baseado na duração cadastrada no serviço (ex: 30min ou 60min)
                const durationInMs = app.service.duration_minutes * 60 * 1000;
                const endTimeLocal = new Date(startTimeLocal.getTime() + durationInMs);

                

                // Cria um objeto de data para o horário que estamos testando agora
                const slotDate = new Date(startTimeLocal);
                slotDate.setUTCHours(slotHour, slotMin, 0, 0);

                /**
                 * LÓGICA DE CONFLITO:
                 * O horário está ocupado se o slot cair ENTRE o início e o fim de um corte.
                 * Ex: Se tem um corte das 09:00 às 10:00, os slots "09:00" e "09:30" ficam ocupados.
                 */
                return slotDate >= startTimeLocal && slotDate < endTimeLocal;
            });

            // Se o "isOccupied" for falso, o horário está disponível e continua na lista
            return !isOccupied;
        });

        return available;
    }
}