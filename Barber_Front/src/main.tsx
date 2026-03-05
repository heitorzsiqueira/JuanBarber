import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // Adicione isso
import './index.css'
import Login from './Pages/Login/Login.tsx'
import Home from './Pages/Home/Home.tsx'
import Agendamento from './Pages/AppointmentBarber/Appointment.tsx'
import { BarberDashboard } from './Pages/Barber/Barber.tsx';
import { Services } from './Pages/Services/Services.tsx';
import { MyAppointments } from './Pages/AppointmentClient/Appointment.tsx';

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
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)