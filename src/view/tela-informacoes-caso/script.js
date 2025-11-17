// Configuração centralizada de constantes
const Config = {
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
    IDS: {
        LISTA_ANEXOS: 'lista-anexos',
        LISTA_RELATORIOS: 'lista-relatorios',
        INPUT_FILE: 'file-input',
        POPUP_UPLOAD: 'popup-upload'
    },
    ICONS: {
        'pdf': 'icons/pdf.png',
        'doc': 'icons/doc.png', 'docx': 'icons/doc.png',
        'txt': 'icons/txt.png',
        'jpg': 'icons/jpg.png', 'jpeg': 'icons/jpg.png',
        'png': 'icons/png.png',
        'mp3': 'icons/mp3.png',
        'mp4': 'icons/mov.png', 'm4a': 'icons/mov.png',
        'zip': 'icons/fecho-eclair.png', 'rar': 'icons/fecho-eclair.png',
        'default': 'icons/pdf.png'
    }
};

// Funções utilitárias de formatação
const Formatters = {
    obterIcone(nomeArquivo) {
        if (!nomeArquivo) return Config.ICONS['default'];
        const extensao = nomeArquivo.split('.').pop().toLowerCase();
        return Config.ICONS[extensao] || Config.ICONS['default'];
    },

    tamanhoArquivo(bytes) {
        if (bytes === 0) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },

    truncarNome(nome, maxLength = 40) {
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

// Gerencia os dados dos arquivos
class FileManager {
    constructor() {
        this.state = {
            prova: [],      // Lista de Provas (Anexos)
            relatorio: []   // Lista de Relatórios
        };
    }

    adicionar(tipo, arquivo) {
        if (this.state[tipo]) {
            this.state[tipo].push(arquivo);
        }
    }

    remover(id) {
        this.state.prova = this.state.prova.filter(f => f.id !== id);
        this.state.relatorio = this.state.relatorio.filter(f => f.id !== id);
    }

    atualizarProgresso(id, progresso) {
        const arquivo = this.buscarPorId(id);
        if (arquivo) {
            arquivo.progresso = progresso;
            arquivo.status = progresso >= 100 ? 'upado' : 'upando';
        }
        return arquivo;
    }

    buscarPorId(id) {
        return [...this.state.prova, ...this.state.relatorio].find(f => f.id === id);
    }

    obterTodos(tipo) {
        return this.state[tipo] || [];
    }

    obterTodosCombinados() {
        return [...this.state.prova, ...this.state.relatorio];
    }
}

// Gerencia a interface e manipulação do DOM
class UIManager {
    constructor() {
        this.containers = {
            prova: document.getElementById(Config.IDS.LISTA_ANEXOS),
            relatorio: document.getElementById(Config.IDS.LISTA_RELATORIOS)
        };
    }

    renderizarLista(tipo, arquivos, callbacks) {
        const container = this.containers[tipo];
        if (!container) return;

        container.innerHTML = "";

        arquivos.forEach(arquivo => {
            const li = document.createElement("li");
            li.className = "item-anexo";
            const icone = Formatters.obterIcone(arquivo.nome);

            if (arquivo.status === 'upando') {
                li.innerHTML = `
                    <div class="icone-arquivo"><img src="${icone}" alt="file"></div>
                    <div class="info-arquivo">
                        <div class="progresso-info"><span class="texto-progresso">Upando arquivo... ${arquivo.progresso}%</span></div>
                        <div class="barra-progresso"><div class="barra-progresso-preenchida" style="width: ${arquivo.progresso}%"></div></div>
                    </div>
                    <button class="btn-cancelar" type="button"><span class="material-symbols-outlined">cancel</span></button>
                `;
                li.querySelector('.btn-cancelar').onclick = () => callbacks.onCancel(arquivo.id);
            } else {
                const nomeExibicao = Formatters.truncarNome(arquivo.nome);
                li.innerHTML = `
                    <div class="icone-arquivo"><img src="${icone}" alt="file"></div>
                    <div class="info-arquivo">
                        <span class="nome-arquivo" title="${arquivo.nome}">${nomeExibicao}</span>
                        <span class="tamanho-arquivo">${arquivo.tamanho}</span>
                    </div>
                    <button class="btn-apagar" type="button"><span class="material-symbols-outlined">delete_forever</span></button>
                `;
                li.querySelector('.btn-apagar').onclick = () => callbacks.onDelete(arquivo.id);
            }
            container.appendChild(li);
        });
    }

    renderizarSelecaoModal(todosArquivos, selecionadosIds, onToggle) {
        const listaModal = document.getElementById('listaAnexosModal');
        const labelNome = document.getElementById('nome-anexo-modal');
        if (!listaModal) return;

        listaModal.innerHTML = '';

        const itens = [{ id: 'formulario', nome: 'Formulário', fixo: true }, ...todosArquivos.filter(a => a.status === 'upado')];

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

        if (selecionadosIds.length === 0) labelNome.textContent = 'Nenhum anexo selecionado';
        else if (selecionadosIds.length === 1) {
            const item = itens.find(i => i.id === selecionadosIds[0]);
            labelNome.textContent = item ? item.nome : '1 anexo selecionado';
        } else {
            labelNome.textContent = `${selecionadosIds.length} anexos selecionados`;
        }
    }

    togglePopupUpload(mostrar) {
        const popup = document.getElementById(Config.IDS.POPUP_UPLOAD);
        if (popup) {
            popup.style.display = mostrar ? 'flex' : 'none';
            if (!mostrar) document.getElementById(Config.IDS.INPUT_FILE).value = '';
        }
    }

    toggleModalEncaminhamento(mostrar) {
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

    preencherDadosCaso(dados) {
        const mapaCampos = {
            'Protocolo': 'protocolo',
            'Assistida': 'assistida',
            'Agressor': 'agressor',
            'DataCadastro': 'dataCadastro',
            'StatusAssistencia': 'statusAssistencia',
            'StatusJuridico': 'statusJuridico',
            'TipoViolencia': 'tipoViolencia',
            'redes-contatadas': 'redesContatadas'
        };

        for (const [id, prop] of Object.entries(mapaCampos)) {
            const el = document.getElementById(id);
            if (el && dados[prop]) {
                el.textContent = dados[prop];
            }
        }
        
        const redesEl = document.getElementById('redes-contatadas');
        if (redesEl && !dados.redesContatadas) {
            redesEl.textContent = 'Nenhuma rede de apoio foi contatada até o momento';
        }
    }
}

// Inicializa quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    const fileManager = new FileManager();
    const uiManager = new UIManager();
    
    let estadoUpload = { tipoAtual: 'prova' };
    let estadoEncaminhamento = { anexosSelecionadosIds: [] };
    
    let redesCadastradas = []; // Array de redes que vem do backend
    let dadosDoCaso = {}; // Dados do caso que vem do backend

    const atualizarTela = ()=> {
        const acoesArquivo = {
            onDelete: (id) => {
                if (confirm('Tem certeza que deseja apagar este arquivo?')) {
                    fileManager.remover(id);
                    atualizarTela();
                }
            },
            onCancel: (id) => {
                if (confirm('Cancelar o upload?')) {
                    fileManager.remover(id);
                    atualizarTela();
                }
            }
        };

        uiManager.renderizarLista('prova', fileManager.obterTodos('prova'), acoesArquivo);
        uiManager.renderizarLista('relatorio', fileManager.obterTodos('relatorio'), acoesArquivo);
    };

    const iniciarUpload = (files) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        
        console.log('Arquivo selecionado:', file.name);
        console.log('Tipo de anexo:', estadoUpload.tipoAtual);

        if (file.size > Config.MAX_FILE_SIZE) {
            alert('O arquivo excede o tamanho máximo permitido de 100MB. Por favor, selecione um arquivo menor.');
            return;
        }

        const novoArquivo = {
            id: 'uuid-' + Date.now(),
            nome: file.name,
            tamanho: Formatters.tamanhoArquivo(file.size),
            status: 'upando',
            progresso: 0,
            rawFile: file
        };

        fileManager.adicionar(estadoUpload.tipoAtual, novoArquivo);
        uiManager.togglePopupUpload(false);
        atualizarTela();
        simularBackendUpload(novoArquivo.id, estadoUpload.tipoAtual);
    };

    const simularBackendUpload = (id, tipo) => {
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

    const fileInput = document.getElementById(Config.IDS.INPUT_FILE);
    if (fileInput) fileInput.onchange = (e) => iniciarUpload(e.target.files);

    const btnSelecionarArquivo = document.getElementById('btn-selecionar-arquivo');
    if (btnSelecionarArquivo && fileInput) {
        btnSelecionarArquivo.onclick = () => fileInput.click();
    }

    // Drag and drop
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
        dropZone.ondragover = (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); };
        dropZone.ondragleave = (e) => { e.preventDefault(); dropZone.classList.remove('drag-over'); };
        dropZone.ondrop = (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            iniciarUpload(e.dataTransfer.files);
        };
    }

    // Modal de encaminhamento
    const btnAbrirEncaminhamento = document.getElementById('encaminhamento');
    const selectEmailPara = document.getElementById('email-para');

    if (btnAbrirEncaminhamento) {
        btnAbrirEncaminhamento.onclick = () => {
            if (selectEmailPara) {
                selectEmailPara.innerHTML = '<option value="" disabled selected>Para</option>';
                redesCadastradas.forEach(rede => {
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
        uiManager.renderizarSelecaoModal(todosArquivos, estadoEncaminhamento.anexosSelecionadosIds, (idClicado) => {
            const index = estadoEncaminhamento.anexosSelecionadosIds.indexOf(idClicado);
            if (index === -1) estadoEncaminhamento.anexosSelecionadosIds.push(idClicado);
            else estadoEncaminhamento.anexosSelecionadosIds.splice(index, 1);
            
            atualizarDropdownModal();
        });
    };

    if (botaoDropdownAnexo && menuAnexos) {
        botaoDropdownAnexo.onclick = (e) => {
            e.stopPropagation();
            const estaVisivel = menuAnexos.style.display === 'block';
            menuAnexos.style.display = estaVisivel ? 'none' : 'block';
            if (!estaVisivel) atualizarDropdownModal();
        };
    }

    if (fecharMenuAnexos) fecharMenuAnexos.onclick = () => menuAnexos.style.display = 'none';

    // Fecha dropdown ao clicar fora
    document.addEventListener('click', (e) => {
        if (menuAnexos && menuAnexos.style.display === 'block' && 
            !menuAnexos.contains(e.target) && !botaoDropdownAnexo.contains(e.target)) {
            menuAnexos.style.display = 'none';
        }
    });

    // Botão enviar encaminhamento
    const btnEnviar = document.getElementById('btnEnviarEncaminhamento');
    if (btnEnviar) {
        btnEnviar.onclick = () => {
            const emailPara = document.getElementById('email-para').value;
            const emailAssunto = document.getElementById('email-assunto').value;
            const emailCorpo = document.getElementById('email-corpo').value;
            
            console.log('Enviando encaminhamento...');
            console.log('Para:', emailPara);
            console.log('Assunto:', emailAssunto);
            console.log('Corpo:', emailCorpo);
            console.log('Anexos selecionados:', estadoEncaminhamento.anexosSelecionadosIds);
            
            uiManager.toggleModalEncaminhamento(false);
            
            // Limpa campos
            document.getElementById('email-para').value = '';
            document.getElementById('email-assunto').value = '';
            document.getElementById('email-corpo').value = '';
            estadoEncaminhamento.anexosSelecionadosIds = [];
            menuAnexos.style.display = 'none';
        };
    }

    // Carrega dados do caso do backend
    async function carregarDadosDoCaso() {
        try {
            // Busca o protocolo do sessionStorage ou URL
            const casoJSON = sessionStorage.getItem('dadosCaso');
            if (casoJSON) {
                dadosDoCaso = JSON.parse(casoJSON);
                
                // Preenche os dados na tela
                uiManager.preencherDadosCaso({
                    protocolo: dadosDoCaso.protocolo || '',
                    assistida: dadosDoCaso.nomeAssistida || '',
                    agressor: dadosDoCaso.nomeAgressor || '',
                    dataCadastro: dadosDoCaso.data ? new Date(dadosDoCaso.data).toLocaleDateString('pt-BR') : '',
                    statusAssistencia: dadosDoCaso.statusAssistencia || '',
                    statusJuridico: dadosDoCaso.statusJuridico || '',
                    tipoViolencia: dadosDoCaso.tipoViolencia || '',
                    redesContatadas: dadosDoCaso.redesContatadas || ''
                });
                
                console.log('Dados do caso carregados:', dadosDoCaso);
            }
        } catch (error) {
            console.error('Erro ao carregar dados do caso:', error);
        }
    }

    // Inicializa mensagem padrão de redes contatadas
    const redesContatadas = document.getElementById('redes-contatadas');
    if (redesContatadas && !redesContatadas.textContent.trim()) {
        redesContatadas.textContent = 'Nenhuma rede de apoio foi contatada até o momento';
    }

    // Carrega dados do backend
    await carregarDadosDoCaso();
    
    atualizarTela();
});