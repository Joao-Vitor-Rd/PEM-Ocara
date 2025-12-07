document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTOS DO MODAL DE SELEÇÃO ---
  const btnOpenSelect = document.querySelector(".btn-existente"); // Botão que abre o modal
  const modalSelectOverlay = document.getElementById("modalSelectOverlay"); // Fundo escuro do modal
  const btnCloseSelect = document.getElementById("closeSelectModal"); // Botão X para fechar
  const btnConfirmar = document.getElementById("btnAdicionarCaso"); // Botão "Adicionar Caso"
  const msgErroSelecao = document.getElementById("msgErroSelecao"); // Mensagem de erro

  // === FUNÇÃO PARA ESCONDER ERRO ===
  const esconderErro = () => {
    if (msgErroSelecao) {
      msgErroSelecao.classList.remove("show");
      msgErroSelecao.textContent = "";
    }
  };

  // === FUNÇÃO PARA MOSTRAR ERRO ===
  const mostrarErro = (mensagem) => {
    if (msgErroSelecao) {
      msgErroSelecao.textContent = mensagem;
      msgErroSelecao.classList.add("show");
    }
  };

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
        radio.addEventListener("change", esconderErro);
      });

      // Esconde mensagem de erro anterior
      esconderErro();

      // Mostra o modal
      if (modalSelectOverlay) {
        modalSelectOverlay.style.display = "flex";
      }
    });
  }

  // === 2. FECHAR MODAL DE SELEÇÃO ===
  // Fecha ao clicar no X
  if (btnCloseSelect) {
    btnCloseSelect.addEventListener("click", () => {
      if (modalSelectOverlay) {
        modalSelectOverlay.style.display = "none";
      }
      esconderErro();
    });
  }

  // Fecha ao clicar fora do modal (no overlay)
  window.addEventListener("click", (e) => {
    if (e.target === modalSelectOverlay) {
      modalSelectOverlay.style.display = "none";
      esconderErro();
    }
  });

  // === 3. LÓGICA DO BOTÃO "ADICIONAR CASO" ===
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", () => {
      // Verifica se alguma opção foi selecionada
      const selecionado = document.querySelector(
        'input[name="assistida-selecionada"]:checked'
      );

      if (selecionado) {
        // SE HOUVER SELEÇÃO: Fecha modal e mostra popup de sucesso
        if (modalSelectOverlay) {
          modalSelectOverlay.style.display = "none";
        }
        esconderErro();
        showPopup("Caso cadastrado com sucesso!");
      } else {
        // SE NÃO HOUVER SELEÇÃO: Mostra mensagem de erro
        mostrarErro("Por favor, selecione uma assistida antes de continuar.");
      }
    });
  }
});
