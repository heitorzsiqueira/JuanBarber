import axios from 'axios';
import { supabase } from './Supabase';

export const api = axios.create({
  baseURL: 'https://juanbarber.onrender.com',
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@Barbearia:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});


api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    // Se o erro for 401 (Token vencido)
    if (error.response?.status === 401) {
      // Pedimos para o Supabase atualizar a sessão
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        // Tenta repetir a requisição com o novo token
        error.config.headers['Authorization'] = `Bearer ${data.session.access_token}`;
        return api.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);
