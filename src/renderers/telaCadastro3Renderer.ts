/// <reference path="../types/windown.d.ts" />

export {};

// --- DEFINIÇÕES GLOBAIS DE BOTÕES ---
const pxmBtn = document.getElementById("proximo") as HTMLButtonElement;
const voltarBtn = document.getElementById("voltar") as HTMLButtonElement;

window.addEventListener("DOMContentLoaded", () => {
  // --- Lógica de PRE-PREENCHIMENTO existente ---
  const dadosSalvos = sessionStorage.getItem("dadosCaso");
  if (dadosSalvos) {
    const dados = JSON.parse(dadosSalvos);
    (
      document.getElementById("outras-informacoes") as HTMLTextAreaElement
    ).value = dados.anotacoesLivres || "";
  }

  // --- LÓGICA DO MODO DE VISUALIZAÇÃO (TELA FINAL) ---
  const isModoVisualizacao =
    sessionStorage.getItem("modoVisualizacao") === "true";

  if (isModoVisualizacao) {
    console.log("[telaCadastro3] Modo de Visualização Ativado (Tela Final)");

    // 1. Bloqueia os campos (apenas a textarea neste caso)
    const todosCampos = document.querySelectorAll("input, select, textarea");
    todosCampos.forEach((campo) => {
      campo.setAttribute("disabled", "true");
      campo.classList.add("campo-bloqueado-visualizacao");
    });

    // 2. Esconde o botão "Próximo" (de salvamento/avanço)
    if (pxmBtn) {
      pxmBtn.style.display = "none";
    }

    // 3. Altera o botão Voltar para ser o "Fechar Visualização"
    if (voltarBtn) {
      voltarBtn.innerText = "Fechar Visualização"; // <--- AÇÃO FINAL

      // Clonamos e substituímos para remover o listener global de voltar
      const novoVoltarBtn = voltarBtn.cloneNode(true) as HTMLButtonElement;
      if (voltarBtn.parentNode) {
        voltarBtn.parentNode.replaceChild(novoVoltarBtn, voltarBtn);
      }

      // NOVO COMPORTAMENTO: FECHAR E RETORNAR
      novoVoltarBtn.addEventListener("click", async () => {
        // ** LIMPEZA DE FLAGS: DESLIGA O MODO VISUALIZAÇÃO **
        sessionStorage.removeItem("modoVisualizacao");

        // Retorna para a lista de casos registrados (que deve abrir a tela de informações do caso)
        await window.api.openWindow("telaCasosRegistrados");
      });
    }

    // 4. Adiciona um aviso visual no topo
    const header = document.querySelector("header") || document.body;
    const aviso = document.createElement("div");
    aviso.style.cssText =
      "background: #e9ecef; color: #495057; padding: 10px; text-align: center; font-weight: bold; border-bottom: 1px solid #ced4da;";
    aviso.innerText =
      "MODO DE LEITURA: Você está apenas visualizando os dados.";
    header.prepend(aviso);
  }
});

// --- EVENT LISTENERS DE NAVEGAÇÃO/SALVAMENTO (COMPORTAMENTO NORMAL) ---

voltarBtn.addEventListener("click", async (event) => {
  // Este listener só é executado se o modo visualização estiver DESLIGADO.
  try {
    const dadosCasoJSON = sessionStorage.getItem("dadosCaso");

    if (!dadosCasoJSON) {
      throw new Error("Erro ao recuperar dados anteriores");
    }

    const dadosCaso = JSON.parse(dadosCasoJSON);

    const anotacoesInput = document.getElementById(
      "outras-informacoes"
    ) as HTMLTextAreaElement;
    const anotacoesLivres = anotacoesInput?.value.trim() || "";

    dadosCaso.anotacoesLivres = anotacoesLivres;

    sessionStorage.setItem("dadosCaso", JSON.stringify(dadosCaso));

    window.api.openWindow("telaCadastro2");
  } catch (error) {
    console.error("Erro ao processar tela 3:", error);
  }
});

pxmBtn.addEventListener("click", async (event) => {
  // Este listener só é executado se o modo visualização estiver DESLIGADO.
  try {
    const dadosCasoJSON = sessionStorage.getItem("dadosCaso");

    if (!dadosCasoJSON) {
      throw new Error("Erro ao recuperar dados anteriores");
    }

    const dadosCaso = JSON.parse(dadosCasoJSON);

    const anotacoesInput = document.getElementById(
      "outras-informacoes"
    ) as HTMLTextAreaElement;
    const anotacoesLivres = anotacoesInput?.value.trim() || "";

    dadosCaso.anotacoesLivres = anotacoesLivres;

    sessionStorage.setItem("dadosCaso", JSON.stringify(dadosCaso));

    // Se telaCadastro4 existe, mantém. Se for o final do fluxo, mude para a tela final desejada.
    window.api.openWindow("telaCadastro4");
  } catch (error) {
    console.error("Erro ao processar tela 3:", error);
  }
});
