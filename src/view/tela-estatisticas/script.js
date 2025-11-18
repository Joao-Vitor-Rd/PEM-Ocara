/**
 * Sistema de Gerenciamento de Filtros com Modal
 *
 * Controla a interface de filtros para aplicação de critérios de região e data
 * com funcionalidades de limpeza, aplicação e estado persistente dos filtros.
 */

/**
 * Configura e gerencia o modal de filtros com todas as interações
 * @returns {void}
 */
function setupFilterModal() {
  // ===== SELEÇÃO DE ELEMENTOS DA INTERFACE =====
  const filterButtons = document.querySelectorAll(".btn-filtro");
  const modal = document.getElementById("modalFiltros");
  const btnCancelar = document.querySelector(".btn-cancelar");
  const btnAplicar = document.querySelector(".btn-aplicar");
  const btnLimparFiltros = document.querySelector(".btn-clear-filtro");
  const chipsRegiao = document.querySelectorAll(".chip");
  const dataInicio = document.getElementById("data-inicio");
  const dataFim = document.getElementById("data-fim");

  // ===== ESTADO DOS FILTROS =====
  /**
   * Objeto que mantém o estado atual dos filtros selecionados
   * @type {Object}
   * @property {string} regiao - Região selecionada ('todas' por padrão)
   * @property {string} dataInicio - Data inicial no formato string
   * @property {string} dataFim - Data final no formato string
   */
  let filtrosAtuais = {
    regiao: "todas",
    dataInicio: "",
    dataFim: "",
  };

  // ===== CONTROLE DE ABERTURA DO MODAL =====
  /**
   * Abre o modal de filtros quando qualquer botão de filtro é clicado
   */
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modal.classList.add("visible");
    });
  });

  // ===== CONTROLE DE FECHAMENTO DO MODAL =====
  /**
   * Fecha o modal de filtros e restaura o estado anterior
   * @returns {void}
   */
  const fecharModal = () => {
    modal.classList.remove("visible");
  };

  // Fechar modal pelo botão cancelar
  btnCancelar.addEventListener("click", fecharModal);

  // Fechar modal clicando fora do conteúdo
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      fecharModal();
    }
  });

  // ===== LÓGICA DE SELEÇÃO DE REGIÃO (CHIPS) =====
  /**
   * Gerencia a seleção de chips de região com estado de seleção única
   */
  chipsRegiao.forEach((chip) => {
    chip.addEventListener("click", () => {
      // Remove estado ativo de todos os chips para garantir seleção única
      chipsRegiao.forEach((c) => c.classList.remove("chip-active"));

      // Aplica estado ativo apenas ao chip clicado
      chip.classList.add("chip-active");

      // Atualiza o estado dos filtros com a região selecionada
      filtrosAtuais.regiao = chip.getAttribute("data-regiao");

      console.log("Região selecionada:", filtrosAtuais.regiao);
    });
  });

  // ===== LÓGICA DE SELEÇÃO DE DATAS =====
  /**
   * Atualiza o estado da data inicial quando o usuário seleciona uma data
   */
  dataInicio.addEventListener("change", (e) => {
    filtrosAtuais.dataInicio = e.target.value;
    console.log("Data início:", filtrosAtuais.dataInicio);
  });

  /**
   * Atualiza o estado da data final quando o usuário seleciona uma data
   */
  dataFim.addEventListener("change", (e) => {
    filtrosAtuais.dataFim = e.target.value;
    console.log("Data fim:", filtrosAtuais.dataFim);
  });

  // ===== LÓGICA DE LIMPEZA DE FILTROS =====
  /**
   * Adiciona handler para o botão de limpar filtros
   */
  btnLimparFiltros.addEventListener("click", () => {
    limparFiltros();
  });

  /**
   * Reseta todos os filtros para seus valores padrão
   * - Região: 'todas'
   * - Datas: vazias
   * - Interface: chips e campos resetados
   * @returns {void}
   */
  function limparFiltros() {
    // Resetar seleção de região na interface
    chipsRegiao.forEach((chip) => {
      chip.classList.remove("chip-active");
      // Ativa apenas o chip "todas" por padrão
      if (chip.getAttribute("data-regiao") === "todas") {
        chip.classList.add("chip-active");
      }
    });

    // Resetar campos de data
    dataInicio.value = "";
    dataFim.value = "";

    // Resetar estado interno dos filtros
    filtrosAtuais = {
      regiao: "todas",
      dataInicio: "",
      dataFim: "",
    };

    console.log("Filtros limpos:", filtrosAtuais);
  }

  // ===== SISTEMA DE POPUP DE CONFIRMAÇÃO =====
  /**
   * Exibe popup de confirmação com mensagem personalizada
   * @param {string} mensagem - Texto a ser exibido no popup
   * @returns {void}
   */
  function mostrarPopupConfirmacao(mensagem) {
    // Assume que popupMensagem e popupConfirmacao estão disponíveis globalmente
    popupMensagem.textContent = mensagem;
    popupConfirmacao.classList.add("visible");
  }

  /**
   * Fecha o popup de confirmação quando o botão OK é clicado
   */
  popupBtnOk.addEventListener("click", () => {
    popupConfirmacao.classList.remove("visible");
  });

  /**
   * Fecha o popup de confirmação quando clica fora do conteúdo
   */
  popupConfirmacao.addEventListener("click", (e) => {
    if (e.target === popupConfirmacao) {
      popupConfirmacao.classList.remove("visible");
    }
  });

  // ===== LÓGICA DE APLICAÇÃO DE FILTROS =====
  /**
   * Aplica os filtros selecionados e fecha o modal
   */
  btnAplicar.addEventListener("click", () => {
    aplicarFiltros();
    fecharModal();
  });

  /**
   * Processa a aplicação dos filtros selecionados
   * - Aqui deve ser implementada a integração com o sistema de dados
   * - Atualiza gráficos, tabelas ou outros componentes com os filtros
   * @returns {void}
   */
  function aplicarFiltros() {
    // TODO: Implementar integração com sistema de dados
    // Exemplo: atualizar gráficos, tabelas, ou fazer requisições API

    console.log("Aplicando filtros:", filtrosAtuais);

    // Fechar modal de filtros (já é chamado no event handler)
    // fecharModal();

    // Feedback visual para o usuário
    mostrarPopupConfirmacao("Filtro aplicado com sucesso!");
  }

  // ===== INICIALIZAÇÃO DA INTERFACE =====
  /**
   * Configura placeholders para melhor usabilidade dos campos de data
   */
  dataInicio.setAttribute("placeholder", "Selecione a data inicial");
  dataFim.setAttribute("placeholder", "Selecione a data final");
}

// ===== INICIALIZAÇÃO DO SISTEMA =====
/**
 * Inicializa o sistema de filtros quando o DOM estiver completamente carregado
 */
document.addEventListener("DOMContentLoaded", setupFilterModal);
