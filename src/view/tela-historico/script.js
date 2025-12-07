// Variáveis globais
let historicoDados = [];
let itensPorPagina = 0; 
let paginaAtual = 1;
let totalPaginas = 1;

function recalcularItensPorTela() {
    const alturaJanela = window.innerHeight;
    
    const headerElement = document.querySelector('.page-header');
    const alturaHeader = headerElement ? headerElement.offsetHeight : 100;
    const alturaPaginacao = 150; 
    const paddingContainer = 40; 
    const alturaCabecalhoTabela = 65; 
    const alturaLinha = 60; 
    const espacoDisponivel = alturaJanela - alturaHeader - alturaPaginacao - paddingContainer - alturaCabecalhoTabela;
    let novosItens = Math.floor(espacoDisponivel / alturaLinha);

    if (novosItens < 10) novosItens = 10;
    if (novosItens > 20) novosItens = 20;

    if (novosItens !== itensPorPagina) {
        itensPorPagina = novosItens;
        paginaAtual = 1;
        carregarDadosHistorico();
    }
}

// Carregar dados do histórico do backend
async function carregarDadosHistorico() {
    try {
        const resposta = await window.api.listarHistorico(paginaAtual, itensPorPagina);
        
        if (resposta.success && resposta.data) {
            historicoDados = resposta.data.registros;
            totalPaginas = resposta.data.totalPaginas;
            renderizarTela();
        } else {
            console.error('Erro ao carregar histórico:', resposta.error);
            mostrarErro('Erro ao carregar histórico: ' + (resposta.error || 'Desconhecido'));
        }
    } catch (erro) {
        console.error('Erro ao carregar histórico:', erro);
        mostrarErro('Erro ao conectar ao servidor');
    }
}

// Função para renderizar a tabela
function renderizarTela() {
    const tbody = document.getElementById('tabela-corpo');
    tbody.innerHTML = '';

    if (historicoDados.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="6" style="padding: 40px; color: #999;">Nenhum registro encontrado</td>';
        tbody.appendChild(tr);
    } else {
        historicoDados.forEach(dado => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${dado.id || 'N/A'}</td>
                <td>${dado.nome || 'N/A'}</td>
                <td>${dado.id_caso || 'N/A'}</td>
                <td>${dado.tipo || 'N/A'}</td>
                <td>${dado.mudanca || 'N/A'}</td>
                <td>${dado.campo || 'N/A'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    atualizarControlesPaginacao();

    setTimeout(() => {
        const container = document.querySelector('.main-content');
        if (container) container.scrollTop = 0;
        window.scrollTo(0, 0);
    }, 50);
}

// Função para atualizar os controles de paginação
function atualizarControlesPaginacao() {
    const container = document.getElementById('paginacao-container');
    container.innerHTML = '';

    // Botão anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.innerHTML = '<span class="material-symbols-outlined arrow-icon">navigate_before</span>';
    btnAnterior.disabled = paginaAtual === 1;
    btnAnterior.onclick = () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            carregarDadosHistorico();
        }
    };
    container.appendChild(btnAnterior);

    // Botões de página
    let paginasParaMostrar = [];
    const maxVizinhos = 2;

    if (totalPaginas <= 7) {
        for (let i = 1; i <= totalPaginas; i++) {
            paginasParaMostrar.push(i);
        }
    } else {
        paginasParaMostrar.push(1);

        let inicioJanela = paginaAtual - maxVizinhos;
        let fimJanela = paginaAtual + maxVizinhos;

        if (inicioJanela <= 2) {
            inicioJanela = 2;
            fimJanela = 6;
        }
        if (fimJanela >= totalPaginas - 1) {
            fimJanela = totalPaginas - 1;
            inicioJanela = totalPaginas - 5;
        }

        if (inicioJanela > 2) paginasParaMostrar.push('...');

        for (let i = inicioJanela; i <= fimJanela; i++) {
            paginasParaMostrar.push(i);
        }

        if (fimJanela < totalPaginas - 1) paginasParaMostrar.push('...');

        paginasParaMostrar.push(totalPaginas);
    }

    paginasParaMostrar.forEach(pagina => {
        const btn = document.createElement('button');
        btn.innerText = pagina;
        btn.classList.add('page-number');

        if (pagina === '...') {
            btn.disabled = true;
            btn.style.cursor = 'default';
        } else {
            if (pagina === paginaAtual) btn.classList.add('active');
            btn.onclick = () => {
                paginaAtual = pagina;
                carregarDadosHistorico();
            };
        }
        container.appendChild(btn);
    });

    // Botão próximo
    const btnProximo = document.createElement('button');
    btnProximo.innerHTML = '<span class="material-symbols-outlined arrow-icon">navigate_next</span>';
    btnProximo.disabled = paginaAtual === totalPaginas || totalPaginas === 0;
    btnProximo.onclick = () => {
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            carregarDadosHistorico();
        }
    };
    container.appendChild(btnProximo);
}

// Função para mostrar erro
function mostrarErro(mensagem) {
    const tbody = document.getElementById('tabela-corpo');
    tbody.innerHTML = `<tr><td colspan="6" style="padding: 40px; color: #d32f2f; text-align: center;">${mensagem}</td></tr>`;
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    recalcularItensPorTela(); 
});

// Recalcular quando a janela for redimensionada
window.addEventListener('resize', () => {
    recalcularItensPorTela();
});