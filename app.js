class Funcionario {
    constructor(id, nome, idade, cargo, salario) {
        this._id = id;
        this._nome = nome;
        this._idade = Number(idade);
        this._cargo = cargo;
        this._salario = Number(salario);
    }

    // Métodos Getters
    getId() {
        return this._id;
    }

    getNome() {
        return this._nome;
    }

    getIdade() {
        return this._idade;
    }

    getCargo() {
        return this._cargo;
    }

    getSalario() {
        return this._salario;
    }

    // Métodos Setters
    setNome(novoNome) {
        this._nome = novoNome;
    }

    setIdade(novaIdade) {
        this._idade = Number(novaIdade);
    }

    setCargo(novoCargo) {
        this._cargo = novoCargo;
    }

    setSalario(novoSalario) {
        this._salario = Number(novoSalario);
    }

    toString() {
        return `ID: ${this._id} | Nome: ${this._nome} | Idade: ${this._idade} | Cargo: ${this._cargo} | Salário: R$ ${this._salario.toFixed(2)}`;
    }
}

let funcionarios = [];
let proximoId = 1;
let indiceEdicao = null;

function salvarFuncionario() {
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

    if (indiceEdicao === null) {
        // Cadastra novo funcionário
        const novoFuncionario = new Funcionario(proximoId++, nome, idade, cargo, salario);
        funcionarios.push(novoFuncionario);
        console.log('Cadastrado:', novoFuncionario.toString());
    } else {
        // Atualiza os atributos usando os métodos da classe Funcionario
        const funcExistente = funcionarios[indiceEdicao];
        funcExistente.setNome(nome);
        funcExistente.setIdade(idade);
        funcExistente.setCargo(cargo);
        funcExistente.setSalario(salario);

        console.log('Atualizado:', funcExistente.toString());
        indiceEdicao = null;
        document.getElementById('btn-salvar').innerText = 'Cadastrar';
    }

    limparFormulario();
    renderizarTabela();
}

function carregarParaEdicao(index) {
    const func = funcionarios[index];

    document.getElementById('nome').value = func.getNome();
    document.getElementById('idade').value = func.getIdade();
    document.getElementById('cargo').value = func.getCargo();
    document.getElementById('salario').value = func.getSalario();

    indiceEdicao = index;
    document.getElementById('btn-salvar').innerText = 'Atualizar';
}

function excluirFuncionario(index) {
    funcionarios.splice(index, 1);

    if (indiceEdicao === index) {
        limparFormulario();
        indiceEdicao = null;
        document.getElementById('btn-salvar').innerText = 'Cadastrar';
    } else if (indiceEdicao !== null && index < indiceEdicao) {
        indiceEdicao--;
    }

    renderizarTabela();
}

function renderizarTabela() {
    const tbody = document.getElementById('tabela-corpo');
    tbody.innerHTML = '';

    for (let i = 0; i < funcionarios.length; i++) {
        const func = funcionarios[i];
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

        // Eventos onclick utilizando funções anônimas
        const btnEditar = tr.querySelector('.btn-editar');
        const btnExcluir = tr.querySelector('.btn-excluir');

        btnEditar.onclick = function () {
            carregarParaEdicao(i);
        };

        btnExcluir.onclick = function () {
            excluirFuncionario(i);
        };

        tbody.appendChild(tr);
    }
}

function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('idade').value = '';
    document.getElementById('cargo').value = '';
    document.getElementById('salario').value = '';
}

// Evento onclick do botão principal com função anônima
document.getElementById('btn-salvar').onclick = function () {
    salvarFuncionario();
};
