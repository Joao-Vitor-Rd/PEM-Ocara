/// <reference path="../types/windown.d.ts" />

import { navigateToTelaInicial, navigateToTelaEstatisticas } from '../utils/SidebarManager.js';

export {}

const telaInicialBtn = document.getElementById('telaInicial') as HTMLLIElement | null;
const cadastroAssistidaBtn = document.getElementById('telaCadastroAssistida') as HTMLButtonElement | null;
const listarAssistidasBtn = document.getElementById('listarAssistidas') as HTMLLIElement | null;
const telaRedeApoioBtn = document.getElementById('telaRedeApoio') as HTMLLIElement | null;
const telaEstatisticasBtn = document.getElementById('telaEstatisticas') as HTMLLIElement | null;
const nomeAssistida = document.getElementById('Assistida') as HTMLSpanElement | null;
const nomeAgressor = document.getElementById('Agressor') as HTMLSpanElement | null;
const dataAberturaCaso = document.getElementById('DataCadastro') as HTMLSpanElement | null;
const tipoViolencia = document.getElementById('TipoViolencia') as HTMLSpanElement | null;

if (telaInicialBtn) {
    telaInicialBtn.addEventListener('click', async (event) => {
        await navigateToTelaInicial();
    })
}

if (cadastroAssistidaBtn) {
    cadastroAssistidaBtn.addEventListener('click', async (event) => {
        const mudarTela = await window.api.openWindow("telaCadastroAssistida");
    })
}

if (listarAssistidasBtn) {
    listarAssistidasBtn.addEventListener('click', async (event) => {
        const mudarTela = await window.api.openWindow("telaListarAssistidas");
    })
}

if (telaRedeApoioBtn) {
    telaRedeApoioBtn.addEventListener('click', async (event) => {
        const mudarTela = await window.api.openWindow("telaRedeApoio");
    })
}

if (telaEstatisticasBtn) {
    telaEstatisticasBtn.addEventListener('click', async (event) => {
        await navigateToTelaEstatisticas();
    })
}

// Configurações gerais
const Config = {
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
    IDS: {
        LISTA_ANEXOS: 'lista-anexos',
        LISTA_RELATORIOS: 'lista-relatorios',
        INPUT_FILE: 'file-input',
        POPUP_UPLOAD: 'popup-upload',
        POPUP_CONFIRMACAO: 'popupConfirmacao',
        MSG_CONFIRMACAO: 'popupMensagem',
        BTN_OK_CONFIRMACAO: 'popupBtnOk'
    },
    ICONS: {
        'pdf': './icons/pdf.png',
        'doc': './icons/doc.png', 'docx': './icons/doc.png',
        'txt': './icons/txt.png',
        'jpg': './icons/jpg.png', 'jpeg': './icons/jpg.png',
        'png': './icons/png.png',
        'mp3': './icons/mp3.png',
        'mp4': './icons/mov.png', 'm4a': './icons/mov.png',
        'zip': './icons/fecho-eclair.png', 'rar': './icons/fecho-eclair.png',
        'default': './icons/pdf.png'
    },
    POPUP_CONFIRMAR: {
        POPUP: 'popupConfirmar',
        MENSAGEM: 'popupConfirmarMensagem',
        BTN_CANCELAR: 'popupBtnCancelar',
        BTN_CONFIRMAR: 'popupBtnConfirmar'
    }
};

// Funções auxiliares de formatação
const Formatters = {
    obterIcone(nomeArquivo: any) {
        if (!nomeArquivo) return Config.ICONS['default'];
        const extensao = (nomeArquivo.split('.').pop() as string).toLowerCase();
        return (Config.ICONS as any)[extensao] || Config.ICONS['default'];
    },

    tamanhoArquivo(bytes: any) {
        if (bytes === 0) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },

    truncarNome(nome: any, maxLength = 40) {
        if (nome.length <= maxLength) return nome;
        const ultimoPonto = nome.lastIndexOf('.');
        if (ultimoPonto === -1) return nome.substring(0, maxLength - 3) + '...';
        
        const nomeSemExt = nome.substring(0, ultimoPonto);
        const ext = nome.substring(ultimoPonto);
        const charsDisponiveis = maxLength - ext.length - 3;
        if (charsDisponiveis <= 0) return nome.substring(0, maxLength - 3) + '...';
        
        return nomeSemExt.substring(0, charsDisponiveis) + '...' + ext;
    }
};

// Gerenciador de arquivos
class FileManager {
    private state: any = {
        prova: [],
        relatorio: []
    };

    constructor() {
        this.state = {
            prova: [],
            relatorio: []
        };
    }

    adicionar(tipo: any, arquivo: any) {
        if (this.state[tipo]) {
            this.state[tipo].push(arquivo);
        }
    }

    remover(id: any) {
        this.state.prova = this.state.prova.filter((f: any) => f.id !== id);
        this.state.relatorio = this.state.relatorio.filter((f: any) => f.id !== id);
    }

    atualizarProgresso(id: any, progresso: any) {
        const arquivo = this.buscarPorId(id);
        if (arquivo) {
            arquivo.progresso = progresso;
            arquivo.status = progresso >= 100 ? 'upado' : 'upando';
        }
        return arquivo;
    }

    buscarPorId(id: any) {
        return [...this.state.prova, ...this.state.relatorio].find((f: any) => f.id === id);
    }

    obterTodos(tipo: any) {
        return this.state[tipo] || [];
    }

    obterTodosCombinados() {
        return [...this.state.prova, ...this.state.relatorio];
    }
}

// Gerenciador de interface
class UIManager {
    private containers: { [key: string]: any } = {};

    constructor() {
        this.containers = {
            prova: document.getElementById(Config.IDS.LISTA_ANEXOS),
            relatorio: document.getElementById(Config.IDS.LISTA_RELATORIOS)
        };
    }

    mostrarPopup(mensagem: any) {
        const popup = document.getElementById(Config.IDS.POPUP_CONFIRMACAO);
        const popupMensagem = document.getElementById(Config.IDS.MSG_CONFIRMACAO);
        const btnOk = document.getElementById(Config.IDS.BTN_OK_CONFIRMACAO);
        
        if (popup && popupMensagem) {
            popupMensagem.textContent = mensagem;
            popup.classList.add('visible');
            
            if (btnOk) {
                btnOk.onclick = () => popup.classList.remove('visible');
            }
        } else {
            alert(mensagem);
        }
    }

    mostrarConfirmacao(mensagem: any) {
        return new Promise((resolve) => {
            const popup = document.getElementById(Config.POPUP_CONFIRMAR.POPUP);
            const popupMensagem = document.getElementById(Config.POPUP_CONFIRMAR.MENSAGEM);
            const btnCancelar = document.getElementById(Config.POPUP_CONFIRMAR.BTN_CANCELAR);
            const btnConfirmar = document.getElementById(Config.POPUP_CONFIRMAR.BTN_CONFIRMAR);
            
            if (popup && popupMensagem && btnCancelar && btnConfirmar) {
                popupMensagem.textContent = mensagem;
                popup.classList.add('visible');
                
                const fecharPopup = (resultado: any) => {
                    popup.classList.remove('visible');
                    btnCancelar.onclick = null;
                    btnConfirmar.onclick = null;
                    resolve(resultado);
                };
                
                btnCancelar.onclick = () => fecharPopup(false);
                btnConfirmar.onclick = () => fecharPopup(true);
            } else {
                resolve(confirm(mensagem));
            }
        });
    }

    renderizarLista(tipo: any, arquivos: any, callbacks: any) {
        const container = this.containers[tipo];
        if (!container) return;

        container.innerHTML = "";

        arquivos.forEach((arquivo: any) => {
            const li = document.createElement("li");
            li.className = "item-anexo";
            li.setAttribute('data-arquivo-id', arquivo.id);
            const icone = Formatters.obterIcone(arquivo.nome);

            if (arquivo.status === 'upando') {
                li.innerHTML = `
                    <div class="icone-arquivo"><img src="${icone}" alt="file"></div>
                    <div class="info-arquivo">
                        <div class="progresso-info"><span class="texto-progresso">Upando arquivo... ${arquivo.progresso}%</span></div>
                        <div class="barra-progresso"><div class="barra-progresso-preenchida" style="width: ${arquivo.progresso}%"></div></div>
                    </div>
                    <button class="btn-cancelar" type="button" data-action="cancel"><span class="material-symbols-outlined">cancel</span></button>
                `;
            } else {
                const nomeExibicao = Formatters.truncarNome(arquivo.nome);
                const iconeVisibilidade = (arquivo.visibilidade && arquivo.visibilidade === 'publico') ? 'visibility' : 'visibility_lock';
                console.log('Renderizando arquivo:', arquivo.nome, 'visibilidade:', arquivo.visibilidade, 'ícone:', iconeVisibilidade);
                li.innerHTML = `
                    <div class="icone-arquivo"><img src="${icone}" alt="file"></div>
                    <div class="info-arquivo">
                        <span class="nome-arquivo" title="${arquivo.nome}">${nomeExibicao}</span>
                        <span class="tamanho-arquivo">${arquivo.tamanho}</span>
                    </div>
                    <button class="btn-visibilidade" type="button" data-action="visibility"><span class="material-symbols-outlined">${iconeVisibilidade}</span></button>
                    <button class="btn-apagar" type="button" data-action="delete"><span class="material-symbols-outlined">delete_forever</span></button>
                `;
            }
            container.appendChild(li);
        });
    }

    configurarEventDelegation(callbacks: any) {
        // Configura event delegation uma única vez para cada container
        Object.values(this.containers).forEach((container: any) => {
            if (!container) return;
            
            // Remove listener antigo se existir
            if ((container as any)._clickHandler) {
                container.removeEventListener('click', (container as any)._clickHandler);
            }

            // Remove listener de download antigo se existir
            if ((container as any)._downloadHandler) {
                container.removeEventListener('click', (container as any)._downloadHandler);
            }
            
            // Adiciona novo listener para download
            (container as any)._downloadHandler = async (e: any) => {
                const nomeSpan = e.target.closest('.nome-arquivo');
                if (!nomeSpan) return;

                const li = nomeSpan.closest('.item-anexo');
                if (!li) return;

                const arquivoId = li.getAttribute('data-arquivo-id');
                const nomeArquivo = nomeSpan.textContent || 'arquivo';
                
                console.log('Download solicitado para:', arquivoId, nomeArquivo);
                try {
                    await window.api.downloadAnexo(arquivoId, nomeArquivo);
                } catch (err: any) {
                    console.error('Erro ao baixar arquivo:', err);
                }
            };

            container.addEventListener('click', (container as any)._downloadHandler);
            
            // Adiciona novo listener
            (container as any)._clickHandler = async (e: any) => {
                const btn = e.target.closest('button[data-action]');
                if (!btn) return;
                
                const li = btn.closest('.item-anexo');
                if (!li) return;
                
                const arquivoId = li.getAttribute('data-arquivo-id');
                const action = btn.getAttribute('data-action');
                
                if (action === 'cancel' && callbacks.onCancel) {
                    await callbacks.onCancel(arquivoId);
                } else if (action === 'delete' && callbacks.onDelete) {
                    await callbacks.onDelete(arquivoId);
                } else if (action === 'visibility' && callbacks.onVisibility) {
                    await callbacks.onVisibility(arquivoId);
                }
            };
            
            container.addEventListener('click', (container as any)._clickHandler);
        });
    }

    renderizarSelecaoModal(todosArquivos: any, selecionadosIds: any, onToggle: any) {
        const listaModal = document.getElementById('listaAnexosModal');
        const labelNome = document.getElementById('nome-anexo-modal') as HTMLElement | null;
        if (!listaModal) return;

        listaModal.innerHTML = '';

        const itens = todosArquivos.filter((a: any) => a.status === 'upado');

        // Remove seleções que não existem mais (como o antigo "Formulário")
        const selecionadosValidos = selecionadosIds.filter((id: any) => itens.some((item: any) => item.id === id));
        if (selecionadosValidos.length !== selecionadosIds.length) {
            selecionadosIds.length = 0;
            selecionadosValidos.forEach((id: any) => selecionadosIds.push(id));
        }

        if (itens.length === 0) {
            if (labelNome) labelNome.textContent = 'Nenhum anexo disponível';
            return;
        }

        itens.forEach((item: any) => {
            const div = document.createElement('div');
            div.className = 'anexo-item-modal';
            
            const isSelected = selecionadosIds.includes(item.id);
            if (isSelected) div.style.backgroundColor = '#F0E6F8';

            const iconeHTML = '<span class="material-symbols-outlined">description</span>';

            div.innerHTML = `
                <div class="anexo-nome-modal" title="${item.nome}">${Formatters.truncarNome(item.nome, 35)}</div>
                <div class="anexo-icone-modal">${iconeHTML}</div>
            `;

            div.onclick = (e) => {
                e.stopPropagation();
                onToggle(item.id);
            };

            listaModal.appendChild(div);
        });

        if (selecionadosIds.length === 0 && labelNome) labelNome.textContent = 'Nenhum anexo selecionado';
        else if (selecionadosIds.length === 1 && labelNome) {
            const item = itens.find((i: any) => i.id === selecionadosIds[0]);
            labelNome.textContent = item ? item.nome : '1 anexo selecionado';
        } else if (labelNome) {
            labelNome.textContent = `${selecionadosIds.length} anexos selecionados`;
        }
    }

    togglePopupUpload(mostrar: any) {
        const popup = document.getElementById(Config.IDS.POPUP_UPLOAD);
        if (popup) {
            popup.style.display = mostrar ? 'flex' : 'none';
            if (!mostrar) {
                const inputFile = document.getElementById(Config.IDS.INPUT_FILE) as HTMLInputElement | null;
                if (inputFile) inputFile.value = '';
            }
        }
    }

    toggleModalEncaminhamento(mostrar: any) {
        const modal = document.getElementById('modalEncaminhamento');
        if (modal) {
            if (mostrar) {
                modal.classList.add('visible');
                document.body.style.overflow = 'hidden';
            } else {
                modal.classList.remove('visible');
                document.body.style.overflow = '';
            }
        }
    }

    preencherDadosCaso(dados: any) {
        
        if (nomeAssistida && dados.nomeassistida) {
            nomeAssistida.textContent = dados.nomeassistida;
        }
        if (nomeAgressor && dados.nomeagressor) {
            nomeAgressor.textContent = dados.nomeagressor;
        }
        if (dataAberturaCaso && dados.data) {
            const dataFormatada = new Date(dados.data).toLocaleDateString('pt-BR');
            dataAberturaCaso.textContent = dataFormatada;
        }
        if (tipoViolencia && dados.tipoviolencia) {
            const tipos = Array.isArray(dados.tipoviolencia) 
                ? dados.tipoviolencia.filter((v: any) => v).join(', ')
                : dados.tipoviolencia;

            if(tipos === '') {
                tipoViolencia.textContent = "Não informado";
            } else {
                tipoViolencia.textContent = tipos;
            }
        }
    }

    toggleModalPrivacidade(mostrar: any) {
        const modal = document.getElementById('modalPrivacidade');
        if (modal) {
            if (mostrar) {
                modal.classList.add('visible');
                document.body.style.overflow = 'hidden';
            } else {
                modal.classList.remove('visible');
                document.body.style.overflow = '';
            }
        }
    }
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', async () => {

    const idCaso = sessionStorage.getItem('idCasoAtual');
    if (!idCaso) {
        console.error('ID do caso não encontrado na sessão.');
        return;
    }
    const informacoesGerais = await window.api.getInformacoesGeraisDoCaso(Number(idCaso));
    // ⚠️ NÃO REMOVER: script.js precisa do idCasoAtual para salvar privacidade
    // sessionStorage.removeItem('idCasoAtual');

    const fileManager = new FileManager();
    const uiManager = new UIManager();

    uiManager.preencherDadosCaso(informacoesGerais.informacoes);

    let estadoUpload = { tipoAtual: 'prova' };
    let estadoEncaminhamento = { anexosSelecionadosIds: [] as any[] };
    let dadosDoCaso: any = {};
    let idAssistida: number = 0;

    const redesCadastradas: any[] = [];
    const redesContatadasElement = document.getElementById('redes-contatadas') as HTMLParagraphElement | null;

    const atualizarRedesContatadas = async () => {
        if (!redesContatadasElement) {
            return;
        }

        try {
            const resposta = await window.api.listarRedesContatadas(Number(idCaso));

            if (resposta?.success && Array.isArray(resposta.redes) && resposta.redes.length > 0) {
                redesContatadasElement.textContent = resposta.redes.join(', ');
            } else {
                redesContatadasElement.textContent = 'Nenhuma rede de apoio foi contatada até o momento';
            }
        } catch (erro) {
            console.error('Erro ao carregar redes contatadas:', erro);
            redesContatadasElement.textContent = 'Não foi possível carregar as redes contatadas.';
        }
    };

    const carregarRedesApoio = async () => {
        try {
            const resposta = await window.api.listarOrgaosRedeApoio();
            redesCadastradas.length = 0;

            if (resposta?.success && Array.isArray(resposta.orgaos)) {
                resposta.orgaos.forEach((orgao: any) => redesCadastradas.push(orgao));
            } else {
                console.warn('Não foi possível carregar as redes de apoio:', resposta?.error);
            }
        } catch (erro) {
            console.error('Erro ao carregar redes de apoio:', erro);
            uiManager.mostrarPopup('Não foi possível carregar as redes de apoio. Tente novamente mais tarde.');
        }
    };

    // Carrega e exibe dados do caso
    if (informacoesGerais.success && informacoesGerais.informacoes) {   
        dadosDoCaso = informacoesGerais.informacoes;
        idAssistida = dadosDoCaso.id_assistida || 0;
        uiManager.preencherDadosCaso(dadosDoCaso);
        console.log('Dados do caso carregados:', dadosDoCaso);
    } else {
        console.error('Erro ao carregar informações do caso:', informacoesGerais);
    }

    // 🔄 RECUPERAR ANEXOS DO BANCO DE DADOS
    const recuperarAnexosDoBanco = async () => {
        try {
            const resultado = await window.api.recuperarAnexosDoCaso(Number(idCaso));
            
            if (resultado.success && resultado.anexos && resultado.anexos.length > 0) {
                // 📍 Criar mapa de ID -> Nome para salvar no sessionStorage
                const mapaAnexos: { [key: number]: string } = {};
                
                resultado.anexos.forEach((anexo: any, index: number) => {
                    // Determina o tipo baseado no campo 'relatorio' do banco de dados
                    const isRelatorio = anexo.relatorio === true;
                    const tipo = isRelatorio ? 'relatorio' : 'prova';
                    
                    const novoArquivo = {
                        id: anexo.idAnexo || `anexo-bd-${index}`,
                        nome: anexo.nomeAnexo,
                        tamanho: Formatters.tamanhoArquivo(anexo.tamanho),
                        status: 'upado',
                        progresso: 100,
                        tipo: anexo.tipo,
                        visibilidade: anexo.visibilidade || 'privado',
                        relatorio: isRelatorio  // Armazena o campo booleano
                        // Dados NÃO são enviados - será baixado quando clicado
                    };
                    
                    // Salvar no mapa o nome do arquivo com ID
                    mapaAnexos[anexo.idAnexo] = anexo.nomeAnexo;
                    
                    fileManager.adicionar(tipo, novoArquivo);
                });
                
                // 💾 Salvar mapa de anexos no sessionStorage para fácil recuperação
                sessionStorage.setItem('mapaAnexosCaso', JSON.stringify(mapaAnexos));
                console.log('📍 Mapa de anexos salvo no sessionStorage:', mapaAnexos);
                
                atualizarTela();
            }
        } catch (error) {
            console.error('Erro ao recuperar anexos:', error);
        }
    };


    let arquivoPrivacidadeAtual: any = null;

    const acoesArquivo = {
        onDelete: async (id: any) => {
            console.log('🗑️ Iniciando deleção do arquivo com ID:', id, 'tipo:', typeof id);
            console.log('Arquivos antes:', fileManager.obterTodosCombinados());
            
            const confirmar = await uiManager.mostrarConfirmacao('Tem certeza que deseja apagar este arquivo?');
            if (confirmar) {
                try {
                    // PASSO 1: Recuperar nome do arquivo do sessionStorage (não do fileManager)
                    const mapaAnexosJSON = sessionStorage.getItem('mapaAnexosCaso');
                    const mapaAnexos = mapaAnexosJSON ? JSON.parse(mapaAnexosJSON) : {};
                    const nomeArquivoSalvo = mapaAnexos[id] || 'Arquivo';
                    console.log('📋 Nome do arquivo recuperado do sessionStorage:', nomeArquivoSalvo);
                    
                    // PASSO 2: Deletar do banco (passando o nome salvo)
                    console.log('Deletando do banco...');
                    const resultadoDeletar = await window.api.excluirAnexo(id, nomeArquivoSalvo);
                    console.log('Resultado da deleção do banco:', resultadoDeletar);
                    
                    // PASSO 3: Se deletou com sucesso, continuar
                    if (resultadoDeletar?.success) {
                        // Remover da memória local
                        fileManager.remover(Number(id));
                        console.log('Removendo da memória com ID:', Number(id));
                        console.log('Arquivos depois:', fileManager.obterTodosCombinados());
                        
                        // PASSO 4: Registrar a deleção no histórico com o nome salvo
                        try {
                            // Recuperar dados do usuário logado
                            const STORAGE_KEY = 'usuarioLogado';
                            const usuarioLogadoJSON = sessionStorage.getItem(STORAGE_KEY);
                            const usuarioLogado = usuarioLogadoJSON ? JSON.parse(usuarioLogadoJSON) : null;
                            const emailFuncionario = usuarioLogado?.email || 'sistema@sistema.com';
                            const nomeFuncionario = usuarioLogado?.nome || 'Sistema';
                            
                            // Registrar a deleção no histórico com o nome salvo
                            await window.api.registrarDelecaoAnexo(
                                Number(idCaso),
                                idAssistida,
                                nomeArquivoSalvo,
                                nomeFuncionario,
                                emailFuncionario
                            );
                            console.log('✅ Histórico registrado: Arquivo deletado por', nomeFuncionario);
                        } catch (erroHistorico) {
                            console.warn('Aviso: Histórico não foi registrado:', erroHistorico);
                        }
                        
                        atualizarTela();
                        uiManager.mostrarPopup('Arquivo deletado com sucesso!');
                    } else {
                        console.error('Falha na deleção do banco');
                        uiManager.mostrarPopup('Erro ao deletar arquivo do banco');
                    }
                } catch (erro) {
                    console.error('Erro ao deletar:', erro);
                    uiManager.mostrarPopup('Erro ao deletar arquivo');
                }
            }
        },
        onCancel: async (id: any) => {
            const confirmar = await uiManager.mostrarConfirmacao('Cancelar o upload?');
            if (confirmar) {
                fileManager.remover(id);
                atualizarTela();
            }
        },
        onVisibility: async (id: any) => {
            arquivoPrivacidadeAtual = fileManager.buscarPorId(id);
            uiManager.toggleModalPrivacidade(true);
        }
    };

    const atualizarTela = ()=> {
        uiManager.renderizarLista('prova', fileManager.obterTodos('prova'), acoesArquivo);
        uiManager.renderizarLista('relatorio', fileManager.obterTodos('relatorio'), acoesArquivo);
    };

    const iniciarUpload = (files: any) => {
        if (!files || files.length === 0) return;
        
        // Validar todos os arquivos primeiro
        const arquivosInvalidos = [];
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > Config.MAX_FILE_SIZE) {
                arquivosInvalidos.push(files[i].name);
            }
        }
        
        if (arquivosInvalidos.length > 0) {
            const mensagem = arquivosInvalidos.length === 1 
                ? `O arquivo "${arquivosInvalidos[0]}" excede o tamanho máximo permitido de 100MB.`
                : `${arquivosInvalidos.length} arquivo(s) excedem o tamanho máximo permitido de 100MB:\n${arquivosInvalidos.join(', ')}`;
            uiManager.mostrarPopup(mensagem);
            return;
        }

        // Processar todos os arquivos válidos
        console.log(`${files.length} arquivo(s) selecionado(s)`);
        console.log('Tipo de anexo:', estadoUpload.tipoAtual);
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            const novoArquivo = {
                id: 'uuid-' + Date.now() + '-' + i,
                nome: file.name,
                tamanho: Formatters.tamanhoArquivo(file.size),
                status: 'upando',
                progresso: 0,
                tipo: file.type,
                visibilidade: 'privado',
                rawFile: file
            };

            fileManager.adicionar(estadoUpload.tipoAtual, novoArquivo);
            salvarArquivoRealizado(novoArquivo, estadoUpload.tipoAtual);
        }
        
        uiManager.togglePopupUpload(false);
        atualizarTela();
    };

    const salvarArquivoRealizado = async (arquivo: any, tipo: string) => {
        try {
            // Ler arquivo como ArrayBuffer (não usar Buffer no renderer)
            const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const buffer = e.target?.result as ArrayBuffer;
                    resolve(buffer);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(arquivo.rawFile);
            });

            // Converter ArrayBuffer para Uint8Array para manter compatibilidade
            const uint8Array = new Uint8Array(arrayBuffer);
            const tamanhoArquivo = uint8Array.length;
            
            // Atualizar tamanho real do arquivo
            arquivo.tamanho = Formatters.tamanhoArquivo(tamanhoArquivo);

            // Define o campo relatorio baseado no tipo selecionado
            const isRelatorio = tipo === 'relatorio';

            // Salvar no banco (Uint8Array será convertido para Buffer no main process)
            const resultado = await window.api.salvarAnexo({
                nome: arquivo.nome,
                tipo: arquivo.rawFile.type || 'application/octet-stream',
                tamanho: tamanhoArquivo,
                dados: uint8Array,
                relatorio: isRelatorio  // ✅ Passa o campo relatorio: true/false
            }, Number(idCaso), idAssistida);

            if (resultado.success) {
                arquivo.status = 'upado';
                arquivo.progresso = 100;
                arquivo.relatorio = isRelatorio;  // Armazena no estado local também
                // Atualizar o ID do arquivo com o ID retornado do banco
                if (resultado.idAnexo) {
                    arquivo.id = resultado.idAnexo;
                    console.log('Arquivo salvo com novo ID:', resultado.idAnexo, 'Relatório:', isRelatorio);

                    // Registrar o nome do anexo recém-criado no mapa utilizado pelo histórico/deleção
                    const mapaAnexosJSON = sessionStorage.getItem('mapaAnexosCaso');
                    const mapaAnexos = mapaAnexosJSON ? JSON.parse(mapaAnexosJSON) : {};
                    mapaAnexos[resultado.idAnexo] = arquivo.nome;
                    sessionStorage.setItem('mapaAnexosCaso', JSON.stringify(mapaAnexos));
                }
            } else {
                arquivo.status = 'erro';
            }
        } catch (error) {
            console.error('Erro ao salvar arquivo:', error);
            arquivo.status = 'erro';
        } finally {
            atualizarTela();
        }
    };


    // Botão Acessar Formulário
    const btnAcessarForm = document.getElementById('acessar-form');
    if (btnAcessarForm) {
        btnAcessarForm.addEventListener('click', async () => {
            console.log('[informacoesCasoRenderer] 🔄 Iniciando carregamento de dados para visualização...');
            
            if (idCaso) {
                try {
                    // 1️⃣ Chamar API para buscar dados completos
                    console.log('[informacoesCasoRenderer] 📡 Chamando API para caso:', idCaso);
                    const resposta = await window.api.getCasoCompletoVisualizacao(Number(idCaso));
                    
                    console.log('[informacoesCasoRenderer] 📦 Resposta da API:', resposta);
                    
                    if (resposta.success && resposta.caso) {
                        const casoData = resposta.caso;
                        console.log('[informacoesCasoRenderer] 📋 Estrutura casoData:', {
                            assistida: casoData.assistida,
                            caso: casoData.caso,
                            agressor: casoData.agressor,
                            questoes: casoData.questoes
                        });
                        
                        // 🔍 DEBUG: Log específico para q10-q13
                        console.log('[informacoesCasoRenderer] 🔍 Valores de Q10-Q13:');
                        console.log('  q9_doenca (agressor):', casoData.agressor?.q9_doenca);
                        console.log('  q10_medida_protetiva (agressor):', casoData.agressor?.q10_medida_protetiva);
                        console.log('  q11_suicidio (agressor):', casoData.agressor?.q11_suicidio);
                        console.log('  q12_financeiro (agressor):', casoData.agressor?.q12_financeiro);
                        console.log('  q13_arma_de_fogo (agressor):', casoData.agressor?.q13_arma_de_fogo);
                        
                        
                        // 2️⃣ Transformar dados para tela 2 (Agressor/Risco)
                        const dadosCaso = {
                            nomeAgressor: casoData.agressor?.nome || '',
                            idadeAgresssor: casoData.agressor?.idade || '',
                            vinculoAssistida: casoData.agressor?.vinculo || '',
                            dataOcorrencia: casoData.caso?.data ?? '',
                            _ameacas: casoData.questoes?.q1_ameacas_violencia || [],
                            _agressoesGraves: casoData.questoes?.q2_agressoes_violencia || [],
                            _outrasAgressoes: casoData.questoes?.q3_tipos_violencia || [],
                            _estupro: casoData.questoes?.q4_estupro ?? '',
                            _comportamentos: casoData.questoes?.q5_comportamentos || [],
                            _boMedida: casoData.questoes?.q6_medida ?? '',
                            _frequenciaAumento: casoData.questoes?.q7_frequencia ?? '',
                            _usoDrogas: casoData.questoes?.q8_substancias ?? [],
                            _doencaMental: casoData.agressor?.q9_doenca ?? '',
                            _descumpriuMedida: casoData.agressor?.q10_medida_protetiva ?? '',
                            _tentativaSuicidio: casoData.agressor?.q11_suicidio ?? '',
                            _desempregadoDificuldades: casoData.agressor?.q12_financeiro ?? '',
                            _acessoArmas: casoData.agressor?.q13_arma_de_fogo ?? '',
                            _ameacouAgrediu: casoData.questoes?.q14_ameacas_agressor ?? [],
                            separacaoRecente: casoData.caso?.q15_separacao ?? '',
                            _temFilhosIds: (() => {
                                const ids = [];
                                // Marcar "Sim, com o agressor" se tiver quantidade
                                if (casoData.questoes?.q16_filhos?.q16a_com_agressor && casoData.questoes.q16_filhos.q16a_com_agressor > 0) {
                                    ids.push('q16-tem-filhos-sim-agressor');
                                }
                                // Marcar "Sim, de outro relacionamento" se tiver quantidade
                                if (casoData.questoes?.q16_filhos?.q16o_outro_relacionamento && casoData.questoes.q16_filhos.q16o_outro_relacionamento > 0) {
                                    ids.push('q16-tem-filhos-sim-outro');
                                }
                                return ids;
                            })(),
                            _q16QuantosAgressor: casoData.questoes?.q16_filhos?.q16a_com_agressor || '',
                            _q16QuantosOutro: casoData.questoes?.q16_filhos?.q16o_outro_relacionamento || '',
                            _q16FaixaEtariaIds: casoData.questoes?.q16_filhos?.q16p1_faixa_etaria || [],
                            _q16Deficiencia: casoData.questoes?.q16_filhos?.q16p2_com_deficiencia || '',
                            _q16ConflitosIds: casoData.questoes?.q16_filhos?.q16p3_conflitos || [],
                            _q16Presenciaram: casoData.questoes?.q16_filhos?.q16p4_viu_violencia || '',
                            _q16ViolenciaGravidez: casoData.questoes?.q16_filhos?.q16p5_violencia_gravidez || '',
                            novoRelacionamentoAumentouAgressao: casoData.caso?.q17_novo_relac ?? false,
                            possuiDeficienciaDoenca: casoData.assistida?.deficiencia || '',
                            corRaca: casoData.assistida?.cor_raca || '',
                            _moraEmAreaRisco: casoData.caso?.q20_mora_risco ?? '',
                            _dependenteFinanceira: casoData.caso?.q21_depen_finc ?? '',
                            _abrigamentoTemporario: casoData.caso?.q22_abrigo ?? ''
                        };
                        
                        // 3️⃣ Transformar dados para tela 1 (Assistida)
                        const dadosAssistida = {
                            nomeCompleto: casoData.assistida?.nome || '',
                            idade: casoData.assistida?.idade || '',
                            endereco: casoData.assistida?.endereco || '',
                            identidadeGenero: casoData.assistida?.identidadegenero || '',
                            nomeSocial: casoData.assistida?.n_social || '',
                            escolaridade: casoData.assistida?.escolaridade || '',
                            religiao: casoData.assistida?.religiao || '',
                            nacionalidade: casoData.assistida?.nacionalidade || '',
                            profissao: casoData.assistida?.ocupacao || '',
                            limitacao: casoData.assistida?.limitacao || '',
                            numeroCadastro: casoData.assistida?.cad_social || '',
                            dependentes: casoData.assistida?.dependentes || '',
                            zona: casoData.assistida?.zona || 'urbana',
                            cpf: '',
                            renda: ''
                        };
                        
                        // 4️⃣ Transformar dados para tela 3 (Encaminhamento)
                        const dadosEncaminhamento = {
                            anotacoesLivres: casoData.caso?.outras_informacoes || ''
                        };
                        
                        // 5️⃣ Armazenar no sessionStorage
                        sessionStorage.setItem('dadosCaso', JSON.stringify(dadosCaso));
                        sessionStorage.setItem('dadosAssistida', JSON.stringify(dadosAssistida));
                        sessionStorage.setItem('dadosEncaminhamento', JSON.stringify(dadosEncaminhamento));
                        sessionStorage.setItem('idCasoVisualizacao', idCaso.toString());
                        
                        console.log('[informacoesCasoRenderer] ✅ Dados carregados no sessionStorage:');
                        console.log('  - dadosCaso:', dadosCaso);
                        console.log('  - dadosAssistida:', dadosAssistida);
                        console.log('[informacoesCasoRenderer] 👶 Q16 - Filhos:');
                        console.log('  _temFilhosIds:', dadosCaso._temFilhosIds);
                        console.log('  _q16QuantosAgressor:', dadosCaso._q16QuantosAgressor);
                        console.log('  _q16QuantosOutro:', dadosCaso._q16QuantosOutro);
                        console.log('  - dadosEncaminhamento:', dadosEncaminhamento);
                        console.log('[informacoesCasoRenderer] 🗓️  Data no dadosCaso:', {
                            data: dadosCaso.dataOcorrencia,
                            tipo: typeof dadosCaso.dataOcorrencia,
                            original: casoData.caso?.data
                        });
                        
                        // 6️⃣ Abrir tela de visualização
                        console.log('[informacoesCasoRenderer] 🪟 Abrindo tela de visualização 1...');
                        await window.api.openWindow("telaVisualizacao1");
                        
                    } else {
                        console.error('[informacoesCasoRenderer] ❌ Erro ao carregar dados:', resposta.error);
                        uiManager.mostrarPopup('Erro ao carregar dados do caso. Tente novamente.');
                    }
                } catch (erro) {
                    console.error('[informacoesCasoRenderer] ❌ Exceção ao carregar dados:', erro);
                    uiManager.mostrarPopup('Erro ao carregar dados. Tente novamente.');
                }
            } else {
                console.error('[informacoesCasoRenderer] ❌ ID do caso não disponível');
                uiManager.mostrarPopup('ID do caso não disponível.');
            }
        });
    }

    // Botão Editar Formulário
    const btnEditarForm = document.getElementById('editar-form');
    if (btnEditarForm) {
        btnEditarForm.addEventListener('click', () => {
            const modalEditarFormulario = document.getElementById('modalEditarFormulario');
            if (modalEditarFormulario) {
                modalEditarFormulario.classList.add('visible');
            }
        });
    }

    // Botão Alterar Privacidade
    const btnAlterarPrivacidade = document.getElementById('alterar-privacidade');
    if (btnAlterarPrivacidade) {
        btnAlterarPrivacidade.addEventListener('click', () => {
            const modalPrivacidadeFormulario = document.getElementById('modalPrivacidadeFormulario');
            if (modalPrivacidadeFormulario) {
                modalPrivacidadeFormulario.classList.add('visible');
            }
        });
    }

    // Fechar modals ao clicar no X
    const btnFecharModalEditarFormulario = document.getElementById('fecharModalEditarFormulario');
    if (btnFecharModalEditarFormulario) {
        btnFecharModalEditarFormulario.addEventListener('click', () => {
            const modalEditarFormulario = document.getElementById('modalEditarFormulario');
            if (modalEditarFormulario) {
                modalEditarFormulario.classList.remove('visible');
            }
        });
    }

    const btnFecharModalPrivacidadeFormulario = document.getElementById('fecharModalPrivacidadeFormulario');
    if (btnFecharModalPrivacidadeFormulario) {
        btnFecharModalPrivacidadeFormulario.addEventListener('click', () => {
            const modalPrivacidadeFormulario = document.getElementById('modalPrivacidadeFormulario');
            if (modalPrivacidadeFormulario) {
                modalPrivacidadeFormulario.classList.remove('visible');
            }
        });
    }

    // Fechar modals ao clicar fora do conteúdo
    const modalEditarFormulario = document.getElementById('modalEditarFormulario');
    if (modalEditarFormulario) {
        modalEditarFormulario.addEventListener('click', (e: any) => {
            if (e.target === modalEditarFormulario) {
                modalEditarFormulario.classList.remove('visible');
            }
        });
    }

    const modalPrivacidadeFormulario = document.getElementById('modalPrivacidadeFormulario');
    if (modalPrivacidadeFormulario) {
        modalPrivacidadeFormulario.addEventListener('click', (e: any) => {
            if (e.target === modalPrivacidadeFormulario) {
                modalPrivacidadeFormulario.classList.remove('visible');
            }
        });
    }

    const btnSalvarPrivacidade = document.querySelector('#modalPrivacidade button');
    if (btnSalvarPrivacidade) {
        (btnSalvarPrivacidade as HTMLElement).onclick = async () => {
            console.log('🔒 btnSalvarPrivacidade clicado');
            console.log('arquivoPrivacidadeAtual:', arquivoPrivacidadeAtual);
            
            const radioSelecionado = document.querySelector('input[name="privacidade"]:checked') as HTMLInputElement;
            console.log('radioSelecionado:', radioSelecionado?.value);
            
            if (radioSelecionado && arquivoPrivacidadeAtual) {
                const tipoPrivacidade = radioSelecionado.value === 'publico' ? 'público' : 'privado';
                
                // Atualiza o estado do arquivo
                console.log('ANTES:', arquivoPrivacidadeAtual.visibilidade);
                arquivoPrivacidadeAtual.visibilidade = radioSelecionado.value;
                console.log('DEPOIS:', arquivoPrivacidadeAtual.visibilidade);
                
                // Re-renderiza para mudar o ícone
                atualizarTela();
                
                uiManager.toggleModalPrivacidade(false);
                uiManager.mostrarPopup(`Anexo definido como ${tipoPrivacidade} com sucesso!`);
            } else {
                console.warn('❌ Não conseguiu atualizar - radioSelecionado:', !!radioSelecionado, 'arquivoPrivacidadeAtual:', !!arquivoPrivacidadeAtual);
            }
        };
    }

    // Botões de anexar
    const btnAnexarProva = document.getElementById('anexar-prova');
    if (btnAnexarProva) {
        btnAnexarProva.onclick = () => {
            estadoUpload.tipoAtual = 'prova';
            uiManager.togglePopupUpload(true);
        };
    }

    const btnAnexarRelatorio = document.getElementById('anexar-relatorio');
    if (btnAnexarRelatorio) {
        btnAnexarRelatorio.onclick = () => {
            estadoUpload.tipoAtual = 'relatorio';
            uiManager.togglePopupUpload(true);
        };
    }

    // Popup de upload
    const btnFecharPopup = document.getElementById('fechar-popup');
    if (btnFecharPopup) btnFecharPopup.onclick = () => uiManager.togglePopupUpload(false);

    const fileInput = document.getElementById(Config.IDS.INPUT_FILE) as HTMLInputElement | null;
    if (fileInput) fileInput.onchange = (e: any) => iniciarUpload((e.target as HTMLInputElement).files);

    const btnSelecionarArquivo = document.getElementById('btn-selecionar-arquivo');
    if (btnSelecionarArquivo && fileInput) {
        btnSelecionarArquivo.onclick = () => fileInput.click();
    }

    // Drag and drop
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
        dropZone.ondragover = (e: any) => { e.preventDefault(); dropZone.classList.add('drag-over'); };
        dropZone.ondragleave = (e: any) => { e.preventDefault(); dropZone.classList.remove('drag-over'); };
        dropZone.ondrop = (e: any) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            iniciarUpload((e.dataTransfer as DataTransfer).files);
        };
    }

    // Modal de encaminhamento
    const btnAbrirEncaminhamento = document.getElementById('encaminhamento') as HTMLButtonElement | null;
    const selectEmailPara = document.getElementById('email-para') as HTMLSelectElement | null;

    if (btnAbrirEncaminhamento) {
        btnAbrirEncaminhamento.onclick = async () => {
            await carregarRedesApoio();

            if (!redesCadastradas.length) {
                uiManager.mostrarPopup('Cadastre uma rede de apoio antes de enviar encaminhamentos.');
                return;
            }

            if (selectEmailPara) {
                selectEmailPara.innerHTML = '<option value="" disabled selected>Selecione o destinatário</option>';
                redesCadastradas.forEach((rede: any) => {
                    const opt = document.createElement('option');
                    opt.value = String(rede.id);
                    opt.textContent = `${rede.nome} (${rede.email})`;
                    (opt.dataset as DOMStringMap).email = rede.email;
                    selectEmailPara.appendChild(opt);
                });
            }

            uiManager.toggleModalEncaminhamento(true);
        };
    }

    const btnFecharEncaminhamento = document.getElementById('fecharModalEncaminhamento');
    if (btnFecharEncaminhamento) btnFecharEncaminhamento.onclick = () => uiManager.toggleModalEncaminhamento(false);

    const btnFecharPrivacidade = document.getElementById('fecharModalPrivacidade');
    if (btnFecharPrivacidade) btnFecharPrivacidade.onclick = () => uiManager.toggleModalPrivacidade(false);

    // Botão Salvar Alterações do Modal de Privacidade do Formulário
    const btnSalvarPrivacidadeForm = document.getElementById('modal-privacidade-form');
    if (btnSalvarPrivacidadeForm) {
        btnSalvarPrivacidadeForm.addEventListener('click', () => {
            // Captura todas as configurações selecionadas
            const configuracao = {
                padrao: (document.querySelector('input[name="visibilidade-padrao"]:checked') as HTMLInputElement)?.id || 'privado-padrao',
                assistida: (document.querySelector('input[name="visibilidade-assistida"]:checked') as HTMLInputElement)?.id || 'privado-assistida',
                caso: (document.querySelector('input[name="visibilidade-caso"]:checked') as HTMLInputElement)?.id || 'privado-caso',
                outras: (document.querySelector('input[name="visibilidade-outras"]:checked') as HTMLInputElement)?.id || 'privado-outras',
                profissional: (document.querySelector('input[name="visibilidade-profissional"]:checked') as HTMLInputElement)?.id || 'privado-profissional'
            };

            // Salva no localStorage
            localStorage.setItem('configuracaoPrivacidadeFormulario', JSON.stringify(configuracao));

            console.log('Configurações de privacidade salvas:', configuracao);

            // Fecha o modal
            const modalPrivacidadeFormulario = document.getElementById('modalPrivacidadeFormulario');
            if (modalPrivacidadeFormulario) {
                modalPrivacidadeFormulario.classList.remove('visible');
            }

            // Mostra mensagem de sucesso
            uiManager.mostrarPopup('Configurações de privacidade salvas com sucesso!');
        });
    }

    // Dropdown de anexos no modal
    const botaoDropdownAnexo = document.getElementById('botaoAnexo');
    const menuAnexos = document.getElementById('menuAnexos');
    const fecharMenuAnexos = document.getElementById('fecharMenuAnexos');

    const atualizarDropdownModal = () => {
        const todosArquivos = fileManager.obterTodosCombinados();
        uiManager.renderizarSelecaoModal(todosArquivos, estadoEncaminhamento.anexosSelecionadosIds, (idClicado: any) => {
            const index = estadoEncaminhamento.anexosSelecionadosIds.indexOf(idClicado);
            if (index === -1) estadoEncaminhamento.anexosSelecionadosIds.push(idClicado);
            else estadoEncaminhamento.anexosSelecionadosIds.splice(index, 1);
            
            atualizarDropdownModal();
        });
    };

    if (botaoDropdownAnexo && menuAnexos) {
        botaoDropdownAnexo.onclick = (e: any) => {
            e.stopPropagation();
            const estaVisivel = menuAnexos.style.display === 'block';
            menuAnexos.style.display = estaVisivel ? 'none' : 'block';
            if (!estaVisivel) atualizarDropdownModal();
        };
    }

    if (fecharMenuAnexos) fecharMenuAnexos.onclick = () => {
        if (menuAnexos) menuAnexos.style.display = 'none';
    };

    // Fecha dropdown ao clicar fora
    document.addEventListener('click', (e: any) => {
        if (menuAnexos && menuAnexos.style.display === 'block' && 
            !menuAnexos.contains(e.target as Node) && botaoDropdownAnexo && !botaoDropdownAnexo.contains(e.target as Node)) {
            menuAnexos.style.display = 'none';
        }
    });

    // Botão enviar encaminhamento
    const btnEnviar = document.getElementById('btnEnviarEncaminhamento') as HTMLButtonElement | null;
    if (btnEnviar) {
        const textoOriginalEnviar = btnEnviar.textContent || 'Enviar';

        btnEnviar.onclick = async () => {
            const emailParaInput = document.getElementById('email-para') as HTMLSelectElement | null;
            const emailAssuntoInput = document.getElementById('email-assunto') as HTMLInputElement | null;
            const emailCorpoInput = document.getElementById('email-corpo') as HTMLTextAreaElement | null;

            const idRedeSelecionada = emailParaInput?.value || '';
            const emailAssunto = (emailAssuntoInput?.value || '').trim();
            const emailCorpo = (emailCorpoInput?.value || '').trim();

            if (!idRedeSelecionada) {
                uiManager.mostrarPopup('Por favor, selecione um destinatário.');
                return;
            }

            if (!emailCorpo || emailCorpo.length < 10) {
                uiManager.mostrarPopup('O campo de mensagem deve conter pelo menos 10 caracteres.');
                return;
            }

            const redeDestino = redesCadastradas.find((rede: any) => String(rede.id) === String(idRedeSelecionada));
            if (!redeDestino) {
                uiManager.mostrarPopup('Rede de apoio selecionada não encontrada.');
                return;
            }

            const anexosSelecionados = (estadoEncaminhamento.anexosSelecionadosIds || [])
                .map((valor: any) => Number(valor))
                .filter((valor: number) => Number.isInteger(valor) && valor > 0);

            try {
                btnEnviar.disabled = true;
                btnEnviar.textContent = 'Enviando...';

                const resposta = await window.api.enviarEmailEncaminhamento({
                    idCaso: Number(idCaso),
                    idRedeDestino: Number(redeDestino.id),
                    assunto: emailAssunto,
                    mensagem: emailCorpo,
                    anexosIds: anexosSelecionados
                });

                if (!resposta?.success) {
                    throw new Error(resposta?.error || 'Falha ao enviar o e-mail.');
                }

                uiManager.toggleModalEncaminhamento(false);
                uiManager.mostrarPopup('E-mail enviado com sucesso!');
                await atualizarRedesContatadas();

                if (emailParaInput) {
                    emailParaInput.selectedIndex = 0;
                }
                if (emailAssuntoInput) emailAssuntoInput.value = '';
                if (emailCorpoInput) emailCorpoInput.value = '';
                estadoEncaminhamento.anexosSelecionadosIds = [];
                if (menuAnexos) menuAnexos.style.display = 'none';
            } catch (erro) {
                console.error('Erro ao enviar encaminhamento:', erro);
                uiManager.mostrarPopup(erro instanceof Error ? erro.message : 'Erro desconhecido ao enviar o e-mail.');
            } finally {
                btnEnviar.disabled = false;
                btnEnviar.textContent = textoOriginalEnviar;
            }
        };
    }

    // Configura event delegation uma única vez
    uiManager.configurarEventDelegation(acoesArquivo);

    // Listener para mudança de status
    const selectStatus = document.getElementById('StatusAssistenciaSelect');
    if (selectStatus) {
        selectStatus.addEventListener('change', async (e: any) => {
            const novoStatus = (e.target as HTMLSelectElement).value;
            console.log('Alterando status para:', novoStatus);
            
            try {
                dadosDoCaso.statusAssistencia = novoStatus;
                sessionStorage.setItem('dadosCaso', JSON.stringify(dadosDoCaso));
                uiManager.mostrarPopup('Status atualizado com sucesso!');
            } catch (error) {
                console.error('Erro ao atualizar status:', error);
                uiManager.mostrarPopup('Erro ao atualizar o status.');
            }
        });
    }

    // Inicializa mensagem padrão de redes contatadas
    const redesContatadas = document.getElementById('redes-contatadas');
    if (redesContatadas && !redesContatadas.textContent.trim()) {
        redesContatadas.textContent = 'Nenhuma rede de apoio foi contatada até o momento';
    }

    await atualizarRedesContatadas();

    // Controle de Visibilidade Padrão e Etapas Específicas
    const radiosPadrao = document.querySelectorAll('input[name="visibilidade-padrao"]');
    const radiosEtapas = document.querySelectorAll('.visibilidade-etapa');

    // Quando clicar em qualquer opção da Visibilidade Padrão, ativa/desativa todas as etapas
    radiosPadrao.forEach((radio: any) => {
        radio.addEventListener('change', (e: any) => {
            const isPublico = (e.target as HTMLInputElement).id === 'publico-padrao';
            
            // Atualiza todas as etapas específicas
            radiosEtapas.forEach((etapa: any) => {
                if (isPublico && (etapa as HTMLInputElement).id.includes('publico')) {
                    (etapa as HTMLInputElement).checked = true;
                } else if (!isPublico && (etapa as HTMLInputElement).id.includes('privado')) {
                    (etapa as HTMLInputElement).checked = true;
                }
            });
        });
    });

    // Carregar configurações salvas ao abrir o modal de privacidade do formulário
    if (btnAlterarPrivacidade) {
        btnAlterarPrivacidade.addEventListener('click', () => {
            // Carrega as configurações salvas do localStorage
            const configSalva = localStorage.getItem('configuracaoPrivacidadeFormulario');
            if (configSalva) {
                try {
                    const config = JSON.parse(configSalva);
                    
                    // Restaura visibilidade padrão
                    if (config.padrao) {
                        const radioPadrao = document.getElementById(config.padrao) as HTMLInputElement;
                        if (radioPadrao) radioPadrao.checked = true;
                    }
                    
                    // Restaura cada etapa específica
                    if (config.assistida) {
                        const radioAssistida = document.getElementById(config.assistida) as HTMLInputElement;
                        if (radioAssistida) radioAssistida.checked = true;
                    }
                    if (config.caso) {
                        const radioCaso = document.getElementById(config.caso) as HTMLInputElement;
                        if (radioCaso) radioCaso.checked = true;
                    }
                    if (config.outras) {
                        const radioOutras = document.getElementById(config.outras) as HTMLInputElement;
                        if (radioOutras) radioOutras.checked = true;
                    }
                    if (config.profissional) {
                        const radioProfissional = document.getElementById(config.profissional) as HTMLInputElement;
                        if (radioProfissional) radioProfissional.checked = true;
                    }
                } catch (error) {
                    console.error('Erro ao carregar configurações:', error);
                }
            }
        });
    }
    
    // 🔄 CARREGAR ANEXOS DO BANCO QUANDO A PÁGINA INICIA
    await recuperarAnexosDoBanco();
    
    // ❌ BOTÃO FECHAR - VOLTAR PARA LISTAGEM DE CASOS DA ASSISTIDA
    const btnFecharInformacoes = document.getElementById('fecharInformacoes') as HTMLButtonElement | null;
    if (btnFecharInformacoes) {
        btnFecharInformacoes.addEventListener('click', async () => {
            console.log('[informaçõesCaso] Botão fechar clicado - voltando para casos da assistida ID:', idAssistida);
            
            // Guardar ID da assistida para retornar à lista de casos dela
            sessionStorage.setItem('protocoloAssistidaSelecionada', String(idAssistida));
            
            // Limpar sessionStorage (exceto o que será usado na próxima página)
            sessionStorage.removeItem('dadosAssistida');
            sessionStorage.removeItem('dadosCaso');
            sessionStorage.removeItem('modoEdicao');
            sessionStorage.removeItem('idAssistidaSelecionada');
            sessionStorage.removeItem('cadastro_anexos');
            
            // Limpar localStorage
            localStorage.removeItem('configuracaoPrivacidadeFormulario');
            
            console.log('[informaçõesCaso] Dados limpos do storage, voltando para assistida ID:', idAssistida);
            
            await window.api.openWindow('telaCasosRegistrados');
        });
    }
    
    atualizarTela();
});