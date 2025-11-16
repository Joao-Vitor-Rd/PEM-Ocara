/// <reference path="../types/windown.d.ts" />

import { session } from "electron";

export {}

function mostrarErro(mensagem: string) {
    let modal = document.getElementById('erro-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'erro-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        document.body.appendChild(modal);
    }

    const conteudo = document.createElement('div');
    conteudo.style.cssText = `
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    const titulo = document.createElement('h3');
    titulo.textContent = 'Erro ao processar formulário';
    titulo.style.cssText = `
        color: #d9534f;
        margin: 0 0 15px 0;
    `;

    const texto = document.createElement('p');
    texto.textContent = mensagem;
    texto.style.cssText = `
        margin: 15px 0;
        color: #333;
        word-wrap: break-word;
    `;

    const botao = document.createElement('button');
    botao.textContent = 'OK';
    botao.style.cssText = `
        margin-top: 20px;
        padding: 10px 30px;
        background-color: #d9534f;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    `;

    botao.addEventListener('click', () => {
        modal!.remove();
    });

    conteudo.appendChild(titulo);
    conteudo.appendChild(texto);
    conteudo.appendChild(botao);

    modal.innerHTML = '';
    modal.appendChild(conteudo);
    modal.style.display = 'flex';
}

const pxmBtn = document.getElementById('proximo') as HTMLButtonElement; 
const voltarBtn = document.getElementById('voltar') as HTMLButtonElement;

voltarBtn.addEventListener('click', async (event) => {
    window.api.openWindow("telaCadastro5");
});

pxmBtn.addEventListener('click', async (event) => {
    try {

        const dadosAssistidaJSON = sessionStorage.getItem('dadosAssistida');
        if (!dadosAssistidaJSON) {
            throw new Error('Dados da assistida não encontrados. Por favor, preencha o formulário desde o início.');
        }

        const dadosCasoJSON = sessionStorage.getItem('dadosCaso');
        if (!dadosCasoJSON) {
            throw new Error('Dados do caso não encontrados. Por favor, preencha todas as telas anteriores.');
        }
        
        const dadosAssistida = JSON.parse(dadosAssistidaJSON);
        const dadosCaso = JSON.parse(dadosCasoJSON);

        if (!dadosAssistida.nome || !dadosAssistida.endereco || !dadosAssistida.profissao || !dadosAssistida.nacionalidade) {
            throw new Error('Dados incompletos da assistida. Verifique o preenchimento do formulário inicial.');
        }

        const camposObrigatorios = [
            'nomeAgressor', 'idadeAgresssor', 'vinculoAssistida', 'dataOcorrida',
            'ameacaFamiliar', 'agressaoFisica', 'abusoSexual', 'comportamentosAgressor',
            'ocorrenciaPolicialMedidaProtetivaAgressor', 'agressoesMaisFrequentesUltimamente',
            'usoDrogasAlcool', 'doencaMental', 'separacaoRecente', 'corRaca',
            '_moraEmAreaRisco'
        ];

        const camposFaltando = camposObrigatorios.filter(campo => !(campo in dadosCaso));
        if (camposFaltando.length > 0) {
            throw new Error(`Campos obrigatórios não preenchidos: ${camposFaltando.join(', ')}. Por favor, revise todas as telas anteriores.`);
        }


        const dadosCompletos = {
            nomeAssistida: dadosAssistida.nome,
            idadeAssistida: dadosAssistida.idade,
            identidadeGenero: dadosAssistida.identidadeGenero || '',
            nomeSocial: dadosAssistida.nomeSocial || '',
            endereco: dadosAssistida.endereco,
            escolaridade: dadosAssistida.escolaridade || '',
            religiao: dadosAssistida.religiao || '',
            nacionalidade: dadosAssistida.nacionalidade,
            zonaHabitacao: dadosAssistida.zonaHabitacao || '',
            profissao: dadosAssistida.profissao,
            limitacaoFisica: dadosAssistida.limitacaoFisica || '',
            numeroCadastroSocial: dadosAssistida.numeroCadastroSocial || '',
            quantidadeDependentes: dadosAssistida.quantidadeDependentes || 0,
            temDependentes: dadosAssistida.temDependentes || false,
            
            // Dados do Caso (telas 2-6)
            ...dadosCaso,
            
            // Data e responsável (tela 6)
            data: new Date(),
            profissionalResponsavel: 'Assistente Social', 
            descricao: '' 
        };

        const result = await window.api.criarCaso(dadosCompletos);

        if (!result.success) {
            throw new Error(result.error || 'Erro desconhecido ao criar caso');
        }

        sessionStorage.removeItem('dadosCaso');
        sessionStorage.removeItem('dadosAssistida');
        window.api.openWindow("telaListarAssistidas");

    } catch (error) {
        const mensagem = error instanceof Error ? error.message : 'Erro desconhecido ao processar o formulário';
        mostrarErro(mensagem);
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

