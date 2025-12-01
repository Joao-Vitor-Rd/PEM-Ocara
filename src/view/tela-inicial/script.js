// Espera o HTML carregar antes de executar
document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTOS DO MODAL DE SELEÇÃO ---
  const btnOpenSelect = document.querySelector(".btn-existente"); // Botão que abre o modal
  const modalSelectOverlay = document.getElementById("modalSelectOverlay"); // Fundo escuro do modal
  const btnCloseSelect = document.getElementById("closeSelectModal"); // Botão X para fechar
  const btnConfirmar = document.getElementById("btnAdicionarCaso"); // Botão "Adicionar Caso"
  const msgErroSelecao = document.getElementById("msgErroSelecao"); // Mensagem de erro

  // --- ELEMENTOS DO POPUP DE CONFIRMAÇÃO ---
  const popupConfirmacao = document.getElementById("popupConfirmacao"); // Popup de sucesso
  const popupBtnOk = document.getElementById("popupBtnOk"); // Botão OK do popup
  const popupMensagem = document.getElementById("popupMensagem"); // Texto do popup

  // === 1. ABRIR MODAL DE SELEÇÃO ===
  if (btnOpenSelect) {
    btnOpenSelect.addEventListener("click", (e) => {
      e.preventDefault(); // Impede comportamento padrão do botão

      // Reseta todas as opções de seleção (bolinhas)
      const radios = document.querySelectorAll(
        'input[name="assistida-selecionada"]'
      );
      radios.forEach((radio) => {
        radio.checked = false;
        // Adiciona evento para esconder erro quando clicar em qualquer opção
        radio.addEventListener("change", () => {
          msgErroSelecao.style.display = "none";
        });
      });

      // Esconde mensagem de erro anterior
      if (msgErroSelecao) msgErroSelecao.style.display = "none";

      // Mostra o modal
      modalSelectOverlay.style.display = "flex";
    });
  }

  // === 2. FECHAR MODAL DE SELEÇÃO ===
  // Fecha ao clicar no X
  if (btnCloseSelect) {
    btnCloseSelect.addEventListener("click", () => {
      modalSelectOverlay.style.display = "none";
    });
  }

  // Fecha ao clicar fora do modal (no overlay)
  window.addEventListener("click", (e) => {
    if (e.target === modalSelectOverlay) {
      modalSelectOverlay.style.display = "none";
    }
  });

  // === 3. FUNÇÕES DO POPUP DE CONFIRMAÇÃO ===
  function showPopup(mensagem) {
    if (popupMensagem) popupMensagem.innerText = mensagem; // Define texto
    popupConfirmacao.classList.add("visible"); // Mostra popup
  }

  function hidePopup() {
    popupConfirmacao.classList.remove("visible"); // Esconde popup
  }

  // Fecha popup ao clicar no OK
  if (popupBtnOk) {
    popupBtnOk.addEventListener("click", hidePopup);
  }

  // Fecha popup ao clicar fora dele
  window.addEventListener("click", (e) => {
    if (e.target === popupConfirmacao) {
      hidePopup();
    }
  });

  // === 4. LÓGICA DO BOTÃO "ADICIONAR CASO" ===
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", () => {
      // Verifica se alguma opção foi selecionada
      const selecionado = document.querySelector(
        'input[name="assistida-selecionada"]:checked'
      );

      if (selecionado) {
        // SE HOUVER SELEÇÃO: Fecha modal e mostra popup de sucesso
        modalSelectOverlay.style.display = "none";
        showPopup("Caso cadastrado com sucesso!");
      } else {
        // SE NÃO HOUVER SELEÇÃO: Mostra mensagem de erro
        if (msgErroSelecao) {
          msgErroSelecao.style.display = "block";
        }
      }
    });
  }
});
