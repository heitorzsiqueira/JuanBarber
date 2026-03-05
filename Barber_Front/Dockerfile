# Usa o Node 20
FROM node:20

WORKDIR /app

# Copia os arquivos de pacotes
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código do front
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# O "--host" é obrigatório para o Docker conseguir acessar o Vite do lado de fora
CMD ["npm", "run", "dev", "--", "--host"]