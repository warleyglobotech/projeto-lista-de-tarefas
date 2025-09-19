// js/cadastro.js

document.querySelector('.criar-conta form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('input[name="email"]').value;
    const nome = document.querySelector('input[name="nome"]').value;
    const senha = document.querySelector('input[name="senha"]').value;
    const confirmacaoSenha = document.querySelector('input[name="confirmacao-senha"]').value;

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
            alert('Conta criada com sucesso! Redirecionando para a página de login.');
            // AQUI: A linha de redirecionamento
            window.location.href = './../index.html'; 
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro ao tentar conectar com o servidor.');
    }
});