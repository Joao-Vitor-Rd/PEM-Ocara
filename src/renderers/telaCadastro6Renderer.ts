/// <reference path="../types/windown.d.ts" />

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
        const dadosAssistidaJSON = sessionStorage.getItem('dadosAssistida');
        const anexosJSON = sessionStorage.getItem('cadastro_anexos');
        
        if (!dadosCasoJSON || !dadosAssistidaJSON) {
            if(placeholder) placeholder.innerHTML = '<span>Erro: Dados do formulário não encontrados. Volte ao início.</span>';
            return;
        }

        const dadosCaso = JSON.parse(dadosCasoJSON);
        const dadosAssistida = JSON.parse(dadosAssistidaJSON);
        const anexos = anexosJSON ? JSON.parse(anexosJSON) : [];

        // Mapear os dados corretamente para o formato esperado
        dadosCompletosParaEnvio = {
            // Dados da Assistida
            nomeAssistida: dadosAssistida.nome,
            idadeAssistida: dadosAssistida.idade,
            identidadeGenero: dadosAssistida.identidadeGenero,
            nomeSocial: dadosAssistida.nomeSocial,
            endereco: dadosAssistida.endereco,
            escolaridade: dadosAssistida.escolaridade,
            religiao: dadosAssistida.religiao,
            nacionalidade: dadosAssistida.nacionalidade,
            zonaHabitacao: dadosAssistida.zonaHabitacao,
            profissao: dadosAssistida.profissao,
            limitacaoFisica: dadosAssistida.limitacaoFisica,
            numeroCadastroSocial: dadosAssistida.numeroCadastroSocial,
            quantidadeDependentes: dadosAssistida.quantidadeDependentes,
            temDependentes: dadosAssistida.temDependentes,
            // Dados do Caso
            ...dadosCaso,
            // Anexos
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
    embed.style.height = '75vh';
    embed.style.borderRadius = '10px';
    embed.style.border = '1px solid #ccc';

    pdfContainer.appendChild(embed);
}


voltarBtn.addEventListener('click', async () => {
    window.api.openWindow("telaCadastro5");
});

pxmBtn.addEventListener('click', async () => {
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

        // Chamar a API para salvar no banco de dados
        const anexosJSON = sessionStorage.getItem('cadastro_anexos');
        const anexos = anexosJSON ? JSON.parse(anexosJSON) : [];

        const result = await window.api.salvarCasoBD({
            assistida: dadosAssistida,
            caso: Object.assign({}, dadosCaso, { anexos }),
            profissionalResponsavel: 'Assistente Social',
            data: new Date()
        });

        if (!result.success) {
            throw new Error(result.error || 'Erro desconhecido ao salvar caso no banco de dados');
        }

        console.log('Resultado salvarCasoBD:', result); // Debug
        console.log('Propriedades do result:', Object.keys(result)); // Debug
        console.log('result.success:', result?.success); // Debug
        console.log('result.idCaso:', result?.idCaso); // Debug
        console.log('result.idAssistida:', result?.idAssistida); // Debug
        
        // Construir objeto Caso com os IDs retornados e dados necessários
        const idCasoRetornado = result?.idCaso || (result as any).caso?.id || (result as any).id || 0;
        const idAssistidaRetornado = result?.idAssistida || (result as any).caso?.idAssistida || (result as any).idAssistida || 0;
        console.log('idCasoRetornado após extração:', idCasoRetornado); // Debug
        console.log('idAssistidaRetornado após extração:', idAssistidaRetornado); // Debug

        // Serializar casoCriado para garantir que o IPC consegue passar os dados
        // IPC do Electron tem limitações com certos tipos (Date, Symbols, etc)
        const casoCriado = {
            idCaso: Number(idCasoRetornado),
            idAssistida: Number(idAssistidaRetornado),
            emailFuncionario: 'assistente.social@pem-ocara.gov.br', // Mock de email do funcionário
            nomeFuncionario: 'Assistente Social',
            ...dadosCaso // Dados completos do caso
        };

        // Garantir que o objeto é JSON-serializable
        const casoCriadoJSON = JSON.parse(JSON.stringify(casoCriado));

        console.log('casoCriado para histórico:', casoCriadoJSON); // Debug
        console.log('casoCriadoJSON.idCaso:', casoCriadoJSON.idCaso); // Debug

        const resultHistorico = await window.api.salvarHistoricoBD({
            caso: casoCriadoJSON,
            assistida: dadosAssistida,
            profissionalResponsavel: 'Assistente Social',
            data: new Date()
        });

        console.log('Resultado salvarHistoricoBD:', resultHistorico); // Debug

        if (!resultHistorico || !resultHistorico.success) {
            console.warn('Aviso ao salvar histórico:', resultHistorico?.error || 'Sem erro específico');
            // Não lançar erro, apenas avisar - o caso foi salvo com sucesso
        }

        sessionStorage.removeItem('dadosCaso');
        sessionStorage.removeItem('dadosAssistida');
        sessionStorage.removeItem('cadastro_anexos');
        
        alert('Atendimento finalizado com sucesso!');
        window.api.openWindow("telaListarAssistidas");

    } catch (error) {
        const mensagem = error instanceof Error ? error.message : 'Erro desconhecido ao processar o formulário';
        mostrarErro(mensagem);
        console.error("Erro ao processar tela 6:", error);
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