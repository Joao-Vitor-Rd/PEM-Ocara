/// <reference path="../types/windown.d.ts" />

export {}

const telaInicialBtn = document.getElementById('telaInicial') as HTMLLIElement | null;
const cadastroAssistidaBtn = document.getElementById('telaCadastroAssistida') as HTMLButtonElement | null;
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
                li.innerHTML = `
                    <div class="icone-arquivo"><img src="${icone}" alt="file"></div>
                    <div class="info-arquivo">
                        <span class="nome-arquivo" title="${arquivo.nome}">${nomeExibicao}</span>
                        <span class="tamanho-arquivo">${arquivo.tamanho}</span>
                    </div>
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
            tipoViolencia.textContent = tipos;
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

    const redesCadastradas: any[] = [];

    // Carrega e exibe dados do caso
    if (informacoesGerais.success && informacoesGerais.informacoes) {   
        dadosDoCaso = informacoesGerais.informacoes;
        uiManager.preencherDadosCaso(dadosDoCaso);
        console.log('Dados do caso carregados:', dadosDoCaso);
    } else {
        console.error('Erro ao carregar informações do caso:', informacoesGerais);
    }

    const acoesArquivo = {
        onDelete: async (id: any) => {
            const confirmar = await uiManager.mostrarConfirmacao('Tem certeza que deseja apagar este arquivo?');
            if (confirmar) {
                fileManager.remover(id);
                atualizarTela();
            }
        },
        onCancel: async (id: any) => {
            const confirmar = await uiManager.mostrarConfirmacao('Cancelar o upload?');
            if (confirmar) {
                fileManager.remover(id);
                atualizarTela();
            }
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
                rawFile: file
            };

            fileManager.adicionar(estadoUpload.tipoAtual, novoArquivo);
            simularBackendUpload(novoArquivo.id, estadoUpload.tipoAtual);
        }
        
        uiManager.togglePopupUpload(false);
        atualizarTela();
    };

    const simularBackendUpload = (id: any, tipo: any) => {
        let progresso = 0;
        const intervalo = setInterval(() => {
            progresso += 10;
            const arquivo = fileManager.atualizarProgresso(id, progresso);
            
            if (!arquivo) {
                clearInterval(intervalo);
                return;
            }

            if (progresso >= 100) {
                clearInterval(intervalo);
            }
            
            atualizarTela(); 
        }, 500);
    };

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
    
    atualizarTela();
});