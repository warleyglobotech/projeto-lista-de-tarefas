document.addEventListener("DOMContentLoaded", async () => {
    const accordion = document.getElementById("accordionExample");
    const usuario_id = localStorage.getItem('usuario_id');
    if (!usuario_id) {
        window.location.href = './../index.html'; 
        return;
    }

    let listas = {};

    async function salvar(lista) {
        try {
            const response = await fetch('/listas', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: lista.id, conteudo: { template: lista.template, tarefas: lista.tarefas } })
            });
            const data = await response.json();
            if (!data.success) {
                console.error('Erro ao salvar no banco de dados:', data.message);
            }
        } catch (error) {
            console.error('Erro de conexão ao salvar:', error);
        }
    }

    // AQUI: A função renderizarListas agora recebe o ID do item ativo
    function renderizarListas(activeId = null) {
        accordion.innerHTML = "";

        Object.entries(listas).forEach(([nome, dados], index) => {
            const collapseId = "collapse" + index;
            const isFirst = index === 0;
            const isActive = activeId === collapseId;

            const item = document.createElement("div");
            item.className = "accordion-item";
            item.innerHTML = `
                <h2 class="accordion-header">
                    <button class="accordion-button ${isActive || isFirst ? '' : 'collapsed'} fw-bold text-primary" type="button"
                        data-bs-toggle="collapse" data-bs-target="#${collapseId}">
                        ${nome}
                    </button>
                </h2>
                <div id="${collapseId}" class="accordion-collapse collapse ${isActive || isFirst ? 'show' : ''}">
                    <div class="accordion-body bg-white"></div>
                </div>
            `;

            const body = item.querySelector(".accordion-body");
            let table = document.createElement("table");
            table.className = "table table-hover align-middle";
            let thead = document.createElement("thead");
            thead.className = "table-primary";
            let tbody = document.createElement("tbody");

            if (dados.template === "estudos") {
                thead.innerHTML = `
                    <tr><th>Conteúdo</th><th>Prazo</th><th></th></tr>
                `;
            } else if (dados.template === "compras") {
                thead.innerHTML = `
                    <tr><th>Item</th><th>Responsável</th><th></th></tr>
                `;
            } else if (dados.template === "contas") {
                thead.innerHTML = `
                    <tr><th>Conta</th><th>Responsável</th><th>Vencimento</th><th></th></tr>
                `;
            } else {
                thead.innerHTML = `
                    <tr><th>Tarefa</th><th>Responsável</th><th></th></tr>
                `;
            }

            dados.tarefas.forEach((tarefa, i) => {
                const tr = document.createElement("tr");

                if (dados.template === "estudos") {
                    tr.innerHTML = `
                        <td><input type="checkbox" ${tarefa.concluida ? "checked" : ""}> ${tarefa.texto}</td>
                        <td><input type="date" class="form-control" value="${tarefa.prazo || ""}"></td>
                        <td><button class="btn btn-outline-danger"><img src="./../assets/icons/trash3.svg"></button></td>
                    `;
                    tr.querySelector("input[type='date']").addEventListener("change", e => {
                        tarefa.prazo = e.target.value;
                        salvar(dados);
                    });
                } else if (dados.template === "compras") {
                    tr.innerHTML = `
                        <td><input type="checkbox" ${tarefa.concluida ? "checked" : ""}> ${tarefa.texto}</td>
                        <td><select class="form-select"><option ${tarefa.resp === "Eu" ? "selected" : ""}>Eu</option><option ${tarefa.resp === "Fulano" ? "selected" : ""}>Fulano</option><option ${tarefa.resp === "Ciclano" ? "selected" : ""}>Ciclano</option></select></td>
                        <td><button class="btn btn-outline-danger"><img src="./../assets/icons/trash3.svg"></button></td>
                    `;
                    tr.querySelector("select").addEventListener("change", e => {
                        tarefa.resp = e.target.value;
                        salvar(dados);
                    });
                } else if (dados.template === "contas") {
                    tr.innerHTML = `
                        <td><input type="checkbox" ${tarefa.concluida ? "checked" : ""}> ${tarefa.texto}</td>
                        <td><select class="form-select"><option ${tarefa.resp === "Eu" ? "selected" : ""}>Eu</option><option ${tarefa.resp === "Fulano" ? "selected" : ""}>Fulano</option><option ${tarefa.resp === "Ciclano" ? "selected" : ""}>Ciclano</option></select></td>
                        <td><input type="date" class="form-control" value="${tarefa.venc || ""}"></td>
                        <td><button class="btn btn-outline-danger"><img src="./../assets/icons/trash3.svg"></button></td>
                    `;
                    tr.querySelector("select").addEventListener("change", e => {
                        tarefa.resp = e.target.value;
                        salvar(dados);
                    });
                    tr.querySelector("input[type='date']").addEventListener("change", e => {
                        tarefa.venc = e.target.value;
                        salvar(dados);
                    });
                } else {
                    tr.innerHTML = `
                        <td><input type="checkbox" ${tarefa.concluida ? "checked" : ""}> ${tarefa.texto}</td>
                        <td><select class="form-select"><option ${tarefa.resp === "Eu" ? "selected" : ""}>Eu</option><option ${tarefa.resp === "Fulano" ? "selected" : ""}>Fulano</option><option ${tarefa.resp === "Ciclano" ? "selected" : ""}>Ciclano</option></select></td>
                        <td><button class="btn btn-outline-danger"><img src="./../assets/icons/trash3.svg"></button></td>
                    `;
                }

                tr.querySelector("input[type='checkbox']").addEventListener("change", e => {
                    tarefa.concluida = e.target.checked;
                    salvar(dados);
                });

                tr.querySelector("button").addEventListener("click", () => {
                    const currentActiveId = document.querySelector('.accordion-collapse.show')?.id;
                    dados.tarefas.splice(i, 1);
                    salvar(dados);
                    renderizarListas(currentActiveId);
                });

                tbody.appendChild(tr);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            body.appendChild(table);

            const inputGroup = document.createElement("div");
            inputGroup.className = "input-group mt-2";
            inputGroup.innerHTML = `
                <input type="text" class="form-control" placeholder="Adicionar nova tarefa">
                <button class="btn btn-outline-success">Criar +</button>
            `;
            body.appendChild(inputGroup);

            const input = inputGroup.querySelector("input");
            const btnAdd = inputGroup.querySelector("button");

            btnAdd.addEventListener("click", () => {
                if (input.value.trim() !== "") {
                    const currentActiveId = document.querySelector('.accordion-collapse.show')?.id;
                    let novaTarefa = { texto: input.value.trim(), concluida: false };
                    if (dados.template === "padrao" || dados.template === "compras" || dados.template === "contas") {
                        novaTarefa.resp = "Eu";
                    }
                    if (dados.template === "estudos") {
                        novaTarefa.prazo = "";
                    }
                    if (dados.template === "contas") {
                        novaTarefa.venc = "";
                    }

                    dados.tarefas.push(novaTarefa);
                    salvar(dados);
                    renderizarListas(currentActiveId);
                    
                }
            });
            accordion.appendChild(item);
        });
    }

    async function carregarListas() {
        try {
            const response = await fetch(`/listas/${usuario_id}`);
            listas = await response.json();
            renderizarListas();
        } catch (error) {
            console.error('Erro ao carregar listas:', error);
            accordion.innerHTML = '<p>Erro ao carregar suas listas.</p>';
        }
    }
    carregarListas();
});