import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // Adicione isso
import './index.css'
import Login from './Pages/Login/Login.tsx'
import Home from './Pages/Home/Home.tsx'
import Agendamento from './Pages/Appointment/Appointment.tsx'
import { BarberDashboard } from './Pages/Barber_Dashboard/Barber.tsx';
import { Services } from './Pages/Services/Services.tsx';
import { MyAppointments } from './Pages/Client_Dashboard/Appointment.tsx';
import { AdminServices } from './Pages/AdminServices/AdminServices.tsx'
import DashboardFinanceiro from './Pages/Barber_Financial/Financial.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota inicial (página de login) */}
        <Route path="/" element={<Login />} />
        
        {/* Rota da home */}
        <Route path="/home" element={<Home />} />
        
        {/* Rota do agendamento */}
        <Route path="/appointment" element={<Agendamento />} />
        {/* Rota do dashboard do barbeiro */}
        <Route path="/barber-dashboard" element={<BarberDashboard />} />
        {/* Rota dos serviços */} 
        <Route path="/services" element={<Services />} />
        {/* Rota dos agendamentos do cliente */}
        <Route path="/my-appointments" element={<MyAppointments />} />
        {/* Rota de administração de serviços */}
        <Route path="/admin-services" element={<AdminServices />} />
        {/* Rota do dashboard financeiro */}
        <Route path="/financial-dashboard" element={<DashboardFinanceiro />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)