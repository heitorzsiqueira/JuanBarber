FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Gera o client do Prisma para o Linux do container
RUN npx prisma generate

EXPOSE 3333

CMD ["npm", "run", "dev"]