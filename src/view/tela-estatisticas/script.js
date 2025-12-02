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

  // ===== ELEMENTOS DE VALIDAÇÃO =====
  // Criar elemento para mensagem de erro
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.style.color = "#E66953";
  errorMessage.style.fontSize = "14px";
  errorMessage.style.marginTop = "5px";
  errorMessage.style.display = "none";
  errorMessage.style.fontFamily = "Poppins";

  // Inserir a mensagem de erro após o grupo completo da data fim
  const dateFimGroup = dataFim.closest(".date-input-group");
  dateFimGroup.parentNode.insertBefore(errorMessage, dateFimGroup.nextSibling);

  // ===== ESTADO DOS FILTROS =====
  /**
   * Objeto que mantém o estado atual dos filtros selecionados
   * @type {Object}
   * @property {Set} regioes - Conjunto de regiões selecionadas
   * @property {string} dataInicio - Data inicial no formato string
   * @property {string} dataFim - Data final no formato string
   */
  let filtrosAtuais = {
    regioes: new Set(), // Agora é um Set para múltiplas seleções
    dataInicio: "",
    dataFim: "",
  };

  // ===== VALIDAÇÃO DE DATAS =====
  /**
   * Valida se a data inicial é anterior ou igual à data final
   * @returns {boolean} - Retorna true se as datas são válidas
   */
  function validarDatas() {
    const inicio = dataInicio.value;
    const fim = dataFim.value;

    // Se ambos os campos estão preenchidos
    if (inicio && fim) {
      const dataInicioObj = new Date(inicio);
      const dataFimObj = new Date(fim);

      if (dataInicioObj > dataFimObj) {
        // Data início é maior que data fim - ERRO
        errorMessage.textContent =
          "A data inicial não pode ser maior que a data final";
        errorMessage.style.display = "block";
        dataFim.style.borderColor = "#E66953"; // Borda vermelha
        return false;
      }
    }

    // Datas válidas ou campos vazios
    errorMessage.style.display = "none";
    dataFim.style.borderColor = "#63468C"; // Borda normal
    return true;
  }

  // ===== CONTROLE DE ABERTURA DO MODAL =====
  /**
   * Abre o modal de filtros quando qualquer botão de filtro é clicado
   */
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modal.classList.add("visible");
      // Limpar validação ao abrir o modal
      errorMessage.style.display = "none";
      dataFim.style.borderColor = "#63468C";
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

  // ===== LÓGICA DE SELEÇÃO DE REGIÃO (CHIPS) - MODIFICADA PARA SELEÇÃO MÚLTIPLA =====
  /**
   * Gerencia a seleção de chips de região com estado de seleção múltipla
   */
  chipsRegiao.forEach((chip) => {
    chip.addEventListener("click", () => {
      const regiao = chip.getAttribute("data-regiao");

      // Lógica especial para "todas"
      if (regiao === "todas") {
        // Se clicar em "todas", limpa todas as outras seleções
        filtrosAtuais.regioes.clear();
        filtrosAtuais.regioes.add("todas");

        // Atualiza a interface
        chipsRegiao.forEach((c) => {
          const isTodas = c.getAttribute("data-regiao") === "todas";
          c.classList.toggle("chip-active", isTodas);
          updateCheckIcon(c, isTodas);
        });
      } else {
        // Remove "todas" se estiver selecionada (seleção específica)
        if (filtrosAtuais.regioes.has("todas")) {
          filtrosAtuais.regioes.delete("todas");
          document
            .querySelector('[data-regiao="todas"]')
            .classList.remove("chip-active");
          updateCheckIcon(
            document.querySelector('[data-regiao="todas"]'),
            false
          );
        }

        // Toggle da região específica
        if (filtrosAtuais.regioes.has(regiao)) {
          // Remove se já estiver selecionada
          filtrosAtuais.regioes.delete(regiao);
          chip.classList.remove("chip-active");
          updateCheckIcon(chip, false);
        } else {
          // Adiciona se não estiver selecionada
          filtrosAtuais.regioes.add(regiao);
          chip.classList.add("chip-active");
          updateCheckIcon(chip, true);
        }

        // Se nenhuma região estiver selecionada, seleciona "todas" automaticamente
        if (filtrosAtuais.regioes.size === 0) {
          filtrosAtuais.regioes.add("todas");
          document
            .querySelector('[data-regiao="todas"]')
            .classList.add("chip-active");
          updateCheckIcon(
            document.querySelector('[data-regiao="todas"]'),
            true
          );
        }
      }

      console.log("Regiões selecionadas:", Array.from(filtrosAtuais.regioes));
    });
  });

  /**
   * Atualiza a visibilidade do ícone de check nos chips
   * @param {HTMLElement} chip - Elemento do chip
   * @param {boolean} isSelected - Se o chip está selecionado
   */
  function updateCheckIcon(chip, isSelected) {
    const checkIcon = chip.querySelector(".material-symbols-outlined");
    if (checkIcon) {
      if (isSelected) {
        checkIcon.style.display = "inline-block";
      } else {
        checkIcon.style.display = "none";
      }
    }
  }

  // ===== LÓGICA DE SELEÇÃO DE DATAS =====
  /**
   * Atualiza o estado da data inicial quando o usuário seleciona uma data
   */
  dataInicio.addEventListener("change", (e) => {
    filtrosAtuais.dataInicio = e.target.value;
    console.log("Data início:", filtrosAtuais.dataInicio);
    // Validar datas sempre que alguma mudar
    validarDatas();
  });

  /**
   * Atualiza o estado da data final quando o usuário seleciona uma data
   */
  dataFim.addEventListener("change", (e) => {
    filtrosAtuais.dataFim = e.target.value;
    console.log("Data fim:", filtrosAtuais.dataFim);
    // Validar datas sempre que alguma mudar
    validarDatas();
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
      const isTodas = chip.getAttribute("data-regiao") === "todas";
      chip.classList.toggle("chip-active", isTodas);
      updateCheckIcon(chip, isTodas);
    });

    // Resetar campos de data
    dataInicio.value = "";
    dataFim.value = "";

    // Resetar estado interno dos filtros
    filtrosAtuais = {
      regioes: new Set(["todas"]), // Apenas "todas" selecionada por padrão
      dataInicio: "",
      dataFim: "",
    };

    // Limpar mensagem de erro
    errorMessage.style.display = "none";
    dataFim.style.borderColor = "#63468C";

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
    const popupMensagem = document.getElementById("popupMensagem");
    const popupConfirmacao = document.getElementById("popupConfirmacao");

    if (popupMensagem && popupConfirmacao) {
      popupMensagem.textContent = mensagem;
      popupConfirmacao.classList.add("visible");
    }
  }

  /**
   * Fecha o popup de confirmação quando o botão OK é clicado
   */
  const popupBtnOk = document.getElementById("popupBtnOk");
  const popupConfirmacao = document.getElementById("popupConfirmacao");

  if (popupBtnOk && popupConfirmacao) {
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
  }

  // ===== LÓGICA DE APLICAÇÃO DE FILTROS =====
  /**
   * Aplica os filtros selecionados e fecha o modal
   */
  btnAplicar.addEventListener("click", () => {
    // Validar datas antes de aplicar
    if (validarDatas()) {
      aplicarFiltros();
      fecharModal();
    } else {
      // Mostrar mensagem de erro se as datas forem inválidas
      mostrarPopupConfirmacao("Erro: Data inicial maior que data final!");
    }
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

    console.log("Aplicando filtros:", {
      regioes: Array.from(filtrosAtuais.regioes),
      dataInicio: filtrosAtuais.dataInicio,
      dataFim: filtrosAtuais.dataFim,
    });

    // Feedback visual para o usuário
    mostrarPopupConfirmacao("Filtro aplicado com sucesso!");
  }

  // ===== INICIALIZAÇÃO DA INTERFACE =====
  /**
   * Configura placeholders para melhor usabilidade dos campos de data
   */
  dataInicio.setAttribute("placeholder", "Selecione a data inicial");
  dataFim.setAttribute("placeholder", "Selecione a data final");

  // Inicializar com "todas" selecionada
  const chipTodas = document.querySelector('[data-regiao="todas"]');
  if (chipTodas) {
    chipTodas.classList.add("chip-active");
    updateCheckIcon(chipTodas, true);
    filtrosAtuais.regioes.add("todas");
  }
}

// ===== INICIALIZAÇÃO DO SISTEMA =====
/**
 * Inicializa o sistema de filtros quando o DOM estiver completamente carregado
 */
document.addEventListener("DOMContentLoaded", setupFilterModal);
