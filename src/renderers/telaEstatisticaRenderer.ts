import { IGraficos } from "../utils/interfaces/IGraficos.js";
import { GraficoLinha } from "../utils/graficosImpl/GraficoLinha.js";
import { GraficoPizza } from "../utils/graficosImpl/GraficoPizza.js";
import { navigateToTelaInicial, navigateToTelaConta, navigateToTelaEstatisticas, navigateToTelaRedeApoio } from '../utils/SidebarManager.js';

let grafico: IGraficos;

/**
 * Configura e gerencia o modal de filtros com todas as interações
 * @returns {void}
 */
function setupFilterModal(): void {
  // ===== SELEÇÃO DE ELEMENTOS DA INTERFACE =====
  const filterButtons = document.querySelectorAll(".btn-filtro");
  const modal = document.getElementById("modalFiltros") as HTMLElement | null;
  const btnCancelar = document.querySelector(".btn-cancelar") as HTMLElement | null;
  const btnAplicar = document.querySelector(".btn-aplicar") as HTMLElement | null;
  const btnLimparFiltros = document.querySelector(".btn-clear-filtro") as HTMLElement | null;
  const chipsRegiao = document.querySelectorAll(".chip");
  const dataInicio = document.getElementById("data-inicio") as HTMLInputElement | null;
  const dataFim = document.getElementById("data-fim") as HTMLInputElement | null;
  
  // IDs do sidebar normal
  const navInicial = document.getElementById("navInicial") as HTMLLIElement | null;
  const navAssistidas = document.getElementById("navAssistidas") as HTMLLIElement | null;
  const navRede = document.getElementById("navRede") as HTMLLIElement | null;
  const navEstatisticas = document.getElementById("navEstatisticas") as HTMLLIElement | null;
  const navConta = document.getElementById("navConta") as HTMLLIElement | null;
  
  // IDs do sidebar admin
  const navFuncionarios = document.getElementById("navFuncionarios") as HTMLLIElement | null;

  // Validar elementos obrigatórios
  if (!modal || !btnCancelar || !btnAplicar || !btnLimparFiltros || !dataInicio || !dataFim) {
    console.error("Elementos obrigatórios não encontrados no DOM");
    return;
  }

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
  const dateFimGroup = dataFim.closest(".date-input-group") as Element | null;
  if (dateFimGroup && dateFimGroup.parentNode) {
    dateFimGroup.parentNode.insertBefore(errorMessage, dateFimGroup.nextSibling);
  }

  navInicial?.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await navigateToTelaInicial();
  });

  navAssistidas?.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await window.api.openWindow("telaListarAssistidas");
  });

  navRede?.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await navigateToTelaRedeApoio();
  });

  navEstatisticas?.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await navigateToTelaEstatisticas();
  });

  navConta?.addEventListener('click', async (event) => {
    event.preventDefault();
    await navigateToTelaConta();
  });

  navFuncionarios?.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await window.api.openWindow("telaListarFuncionarios");
  });

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
  function validarDatas(): boolean {
    if (!dataInicio || !dataFim) return false;
    
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
  chipsRegiao.forEach((chipElement) => {
    const chip = chipElement as HTMLElement;
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
          updateCheckIcon(c as HTMLElement, isTodas);
        });
      } else {
        // Remove "todas" se estiver selecionada (seleção específica)
        if (filtrosAtuais.regioes.has("todas")) {
          filtrosAtuais.regioes.delete("todas");
          const chipTodas = document.querySelector('[data-regiao="todas"]') as HTMLElement | null;
          if (chipTodas) {
            chipTodas.classList.remove("chip-active");
            updateCheckIcon(chipTodas, false);
          }
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
          const chipTodas = document.querySelector('[data-regiao="todas"]') as HTMLElement | null;
          if (chipTodas) {
            chipTodas.classList.add("chip-active");
            updateCheckIcon(chipTodas, true);
          }
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
  function updateCheckIcon(chip: HTMLElement, isSelected: boolean): void {
    const checkIcon = chip.querySelector(".material-symbols-outlined");
    if (checkIcon) {
      if (isSelected) {
        (checkIcon as HTMLElement).style.display = "inline-block";
      } else {
        (checkIcon as HTMLElement).style.display = "none";
      }
    }
  }

  // ===== LÓGICA DE SELEÇÃO DE DATAS =====
  /**
   * Atualiza o estado da data inicial quando o usuário seleciona uma data
   */
  dataInicio.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLInputElement;
    filtrosAtuais.dataInicio = target.value;
    console.log("Data início:", filtrosAtuais.dataInicio);
    // Validar datas sempre que alguma mudar
    validarDatas();
  });

  /**
   * Atualiza o estado da data final quando o usuário seleciona uma data
   */
  dataFim.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLInputElement;
    filtrosAtuais.dataFim = target.value;
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
  function limparFiltros(): void {
    if (!dataInicio || !dataFim) return;

    // Resetar seleção de região na interface
    chipsRegiao.forEach((chip) => {
      const isTodas = chip.getAttribute("data-regiao") === "todas";
      chip.classList.toggle("chip-active", isTodas);
      updateCheckIcon(chip as HTMLElement, isTodas);
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
  function mostrarPopupConfirmacao(mensagem: string): void {
    // Assume que popupMensagem e popupConfirmacao estão disponíveis globalmente
    const popupMensagem = document.getElementById("popupMensagem") as HTMLElement | null;
    const popupConfirmacao = document.getElementById("popupConfirmacao") as HTMLElement | null;

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
  btnAplicar.addEventListener("click", async () => {

    if (validarDatas()) {
      await aplicarFiltros();
      fecharModal();
    } else {
      mostrarPopupConfirmacao("Erro: Data inicial maior que data final!");
    }
  });

  /**
   * Processa a aplicação dos filtros selecionados
   * Atualiza ambos os gráficos (barras e pizza) com os filtros aplicados
   * @returns {void}
   */
  async function aplicarFiltros(): Promise<void> {
    try {
      const regioesArray: string[] = Array.from(filtrosAtuais.regioes) as string[];
      const dataInicio = filtrosAtuais.dataInicio || undefined;
      const dataFim = filtrosAtuais.dataFim || undefined;
      
      console.log("Aplicando filtros com parâmetros:", {
        regioes: regioesArray,
        dataInicio,
        dataFim,
      });

      // Limpar gráficos antigos
      const containerEvolucao = document.getElementById("grafico-evolucao");
      const containerDistribuicao = document.getElementById("grafico-distribuicao");
      const totalCasosEl = document.getElementById("total-casos") as HTMLParagraphElement | null;
      const casosMesEl = document.getElementById("casos-mes") as HTMLParagraphElement | null;
      
      if (containerEvolucao) {
        containerEvolucao.innerHTML = '';
      }
      if (containerDistribuicao) {
        containerDistribuicao.innerHTML = '';
      }

      // ===== GRÁFICO DE BARRAS (EVOLUÇÃO) COM FILTRO =====
      grafico = new GraficoLinha();
      const queryData = await window.api.getTotalCasosNoAnoFiltrado(regioesArray, dataInicio, dataFim);
      console.log("Dados de barras filtrados:", queryData);
      if (queryData && queryData.success && queryData.totalCasos) {
        const data: number[] = queryData.totalCasos.map((item: any) => item.quantidade);
        const mesesLabels: string[] = queryData.totalCasos.map((item: any) => {
          const anoAtual = new Date().getFullYear();
          return `${item.mes} ${anoAtual}`;
        });
        console.log("Renderizando barras com:", { data, mesesLabels });
        grafico.gerarGrafico(data, mesesLabels, "grafico-evolucao");
      }

      // ===== GRÁFICO DE PIZZA (DISTRIBUIÇÃO) COM FILTRO =====
      grafico = new GraficoPizza();
      const enderecos = await window.api.getEnderecosAssistidasFiltrado(dataInicio, dataFim);
      console.log("Dados de endereços filtrados:", enderecos);
      if (enderecos?.enderecos) {
        let dadosFiltrados = enderecos.enderecos;

        // Aplicar filtro de regiões se não estiver "todas" selecionada
        if (!regioesArray.includes('todas')) {
          dadosFiltrados = enderecos.enderecos.filter((item: any) =>
            regioesArray.includes(item.endereco)
          );
        }

        if (dadosFiltrados.length > 0) {
          const data: number[] = dadosFiltrados.map((item: any) => item.quantidade);
          const labels: string[] = dadosFiltrados.map((item: any) => item.endereco);
          console.log("Renderizando pizza com:", { data, labels });
          grafico.gerarGrafico(data, labels, "grafico-distribuicao");
        }
      }

      // ===== ATUALIZAR TOTAIS COM FILTRO =====
      if (totalCasosEl) {
        try {
          const totalCasosData = await window.api.getTotalCasosFiltrado(regioesArray, dataInicio, dataFim);
          console.log("Total de casos filtrado:", totalCasosData);
          if (totalCasosData && totalCasosData.success && totalCasosData.totalCasos !== undefined) {
            const valor = totalCasosData.totalCasos;
            totalCasosEl.textContent = valor.toString();
            console.log("Total atualizado para:", valor);
          }
        } catch (err) {
          console.error("Erro ao atualizar total de casos:", err);
        }
      }

      if (casosMesEl) {
        try {
          let mesDataInicio: string;
          let mesDataFim: string;

          // Se houver data final no filtro, filtra o último mês do intervalo; senão usa o mês atual
          if (dataFim) {
            const dataFimObj = new Date(dataFim);
            const ano = dataFimObj.getFullYear();
            const mes = String(dataFimObj.getMonth() + 1).padStart(2, '0');
            
            // Primeiro dia do mês
            mesDataInicio = `${ano}-${mes}-01`;
            // Último dia do mês
            const ultimoDia = new Date(ano, dataFimObj.getMonth() + 1, 0);
            mesDataFim = `${ano}-${mes}-${String(ultimoDia.getDate()).padStart(2, '0')}`;
          } else {
            const hoje = new Date();
            const ano = hoje.getFullYear();
            const mes = String(hoje.getMonth() + 1).padStart(2, '0');
            
            mesDataInicio = `${ano}-${mes}-01`;
            const ultimoDia = new Date(ano, hoje.getMonth() + 1, 0);
            mesDataFim = `${ano}-${mes}-${String(ultimoDia.getDate()).padStart(2, '0')}`;
          }

          const casosMesData = await window.api.getTotalCasosFiltrado(regioesArray, mesDataInicio, mesDataFim);
          console.log("Casos do mês filtrado:", casosMesData);
          if (casosMesData && casosMesData.success && casosMesData.totalCasos !== undefined) {
            const valor = casosMesData.totalCasos;
            casosMesEl.textContent = valor.toString();
            console.log("Mês atualizado para:", valor);
          }
        } catch (err) {
          console.error("Erro ao atualizar casos do mês:", err);
        }
      }

    // Feedback visual para o usuário
      mostrarPopupConfirmacao("Filtro aplicado com sucesso!");
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
      mostrarPopupConfirmacao("Erro ao aplicar filtro. Tente novamente.");
    }
  }

  // ===== INICIALIZAÇÃO DA INTERFACE =====
  /**
   * Configura placeholders para melhor usabilidade dos campos de data
   */
  dataInicio.setAttribute("placeholder", "Selecione a data inicial");
  dataFim.setAttribute("placeholder", "Selecione a data final");

  // Inicializar com "todas" selecionada
  const chipTodas = document.querySelector('[data-regiao="todas"]') as HTMLElement | null;
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
document.addEventListener("DOMContentLoaded", async () => {
  setupFilterModal();
  const totalCasosEl = document.getElementById("total-casos") as HTMLParagraphElement | null;
  const casosMesEl = document.getElementById("casos-mes") as HTMLParagraphElement| null;

  if (totalCasosEl) {
    try {
      const totalCasosData = await window.api.getTotalCasos();
      if (totalCasosData.success && totalCasosData.totalCasos !== undefined) {
        totalCasosEl.textContent = totalCasosData.totalCasos.toString();
      } else {
        totalCasosEl.textContent = "0";
      }
    }
    catch (error) {
      console.error("Erro ao buscar total de casos:", error);
      totalCasosEl.textContent = "Erro";
    }
  }
  if (casosMesEl) {
    try {
      const hoje = new Date();
      const mesAtual = hoje.getMonth() + 1;
      const anoAtual = hoje.getFullYear();
      const casosMesData = await window.api.getTotalCasosMes(mesAtual, anoAtual);
      if (casosMesData.success && casosMesData.totalCasosMes !== undefined) {
        casosMesEl.textContent = casosMesData.totalCasosMes.toString();
      } else {
        casosMesEl.textContent = "0";
      }
    }
    catch (error) {
      console.error("Erro ao buscar casos do mês:", error);
      casosMesEl.textContent = "Erro";
    }
  }

  try {

    const queryData = await window.api.getTotalCasosNoAno();

    grafico = new GraficoLinha();

    if (queryData.success && queryData.totalCasos) {
      const data: number[] = queryData.totalCasos.map((item: any) => item.quantidade);
      const mesesLabels: string[] = queryData.totalCasos.map((item: any) => item.mes);
      grafico.gerarGrafico(data, mesesLabels, "grafico-evolucao");

    } else {
      console.error("Erro ao buscar dados de casos");
    }

    grafico = new GraficoPizza();

    const enderecos = await window.api.getEnderecosAssistidas();
    if (enderecos?.enderecos && enderecos.enderecos.length > 0) {
      const data: number[] = enderecos.enderecos.map((item: any) => item.quantidade);
      const labels: string[] = enderecos.enderecos.map((item: any) => item.endereco);
      grafico.gerarGrafico(data, labels, "grafico-distribuicao");
    } else {
      console.error("Erro ao buscar dados de endereços");
    }
  } catch (error) {
    console.error("Erro ao carregar gráficos:", error);
  }
});