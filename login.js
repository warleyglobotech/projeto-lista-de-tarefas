
// Lida com o formulário de Login
// js/login.js

document.querySelector('.login form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('input[name="email-login"]').value;
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
            // AQUI: Salva o ID do usuário no localStorage
            localStorage.setItem('usuario_id', data.user.id);
            
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