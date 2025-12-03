/// <reference path="../types/windown.d.ts" />

export {}


document.addEventListener('DOMContentLoaded', async () => {
    const telaInicialBtn = document.getElementById('telaInicial') as HTMLButtonElement;
    const sairBtn = document.getElementById('sairBtn') as HTMLDivElement;
    const assistidasBtn = document.getElementById('listarAssistidas') as HTMLLIElement;

    if (assistidasBtn) {
        assistidasBtn.addEventListener('click', async (event) => {
            const mudarTela = await window.api.openWindow("telaListarAssistidas");
        });
    }

    if (telaInicialBtn) {
        telaInicialBtn.addEventListener('click', async (event) => {
            const mudarTela = await window.api.openWindow("telaInicial");
        });
    }

    if (sairBtn) {
        sairBtn.addEventListener('click', async (event) => {
            const mudarTela = await window.api.openWindow("telaListarAssistidas");
        });
    }

    const protocoloAssistida = sessionStorage.getItem('protocoloAssistidaSelecionada');
    if (protocoloAssistida) {
        const titulo = document.querySelector('h2');
        if (titulo) {
            titulo.textContent = `Casos Registrados a ${protocoloAssistida}`;
        }
    }

    await carregarCasos();
});

async function carregarCasos() {
    try {
        const protocoloAssistida = sessionStorage.getItem('protocoloAssistidaSelecionada');
        
        if (!protocoloAssistida) {
            const containerCards = document.querySelector('.row.gy-4.gx-5');
            if (containerCards) {
                containerCards.innerHTML = '<div class="col-12"><p class="text-center text-muted">Nenhuma assistida selecionada.</p></div>';
            }
            return;
        }

        const idAssistida = parseInt(protocoloAssistida);
        console.log('Carregando casos para assistida:', idAssistida);
        const resultado = await window.api.listarCasosPorAssistida(idAssistida);
        sessionStorage.removeItem('protocoloAssistidaSelecionada');
        console.log('Resultado da API:', resultado);
        
        if (resultado.success && resultado.casos && resultado.casos.length > 0) {
            exibirCasos(resultado.casos);
        } else {
            const containerCards = document.querySelector('.row.gy-4.gx-5');
            if (containerCards) {
                containerCards.innerHTML = '<div class="col-12"><p class="text-center text-muted">Nenhum caso registrado para esta assistida.</p></div>';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar casos:', error);
        const containerCards = document.querySelector('.row.gy-4.gx-5');
        if (containerCards) {
            containerCards.innerHTML = '<div class="col-12"><p class="text-center text-danger">Erro ao carregar casos.</p></div>';
        }
    }
}

function exibirCasos(casos: any[]) {
    const containerCards = document.querySelector('.row.gy-4.gx-5');
    
    if (!containerCards) {
        console.error('Container não encontrado');
        return;
    }

    containerCards.innerHTML = '';

    casos.forEach((caso: any) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'col-md-6';
        
        const idCaso = caso.id_caso || 'N/A';
        const nomeRede = caso.nome_rede || 'Sem rede';
        const status = caso.status || 'N/A';
        const statusColor = status === 'Encaminhada' ? '#5cb85c' : '#d9534f';
        
        cardDiv.innerHTML = `
            <div class="text-center card-paciente" data-id="${idCaso}">
                <h3 class="mb-2">ID Caso: ${idCaso}</h3>
                <p>
                    <span class="card-label">Rede:</span> ${nomeRede}
                </p>
                <p class="status-text">
                    <span class="card-label">Status:</span> 
                    <span style="color: ${statusColor};">${status}</span>
                </p>
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
                sessionStorage.setItem('idCasoAtual', idCaso.toString());
                window.api.openWindow("telaInformacoesCaso");
                console.log(`Caso selecionado: ID ${idCaso}`);
                console.log(caso);
            });
        }
        
        containerCards.appendChild(cardDiv);
    });
}
