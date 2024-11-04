# Completa Aí

Aplicação web para criação, participação e organização de eventos

## Pré-requisitos

- Docker Desktop
- MySQL Workbench

## Passos para instalação

1. Clonar o repositório:

   ```bash
   git clone https://github.com/marquim7001/CompletaAi.git
   cd CompletaAi
   ```

2. Criar arquivo Dockerfile:

Na pasta raiz do projeto, criar um arquivo chamado Dockerfile e inserir essas informações:

  ```Dockerfile
  # Dockerfile
  
  # Usar uma imagem base do Node.js
  FROM node:14
  
  # Definir o diretório de trabalho dentro do contêiner
  WORKDIR /app
  
  # Copiar o package.json e o package-lock.json para o diretório de trabalho
  COPY package*.json ./
  
  # Instalar apenas dependências de produção
  RUN npm install
  
  # Copiar o restante do código para o diretório de trabalho
  COPY . .
  
  # Expor a porta usada pela aplicação
  EXPOSE 8080
  
  # Comando para iniciar a aplicação
  CMD ["npm", "start"]
  ```

3. Alterar essas linhas no arquivo docker-compose.yml:

  ```yml
  - DB_PASSWORD=<senha_do_BD_local>
  ```
  
  ```yml
  MYSQL_ROOT_PASSWORD: <senha_do_BD_local>
  ```

4. Alterar essa linha no arquivo db.js:

  ```js
  password: '<senha_do_BD_local>'
  ```

5. Criar uma nova conexão no MySQL Workbench:

  ![image](https://github.com/user-attachments/assets/c7b7d84a-6776-4f2e-992d-fa0c1cd48973)


6. No MySQL Workbench, criar as tabelas do banco de dados:

  ```sql
   CREATE SCHEMA completa_ai;
  ```
  ```sql
   USE completa_ai;
  ```
  ```sql
  CREATE TABLE usuarios (
    id int NOT NULL AUTO_INCREMENT,
    email varchar(200) NOT NULL,
    senha varchar(200) NOT NULL,
    nome varchar(200) DEFAULT NULL,
    data_nascimento date DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY email (email)
  )
  ```
  ```sql
  CREATE TABLE eventos (
    id int NOT NULL AUTO_INCREMENT,
    nome varchar(255) NOT NULL,
    categoria varchar(255) NOT NULL,
    num_vagas int NOT NULL,
    descricao text NOT NULL,
    data_inicio date NOT NULL,
    data_fim date NOT NULL,
    hora_inicio time NOT NULL,
    hora_fim time NOT NULL,
    localizacao text NOT NULL,
    id_criador varchar(200) DEFAULT NULL,
    PRIMARY KEY (id)
  )
  ```
  ```sql
  CREATE TABLE eventos_usuarios (
     id_usuario int NOT NULL,
     id_evento int NOT NULL,
     PRIMARY KEY (id_usuario, id_evento),
     KEY id_evento (id_evento),
     CONSTRAINT eventos_usuarios_ibfk_1 FOREIGN KEY (id_usuario) REFERENCES usuarios (id),
     CONSTRAINT eventos_usuarios_ibfk_2 FOREIGN KEY (id_evento) REFERENCES eventos (id)
   );
  ```

7. Rodar esse comando no terminal na pasta raiz:

  ```bash
  docker-compose up -d
  ```

8. Verificar se o projeto está rodando no Docker Desktop:

  ![image](https://github.com/user-attachments/assets/6107f71b-7edb-4e56-a921-53c3d3bd067d)

9. Acessar o link da aplicação:

  (http://localhost:3000/)
