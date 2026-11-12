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

// --- Funções de manipulação com Arrow Functions (Expressões Lambda) ---

const buscarPorId = (id) => funcionarios.find(f => f.getId() === Number(id));

const buscarPorNome = (nome) => funcionarios.filter(f =>
    f.getNome().toLowerCase().includes(nome.trim().toLowerCase())
);

const filtrarFuncionarios = (tipo, termo) => {
    const termoLimpo = termo.trim();
    if (!termoLimpo) return funcionarios;

    if (tipo === 'id') {
        const encontrado = buscarPorId(termoLimpo);
        return encontrado ? [encontrado] : [];
    } else {
        return buscarPorNome(termoLimpo);
    }
};

const limparFormulario = () => {
    document.getElementById('nome').value = '';
    document.getElementById('idade').value = '';
    document.getElementById('cargo').value = '';
    document.getElementById('salario').value = '';
};

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

const excluirFuncionario = (id) => {
    funcionarios = funcionarios.filter(f => f.getId() !== id);

    if (idEdicao === id) {
        limparFormulario();
        idEdicao = null;
        document.getElementById('btn-salvar').innerText = 'Cadastrar';
    }

    renderizarTabela();
    atualizarTodosRelatorios();
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

        btnEditar.addEventListener('click', function () {
            carregarParaEdicao(func.getId());
        });

        btnExcluir.addEventListener('click', () => excluirFuncionario(func.getId()));

        tbody.appendChild(tr);
    });
};

// --- Funções de Relatórios com Streams JS (Exercício 4) ---

// 1. Funcionários com salário maior que R$ 5000 (filter + map)
const obterRelatorioSalarioMaior5000 = () => {
    const filtrados = funcionarios
        .filter(f => f.getSalario() > 5000)
        .map(f => `${f.getNome()} (${f.getCargo()} - R$ ${f.getSalario().toFixed(2)})`);

    return filtrados.length > 0
        ? `<strong>Funcionários com Salário > R$ 5000:</strong> ${filtrados.join(', ')}`
        : '<strong>Funcionários com Salário > R$ 5000:</strong> Nenhum funcionário encontrado.';
};

// 2. Média salarial dos funcionários (reduce)
const obterRelatorioMediaSalarial = () => {
    if (funcionarios.length === 0) return '<strong>Média Salarial:</strong> R$ 0.00';
    const somaSalarios = funcionarios.reduce((acc, f) => acc + f.getSalario(), 0);
    const media = (somaSalarios / funcionarios.length).toFixed(2);
    return `<strong>Média Salarial:</strong> R$ ${media}`;
};

// 3. Listar apenas os cargos únicos sem repetição (map + new Set)
const obterRelatorioCargosUnicos = () => {
    if (funcionarios.length === 0) return '<strong>Cargos Únicos:</strong> Nenhum cargo cadastrado.';
    const cargosUnicos = [...new Set(funcionarios.map(f => f.getCargo()))];
    return `<strong>Cargos Únicos:</strong> ${cargosUnicos.join(', ')}`;
};

// 4. Lista de nomes em maiúsculo (map)
const obterRelatorioNomesMaiusculo = () => {
    if (funcionarios.length === 0) return '<strong>Nomes em Maiúsculo:</strong> Nenhum funcionário cadastrado.';
    const nomesMaiusculos = funcionarios.map(f => f.getNome().toUpperCase());
    return `<strong>Nomes em Maiúsculo:</strong> ${nomesMaiusculos.join(', ')}`;
};

const exibirRelatorio = (conteudoHtml) => {
    document.getElementById('resultado-relatorios').innerHTML = `<p>${conteudoHtml}</p>`;
};

const atualizarTodosRelatorios = () => {
    const container = document.getElementById('resultado-relatorios');
    if (funcionarios.length === 0) {
        container.innerHTML = '<p>Nenhum funcionário cadastrado para gerar relatórios.</p>';
        return;
    }

    container.innerHTML = `
        <p>${obterRelatorioSalarioMaior5000()}</p>
        <p>${obterRelatorioMediaSalarial()}</p>
        <p>${obterRelatorioCargosUnicos()}</p>
        <p>${obterRelatorioNomesMaiusculo()}</p>
    `;
};

// --- Eventos do Formulário e Busca ---

document.getElementById('btn-salvar').addEventListener('click', function () {
    salvarFuncionario();
});

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

// --- Eventos dos Botões de Relatórios ---

document.getElementById('btn-rel-salario').addEventListener('click', () => {
    exibirRelatorio(obterRelatorioSalarioMaior5000());
});

document.getElementById('btn-rel-media').addEventListener('click', () => {
    exibirRelatorio(obterRelatorioMediaSalarial());
});

document.getElementById('btn-rel-cargos').addEventListener('click', () => {
    exibirRelatorio(obterRelatorioCargosUnicos());
});

document.getElementById('btn-rel-maiusculo').addEventListener('click', () => {
    exibirRelatorio(obterRelatorioNomesMaiusculo());
});

document.getElementById('btn-rel-todos').addEventListener('click', () => {
    atualizarTodosRelatorios();
});
