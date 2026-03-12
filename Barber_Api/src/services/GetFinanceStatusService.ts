import { prisma } from '../config/Prisma.js'; 
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export async function getFinanceStats(barber_id: string) {
  const now = new Date();

  // 1. Busca todos os agendamentos atendidos do barbeiro
  
  const appointments = await prisma.appointment.findMany({
    where: {
      barber_id,
      status: 'SERVED',
    },
    include: {
      service: true,
    },
  });

  // 2. Filtros de data usando lógica de JS (mais performático para volume médio)
  const stats = appointments.reduce((acc, app) => {
    const appDate = new Date(app.date);
    const price = Number(app.service.price);

    // Soma Hoje
    if (appDate >= startOfDay(now) && appDate <= endOfDay(now)) {
      acc.totalDay += price;
    }

    // Soma Semana
    if (appDate >= startOfWeek(now) && appDate <= endOfWeek(now)) {
      acc.totalWeek += price;
    }

    // Soma Mês
    if (appDate >= startOfMonth(now) && appDate <= endOfMonth(now)) {
      acc.totalMonth += price;
      acc.totalAppointments += 1; // Contador de cortes no mês
    }

    return acc;
  }, {
    totalDay: 0,
    totalWeek: 0,
    totalMonth: 0,
    totalAppointments: 0
  });

  return stats;
}