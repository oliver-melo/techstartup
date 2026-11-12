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

// Array em memória e controle de ID sequencial
let funcionarios = [];
let proximoId = 1;

function cadastrarFuncionario() {
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

    const novoFuncionario = new Funcionario(proximoId++, nome, idade, cargo, salario);
    funcionarios.push(novoFuncionario);

    console.log(novoFuncionario.toString());

    limparFormulario();
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
        `;

        tbody.appendChild(tr);
    }
}

function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('idade').value = '';
    document.getElementById('cargo').value = '';
    document.getElementById('salario').value = '';
}
