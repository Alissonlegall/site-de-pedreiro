// Dados dos tipos de tijolos (dimensões em cm)
const tiposTijolos = {
    baiano: { comprimento: 19, altura: 9, espessura: 19, nome: "Tijolo Baiano" },
    "6furos": { comprimento: 19, altura: 9, espessura: 14, nome: "Tijolo 6 Furos" },
    "8furos": { comprimento: 19, altura: 9, espessura: 19, nome: "Tijolo 8 Furos" },
    concreto14: { comprimento: 39, altura: 19, espessura: 14, nome: "Bloco Concreto 14cm" },
    concreto20: { comprimento: 39, altura: 19, espessura: 20, nome: "Bloco Concreto 20cm" }
};

// Dados de projetos
let projetos = JSON.parse(localStorage.getItem('projetos')) || [];

// Inicialização quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    inicializarCalculadora();
    inicializarOrcamento();
    inicializarProjetos();
});

// Calculadora de Materiais
function inicializarCalculadora() {
    document.getElementById('calcular-materiais').addEventListener('click', calcularMateriais);
}

function calcularMateriais() {
    // Obter valores dos inputs
    const comprimento = parseFloat(document.getElementById('comprimento').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const tipoTijolo = document.getElementById('tijolo').value;
    const espessuraRejunte = parseFloat(document.getElementById('rejunte').value) / 100; // Converter para metros
    const margemSeguranca = parseFloat(document.getElementById('margem').value) / 100;
    const traco = document.getElementById('traco').value;

    // Validar entradas
    if (!comprimento || !altura || !tipoTijolo) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Obter dados do tijolo selecionado
    const tijolo = tiposTijolos[tipoTijolo];
    
    // Converter dimensões do tijolo para metros
    const comprimentoTijolo = tijolo.comprimento / 100;
    const alturaTijolo = tijolo.altura / 100;
    
    // Calcular área da parede
    const areaParede = comprimento * altura;
    
    // Calcular área do tijolo com rejunte
    const comprimentoTijoloComRejunte = comprimentoTijolo + espessuraRejunte;
    const alturaTijoloComRejunte = alturaTijolo + espessuraRejunte;
    const areaTijoloComRejunte = comprimentoTijoloComRejunte * alturaTijoloComRejunte;
    
    // Calcular quantidade de tijolos
    let quantidadeTijolos = areaParede / areaTijoloComRejunte;
    
    // Aplicar margem de segurança
    quantidadeTijolos = quantidadeTijolos * (1 + margemSeguranca);
    
    // Calcular volume de argamassa (estimativa simplificada)
    const volumeArgamassa = areaParede * 0.02; // 2cm de espessura média
    
    // Calcular componentes da argamassa baseado no traço
    let cimento, areia, cal;
    
    switch(traco) {
        case '1:2:1':
            // 1 parte cimento, 2 partes areia, 1 parte cal
            cimento = volumeArgamassa / 4;
            areia = volumeArgamassa / 2;
            cal = volumeArgamassa / 4;
            break;
        case '1:4:1':
            // 1 parte cimento, 4 partes areia, 1 parte cal
            cimento = volumeArgamassa / 6;
            areia = volumeArgamassa * 2/3;
            cal = volumeArgamassa / 6;
            break;
        case '1:3:1':
        default:
            // 1 parte cimento, 3 partes areia, 1 parte cal (padrão)
            cimento = volumeArgamassa / 5;
            areia = volumeArgamassa * 3/5;
            cal = volumeArgamassa / 5;
            break;
    }
    
    // Converter para unidades práticas
    // 1 saco de cimento = 0,03 m³ | 1 saco de cal = 0,02 m³
    const sacosCimento = Math.ceil(cimento / 0.03);
    const sacosCal = Math.ceil(cal / 0.02);
    
    // Exibir resultados
    document.getElementById('quantidade-tijolos').textContent = Math.ceil(quantidadeTijolos);
    document.getElementById('volume-argamassa').textContent = volumeArgamassa.toFixed(3) + ' m³';
    document.getElementById('cimento').textContent = sacosCimento + ' sacos';
    document.getElementById('areia').textContent = areia.toFixed(3) + ' m³';
    document.getElementById('cal').textContent = sacosCal + ' sacos';
    
    // Mostrar resultados
    document.getElementById('resultados-materiais').classList.remove('hidden');
    
    // Atualizar orçamento com os materiais calculados
    atualizarMateriaisOrcamento(tijolo.nome, Math.ceil(quantidadeTijolos), sacosCimento, areia, sacosCal);
}

// Ferramenta de Orçamento
function inicializarOrcamento() {
    document.getElementById('calcular-orcamento').addEventListener('click', calcularOrcamento);
    document.getElementById('adicionar-material').addEventListener('click', adicionarMaterialPersonalizado);
}

function atualizarMateriaisOrcamento(nomeTijolo, qtdTijolos, sacosCimento, volumeAreia, sacosCal) {
    const listaMateriais = document.getElementById('lista-materiais-orcamento');
    listaMateriais.innerHTML = '';
    
    // Adicionar tijolos
    adicionarItemOrcamento(listaMateriais, nomeTijolo, qtdTijolos, 'unidade', 0);
    
    // Adicionar cimento
    adicionarItemOrcamento(listaMateriais, 'Cimento', sacosCimento, 'saco', 25);
    
    // Adicionar areia
    adicionarItemOrcamento(listaMateriais, 'Areia', volumeAreia, 'm³', 60);
    
    // Adicionar cal
    adicionarItemOrcamento(listaMateriais, 'Cal', sacosCal, 'saco', 15);
}

function adicionarItemOrcamento(container, nome, quantidade, unidade, precoUnitario) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'material-item';
    itemDiv.innerHTML = `
        <div class="input-group">
            <label>${nome}:</label>
            <div style="display: flex; gap: 10px;">
                <input type="number" value="${quantidade}" step="1" min="0" class="quantidade" placeholder="Quantidade" style="flex: 1;">
                <input type="number" value="${precoUnitario}" step="0.01" min="0" class="preco" placeholder="Preço unitário" style="flex: 1;">
                <span style="line-height: 2.5;">${unidade}</span>
            </div>
        </div>
    `;
    container.appendChild(itemDiv);
}

function adicionarMaterialPersonalizado() {
    const listaMateriais = document.getElementById('lista-materiais-orcamento');
    const itemDiv = document.createElement('div');
    itemDiv.className = 'material-item';
    itemDiv.innerHTML = `
        <div class="input-group">
            <label>Material Personalizado:</label>
            <div style="display: flex; gap: 10px; margin-bottom: 5px;">
                <input type="text" class="nome-material" placeholder="Nome do material" style="flex: 1;">
            </div>
            <div style="display: flex; gap: 10px;">
                <input type="number" value="0" step="1" min="0" class="quantidade" placeholder="Quantidade" style="flex: 1;">
                <input type="number" value="0" step="0.01" min="0" class="preco" placeholder="Preço unitário" style="flex: 1;">
                <input type="text" class="unidade" placeholder="Unidade" style="flex: 1;">
            </div>
        </div>
    `;
    listaMateriais.appendChild(itemDiv);
}

function calcularOrcamento() {
    const areaTotal = parseFloat(document.getElementById('area-total').value) || 0;
    const custoMaoObra = parseFloat(document.getElementById('custo-mao-obra').value) || 0;
    
    // Calcular custo de mão de obra
    const custoMaoObraTotal = areaTotal * custoMaoObra;
    
    // Calcular custo de materiais
    let custoMateriaisTotal = 0;
    const itensMateriais = document.querySelectorAll('.material-item');
    
    itensMateriais.forEach(item => {
        const quantidade = parseFloat(item.querySelector('.quantidade').value) || 0;
        const preco = parseFloat(item.querySelector('.preco').value) || 0;
        custoMateriaisTotal += quantidade * preco;
    });
    
    // Calcular total do orçamento
    const orcamentoTotal = custoMateriaisTotal + custoMaoObraTotal;
    
    // Exibir resultados
    document.getElementById('custo-materiais').textContent = `R$ ${custoMateriaisTotal.toFixed(2)}`;
    document.getElementById('custo-mao-obra-total').textContent = `R$ ${custoMaoObraTotal.toFixed(2)}`;
    document.getElementById('valor-total').textContent = `R$ ${orcamentoTotal.toFixed(2)}`;
    
    // Mostrar resultados
    document.getElementById('resultados-orcamento').classList.remove('hidden');
}

// Gerenciador de Projetos
function inicializarProjetos() {
    document.getElementById('criar-projeto').addEventListener('click', criarProjeto);
    carregarProjetos();
}

function criarProjeto() {
    const nomeProjeto = document.getElementById('nome-projeto').value.trim();
    
    if (!nomeProjeto) {
        alert('Por favor, informe um nome para o projeto.');
        return;
    }
    
    const novoProjeto = {
        id: Date.now(),
        nome: nomeProjeto,
        etapas: [],
        dataCriacao: new Date().toISOString()
    };
    
    projetos.push(novoProjeto);
    salvarProjetos();
    carregarProjetos();
    
    // Limpar campo
    document.getElementById('nome-projeto').value = '';
}

function carregarProjetos() {
    const listaProjetos = document.getElementById('lista-projetos');
    listaProjetos.innerHTML = '';
    
    if (projetos.length === 0) {
        listaProjetos.innerHTML = '<p>Nenhum projeto criado ainda.</p>';
        return;
    }
    
    projetos.forEach(projeto => {
        const projetoElement = document.createElement('div');
        projetoElement.className = 'project-item';
        projetoElement.innerHTML = `
            <h3>${projeto.nome}</h3>
            <p>Criado em: ${new Date(projeto.dataCriacao).toLocaleDateString()}</p>
            <button class="btn-ver-projeto" data-id="${projeto.id}">Ver Detalhes</button>
            <button class="btn-excluir-projeto" data-id="${projeto.id}">Excluir</button>
        `;
        listaProjetos.appendChild(projetoElement);
    });
    
    // Adicionar event listeners aos botões
    document.querySelectorAll('.btn-ver-projeto').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            verProjeto(id);
        });
    });
    
    document.querySelectorAll('.btn-excluir-projeto').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            excluirProjeto(id);
        });
    });
}

function verProjeto(id) {
    // Implementar visualização detalhada do projeto
    alert(`Visualizando projeto ${id}. Esta funcionalidade será implementada em uma versão futura.`);
}

function excluirProjeto(id) {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        projetos = projetos.filter(projeto => projeto.id !== id);
        salvarProjetos();
        carregarProjetos();
    }
}

function salvarProjetos() {
    localStorage.setItem('projetos', JSON.stringify(projetos));
}