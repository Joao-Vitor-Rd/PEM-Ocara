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

        const protocoloNum = parseInt(protocoloAssistida);
        const resultado = await window.api.obterCasosPorProtocoloAssistida(protocoloNum);
        
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
        
        const protocoloCaso = caso.protocoloCaso || 'N/A';
        
        cardDiv.innerHTML = `
            <div class="text-center card-paciente" data-protocolo="${protocoloCaso}">
                <h3 class="mb-2">Protocolo: ${protocoloCaso}</h3>
                <p>
                    <span class="card-label">Rede:</span>
                </p>
                <p class="status-text">
                    <span class="card-label">Status:</span> 
                    <span style="color: #5cb85c;">Ativo</span>
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
                window.api.obterCasosPorProtocoloAssistida(protocoloCaso);
                console.log('Caso clicado:', protocoloCaso, caso);
            });
        }
        
        containerCards.appendChild(cardDiv);
    });
}
