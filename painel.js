document.addEventListener("DOMContentLoaded", () => {
    const nomeListaInput = document.getElementById("nomeLista");
    const templateRadios = document.querySelectorAll("input[name='template']");
    const btnCriar = document.querySelector(".btn-outline-success");
    const btnExcluir = document.querySelector(".btn-outline-danger");
    const selectExcluir = document.querySelector("select.form-select");

    const usuario_id = localStorage.getItem('usuario_id');
    if (!usuario_id) {
        window.location.href = './../index.html'; // Redireciona se não houver login
        return;
    }

    // Criar lista
    btnCriar.addEventListener("click", async () => {
        const nome = nomeListaInput.value.trim();
        if (!nome) {
            alert("Digite um nome para a lista!");
            return;
        }

        const selecionado = document.querySelector("input[name='template']:checked");
        const template = selecionado ? selecionado.value : "padrao";

        try {
            const response = await fetch('/listas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, template, usuario_id })
            });

            const data = await response.json();
            if (data.success) {
                alert(`Lista "${nome}" criada!`);
                nomeListaInput.value = "";
                await atualizarSelect();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor.');
        }
    });

    // Excluir lista
    btnExcluir.addEventListener("click", async () => {
        const selectedOption = selectExcluir.options[selectExcluir.selectedIndex];
        const lista_id = selectedOption.dataset.id;
        const nome_lista = selectedOption.value;

        if (!lista_id) {
            alert("Escolha uma lista para excluir!");
            return;
        }

        try {
            const response = await fetch(`/listas/${lista_id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (data.success) {
                alert(`Lista "${nome_lista}" excluída com sucesso!`);
                await atualizarSelect();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor.');
        }
    });

    // Preenche o select com as listas
    async function atualizarSelect() {
        try {
            const response = await fetch(`/listas/${usuario_id}`);
            const listas = await response.json();
            selectExcluir.innerHTML = `<option selected>Selecione a lista</option>`;
            Object.keys(listas).forEach(nome => {
                const opt = document.createElement("option");
                opt.value = nome;
                opt.textContent = nome;
                opt.dataset.id = listas[nome].id;
                selectExcluir.appendChild(opt);
            });
        } catch (error) {
            console.error('Erro ao carregar listas:', error);
        }
    }

    atualizarSelect();
});