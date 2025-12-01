const historicoDados = [];
//TESTANDO DADOS
for (let i = 1; i <= 100; i++) {
    historicoDados.push({
        id: i,
        nome: i % 2 === 0 ? "Maria Silva" : "Ana Pereira",
        caso: `Caso #${100 + i}`,
        acao: i % 3 === 0 ? "EXCLUIU" : "EDITOU",
        mudanca: "Alteração de dados cadastrais",
        campo: "Dados Pessoais"
    });
}
const ITENS_POR_PAGINA = 15;
let paginaAtual = 1;

function renderizarTela() {
    const tbody = document.getElementById('tabela-corpo');
    tbody.innerHTML = '';

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;
    const dadosDaPagina = historicoDados.slice(inicio, fim);

    dadosDaPagina.forEach(dado => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dado.id}</td>
            <td>${dado.nome}</td>
            <td>${dado.caso}</td>
            <td>${dado.acao}</td>
            <td>${dado.mudanca}</td>
            <td>${dado.campo}</td>
        `;
        tbody.appendChild(tr);
    });
    atualizarControlesPaginacao();
    setTimeout(() => {
        const container = document.querySelector('.main-content');
        if (container) container.scrollTop = 0;
        window.scrollTo(0, 0);
    }, 50);
}

function atualizarControlesPaginacao() {
    const container = document.getElementById('paginacao-container');
    container.innerHTML = '';

    const totalPaginas = Math.ceil(historicoDados.length / ITENS_POR_PAGINA);
    
    const btnAnterior = document.createElement('button');
    btnAnterior.innerHTML = '<span class="material-symbols-outlined arrow-icon">navigate_before</span>';
    btnAnterior.disabled = paginaAtual === 1;
    btnAnterior.onclick = () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            renderizarTela();
        }
    };
    container.appendChild(btnAnterior);

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
            fimJanela = 6; // Garante mostrar 5 itens no começo: 1 [2 3 4 5 6] ...
        }
        if (fimJanela >= totalPaginas - 1) {
            fimJanela = totalPaginas - 1;
            inicioJanela = totalPaginas - 5; // Garante mostrar 5 itens no fim: ... [5 6 7 8] 9
        }

        if (inicioJanela > 2) {
            paginasParaMostrar.push('...');
        }

        for (let i = inicioJanela; i <= fimJanela; i++) {
            paginasParaMostrar.push(i);
        }

        if (fimJanela < totalPaginas - 1) {
            paginasParaMostrar.push('...');
        }

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
                renderizarTela();
            };
        }
        container.appendChild(btn);
    });

    const btnProximo = document.createElement('button');
    btnProximo.innerHTML = '<span class="material-symbols-outlined arrow-icon">navigate_next</span>';
    btnProximo.disabled = paginaAtual === totalPaginas;
    btnProximo.onclick = () => {
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            renderizarTela();
        }
    };
    container.appendChild(btnProximo);
}

document.addEventListener('DOMContentLoaded', renderizarTela);