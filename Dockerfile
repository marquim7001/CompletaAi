# Dockerfile

# Usar uma imagem base do Node.js
FROM node:14

# Instalar dependências do sistema para usar wait-for-it
RUN apt-get update && apt-get install -y curl

# Baixar wait-for-it
RUN curl -sSLo /usr/local/bin/wait-for-it https://github.com/vishnubob/wait-for-it/releases/download/v2.3.2/wait-for-it.sh && chmod +x /usr/local/bin/wait-for-it

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm install

# Copiar o restante do código para o diretório de trabalho
COPY . .

# Copiar o arquivo .env para o contêiner (usar essa linha quando rodar no Docker, comentar quando usar o Railway)
# COPY .env .env

# Expor a porta usada pela aplicação
EXPOSE 8080

# Comando para iniciar a aplicação, esperando a conexão com o MySQL
CMD ["wait-for-it", "mysql:3306", "--", "npm", "start"]