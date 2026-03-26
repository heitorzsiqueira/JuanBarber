import 'dotenv/config'; 
import cors from 'cors';
import express from 'express';
import { sessionRoutes } from './routes/Sessions.js';
import { AppointmentsRoutes } from './routes/Appointments.js';
import { listRoutes } from './routes/List.js';
import { servicesRouter } from './routes/Services.js';
import FinancesRoutes from './routes/Finances.js';


const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT;


app.use((req, res, next) => {
  console.log(`📡 Chamada recebida: ${req.method} ${req.url}`);
  next();
});


app.use('/sessions', sessionRoutes);
app.use('/appointments', AppointmentsRoutes);
app.use('/list', listRoutes);
app.use('/services', servicesRouter);
app.use('/finance', FinancesRoutes);

app.get('/hello', (req, res) => {
  return res.json({ 
    message: "Opa! O back-end no Render está vivo e ouvindo!",
    timestamp: new Date().toISOString()
  });
});



app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
});
