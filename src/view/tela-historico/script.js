const historicoDados = [];
for (let i = 1; i <= 100; i++) {
    historicoDados.push({
        id: i,
        nome: i % 2 === 0 ? "Maria Silva" : "Ana Pereira", // Alterna nomes
        caso: `Caso #${100 + i}`,
        acao: i % 3 === 0 ? "EXCLUIU" : "EDITOU",
        mudanca: "Alteração de dados cadastrais",
        campo: "Dados Pessoais"
    });
}
const ITENS_POR_PAGINA = 15;
let paginaAtual = 1;

function renderizarTela() {
    document.querySelector('.main-content').scrollTop = 0; 

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

    if (totalPaginas <= 7) {
        for (let i = 1; i <= totalPaginas; i++) {
            paginasParaMostrar.push(i);
        }
    } else {
        
        paginasParaMostrar.push(1);

        if (paginaAtual > 3) {
            paginasParaMostrar.push('...');
        }

        let inicioVizinhos = Math.max(2, paginaAtual - 1);
        let fimVizinhos = Math.min(totalPaginas - 1, paginaAtual + 1);

        if (paginaAtual === 1) fimVizinhos = 3;
        if (paginaAtual === totalPaginas) inicioVizinhos = totalPaginas - 2;

        for (let i = inicioVizinhos; i <= fimVizinhos; i++) {
            if (i > 1 && i < totalPaginas) {
                paginasParaMostrar.push(i);
            }
        }

        if (paginaAtual < totalPaginas - 2) {
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