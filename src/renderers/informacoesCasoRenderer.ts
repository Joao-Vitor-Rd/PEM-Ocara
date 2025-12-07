/// <reference path="../types/windown.d.ts" />

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
        const mudarTela = await window.api.openWindow("telaInicial");
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
        const mudarTela = await window.api.openWindow("telaEstatisticas");
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

        const itens = [{ id: 'formulario', nome: 'Formulário', fixo: true }, ...todosArquivos.filter((a: any) => a.status === 'upado')];

        itens.forEach(item => {
            const div = document.createElement('div');
            div.className = 'anexo-item-modal';
            
            const isSelected = selecionadosIds.includes(item.id);
            if (isSelected) div.style.backgroundColor = '#F0E6F8';

            const iconeHTML = item.fixo 
                ? '<span class="material-symbols-outlined">attach_file</span>' 
                : '<span class="material-symbols-outlined">description</span>';

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
    sessionStorage.removeItem('idCasoAtual');

    const fileManager = new FileManager();
    const uiManager = new UIManager();

    uiManager.preencherDadosCaso(informacoesGerais.informacoes);

    let estadoUpload = { tipoAtual: 'prova' };
    let estadoEncaminhamento = { anexosSelecionadosIds: [] as any[] };
    let dadosDoCaso: any = {};
    let idAssistida: number = 0;

    const redesCadastradas: any[] = [];

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
                resultado.anexos.forEach((anexo: any, index: number) => {
                    const novoArquivo = {
                        id: anexo.idAnexo || `anexo-bd-${index}`,
                        nome: anexo.nomeAnexo,
                        tamanho: Formatters.tamanhoArquivo(anexo.tamanho),
                        status: 'upado',
                        progresso: 100,
                        tipo: anexo.tipo,
                        visibilidade: anexo.visibilidade || 'privado'
                        // Dados NÃO são enviados - será baixado quando clicado
                    };
                    
                    // Determina se é prova ou relatório baseado no tipo MIME ou padrão
                    const tipo = anexo.tipo && anexo.tipo.includes('pdf') ? 'relatorio' : 'prova';
                    fileManager.adicionar(tipo, novoArquivo);
                });
                
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
                    console.log('Deletando do banco...');
                    await window.api.excluirAnexo(id);
                    console.log('Removendo da memória com ID:', Number(id));
                    fileManager.remover(Number(id));
                    console.log('Arquivos depois:', fileManager.obterTodosCombinados());
                    atualizarTela();
                    uiManager.mostrarPopup('Arquivo deletado com sucesso!');
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

            // Salvar no banco (Uint8Array será convertido para Buffer no main process)
            const resultado = await window.api.salvarAnexo({
                nome: arquivo.nome,
                tipo: arquivo.rawFile.type || 'application/octet-stream',
                tamanho: tamanhoArquivo,
                dados: uint8Array
            }, Number(idCaso), idAssistida);

            if (resultado.success) {
                arquivo.status = 'upado';
                arquivo.progresso = 100;
                // Atualizar o ID do arquivo com o ID retornado do banco
                if (resultado.idAnexo) {
                    arquivo.id = resultado.idAnexo;
                    console.log('Arquivo salvo com novo ID:', resultado.idAnexo);
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
        btnAcessarForm.addEventListener('click', () => {
            console.log('Acessar formulário clicado');
            window.api.openWindow("telaInformacoesCaso");
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
    const btnAbrirEncaminhamento = document.getElementById('encaminhamento');
    const selectEmailPara = document.getElementById('email-para');

    if (btnAbrirEncaminhamento) {
        btnAbrirEncaminhamento.onclick = () => {
            if (selectEmailPara) {
                selectEmailPara.innerHTML = '<option value="" disabled selected>Para</option>';
                redesCadastradas.forEach((rede: any) => {
                    const opt = document.createElement('option');
                    opt.value = rede.id;
                    opt.textContent = rede.nome;
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
    const btnEnviar = document.getElementById('btnEnviarEncaminhamento');
    if (btnEnviar) {
        btnEnviar.onclick = () => {
            const emailParaInput = document.getElementById('email-para') as HTMLInputElement | null;
            const emailAssuntoInput = document.getElementById('email-assunto') as HTMLInputElement | null;
            const emailCorpoInput = document.getElementById('email-corpo') as HTMLInputElement | null;
            
            const emailPara = emailParaInput?.value || '';
            const emailAssunto = emailAssuntoInput?.value || '';
            const emailCorpo = emailCorpoInput?.value || '';
            
            // Validações
            if (!emailPara || emailPara === '') {
                uiManager.mostrarPopup('Por favor, selecione um destinatário.');
                return;
            }
            
            if (!emailCorpo || emailCorpo.trim().length < 5) {
                uiManager.mostrarPopup('O campo de mensagem deve conter pelo menos 10 caracteres.');
                return;
            }
            
            console.log('Enviando encaminhamento...');
            console.log('Para:', emailPara);
            console.log('Assunto:', emailAssunto);
            console.log('Corpo:', emailCorpo);
            console.log('Anexos selecionados:', estadoEncaminhamento.anexosSelecionadosIds);
            
            uiManager.toggleModalEncaminhamento(false);
            
            uiManager.mostrarPopup('Email enviado com sucesso!');
            
            // Limpa campos
            if (emailParaInput) emailParaInput.value = '';
            if (emailAssuntoInput) emailAssuntoInput.value = '';
            if (emailCorpoInput) emailCorpoInput.value = '';
            estadoEncaminhamento.anexosSelecionadosIds = [];
            if (menuAnexos) menuAnexos.style.display = 'none';
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