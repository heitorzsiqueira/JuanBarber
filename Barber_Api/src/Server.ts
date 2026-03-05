import 'dotenv/config'; 
import cors from 'cors';
import express from 'express';
import { sessionRoutes } from './routes/Sessions.js';
import { AppointmentsRoutes } from './routes/Appointments.js';
import { listRoutes } from './routes/List.js';

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



app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});