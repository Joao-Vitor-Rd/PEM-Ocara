// --- Dados que virão do Backend ---
// Dados do caso (a serem preenchidos pelo backend)
let dadosDoCaso = {};

// Arrays de anexos e relatórios (a serem preenchidos pelo backend)
let dadosDosAnexos = [];
let dadosDosRelatorios = [];

// Variável para rastrear se está anexando prova ou relatório
let tipoAnexoAtual = 'prova'; // 'prova' ou 'relatorio'

// Função para obter o ícone correto baseado na extensão do arquivo
function obterIconeArquivo(nomeArquivo) {
  const extensao = nomeArquivo.split('.').pop().toLowerCase();
  
  switch(extensao) {
    case 'pdf':
      return 'icons/pdf.png';
    case 'doc':
    case 'docx':
      return 'icons/doc.png';
    case 'txt':
      return 'icons/txt.png';
    case 'jpg':
    case 'jpeg':
      return 'icons/jpg.png';
    case 'png':
      return 'icons/png.png';
    case 'mp3':
      return 'icons/mp3.png';
    case 'mp4':
    case 'm4a':
      return 'icons/mov.png';
    case 'zip':
    case 'rar':
      return 'icons/fecho-eclair.png';
    default:
      return 'icons/pdf.png'; // Ícone padrão
  }
}

// Função para truncar nomes de arquivos longos
function truncarNomeArquivo(nomeCompleto, maxLength = 40) {
  if (nomeCompleto.length <= maxLength) {
    return nomeCompleto;
  }
  
  // Separa nome e extensão
  const ultimoPonto = nomeCompleto.lastIndexOf('.');
  if (ultimoPonto === -1) {
    // Sem extensão, trunca normalmente
    return nomeCompleto.substring(0, maxLength - 3) + '...';
  }
  
  const nome = nomeCompleto.substring(0, ultimoPonto);
  const extensao = nomeCompleto.substring(ultimoPonto);
  
  // Calcula quanto do nome pode ser mostrado
  const espacoParaNome = maxLength - extensao.length - 3; // 3 para "..."
  
  if (espacoParaNome <= 0) {
    // Extensão muito longa, trunca tudo
    return nomeCompleto.substring(0, maxLength - 3) + '...';
  }
  
  return nome.substring(0, espacoParaNome) + '...' + extensao;
}

// Função para renderizar anexos
function renderizarAnexos(dados, containerId) {
  const listaContainer = document.getElementById(containerId);
  
  if (!listaContainer) {
    console.error(`Container ${containerId} não encontrado`);
    return;
  }
  
  listaContainer.innerHTML = "";
  
  dados.forEach(arquivo => {
    const itemLista = document.createElement("li");
    itemLista.className = "item-anexo";
    
    const estaUpando = arquivo.status === 'upando';
    
    if (estaUpando) {
      // Layout para arquivo em upload
      const iconeArquivo = obterIconeArquivo(arquivo.nome);
      itemLista.innerHTML = `
        <div class="icone-arquivo">
          <img src="${iconeArquivo}" alt="Ícone do arquivo">
        </div>
        
        <div class="info-arquivo">
          <div class="progresso-info">
            <span class="texto-progresso">Upando arquivo... ${arquivo.progresso || 0}%</span>
          </div>
          <div class="barra-progresso">
            <div class="barra-progresso-preenchida" style="width: ${arquivo.progresso || 0}%"></div>
          </div>
        </div>
        
        <button class="btn-cancelar" data-id="${arquivo.id}">
          <span class="material-symbols-outlined">cancel</span>
        </button>
      `;
    } else {
      // Layout para arquivo upado
      const iconeArquivo = obterIconeArquivo(arquivo.nome);
      const nomeExibicao = truncarNomeArquivo(arquivo.nome);
      itemLista.innerHTML = `
        <div class="icone-arquivo">
          <img src="${iconeArquivo}" alt="Ícone do arquivo">
        </div>
        
        <div class="info-arquivo">
          <span class="nome-arquivo" title="${arquivo.nome}">${nomeExibicao}</span>
          <span class="tamanho-arquivo">${arquivo.tamanho}</span>
        </div>
        
        <button class="btn-apagar" data-id="${arquivo.id}">
          <span class="material-symbols-outlined">delete_forever</span>
        </button>
      `;
    }
    
    listaContainer.appendChild(itemLista);
  });
  
  // Adiciona evento de clique aos botões de apagar
  const botoesApagar = listaContainer.querySelectorAll('.btn-apagar');
  botoesApagar.forEach(botao => {
    botao.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      apagarAnexo(id, containerId);
    });
  });
  
  // Adiciona evento de clique aos botões de cancelar
  const botoesCancelar = listaContainer.querySelectorAll('.btn-cancelar');
  botoesCancelar.forEach(botao => {
    botao.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      cancelarUpload(id, containerId);
    });
  });
}

// Função para apagar anexo
function apagarAnexo(id, containerId) {
  if (confirm('Tem certeza que deseja apagar este arquivo?')) {
    // Aqui você faria a chamada para o backend para apagar
    console.log(`Apagando arquivo com ID: ${id}`);
    
    // Remove do array
    if (containerId === 'lista-anexos') {
      const index = dadosDosAnexos.findIndex(a => a.id === id);
      if (index > -1) {
        dadosDosAnexos.splice(index, 1);
        renderizarAnexos(dadosDosAnexos, 'lista-anexos');
      }
    } else if (containerId === 'lista-relatorios') {
      const index = dadosDosRelatorios.findIndex(a => a.id === id);
      if (index > -1) {
        dadosDosRelatorios.splice(index, 1);
        renderizarAnexos(dadosDosRelatorios, 'lista-relatorios');
      }
    }
  }
}

// Função para cancelar upload
function cancelarUpload(id, containerId) {
  if (confirm('Tem certeza que deseja cancelar o upload?')) {
    // Aqui você faria a chamada para o backend para cancelar
    console.log(`Cancelando upload do arquivo com ID: ${id}`);
    
    // Remove do array
    if (containerId === 'lista-anexos') {
      const index = dadosDosAnexos.findIndex(a => a.id === id);
      if (index > -1) {
        dadosDosAnexos.splice(index, 1);
        renderizarAnexos(dadosDosAnexos, 'lista-anexos');
      }
    } else if (containerId === 'lista-relatorios') {
      const index = dadosDosRelatorios.findIndex(a => a.id === id);
      if (index > -1) {
        dadosDosRelatorios.splice(index, 1);
        renderizarAnexos(dadosDosRelatorios, 'lista-relatorios');
      }
    }
  }
}

// Função para abrir popup de upload
function abrirPopupUpload(tipo) {
  tipoAnexoAtual = tipo || 'prova';
  const popup = document.getElementById('popup-upload');
  popup.style.display = 'flex';
}

// Função para fechar popup de upload
function fecharPopupUpload() {
  const popup = document.getElementById('popup-upload');
  popup.style.display = 'none';
  // Limpa o input de arquivo
  document.getElementById('file-input').value = '';
}

// Função para lidar com seleção de arquivo
function handleFileSelect(files) {
  if (files.length > 0) {
    const file = files[0];
    console.log('Arquivo selecionado:', file.name);
    console.log('Tipo de anexo:', tipoAnexoAtual);
    
    // Verifica se o arquivo excede 100MB
    const maxSize = 100 * 1024 * 1024; // 100MB em bytes
    if (file.size > maxSize) {
      alert('O arquivo excede o tamanho máximo permitido de 100MB. Por favor, selecione um arquivo menor.');
      return;
    }
    
    // Aqui você faria o upload do arquivo
    // Por enquanto, vamos simular adicionando à lista
    const novoAnexo = {
      id: 'uuid-' + Date.now(),
      nome: file.name,
      tamanho: formatarTamanho(file.size),
      status: 'upando',
      progresso: 0
    };
    
    // Adiciona ao array correto baseado no tipo
    if (tipoAnexoAtual === 'relatorio') {
      dadosDosRelatorios.push(novoAnexo);
      renderizarAnexos(dadosDosRelatorios, 'lista-relatorios');
      simularUpload(novoAnexo.id, 'relatorio');
    } else {
      dadosDosAnexos.push(novoAnexo);
      renderizarAnexos(dadosDosAnexos, 'lista-anexos');
      simularUpload(novoAnexo.id, 'prova');
    }
    
    fecharPopupUpload();
  }
}

// Função auxiliar para formatar tamanho do arquivo
function formatarTamanho(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Função para simular upload (remover quando integrar com backend)
function simularUpload(id, tipo) {
  let progresso = 0;
  const interval = setInterval(() => {
    progresso += 10;
    
    // Busca no array correto
    const dados = tipo === 'relatorio' ? dadosDosRelatorios : dadosDosAnexos;
    const containerId = tipo === 'relatorio' ? 'lista-relatorios' : 'lista-anexos';
    
    const anexo = dados.find(a => a.id === id);
    if (anexo) {
      anexo.progresso = progresso;
      if (progresso >= 100) {
        anexo.status = 'upado';
        clearInterval(interval);
      }
      renderizarAnexos(dados, containerId);
    } else {
      clearInterval(interval);
    }
  }, 500);
}

// Função para preencher as informações do caso (chamar quando receber dados do backend)
function preencherInformacoesCaso(dados) {
  if (!dados) return;
  
  // Preenche o protocolo no título
  if (dados.protocolo) {
    document.getElementById('Protocolo').textContent = dados.protocolo;
  }
  
  // Preenche as informações do caso
  if (dados.assistida) {
    document.getElementById('Assistida').textContent = dados.assistida;
  }
  if (dados.agressor) {
    document.getElementById('Agressor').textContent = dados.agressor;
  }
  if (dados.dataCadastro) {
    document.getElementById('DataCadastro').textContent = dados.dataCadastro;
  }
  if (dados.statusAssistencia) {
    document.getElementById('StatusAssistencia').textContent = dados.statusAssistencia;
  }
  if (dados.statusJuridico) {
    document.getElementById('StatusJuridico').textContent = dados.statusJuridico;
  }
  if (dados.tipoViolencia) {
    document.getElementById('TipoViolencia').textContent = dados.tipoViolencia;
  }
  
  // Preenche as redes contatadas
  if (dados.redesContatadas) {
    document.getElementById('redes-contatadas').textContent = dados.redesContatadas;
  }
}

// Renderiza as listas quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  // Renderiza as listas de anexos e relatórios
  renderizarAnexos(dadosDosAnexos, 'lista-anexos');
  renderizarAnexos(dadosDosRelatorios, 'lista-relatorios');

  // Modal de Encaminhamento
  const botaoEncaminhamento = document.getElementById('encaminhamento');
  const modalEncaminhamento = document.getElementById('modalEncaminhamento');
  const botaoFecharModalEncaminhamento = document.getElementById('fecharModalEncaminhamento');
  const selectEmailPara = document.getElementById('email-para');

  // Array de redes (a ser preenchido pelo backend)
  let redesCadastradas = [];

  function carregarRedes() {
    // Limpa as opções existentes (exceto a primeira)
    selectEmailPara.innerHTML = '<option value="" disabled selected>Para</option>';
    
    // Adiciona as redes vindas do backend
    redesCadastradas.forEach(rede => {
      const option = document.createElement('option');
      option.value = rede.id;
      option.textContent = rede.nome;
      selectEmailPara.appendChild(option);
    });
  }

  function abrirModalEncaminhamento() {
    carregarRedes();
    modalEncaminhamento.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function fecharModalEncaminhamento() {
    modalEncaminhamento.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (botaoEncaminhamento) {
    botaoEncaminhamento.addEventListener('click', abrirModalEncaminhamento);
  }

  if (botaoFecharModalEncaminhamento) {
    botaoFecharModalEncaminhamento.addEventListener('click', fecharModalEncaminhamento);
  }

  // Anexo do modal - selecionar dos anexos já existentes
  const botaoAnexo = document.getElementById('botaoAnexo');
  const nomeAnexoModalEl = document.getElementById('nome-anexo-modal');
  const menuAnexos = document.getElementById('menuAnexos');
  const fecharMenuAnexos = document.getElementById('fecharMenuAnexos');
  const listaAnexosModal = document.getElementById('listaAnexosModal');
  let anexosSelecionados = [];

  if (nomeAnexoModalEl) {
    nomeAnexoModalEl.textContent = 'Nenhum anexo selecionado';
  }

  function atualizarListaAnexosModal() {
    listaAnexosModal.innerHTML = '';
    
    // Sempre adiciona o formulário primeiro (vem do backend)
    const formulario = {
      id: 'formulario',
      nome: 'Formulário'
    };
    
    // Combina formulário, anexos e relatórios
    const todosAnexos = [
      formulario,
      ...dadosDosAnexos.filter(a => a.status === 'upado'),
      ...dadosDosRelatorios.filter(a => a.status === 'upado')
    ];

    todosAnexos.forEach(anexo => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'anexo-item-modal';
      
      // Adiciona ícone - attach_file para formulário, description para outros
      const iconeDiv = document.createElement('div');
      iconeDiv.className = 'anexo-icone-modal';
      if (anexo.id === 'formulario') {
        iconeDiv.innerHTML = '<span class="material-symbols-outlined">attach_file</span>';
      } else {
        iconeDiv.innerHTML = '<span class="material-symbols-outlined">description</span>';
      }
      
      const infoDiv = document.createElement('div');
      infoDiv.className = 'anexo-info-modal';
      
      const nomeSpan = document.createElement('div');
      nomeSpan.className = 'anexo-nome-modal';
      const nomeExibicao = truncarNomeArquivo(anexo.nome, 35);
      nomeSpan.textContent = nomeExibicao;
      nomeSpan.title = anexo.nome; // Tooltip com nome completo
      
      infoDiv.appendChild(nomeSpan);
      
      itemDiv.appendChild(nomeSpan);
      itemDiv.appendChild(iconeDiv);
      
      // Click no item inteiro seleciona
      itemDiv.addEventListener('click', (e) => {
        if (!anexosSelecionados.includes(anexo.id)) {
          anexosSelecionados.push(anexo.id);
        } else {
          anexosSelecionados = anexosSelecionados.filter(id => id !== anexo.id);
        }
        
        // Atualiza visual de seleção
        if (anexosSelecionados.includes(anexo.id)) {
          itemDiv.style.backgroundColor = '#F0E6F8';
        } else {
          itemDiv.style.backgroundColor = '#ffffff';
        }
        
        atualizarTextoAnexosSelecionados();
      });
      
      // Marca visual se já está selecionado
      if (anexosSelecionados.includes(anexo.id)) {
        itemDiv.style.backgroundColor = '#F0E6F8';
      }
      
      listaAnexosModal.appendChild(itemDiv);
    });
  }

  function atualizarTextoAnexosSelecionados() {
    if (anexosSelecionados.length === 0) {
      nomeAnexoModalEl.textContent = 'Nenhum anexo selecionado';
    } else if (anexosSelecionados.length === 1) {
      const anexo = [...dadosDosAnexos, ...dadosDosRelatorios].find(a => a.id === anexosSelecionados[0]);
      nomeAnexoModalEl.textContent = anexo ? anexo.nome : '1 anexo selecionado';
    } else {
      nomeAnexoModalEl.textContent = `${anexosSelecionados.length} anexos selecionados`;
    }
  }

  if (botaoAnexo) {
    botaoAnexo.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (menuAnexos.style.display === 'none' || menuAnexos.style.display === '') {
        atualizarListaAnexosModal();
        menuAnexos.style.display = 'block';
      } else {
        menuAnexos.style.display = 'none';
      }
    });
  }

  if (fecharMenuAnexos) {
    fecharMenuAnexos.addEventListener('click', () => {
      menuAnexos.style.display = 'none';
    });
  }

  // Fecha o menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (menuAnexos && !menuAnexos.contains(e.target) && !botaoAnexo.contains(e.target)) {
      menuAnexos.style.display = 'none';
    }
  });

  // Botão enviar encaminhamento
  const btnEnviarEncaminhamento = document.getElementById('btnEnviarEncaminhamento');
  if (btnEnviarEncaminhamento) {
    btnEnviarEncaminhamento.addEventListener('click', function() {
      const emailPara = document.getElementById('email-para').value;
      const emailAssunto = document.getElementById('email-assunto').value;
      const emailCorpo = document.getElementById('email-corpo').value;
      
      console.log('Enviando encaminhamento...');
      console.log('Para:', emailPara);
      console.log('Assunto:', emailAssunto);
      console.log('Corpo:', emailCorpo);
      console.log('Anexos selecionados:', anexosSelecionados);
      
      // Aqui você implementará a lógica de envio
      fecharModalEncaminhamento();
      
      // Limpa os campos após enviar
      document.getElementById('email-para').value = '';
      document.getElementById('email-assunto').value = '';
      document.getElementById('email-corpo').value = '';
      anexosSelecionados = [];
      atualizarTextoAnexosSelecionados();
      menuAnexos.style.display = 'none';
    });
  }
  
  // Eventos dos botões de anexar
  const botaoAnexarProva = document.getElementById('anexar-prova');
  if (botaoAnexarProva) {
    botaoAnexarProva.addEventListener('click', () => abrirPopupUpload('prova'));
  }
  
  const botaoAnexarRelatorio = document.getElementById('anexar-relatorio');
  if (botaoAnexarRelatorio) {
    botaoAnexarRelatorio.addEventListener('click', () => abrirPopupUpload('relatorio'));
  }
  
  // Evento do botão fechar popup
  const btnFecharPopup = document.getElementById('fechar-popup');
  if (btnFecharPopup) {
    btnFecharPopup.addEventListener('click', fecharPopupUpload);
  }
  
  // Removido: popup não fecha ao clicar fora, apenas no botão close
  
  // Evento do input de arquivo
  const fileInput = document.getElementById('file-input');
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      handleFileSelect(e.target.files);
    });
  }
  
  // Evento do botão selecionar arquivo
  const btnSelecionarArquivo = document.getElementById('btn-selecionar-arquivo');
  if (btnSelecionarArquivo) {
    btnSelecionarArquivo.addEventListener('click', function() {
      fileInput.click();
    });
  }
  
  // Drag and drop
  const dropZone = document.getElementById('drop-zone');
  if (dropZone) {
    dropZone.addEventListener('dragover', function(e) {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', function(e) {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', function(e) {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      handleFileSelect(e.dataTransfer.files);
    });
  }
});