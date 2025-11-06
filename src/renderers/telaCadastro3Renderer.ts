/// <reference path="../types/windown.d.ts" />

export {}

const pxmBtn = document.getElementById('proximo') as HTMLButtonElement; 
const voltarBtn = document.getElementById('voltar') as HTMLButtonElement;

voltarBtn.addEventListener('click', async (event) => {
    window.api.openWindow("telaCadastroCaso");
});

pxmBtn.addEventListener('click', async (event) => {
    try {
        const dadosCasoJSON = sessionStorage.getItem('dadosCaso');
        
        if (!dadosCasoJSON) {
            throw new Error('Erro ao recuperar dados anteriores');
        }
        
        const dadosCaso = JSON.parse(dadosCasoJSON);

        const anotacoesInput = document.getElementById('outras-informacoes') as HTMLTextAreaElement;
        const anotacoesLivres = anotacoesInput?.value.trim() || "";

        dadosCaso.anotacoesLivres = anotacoesLivres;

        sessionStorage.setItem('dadosCaso', JSON.stringify(dadosCaso));
        
        window.api.openWindow("telaCadastro4");
    } catch (error) {
        console.error("Erro ao processar tela 3:", error);
    }
});

