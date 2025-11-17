/// <reference path="../types/windown.d.ts" />

import { session } from "electron";

export {}

const pxmBtn = document.getElementById('proximo') as HTMLButtonElement; 
const voltarBtn = document.getElementById('voltar') as HTMLButtonElement;

voltarBtn.addEventListener('click', async (event) => {
    window.api.openWindow("telaCadastro5");
});

pxmBtn.addEventListener('click', async (event) => {
    try {
        const dadosCasoJSON = sessionStorage.getItem('dadosCaso');
        
        if (!dadosCasoJSON) {
            throw new Error('Erro ao recuperar dados anteriores');
        }
        
        const dadosCaso = JSON.parse(dadosCasoJSON);

        const result = await window.api.criarCaso(dadosCaso);

        if (!result.success) {
            throw new Error('Erro ao criar caso: ' + result.error);
        }

        sessionStorage.removeItem('dadosCaso');
        sessionStorage.removeItem('dadosAssistida');
        window.api.openWindow("telaListarAssistidas");
    } catch (error) {
        console.error("Erro ao processar tela 6:", error);
    }
});

document.addEventListener('DOMContentLoaded', () => {

    const botaoAbrirModal = document.getElementById('gerarEncaminhamento') as HTMLElement;
    const modal = document.getElementById('modalEncaminhamento') as HTMLElement;
    const botaoFecharModal = document.getElementById('fecharModal') as HTMLElement;

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
        if (event.target === modal) {
            fecharModal();
        }
    });

    const fileInput = document.getElementById('inputAnexo') as HTMLInputElement;
    const escolherArquivo = document.getElementById('botaoAnexo') as HTMLElement;
    const nomeAnexoEl = document.getElementById('nome-anexo') as HTMLElement;

    nomeAnexoEl.textContent = 'Nenhum arquivo selecionado';

    escolherArquivo.addEventListener('click', (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        fileInput.click(); 
    });

    fileInput.addEventListener('change', (e) => {
        const files = (e.target as HTMLInputElement).files;
        handleFiles(files);
    });

    function handleFiles(files: FileList | null) {
        if (!files || files.length === 0) {
            nomeAnexoEl.textContent = 'Nenhum arquivo selecionado';
            return;
        }

        const arquivo = files[0];
        const tiposPermitidos = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png'
        ];

        if (!tiposPermitidos.includes(arquivo.type)) {
            alert('Tipo de arquivo não permitido. Selecione PDF, DOC, DOCX, JPG ou PNG.');
            fileInput.value = '';
            nomeAnexoEl.textContent = 'Nenhum arquivo selecionado';
            return;
        }

        if (arquivo.size > 5 * 1024 * 1024) {
            alert('O arquivo deve ter no máximo 5 MB.');
            fileInput.value = '';
            nomeAnexoEl.textContent = 'Nenhum arquivo selecionado';
            return;
        }

        nomeAnexoEl.textContent = arquivo.name;

        const removerBtn = document.createElement('button');
        removerBtn.textContent = '✖';
        removerBtn.style.marginLeft = '8px';
        removerBtn.style.border = 'none';
        removerBtn.style.background = 'transparent';
        removerBtn.style.color = '#63468C';
        removerBtn.style.cursor = 'pointer';
        removerBtn.style.fontSize = '16px';

        removerBtn.addEventListener('click', () => {
            fileInput.value = '';
            nomeAnexoEl.textContent = 'Nenhum arquivo selecionado';
            removerBtn.remove();
        });

        nomeAnexoEl.appendChild(removerBtn);
        console.log('Arquivo selecionado:', arquivo.name);
    }

});

