// Navegação entre seções
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Atualizar links ativos
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Mostrar seção correspondente
        const targetId = this.getAttribute('href').substring(1);
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(targetId).classList.add('active');
        
        // Fechar menu mobile se aberto
        document.getElementById('mobileNav').classList.remove('active');
    });
});

// Menu mobile
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.getElementById('mobileNav').classList.toggle('active');
});

// Calculadora de materiais
document.getElementById('calc-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const comprimento = parseFloat(document.getElementById('comprimento').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const quantidadeParedes = parseInt(document.getElementById('quantidade-paredes').value);
    const tipoTijolo = document.getElementById('tipo-tijolo').value;
    
    // Calcular área total das paredes
    const areaParede = comprimento * altura;
    const areaTotal = areaParede * quantidadeParedes;
    
    // Valores de referência (podem ser ajustados)
    let tijolosPorMetro = 0;
    let argamassaPorMetro = 0;
    
    switch(tipoTijolo) {
        case '6furos':
            tijolosPorMetro = 40;
            argamassaPorMetro = 25;
            break;
        case '8furos':
            tijolosPorMetro = 30;
            argamassaPorMetro = 20;
            break;
        case 'baiano':
            tijolosPorMetro = 25;
            argamassaPorMetro = 30;
            break;
        case 'ceramico':
            tijolosPorMetro = 45;
            argamassaPorMetro = 22;
            break;
    }
    
    // Calcular quantidades
    const qtdTijolos = Math.ceil(areaTotal * tijolosPorMetro * 1.1); // +10% para perdas
    const qtdArgamassa = areaTotal * argamassaPorMetro;
    const qtdCimento = qtdArgamassa * 0.2; // Proporção aproximada
    const qtdAreia = qtdArgamassa * 0.6;   // Proporção aproximada
    const qtdCal = qtdArgamassa * 0.2;     // Proporção aproximada
    
    // Exibir resultados
    document.getElementById('tijolos').querySelector('span').textContent = qtdTijolos;
    document.getElementById('argamassa').querySelector('span').textContent = qtdArgamassa.toFixed(2);
    document.getElementById('cimento').querySelector('span').textContent = qtdCimento.toFixed(2);
    document.getElementById('areia').querySelector('span').textContent = qtdAreia.toFixed(2);
    document.getElementById('cal').querySelector('span').textContent = qtdCal.toFixed(2);
    
    document.getElementById('resultado-calc').classList.add('mostrar');
});

// Calculadora de orçamento
document.getElementById('orcamento-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const tipoServico = document.getElementById('tipo-servico').value;
    const areaServico = parseFloat(document.getElementById('area-servico').value);
    const custoMaterial = parseFloat(document.getElementById('custo-material').value);
    const maoObra = parseFloat(document.getElementById('mao-obra').value);
    
    // Calcular totais
    const totalMateriais = areaServico * custoMaterial;
    const totalMaoObra = areaServico * maoObra;
    const totalServico = totalMateriais + totalMaoObra;
    
    // Exibir resultados
    document.getElementById('total-materiais').textContent = totalMateriais.toFixed(2);
    document.getElementById('total-mao-obra').textContent = totalMaoObra.toFixed(2);
    document.getElementById('total-servico').textContent = totalServico.toFixed(2);
    
    document.getElementById('resultado-orcamento').classList.add('mostrar');
});

// Adicionar campos de material
document.getElementById('adicionar-material').addEventListener('click', function() {
    const materiaisDiv = document.getElementById('materiais-projeto');
    const novoMaterial = document.createElement('div');
    novoMaterial.className = 'material-projeto';
    novoMaterial.innerHTML = `
        <input type="text" placeholder="Nome do material" class="material-nome">
        <input type="number" placeholder="Quantidade" min="1" class="material-quantidade">
        <input type="number" placeholder="Preço unitário (R$)" step="0.01" min="0" class="material-preco">
        <button type="button" class="remover-material" onclick="removerMaterial(this)">×</button>
    `;
    materiaisDiv.appendChild(novoMaterial);
});

// Função para remover material
function removerMaterial(botao) {
    const materialDiv = botao.closest('.material-projeto');
    materialDiv.remove();
}

// Gerenciamento de projetos
document.getElementById('novo-projeto-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nomeProjeto = document.getElementById('nome-projeto').value;
    const descricaoProjeto = document.getElementById('descricao-projeto').value;
    const dataPrevisao = document.getElementById('data-previsao').value;
    
    // Coletar informações dos materiais
    const materiais = [];
    const materiaisElements = document.querySelectorAll('.material-projeto');
    
    materiaisElements.forEach(materialEl => {
        const nome = materialEl.querySelector('.material-nome').value;
        const quantidade = materialEl.querySelector('.material-quantidade').value;
        const preco = materialEl.querySelector('.material-preco').value;
        
        if (nome && quantidade && preco) {
            materiais.push({
                nome: nome,
                quantidade: quantidade,
                preco: preco,
                total: (quantidade * preco).toFixed(2)
            });
        }
    });
    
    // Calcular custo total dos materiais
    const custoTotalMateriais = materiais.reduce((total, material) => {
        return total + parseFloat(material.total);
    }, 0);
    
    // Criar elemento do projeto com informações de materiais
    const projetoDiv = document.createElement('div');
    projetoDiv.className = 'projeto-item';
    
    let materiaisHTML = '';
    if (materiais.length > 0) {
        materiaisHTML = `
            <h4>Materiais:</h4>
            <table class="tabela-materiais">
                <tr>
                    <th>Material</th>
                    <th>Quantidade</th>
                    <th>Preço Unit.</th>
                    <th>Total</th>
                </tr>
                ${materiais.map(material => `
                    <tr>
                        <td>${material.nome}</td>
                        <td>${material.quantidade}</td>
                        <td>R$ ${material.preco}</td>
                        <td>R$ ${material.total}</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="3"><strong>Total Materiais:</strong></td>
                    <td><strong>R$ ${custoTotalMateriais.toFixed(2)}</strong></td>
                </tr>
            </table>
        `;
    }
    
    projetoDiv.innerHTML = `
        <h4>${nomeProjeto}</h4>
        <p>${descricaoProjeto}</p>
        <p><strong>Previsão de conclusão:</strong> ${formatarData(dataPrevisao)}</p>
        ${materiaisHTML}
        <div class="progresso-obra">
            <div class="progresso-barra" style="width: 0%">0%</div>
        </div>
        <h4>Tarefas:</h4>
        <div class="tarefas-lista">
            <div class="tarefa-item">
                <input type="checkbox" id="tarefa-1" onchange="atualizarProgresso(this)">
                <label for="tarefa-1">Fundação</label>
            </div>
            <div class="tarefa-item">
                <input type="checkbox" id="tarefa-2" onchange="atualizarProgresso(this)">
                <label for="tarefa-2">Alvenaria</label>
            </div>
            <div class="tarefa-item">
                <input type="checkbox" id="tarefa-3" onchange="atualizarProgresso(this)">
                <label for="tarefa-3">Reboco</label>
            </div>
            <div class="tarefa-item">
                <input type="checkbox" id="tarefa-4" onchange="atualizarProgresso(this)">
                <label for="tarefa-4">Instalações</label>
            </div>
            <div class="tarefa-item">
                <input type="checkbox" id="tarefa-5" onchange="atualizarProgresso(this)">
                <label for="tarefa-5">Acabamento</label>
            </div>
        </div>
        <button onclick="removerProjeto(this)" style="margin-top: 10px; background-color: var(--warning-color)">Remover Projeto</button>
    `;
    
    // Adicionar à lista de projetos
    const listaProjetos = document.getElementById('lista-projetos');
    const semProjetos = listaProjetos.querySelector('.sem-projetos');
    
    if (semProjetos) {
        semProjetos.remove();
    }
    
    listaProjetos.appendChild(projetoDiv);
    
    // Limpar formulário e materiais
    this.reset();
    document.getElementById('materiais-projeto').innerHTML = `
        <div class="material-projeto">
            <input type="text" placeholder="Nome do material" class="material-nome">
            <input type="number" placeholder="Quantidade" min="1" class="material-quantidade">
            <input type="number" placeholder="Preço unitário (R$)" step="0.01" min="0" class="material-preco">
            <button type="button" class="remover-material" onclick="removerMaterial(this)">×</button>
        </div>
    `;
});

// Função para formatar data
function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Função para atualizar progresso
function atualizarProgresso(checkbox) {
    const tarefas = checkbox.parentElement.parentElement.querySelectorAll('.tarefa-item');
    const checkboxes = checkbox.parentElement.parentElement.querySelectorAll('input[type="checkbox"]');
    
    let concluidas = 0;
    checkboxes.forEach(cb => {
        if (cb.checked) concluidas++;
    });
    
    const percentual = Math.round((concluidas / tarefas.length) * 100);
    const barraProgresso = checkbox.closest('.projeto-item').querySelector('.progresso-barra');
    
    barraProgresso.style.width = `${percentual}%`;
    barraProgresso.textContent = `${percentual}%`;
}

// Função para remover projeto
function removerProjeto(botao) {
    const projeto = botao.closest('.projeto-item');
    projeto.remove();
    
    const listaProjetos = document.getElementById('lista-projetos');
    if (listaProjetos.children.length === 0) {
        listaProjetos.innerHTML = '<p class="sem-projetos">Nenhum projeto cadastrado ainda.</p>';
    }
}