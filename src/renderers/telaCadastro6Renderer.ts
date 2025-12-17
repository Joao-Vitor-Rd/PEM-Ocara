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
let idCasoPersistido: number | null = null;
let idAssistidaPersistida: number | null = null;
let redesCadastradas: any[] = [];
let historicoRegistrado = false;
let ultimaCapturaFormulario: {
    dadosAssistida: any;
    dadosCaso: any;
    nomeFuncionario: string;
    emailFuncionario: string;
} | null = null;
type ArquivoTemporario = { nome: string; tipo: string; tamanho: number; dados: Uint8Array };
let arquivosTemporariosSelecionados: ArquivoTemporario[] = [];

const STORAGE_CASO_ID = 'casoFinalizacaoId';
const STORAGE_ASSISTIDA_ID = 'assistidaFinalizacaoId';
const STORAGE_DADOS_FORM = 'dadosFormularioPersistidoTela6';
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

document.addEventListener('DOMContentLoaded', async () => {
    const idCasoSalvo = sessionStorage.getItem(STORAGE_CASO_ID);
    const idAssistidaSalva = sessionStorage.getItem(STORAGE_ASSISTIDA_ID);
    if (idCasoSalvo) {
        const parsed = Number(idCasoSalvo);
        idCasoPersistido = Number.isFinite(parsed) ? parsed : null;
    }
    if (idAssistidaSalva) {
        const parsed = Number(idAssistidaSalva);
        idAssistidaPersistida = Number.isFinite(parsed) ? parsed : null;
    }

    const dadosFormPersistidos = sessionStorage.getItem(STORAGE_DADOS_FORM);
    if (dadosFormPersistidos) {
        try {
            ultimaCapturaFormulario = JSON.parse(dadosFormPersistidos);
        } catch (erro) {
            console.warn('Não foi possível reconstruir os dados persistidos do formulário:', erro);
        }
    }

    await carregarPreviewPDF();
    setupModalEncaminhamento();
});

function obterUsuarioLogado() {
    const STORAGE_KEY = 'usuarioLogado';
    const usuarioLogadoJSON = sessionStorage.getItem(STORAGE_KEY);
    const usuarioLogado = usuarioLogadoJSON ? JSON.parse(usuarioLogadoJSON) : null;
    return {
        email: usuarioLogado?.email || 'sistema@sistema.com',
        nome: usuarioLogado?.nome || 'Sistema'
    };
}

function capturarDadosFormulario() {
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

    const anexosJSON = sessionStorage.getItem('cadastro_anexos');
    const anexos = anexosJSON ? JSON.parse(anexosJSON) : [];
    const modoEdicao = sessionStorage.getItem('modoEdicao');
    const idAssistidaExistente = dadosAssistida.id ? Number(dadosAssistida.id) : null;

    return {
        dadosAssistida,
        dadosCaso,
        anexos,
        modoEdicao,
        idAssistidaExistente
    };
}

async function salvarCasoSeNecessario() {
    if (idCasoPersistido && idAssistidaPersistida) {
        return { idCaso: idCasoPersistido, idAssistida: idAssistidaPersistida };
    }

    const formulario = capturarDadosFormulario();
    const usuario = obterUsuarioLogado();

    const resultado = await window.api.salvarCasoBD({
        assistida: formulario.dadosAssistida,
        caso: Object.assign({}, formulario.dadosCaso, { anexos: formulario.anexos }),
        profissionalResponsavel: usuario.nome,
        data: new Date(),
        modoEdicao: formulario.modoEdicao || 'nova',
        idAssistidaExistente: formulario.idAssistidaExistente || null
    });

    if (!resultado?.success) {
        throw new Error(resultado?.error || 'Erro desconhecido ao salvar caso no banco de dados');
    }

    const idCasoRetornado = resultado?.idCaso || (resultado as any)?.caso?.id || (resultado as any)?.id || 0;
    const idAssistidaRetornado = resultado?.idAssistida || (resultado as any)?.caso?.idAssistida || (resultado as any)?.idAssistida || 0;

    idCasoPersistido = Number(idCasoRetornado);
    idAssistidaPersistida = Number(idAssistidaRetornado);

    if (!Number.isFinite(idCasoPersistido) || idCasoPersistido <= 0) {
        throw new Error('Retorno inválido ao salvar o caso.');
    }

    sessionStorage.setItem(STORAGE_CASO_ID, String(idCasoPersistido));
    sessionStorage.setItem(STORAGE_ASSISTIDA_ID, String(idAssistidaPersistida));

    ultimaCapturaFormulario = {
        dadosAssistida: formulario.dadosAssistida,
        dadosCaso: formulario.dadosCaso,
        nomeFuncionario: usuario.nome,
        emailFuncionario: usuario.email
    };
    sessionStorage.setItem(STORAGE_DADOS_FORM, JSON.stringify(ultimaCapturaFormulario));
    historicoRegistrado = false;

    return { idCaso: idCasoPersistido, idAssistida: idAssistidaPersistida };
}

async function registrarHistoricoCaso() {
    if (historicoRegistrado || !ultimaCapturaFormulario || !idCasoPersistido || !idAssistidaPersistida) {
        return;
    }

    const casoCriado = {
        idCaso: Number(idCasoPersistido),
        idAssistida: Number(idAssistidaPersistida),
        emailFuncionario: ultimaCapturaFormulario.emailFuncionario,
        nomeFuncionario: ultimaCapturaFormulario.nomeFuncionario,
        ...ultimaCapturaFormulario.dadosAssistida,
        ...ultimaCapturaFormulario.dadosCaso
    };

    const casoCriadoJSON = JSON.parse(JSON.stringify(casoCriado));

    const resultadoHistorico = await window.api.salvarHistoricoBD({
        caso: casoCriadoJSON,
        assistida: ultimaCapturaFormulario.dadosAssistida,
        profissionalResponsavel: ultimaCapturaFormulario.nomeFuncionario,
        data: new Date()
    });

    if (!resultadoHistorico?.success) {
        console.warn('Aviso ao salvar histórico:', resultadoHistorico?.error || 'Sem erro específico');
        return;
    }

    historicoRegistrado = true;
}

function limparPersistencias() {
    sessionStorage.removeItem('dadosCaso');
    sessionStorage.removeItem('dadosAssistida');
    sessionStorage.removeItem('cadastro_anexos');
    sessionStorage.removeItem('modoEdicao');
    sessionStorage.removeItem(STORAGE_CASO_ID);
    sessionStorage.removeItem(STORAGE_ASSISTIDA_ID);
    sessionStorage.removeItem(STORAGE_DADOS_FORM);
    idCasoPersistido = null;
    idAssistidaPersistida = null;
    ultimaCapturaFormulario = null;
    historicoRegistrado = false;
    arquivosTemporariosSelecionados = [];
}

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
        await salvarCasoSeNecessario();
        await registrarHistoricoCaso();

        limparPersistencias();
        alert('Atendimento finalizado com sucesso!');
        window.api.openWindow("telaListarAssistidas");

    } catch (error) {
        const mensagem = error instanceof Error ? error.message : 'Erro desconhecido ao processar o formulário';
        mostrarErro(mensagem);
        console.error("Erro ao processar tela 6:", error);
    }
});

async function carregarRedesApoioSelect(selectElement: HTMLSelectElement) {
    try {
        const resposta = await window.api.listarOrgaosRedeApoio();
        redesCadastradas = Array.isArray(resposta?.orgaos) ? resposta.orgaos : [];

        selectElement.innerHTML = '<option value="" disabled selected>Selecione o destinatário</option>';
        redesCadastradas.forEach((rede: any) => {
            if (!rede?.id) return;
            const opt = document.createElement('option');
            opt.value = String(rede.id);
            opt.textContent = `${rede.nome} (${rede.email})`;
            selectElement.appendChild(opt);
        });

        if (!redesCadastradas.length) {
            throw new Error('Cadastre uma rede de apoio antes de enviar encaminhamentos.');
        }
    } catch (erro) {
        console.error('Erro ao carregar redes de apoio:', erro);
        throw new Error('Não foi possível carregar as redes de apoio. Tente novamente mais tarde.');
    }
}

function setupModalEncaminhamento() {
    const botaoAbrirModal = document.getElementById('gerarEncaminhamento') as HTMLElement | null;
    const modal = document.getElementById('modalEncaminhamento') as HTMLElement | null;
    const botaoFecharModal = document.getElementById('fecharModal') as HTMLElement | null;
    const selectEmailPara = document.getElementById('email-para') as HTMLSelectElement | null;
    const emailAssuntoInput = document.getElementById('email-assunto') as HTMLInputElement | null;
    const emailCorpoInput = document.getElementById('email-corpo') as HTMLTextAreaElement | null;
    const btnEnviar = document.getElementById('btnEnviar') as HTMLButtonElement | null;
    const fileInput = document.getElementById('inputAnexo') as HTMLInputElement | null;
    const escolherArquivo = document.getElementById('botaoAnexo') as HTMLElement | null;
    const nomeAnexoEl = document.getElementById('nome-anexo') as HTMLElement | null;

    if (!botaoAbrirModal || !modal || !selectEmailPara || !btnEnviar || !fileInput || !nomeAnexoEl) {
        return;
    }

    const atualizarResumoAnexos = () => {
        if (!nomeAnexoEl) return;
        if (!arquivosTemporariosSelecionados.length) {
            nomeAnexoEl.textContent = 'Nenhum arquivo selecionado';
            return;
        }

        if (arquivosTemporariosSelecionados.length === 1) {
            nomeAnexoEl.textContent = arquivosTemporariosSelecionados[0].nome;
            return;
        }

        nomeAnexoEl.textContent = `${arquivosTemporariosSelecionados.length} arquivos selecionados`;
    };

    const fecharModal = () => {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
    };

    if (botaoFecharModal) {
        botaoFecharModal.addEventListener('click', fecharModal);
    }

    modal.addEventListener('click', (event) => {
        if (event.target === modal) fecharModal();
    });

    if (escolherArquivo) {
        escolherArquivo.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInput.click();
        });
    }

    const processarArquivosSelecionados = async (files: FileList | null) => {
        if (!files || files.length === 0) {
            if (!arquivosTemporariosSelecionados.length) {
                atualizarResumoAnexos();
            }
            return;
        }

        const novosArquivos: ArquivoTemporario[] = [];
        for (const file of Array.from(files)) {
            if (file.size > MAX_FILE_SIZE_BYTES) {
                mostrarErro(`O arquivo "${file.name}" excede o limite de 25MB.`);
                continue;
            }

            const jaExiste = arquivosTemporariosSelecionados.some(
                (anexo) => anexo.nome === file.name && anexo.tamanho === file.size
            );
            if (jaExiste) {
                continue;
            }

            try {
                const arrayBuffer = await file.arrayBuffer();
                novosArquivos.push({
                    nome: file.name,
                    tipo: file.type || 'application/octet-stream',
                    tamanho: file.size,
                    dados: new Uint8Array(arrayBuffer)
                });
            } catch (erro) {
                console.error('Erro ao processar arquivo selecionado:', erro);
                mostrarErro(`Não foi possível processar o arquivo "${file.name}".`);
            }
        }

        if (novosArquivos.length) {
            arquivosTemporariosSelecionados = [...arquivosTemporariosSelecionados, ...novosArquivos];
            atualizarResumoAnexos();
        } else if (!arquivosTemporariosSelecionados.length) {
            atualizarResumoAnexos();
        }

        fileInput.value = '';
    };

    fileInput.addEventListener('change', async (e) => {
        const files = (e.target as HTMLInputElement).files;
        await processarArquivosSelecionados(files);
    });

    botaoAbrirModal.addEventListener('click', async () => {
        try {
            await salvarCasoSeNecessario();
            await carregarRedesApoioSelect(selectEmailPara);
            arquivosTemporariosSelecionados = [];
            fileInput.value = '';
            atualizarResumoAnexos();
            emailAssuntoInput && (emailAssuntoInput.value = '');
            emailCorpoInput && (emailCorpoInput.value = '');

            modal.classList.add('visible');
            document.body.style.overflow = 'hidden';
        } catch (erro) {
            console.error('Erro ao preparar modal de encaminhamento:', erro);
            mostrarErro(erro instanceof Error ? erro.message : 'Não foi possível preparar o encaminhamento.');
        }
    });

    btnEnviar.addEventListener('click', async () => {
        if (!idCasoPersistido) {
            mostrarErro('O caso ainda não foi salvo. Tente novamente.');
            return;
        }

        const idRedeSelecionada = selectEmailPara.value;
        const emailAssunto = (emailAssuntoInput?.value || '').trim();
        const emailCorpo = (emailCorpoInput?.value || '').trim();

        if (!idRedeSelecionada) {
            mostrarErro('Por favor, selecione um destinatário.');
            return;
        }

        if (!emailCorpo || emailCorpo.length < 10) {
            mostrarErro('O campo de mensagem deve conter pelo menos 10 caracteres.');
            return;
        }

        const redeDestino = redesCadastradas.find((rede: any) => String(rede.id) === String(idRedeSelecionada));
        if (!redeDestino) {
            mostrarErro('Rede de apoio selecionada não encontrada.');
            return;
        }

        const anexosTemporariosPayload = arquivosTemporariosSelecionados.map((arquivo) => ({
            nome: arquivo.nome,
            tipo: arquivo.tipo,
            dados: arquivo.dados
        }));

        const textoOriginal = btnEnviar.textContent || 'Enviar';
        try {
            btnEnviar.disabled = true;
            btnEnviar.textContent = 'Enviando...';

            const resposta = await window.api.enviarEmailEncaminhamento({
                idCaso: Number(idCasoPersistido),
                idRedeDestino: Number(redeDestino.id),
                assunto: emailAssunto,
                mensagem: emailCorpo,
                anexosIds: [],
                arquivosTemporarios: anexosTemporariosPayload
            });

            if (!resposta?.success) {
                throw new Error(resposta?.error || 'Falha ao enviar o e-mail.');
            }

            alert('E-mail enviado com sucesso!');
            fecharModal();
            selectEmailPara.selectedIndex = 0;
            if (emailAssuntoInput) emailAssuntoInput.value = '';
            if (emailCorpoInput) emailCorpoInput.value = '';
            arquivosTemporariosSelecionados = [];
            fileInput.value = '';
            atualizarResumoAnexos();
        } catch (erro) {
            console.error('Erro ao enviar encaminhamento:', erro);
            mostrarErro(erro instanceof Error ? erro.message : 'Erro desconhecido ao enviar o e-mail.');
        } finally {
            btnEnviar.disabled = false;
            btnEnviar.textContent = textoOriginal;
        }
    });
}