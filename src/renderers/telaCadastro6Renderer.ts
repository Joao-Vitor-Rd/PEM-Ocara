/// <reference path="../types/windown.d.ts" />

export {}

const pxmBtn = document.getElementById('proximo') as HTMLButtonElement; 
const voltarBtn = document.getElementById('voltar') as HTMLButtonElement;
const pdfContainer = document.querySelector('.pdf-viewer-container') as HTMLElement;
const placeholder = document.querySelector('.pdf-placeholder') as HTMLElement;

let dadosCompletosParaEnvio: any = null;

document.addEventListener('DOMContentLoaded', async () => {
    await carregarPreviewPDF();
    setupModalEncaminhamento();
});

async function carregarPreviewPDF() {
    try {
        const dadosCasoJSON = sessionStorage.getItem('dadosCaso');
        const anexosJSON = sessionStorage.getItem('cadastro_anexos');
        
        if (!dadosCasoJSON) {
            if(placeholder) placeholder.innerHTML = '<span>Erro: Dados do formulário não encontrados. Volte ao início.</span>';
            return;
        }

        const dadosCaso = JSON.parse(dadosCasoJSON);
        const anexos = anexosJSON ? JSON.parse(anexosJSON) : [];

        dadosCompletosParaEnvio = {
            ...dadosCaso,
            anexos: anexos 
        };

        if(placeholder) placeholder.innerHTML = '<span>Gerando visualização do PDF...</span>';

        const result = await window.api.gerarPreviewCaso(dadosCompletosParaEnvio);

        if (result.success && result.path) {
            exibirPDF(result.path);
        } else {
            if(placeholder) placeholder.innerHTML = `<span style="color:red">Erro ao gerar preview: ${result.error}</span>`;
        }

    } catch (error) {
        console.error("Erro ao carregar preview:", error);
        if(placeholder) placeholder.innerHTML = `<span style="color:red">Erro crítico: ${error}</span>`;
    }
}

function exibirPDF(caminhoArquivo: string) {
    pdfContainer.innerHTML = '';
    
    const embed = document.createElement('embed');
    embed.src = `file://${caminhoArquivo}#toolbar=0&navpanes=0&scrollbar=0`;
    embed.type = 'application/pdf';
    embed.width = '100%';
    embed.height = '100%';
    embed.style.borderRadius = '10px';
    embed.style.border = '1px solid #ccc';

    pdfContainer.appendChild(embed);
}


voltarBtn.addEventListener('click', async () => {
    window.api.openWindow("telaCadastro5");
});

pxmBtn.addEventListener('click', async () => {
    try {
        if (!dadosCompletosParaEnvio) {
            alert('Aguarde o carregamento dos dados.');
            return;
        }

        pxmBtn.disabled = true;
        pxmBtn.textContent = "Salvando...";

        const result = await window.api.criarCaso(dadosCompletosParaEnvio);

        if (!result.success) {
            throw new Error(result.error);
        }

        sessionStorage.removeItem('dadosCaso');
        sessionStorage.removeItem('dadosAssistida');
        sessionStorage.removeItem('cadastro_anexos');
        
        alert('Atendimento finalizado com sucesso!');
        window.api.openWindow("telaListarAssistidas");

    } catch (error) {
        console.error("Erro ao finalizar:", error);
        alert('Erro ao salvar caso: ' + error);
        pxmBtn.disabled = false;
        pxmBtn.textContent = "Finalizar Atendimento";
    }
});

function setupModalEncaminhamento() {
    const botaoAbrirModal = document.getElementById('gerarEncaminhamento') as HTMLElement;
    const modal = document.getElementById('modalEncaminhamento') as HTMLElement;
    const botaoFecharModal = document.getElementById('fecharModal') as HTMLElement;
    const fileInput = document.getElementById('inputAnexo') as HTMLInputElement;
    const escolherArquivo = document.getElementById('botaoAnexo') as HTMLElement;
    const nomeAnexoEl = document.getElementById('nome-anexo') as HTMLElement;

    if(!botaoAbrirModal || !modal) return;

    function abrirModal() {
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden'; 
    }

    function fecharModal() {
        modal.classList.remove('visible');
        document.body.style.overflow = ''; 
    }

    botaoAbrirModal.addEventListener('click', abrirModal);
    botaoFecharModal.addEventListener('click', fecharModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) fecharModal();
    });

    escolherArquivo.addEventListener('click', (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        fileInput.click(); 
    });

    fileInput.addEventListener('change', (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
            nomeAnexoEl.textContent = files[0].name;
        }
    });
}