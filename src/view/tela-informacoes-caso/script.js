// --- Simulação dos dados vindos do seu Backend ---
const dadosDosAnexos = [
  {
    id: "uuid-12345",
    nome: "boletim_ocorrencia.pdf",
    tamanho: "2.5 MB",
    status: "upado"
  },
  {
    id: "uuid-67890",
    nome: "comprovante_residencia.jpg",
    tamanho: "1.2 MB",
    status: "upando",
    progresso: 65
  },
  {
    id: "uuid-abcde",
    nome: "documento_identidade.pdf",
    tamanho: "850 KB",
    status: "upado"
  }
];

const dadosDosRelatorios = [
  {
    id: "uuid-11111",
    nome: "relatorio_psicologico.pdf",
    tamanho: "3.1 MB",
    status: "upado"
  },
  {
    id: "uuid-22222",
    nome: "relatorio_social.pdf",
    tamanho: "1.8 MB",
    status: "upado"
  }
];

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
      itemLista.innerHTML = `
        <div class="icone-arquivo">
          <span class="material-symbols-outlined" style="font-size: 60px; color: #63468C;">description</span>
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
      itemLista.innerHTML = `
        <div class="icone-arquivo">
          <span class="material-symbols-outlined" style="font-size: 60px; color: #63468C;">description</span>
        </div>
        
        <div class="info-arquivo">
          <span class="nome-arquivo">${arquivo.nome}</span>
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
function abrirPopupUpload() {
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
    
    // Aqui você faria o upload do arquivo
    // Por enquanto, vamos simular adicionando à lista
    const novoAnexo = {
      id: 'uuid-' + Date.now(),
      nome: file.name,
      tamanho: formatarTamanho(file.size),
      status: 'upando',
      progresso: 0
    };
    
    dadosDosAnexos.push(novoAnexo);
    renderizarAnexos(dadosDosAnexos, 'lista-anexos');
    
    // Simula progresso do upload
    simularUpload(novoAnexo.id);
    
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
function simularUpload(id) {
  let progresso = 0;
  const interval = setInterval(() => {
    progresso += 10;
    const anexo = dadosDosAnexos.find(a => a.id === id);
    if (anexo) {
      anexo.progresso = progresso;
      if (progresso >= 100) {
        anexo.status = 'upado';
        clearInterval(interval);
      }
      renderizarAnexos(dadosDosAnexos, 'lista-anexos');
    } else {
      clearInterval(interval);
    }
  }, 500);
}

// Renderiza as listas quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  renderizarAnexos(dadosDosAnexos, 'lista-anexos');
  renderizarAnexos(dadosDosRelatorios, 'lista-relatorios');
  
  // Eventos dos botões de anexar
  const botoesAnexar = document.querySelectorAll('#anexar-prova');
  botoesAnexar.forEach(botao => {
    botao.addEventListener('click', abrirPopupUpload);
  });
  
  // Evento do botão fechar popup
  const btnFecharPopup = document.getElementById('fechar-popup');
  if (btnFecharPopup) {
    btnFecharPopup.addEventListener('click', fecharPopupUpload);
  }
  
  // Evento do overlay (clicar fora fecha)
  const popupOverlay = document.getElementById('popup-upload');
  if (popupOverlay) {
    popupOverlay.addEventListener('click', function(e) {
      if (e.target === popupOverlay) {
        fecharPopupUpload();
      }
    });
  }
  
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