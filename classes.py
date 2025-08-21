# Arquivo: classes.py

# =================================
# BLOCO 1: CLASSE USUARIO
# =================================
class Usuario:
    """
    Representa um usuário do sistema de tarefas.
    """
    def __init__(self, nome, email, senha, foto):
        # Atributos do usuário
        self.id_usuario = None
        self.nome = nome
        self.email = email
        self.senha = senha
        self.foto = foto
        self.listas_de_tarefas = []

    # MÉTODO ATUALIZADO (ESSA É UMA DAS CORREÇÕES)
    def adicionar_lista(self, nome_da_lista):
        nova_lista = ListaDeTarefas(nome_da_lista)
        self.listas_de_tarefas.append(nova_lista)
        print(f"Lista '{nome_da_lista}' adicionada para o usuário {self.nome}.")

    def remover_lista(self, id_da_lista):
        print(f"Lógica para remover a lista com ID {id_da_lista} do usuário {self.nome}...")
        pass
    
    def __str__(self):
        return f"Usuário: {self.nome}, E-mail: {self.email}"

# =================================
# BLOCO 2: CLASSE LISTADETAREFAS (LUGAR CORRETO)
# =================================
class ListaDeTarefas:
    """
    Representa uma lista de tarefas, como 'Compras' ou 'Estudos'.
    """
    def __init__(self, nome):
        self.id_lista = None
        self.nome = nome
        self.tarefas = []

    def adicionar_tarefa(self, descricao_da_tarefa):
        nova_tarefa = Tarefa(descricao_da_tarefa)
        self.tarefas.append(nova_tarefa)
        print(f"-> Tarefa '{descricao_da_tarefa}' adicionada à lista '{self.nome}'.")

    def marcar_tarefa_concluida(self, id_da_tarefa):
        # Em um sistema real, buscaríamos a tarefa pelo ID.
        for tarefa in self.tarefas:
            if not tarefa.concluida:
                tarefa.marcar_como_concluida()
                break
    
    def __str__(self):
        return f"Lista: '{self.nome}' ({len(self.tarefas)} tarefas)"

# =================================
# BLOCO 3: CLASSE TAREFA (LUGAR CORRETO)
# =================================
class Tarefa:
    """
    Representa uma única tarefa.
    """
    def __init__(self, descricao):
        self.id_tarefa = None
        self.descricao = descricao
        self.concluida = False

    def marcar_como_concluida(self):
        self.concluida = True
        print(f"   - Tarefa '{self.descricao}' marcada como concluída.")

    def __str__(self):
        status = "Concluída" if self.concluida else "Pendente"
        return f"- {self.descricao} [{status}]"

# =================================
# BLOCO 4: BLOCO DE TESTE (CÓDIGO CORRETO NO LUGAR CORRETO)
# =================================
if __name__ == "__main__":
    
    # 1. Criamos um usuário
    usuario_teste = Usuario(
        nome="Dannyel", 
        email="dannyel@email.com", 
        senha="123", 
        foto="foto.jpg"
    )
    print(f"Usuário criado: {usuario_teste.nome}")
    
    # 2. Adicionamos listas de tarefas a este usuário
    usuario_teste.adicionar_lista("Compras do Supermercado")
    usuario_teste.adicionar_lista("Estudos Globotech")

    # 3. Acessamos a primeira lista e adicionamos tarefas a ela
    print(f"\nAdicionando tarefas à lista '{usuario_teste.listas_de_tarefas[0].nome}':")
    lista_compras = usuario_teste.listas_de_tarefas[0]
    lista_compras.adicionar_tarefa("Comprar leite")
    lista_compras.adicionar_tarefa("Comprar pão")

    # 4. Acessamos a segunda lista e adicionamos tarefas a ela
    print(f"\nAdicionando tarefas à lista '{usuario_teste.listas_de_tarefas[1].nome}':")
    lista_estudos = usuario_teste.listas_de_tarefas[1]
    lista_estudos.adicionar_tarefa("Finalizar o projeto")

    # 5. Marcamos uma tarefa como concluída
    print("\nMarcando uma tarefa como concluída:")
    lista_compras.marcar_tarefa_concluida(1)

    # 6. Imprimimos o resumo final
    print("\n--- RESUMO FINAL ---")
    print(usuario_teste)
    for lista in usuario_teste.listas_de_tarefas:
        print(f"  {lista}")
        for tarefa in lista.tarefas:
            print(f"    {tarefa}")