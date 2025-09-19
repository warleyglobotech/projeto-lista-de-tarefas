document.getElementById("logoutButton").addEventListener("click", (event) => {
    event.preventDefault(); // Impede a ação padrão do link

    // Limpa os dados de sessão do localStorage (ou sessionStorage)
    // Isso é crucial para "deslogar" o usuário
    localStorage.clear();

    // Redireciona o usuário de volta para a página de login
    window.location.href = "./../index.html"; 
});