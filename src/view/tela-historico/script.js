// 1. Simulação dos dados que viriam do Backend (Banco de Dados)
const historicoDados = [
    {
        id: 3,
        nome: "Ana Pereira",
        caso: "Caso #102",
        acao: "EDITOU",
        mudanca: "joao' para 'joão'",
        campo: "Nome do Agressor"
    },
    {
        id: 2,
        nome: "Maria Silva",
        caso: "Caso #098",
        acao: "EXCLUIU",
        mudanca: "Arquivo .pdf",
        campo: "Anexo"
    },
    {
        id: 1,
        nome: "Carla Souza",
        caso: "Caso #098",
        acao: "CRIOU",
        mudanca: "Novo atendimento",
        campo: "Geral"
    },
];

function carregarHistorico() {
    const tbody = document.getElementById('tabela-corpo');
    
    tbody.innerHTML = '';

    historicoDados.forEach(dado => {
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
}

document.addEventListener('DOMContentLoaded', carregarHistorico);