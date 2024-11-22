# Usar uma imagem base do Node.js
FROM node:16

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código do projeto para o contêiner
COPY . ./

# Expor a porta usada pela aplicação
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "start"]