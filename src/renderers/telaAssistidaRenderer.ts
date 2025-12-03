/// <reference path="../types/windown.d.ts" />

export {}

const telaInicialBtn = document.getElementById('telaInicial') as HTMLLIElement;
const cadastroAssistidaBtn = document.getElementById('telaCadastroAssistida') as HTMLButtonElement;
const telaEstatisticasBtn = document.getElementById('telaEstatisticas') as HTMLLIElement;

telaInicialBtn.addEventListener('click', async (event) => {
    const mudarTela = await window.api.openWindow("telaInicial");
})

cadastroAssistidaBtn.addEventListener('click', async (event) => {
    const mudarTela = await window.api.openWindow("telaCadastroAssistida");
})

telaEstatisticasBtn.addEventListener('click', async (event) => {
    const mudarTela = await window.api.openWindow("telaEstatisticas");
})

document.addEventListener('DOMContentLoaded', async () => {
    await carregarAssistidas();
});




async function carregarAssistidas() {
    try {
        const resultado = await window.api.listarAssistidas();
        
        if (resultado.success && resultado.assistidas && resultado.assistidas.length > 0) {
            exibirAssistidas(resultado.assistidas);
        } else {
            const containerCards = document.querySelector('.row.gy-4.gx-5');
            if (containerCards) {
                containerCards.innerHTML = '<div class="col-12"><p class="text-center text-muted">Nenhuma assistida cadastrada.</p></div>';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar assistidas:', error);
    }
}

function exibirAssistidas(assistidas: any[]) {
    const containerCards = document.querySelector('.row.gy-4.gx-5');
    
    if (!containerCards) return;

    assistidas.forEach((assistida: any) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'col-md-6';
        cardDiv.innerHTML = `
            <div class="text-center card-paciente" data-id="${assistida.id}">
                <h3 class="mb-2">ID: ${assistida.id || 'N/A'}</h3>
                <p>${assistida.nome || 'N/A'}</p>
            </div>
        `;
    
        const cardElement = cardDiv.querySelector('.card-paciente') as HTMLElement;
        if (cardElement) {
            cardElement.addEventListener('mouseover', () => {
                cardElement.style.transform = 'scale(1.05)';
            });
            cardElement.addEventListener('mouseout', () => {
                cardElement.style.transform = 'scale(1)';
            });
            cardElement.addEventListener('click', () => {
                console.log('Assistida clicada:', assistida.id, assistida);
                sessionStorage.setItem('protocoloAssistidaSelecionada', String(assistida.id));
                window.api.openWindow("telaCasosRegistrados");
            });
        }
        
        containerCards.appendChild(cardDiv);
    });
}