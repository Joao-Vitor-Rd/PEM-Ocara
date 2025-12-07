// 1. Captura dos Elementos
const cadastroAssistidaBtn = document.getElementById('telaCadastroAssistida') as HTMLButtonElement;
const cadastroExistenteBtn = document.getElementById('telaCadastroExistente') as HTMLButtonElement;
const assistidasBtn = document.getElementById('listarAssistidas') as HTMLLIElement;
const redeApoioBtn = document.getElementById('telaRedeApoio') as HTMLLIElement;
const estatisticasBtn = document.getElementById('telaEstatisticas') as HTMLLIElement;
const contaBtn = document.getElementById('telaConta') as HTMLLIElement;
const modalSelectOverlay = document.getElementById('modalSelectOverlay') as HTMLElement;
const closeSelectModal = document.getElementById('closeSelectModal') as HTMLElement;
const assistidaListContainer = document.querySelector('.assistida-list-container') as HTMLElement;
const btnAdicionarCaso = document.getElementById('btnAdicionarCaso') as HTMLButtonElement;


// 2. Função para carregar assistidas
const carregarAssistidas = async () => {
    try {
        const resultado = await window.api.listarAssistidas();
        
        if (resultado.success && resultado.assistidas) {
            assistidaListContainer.innerHTML = '';
            
            resultado.assistidas.forEach((assistida: any, index: number) => {
                const label = document.createElement('label');
                label.className = 'assistida-item';
                label.innerHTML = `
                    <input
                        type="radio"
                        name="assistida-selecionada"
                        value="${assistida.id}"
                        ${index === 0 ? 'checked' : ''}
                    />
                    <span class="radio-custom"></span>
                    <span class="item-text">${assistida.id}: ${assistida.nome}</span>
                `;
                assistidaListContainer.appendChild(label);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar assistidas:', error);
    }
};

// 3. Lógica do Botão Cadastrar Caso a Assistida Existente
if (cadastroExistenteBtn) {
    cadastroExistenteBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        await carregarAssistidas();
        if (modalSelectOverlay) {
            modalSelectOverlay.classList.add('visible');
        }
    });
}

// 4. Fechar Modal
if (closeSelectModal) {
    closeSelectModal.addEventListener('click', () => {
        if (modalSelectOverlay) {
            modalSelectOverlay.classList.remove('visible');
        }
    });
}

// 5. Fechar modal ao clicar fora
if (modalSelectOverlay) {
    modalSelectOverlay.addEventListener('click', (e) => {
        if (e.target === modalSelectOverlay) {
            modalSelectOverlay.classList.remove('visible');
        }
    });
}

// 6. Botão Adicionar Caso
if (btnAdicionarCaso) {
    btnAdicionarCaso.addEventListener('click', async () => {
        const radioSelecionado = document.querySelector('input[name="assistida-selecionada"]:checked') as HTMLInputElement;
        if (radioSelecionado) {
            const idAssistida = Number(radioSelecionado.value);
            
            // Buscar dados completos da assistida
            const resultado = await window.api.buscarAssistidaPorId(idAssistida);
            if (resultado.success && resultado.assistida) {
                // Log dos dados que serão armazenados
                console.log('[TelaInicial] Dados da assistida recebidos do banco:', resultado.assistida);
                
                // Armazenar em sessionStorage para o formulário preencher
                sessionStorage.setItem('dadosAssistida', JSON.stringify(resultado.assistida));
                sessionStorage.setItem('idAssistidaSelecionada', String(idAssistida));
                sessionStorage.setItem('modoEdicao', 'assistida'); // Flag para indicar que modificações devem fazer UPDATE
                
                // Log para confirmar o que foi armazenado
                console.log('[TelaInicial] sessionStorage.dadosAssistida:', sessionStorage.getItem('dadosAssistida'));
                
                if (modalSelectOverlay) {
                    modalSelectOverlay.classList.remove('visible');
                }
                await window.api.openWindow('telaCadastroAssistida');
            } else {
                console.error('Erro ao buscar assistida:', resultado.error);
            }
        }
    });
}

// 7. Lógica do Botão Estatísticas
if (estatisticasBtn) {
    estatisticasBtn.addEventListener('click', async (event) => {
        await window.api.openWindow("telaEstatisticas");
    });
}

// 8. Lógica do Botão Rede de Apoio
if (redeApoioBtn) {
    redeApoioBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        await window.api.openWindow('telaRedeApoio');
    });
}

// 9. Lógica do Botão Listar Assistidas
if (assistidasBtn) {
    assistidasBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        await window.api.openWindow('telaListarAssistidas');
    });
}

// 10. Lógica do Botão Cadastrar Assistida Nova
if (cadastroAssistidaBtn) {
    cadastroAssistidaBtn.addEventListener('click', async (event) => {
        event.preventDefault(); 
        await window.api.openWindow('telaCadastroAssistida');
    });
}

if (contaBtn) {
    contaBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        await window.api.openWindow('telaConfiguracoesConta');
    });
}