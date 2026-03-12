# 1. Usa uma imagem leve do Node
FROM node:20-slim

# 2. Instala dependências necessárias para o Prisma rodar no Linux
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# 3. Copia apenas os arquivos de dependências primeiro (otimiza o cache)
COPY package*.json ./
COPY prisma ./prisma/

# 4. Instala as dependências
RUN npm install

# 5. Copia o restante do código
COPY . .

# 6. Gera o Client do Prisma e COMPILA o TypeScript para JavaScript
RUN npx prisma generate
RUN npm run build

# 7. Porta padrão da sua API
EXPOSE 3333

# 8. COMANDO DE PRODUÇÃO: Roda o código compilado em JS
CMD ["npm", "start"]