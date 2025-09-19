const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'bd_lista_tarefas'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// --- Rota para Registro ---
app.post('/registrar', async (req, res) => {
    const { nome, email, senha } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    const query = 'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)';
    db.query(query, [nome, email, hashedPassword], (err, result) => {
        if (err) {
            console.error('Erro ao inserir usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao registrar usuário. O e-mail já pode estar em uso.' });
        }
        res.status(201).json({ success: true, message: 'Usuário registrado com sucesso!' });
    });
});

// --- Rota para Login ---
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const query = 'SELECT * FROM usuarios WHERE email = ?';

    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
        }

        const user = results[0];
        const match = await bcrypt.compare(senha, user.senha_hash);

        if (match) {
            res.json({ success: true, message: 'Login bem-sucedido!', user: { id: user.id, email: user.email } });
        } else {
            res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
        }
    });
});

// --- Rota para criar uma lista ---
app.post('/listas', (req, res) => {
    const { nome, template, usuario_id } = req.body;
    const conteudo = { template: template, tarefas: [] };

    const query = 'INSERT INTO listas (nome_lista, conteudo_lista, usuario_id) VALUES (?, ?, ?)';
    db.query(query, [nome, JSON.stringify(conteudo), usuario_id], (err, result) => {
        if (err) {
            console.error('Erro ao criar a lista:', err);
            return res.status(500).json({ success: false, message: 'Erro ao criar a lista.' });
        }
        res.status(201).json({ success: true, message: 'Lista criada com sucesso!' });
    });
});

// --- Rota para buscar as listas do usuário ---
app.get('/listas/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;

    const query = 'SELECT id, nome_lista, conteudo_lista FROM listas WHERE usuario_id = ?';
    db.query(query, [usuario_id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar as listas:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar as listas.' });
        }
        
        // AQUI: Remova o JSON.parse()
        const listas = results.reduce((obj, item) => {
            obj[item.nome_lista] = {
                id: item.id,
                ...item.conteudo_lista // Use o objeto diretamente
            };
            return obj;
        }, {});
        res.json(listas);
    });
});

// --- Rota para atualizar uma lista ---
app.put('/listas', (req, res) => {
    const { id, conteudo } = req.body;

    const query = 'UPDATE listas SET conteudo_lista = ? WHERE id = ?';
    db.query(query, [JSON.stringify(conteudo), id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar a lista:', err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar a lista.' });
        }
        res.json({ success: true, message: 'Lista atualizada com sucesso!' });
    });
});

// --- Rota para deletar uma lista ---
app.delete('/listas/:id_lista', (req, res) => {
    const { id_lista } = req.params;
    const query = 'DELETE FROM listas WHERE id = ?';

    db.query(query, [id_lista], (err, result) => {
        if (err) {
            console.error('Erro ao excluir a lista:', err);
            return res.status(500).json({ success: false, message: 'Erro ao excluir a lista.' });
        }
        res.json({ success: true, message: 'Lista excluída com sucesso!' });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});