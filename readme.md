# Lista de tarefas
Desenvolvimento de uma aplicação para gerenciar listas de tarefas.

Funcionalidades:
1.Criar um novo usuário.
2.Criar uma nova lista de tarefas para um usuário.
3.Remover uma lista de tarefas para um usuário.
4.Adicionar tarefas a uma lista.
5.Listar todas as listas de um usuário.
6.Listar todas as tarefas de uma lista.
7.Marcar tarefa como concluída.
8.Remover uma tarefa de uma lista.

## Comunicação com Banco de Dados: 

Com o mysql e o node instalado:
1. Abra o terminal na pasta scripts e execute npm init -y para criar um arquivo package.json.

2. Instale as dependências: Você precisará de pacotes para o servidor web, para se conectar ao MySQL e para lidar com senhas.
npm install express mysql2 bcrypt

3. Crie o banco de dados e a tabela no mySQL,  usando os comandos:

CREATE DATABASE bd_lista_tarefas;

USE bd_lista_tarefas;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_lista VARCHAR(255) NOT NULL,
    conteudo_lista JSON,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

4. Executando:
- No server.js, atualize os dados de conexão com de acordo com suas informações de user e password
- No terminal, na pasta do projeto/js, inicie o servidor com o comando:
node server.js
- Abra seu navegador e acesse http://localhost:3000