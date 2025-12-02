export {};

// 1. Captura dos Elementos
const cadastroAssistidaBtn = document.getElementById('telaCadastroAssistida') as HTMLButtonElement;
const assistidasBtn = document.getElementById('listarAssistidas') as HTMLLIElement;
const redeApoioBtn = document.getElementById('telaRedeApoio') as HTMLLIElement;
const estatisticasBtn = document.getElementById('telaEstatisticas') as HTMLLIElement;

// 2. Lógica do Botão Estatísticas (Da outra branch)
if (estatisticasBtn) {
    estatisticasBtn.addEventListener('click', async (event) => {
        await window.api.openWindow("telaEstatisticas");
    });
}

// 3. Lógica do Botão Rede de Apoio (Sua funcionalidade)
if (redeApoioBtn) {
    redeApoioBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        await window.api.openWindow('telaRedeApoio');
    });
}

// 4. Lógica do Botão Listar Assistidas
if (assistidasBtn) {
    assistidasBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        await window.api.openWindow('telaListarAssistidas');
    });
}

// 5. Lógica do Botão Cadastrar Assistida (Corrigido)
if (cadastroAssistidaBtn) {
    cadastroAssistidaBtn.addEventListener('click', async (event) => {
        event.preventDefault(); 
        await window.api.openWindow('telaCadastroAssistida');
    });
}