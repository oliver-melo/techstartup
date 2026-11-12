class Funcionario {
    constructor(id, nome, idade, cargo, salario) {
        this._id = id;
        this._nome = nome;
        this._idade = Number(idade);
        this._cargo = cargo;
        this._salario = Number(salario);
    }

    getId() { return this._id; }
    getNome() { return this._nome; }
    getIdade() { return this._idade; }
    getCargo() { return this._cargo; }
    getSalario() { return this._salario; }

    setNome(novoNome) { this._nome = novoNome; }
    setIdade(novaIdade) { this._idade = Number(novaIdade); }
    setCargo(novoCargo) { this._cargo = novoCargo; }
    setSalario(novoSalario) { this._salario = Number(novoSalario); }

    toString() {
        return `ID: ${this._id} | Nome: ${this._nome} | Idade: ${this._idade} | Cargo: ${this._cargo} | Salário: R$ ${this._salario.toFixed(2)}`;
    }
}

let funcionarios = [];
let proximoId = 1;
let idEdicao = null;

// --- Funções de manipulação reescritas com Arrow Functions (Expressões Lambda) ---

// Busca um funcionário pelo ID usando expressão lambda (.find)
const buscarPorId = (id) => funcionarios.find(f => f.getId() === Number(id));

// Busca funcionários pelo Nome usando expressão lambda (.filter)
const buscarPorNome = (nome) => funcionarios.filter(f =>
    f.getNome().toLowerCase().includes(nome.trim().toLowerCase())
);

// Direciona a pesquisa conforme a opção selecionada no combobox
const filtrarFuncionarios = (tipo, termo) => {
    const termoLimpo = termo.trim();
    if (!termoLimpo) return funcionarios;

    if (tipo === 'id') {
        const encontrado = buscarPorId(termoLimpo);
        return encontrado ? [encontrado] : [];
    } else {
        return buscarPorNome(termoLimpo);
    }
}

;const limparFormulario = () => {
    document.getElementById('nome').value = '';
    document.getElementById('idade').value = '';
    document.getElementById('cargo').value = '';
    document.getElementById('salario').value = '';
};

// Cadastro e Atualização usando arrow function e busca por ID
const salvarFuncionario = () => {
    const nomeInput = document.getElementById('nome');
    const idadeInput = document.getElementById('idade');
    const cargoInput = document.getElementById('cargo');
    const salarioInput = document.getElementById('salario');

    const nome = nomeInput.value.trim();
    const idade = idadeInput.value;
    const cargo = cargoInput.value.trim();
    const salario = salarioInput.value;

    if (!nome || !idade || !cargo || !salario) {
        alert('Preencha todos os campos!');
        return;
    }

    if (idEdicao === null) {
        const novoFuncionario = new Funcionario(proximoId++, nome, idade, cargo, salario);
        funcionarios.push(novoFuncionario);
        console.log('Cadastrado:', novoFuncionario.toString());
    } else {
        // Localiza o funcionário pelo ID com lambda e atualiza via setters
        const funcExistente = buscarPorId(idEdicao);
        if (funcExistente) {
            funcExistente.setNome(nome);
            funcExistente.setIdade(idade);
            funcExistente.setCargo(cargo);
            funcExistente.setSalario(salario);
            console.log('Atualizado:', funcExistente.toString());
        }
        idEdicao = null;
        document.getElementById('btn-salvar').innerText = 'Cadastrar';
    }

    limparFormulario();
    renderizarTabela();
};

const carregarParaEdicao = (id) => {
    const func = buscarPorId(id);
    if (!func) return;

    document.getElementById('nome').value = func.getNome();
    document.getElementById('idade').value = func.getIdade();
    document.getElementById('cargo').value = func.getCargo();
    document.getElementById('salario').value = func.getSalario();

    idEdicao = id;
    document.getElementById('btn-salvar').innerText = 'Atualizar';
};

// Remoção usando arrow function e .filter / .findIndex
const excluirFuncionario = (id) => {
    funcionarios = funcionarios.filter(f => f.getId() !== id);

    if (idEdicao === id) {
        limparFormulario();
        idEdicao = null;
        document.getElementById('btn-salvar').innerText = 'Cadastrar';
    }

    renderizarTabela();
};

const renderizarTabela = (lista = funcionarios) => {
    const tbody = document.getElementById('tabela-corpo');
    tbody.innerHTML = '';

    lista.forEach(func => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${func.getId()}</td>
            <td>${func.getNome()}</td>
            <td>${func.getIdade()}</td>
            <td>${func.getCargo()}</td>
            <td>R$ ${func.getSalario().toFixed(2)}</td>
            <td>
                <button type="button" class="btn-editar">Editar</button>
                <button type="button" class="btn-excluir">Excluir</button>
            </td>
        `;

        const btnEditar = tr.querySelector('.btn-editar');
        const btnExcluir = tr.querySelector('.btn-excluir');

        // Exemplo 1: Evento de clique usando função anônima tradicional
        btnEditar.addEventListener('click', function () {
            carregarParaEdicao(func.getId());
        });

        // Exemplo 2: Substituindo função anônima tradicional por Arrow Function (Lambda)
        // Antes: btnExcluir.addEventListener('click', function () { excluirFuncionario(func.getId()); });
        btnExcluir.addEventListener('click', () => excluirFuncionario(func.getId()));

        tbody.appendChild(tr);
    });
};

// --- Eventos do Formulário e Busca ---

// Função anônima tradicional no evento de clique do botão Cadastrar
document.getElementById('btn-salvar').addEventListener('click', function () {
    salvarFuncionario();
});

// Substituição de função anônima por Arrow Function nos eventos de form e busca
document.getElementById('form-funcionario').addEventListener('submit', (event) => event.preventDefault());

document.getElementById('btn-buscar').addEventListener('click', () => {
    const tipo = document.getElementById('tipo-busca').value;
    const termo = document.getElementById('campo-busca').value;
    const resultado = filtrarFuncionarios(tipo, termo);
    renderizarTabela(resultado);
});

document.getElementById('btn-limpar-busca').addEventListener('click', () => {
    document.getElementById('campo-busca').value = '';
    renderizarTabela(funcionarios);
});
