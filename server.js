// js/server.js

const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para processar JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Substitua pelo seu usuário do MySQL
    password: '@MySQL2712', // Substitua pela sua senha do MySQL
    database: 'bd_lista_tarefas' // Substitua pelo nome do seu banco de dados
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

// Serve arquivos estáticos da pasta raiz do projeto.
// O '__dirname' aponta para 'js', então '..' sobe um nível.
app.use(express.static(path.join(__dirname, '..')));

// Rota principal para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// --- Rota para Registro de Novo Usuário (POST /registrar) ---
app.post('/registrar', async (req, res) => {
    const { nome, email, senha } = req.body;

    // Hashear a senha para segurança
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    const query = 'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)';
    db.query(query, [nome, email, hashedPassword], (err, result) => {
        if (err) {
            console.error('Erro ao inserir usuário:', err);
            // Mensagem mais amigável para o usuário
            return res.status(500).json({ success: false, message: 'Erro ao registrar usuário. O e-mail já pode estar em uso.' });
        }
        res.status(201).json({ success: true, message: 'Usuário registrado com sucesso!' });
    });
});

// --- Rota para Login de Usuário (POST /login) ---
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
        }

        const user = results[0];
        // Comparar a senha fornecida com a senha hashada do banco
        const match = await bcrypt.compare(senha, user.senha_hash);

        if (match) {
            res.json({ success: true, message: 'Login bem-sucedido!' });
        } else {
            res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});