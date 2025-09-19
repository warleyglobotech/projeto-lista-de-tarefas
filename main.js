// scripts/main.js

// Lida com o formulário de Login
document.querySelector('.login form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('input[name="e-mail-login"]').value;
    const senha = document.querySelector('input[name="senha-login"]').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (data.success) {
            alert('Login bem-sucedido!');
            window.location.href = './pages/painel.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro ao tentar conectar com o servidor.');
    }
});

// Lida com o formulário de Registro
document.querySelector('.criar-conta form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('input[name="email"]').value;
    const nome = document.querySelector('input[name="nome"]').value;
    const senha = document.querySelector('input[name="senha"]').value;
    const confirmacaoSenha = document.querySelector('input[name="confirmacao-senha"]').value;
    // O campo de foto precisaria de uma lógica mais complexa, mas vamos focar no essencial por agora.

    if (senha !== confirmacaoSenha) {
        return alert('As senhas não coincidem!');
    }

    try {
        const response = await fetch('/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();

        if (data.success) {
            alert('Conta criada com sucesso!');
            // Você pode limpar o formulário ou redirecionar o usuário
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro ao tentar conectar com o servidor.');
    }
});