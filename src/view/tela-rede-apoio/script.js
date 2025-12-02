/**
 * Gerenciamento de Modais (Cadastro e Edição) de Rede de Apoio
 *
 * Este script controla a abertura, fechamento, validação e submissão
 * dos formulários, incluindo feedback visual e validação reutilizável.
 */

// ===== SELEÇÃO DE ELEMENTOS DO DOM (CADASTRO) =====
const btnAbrir = document.getElementById("btnAbrirModalRede");
const btnFechar = document.getElementById("fecharModalRede");
const modal = document.getElementById("modalRedeApoio");
const btnCadastrar = document.querySelector(".btn-atualizar");
const redeError = document.getElementById("redeError"); // Erro do modal de cadastro

// ===== SELEÇÃO DE ELEMENTOS DO DOM (EDIÇÃO - NOVO) =====
const modalEditar = document.getElementById("modalEditarRede");
const btnFecharEditar = document.getElementById("fecharModalEditar");
const cardsRede = document.querySelectorAll(".card-rede-apoio"); // Todos os cards
const btnSalvarEdit = document.querySelector(".btn-salvar");
const btnApagarEdit = document.querySelector(".btn-apagar");
const inputNovoNome = document.getElementById("novoNome");
const inputNovoEmail = document.getElementById("novoEmail");
// OBS: Adicione <p id="redeErrorEdit" class="error-message"></p> no HTML do novo modal
const redeErrorEdit = document.getElementById("redeErrorEdit");

// ===== SELEÇÃO DE ELEMENTOS DO DOM (POPUP GLOBAL) =====
const popupConfirmacao = document.getElementById("popupConfirmacao");
const popupBtnOk = document.getElementById("popupBtnOk");
const popupMensagem = document.getElementById("popupMensagem");

// ===== CLASSES DE VALIDAÇÃO (MANTIDAS) =====
/**
 * Validador para campos de nome
 */
class NameValidator {
  validate(novoNome) {
    const nomeTrimado = novoNome.trim();
    if (nomeTrimado === "") return "Por favor, preencha o campo de nome.";
    if (nomeTrimado.length < 3)
      return "O nome deve ter pelo menos 3 caracteres.";
    if (/^\d+$/.test(nomeTrimado))
      return "O nome não pode conter apenas números.";
    if (!/[a-zA-Z]/.test(nomeTrimado))
      return "O nome deve conter pelo menos uma letra.";
    return null;
  }
}

/**
 * Validador para campos de email
 */
class EmailValidator {
  validate(novoEmail) {
    const email = novoEmail.trim();
    if (email === "") return "Por favor, preencha o campo de e-mail.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return "Por favor, insira um formato de e-mail válido.";
    return null;
  }
}

// Instâncias dos validadores
const nameValidator = new NameValidator();
const emailValidator = new EmailValidator();

// ===== GERENCIAMENTO DE ESTADO =====

// Limpa campos do cadastro
const limparFormularioCadastro = () => {
  document.getElementById("nomeRede").value = "";
  document.getElementById("emailRede").value = "";
  limparErro(redeError);
};

// Limpa campos da edição
const limparFormularioEdicao = () => {
  if (inputNovoNome) inputNovoNome.value = "";
  if (inputNovoEmail) inputNovoEmail.value = "";
  limparErro(redeErrorEdit);
};

// Funções Genéricas de Erro
const mostrarErro = (elemento, mensagem) => {
  if (elemento) {
    elemento.textContent = mensagem;
    elemento.style.display = "block";
  } else {
    // Fallback caso esqueça de adicionar a tag <p> no HTML novo
    alert(mensagem);
  }
};

const limparErro = (elemento) => {
  if (elemento) {
    elemento.textContent = "";
    elemento.style.display = "none";
  }
};

// ===== CONTROLE DE MODAIS (ABRIR/FECHAR) =====

// --- Modal Cadastro ---
const abrirModal = () => {
  modal.classList.add("visible");
  limparErro(redeError);
};

const fecharModal = () => {
  modal.classList.remove("visible");
  limparFormularioCadastro();
};

// --- Modal Edição (NOVO) ---
const abrirModalEdicao = () => {
  modalEditar.classList.add("visible");
  limparErro(redeErrorEdit);
  // Aqui você poderia carregar os dados do card clicado para os inputs "Atuais"
};

const fecharModalEdicao = () => {
  modalEditar.classList.remove("visible");
  limparFormularioEdicao();
};

// --- Popup Confirmação ---
const abrirPopup = (mensagem) => {
  popupMensagem.textContent = mensagem; // Mensagem dinâmica
  popupConfirmacao.classList.add("visible");
};

const fecharPopup = () => {
  popupConfirmacao.classList.remove("visible");
};

// ===== EVENT LISTENERS =====

// Botoes do Modal Cadastro
if (btnAbrir) btnAbrir.addEventListener("click", abrirModal);
if (btnFechar) btnFechar.addEventListener("click", fecharModal);

// Botoes do Modal Edição (NOVO)
// Adiciona evento de click em CADA card existente
cardsRede.forEach((card) => {
  card.addEventListener("click", () => {
    abrirModalEdicao();
  });
});

if (btnFecharEditar)
  btnFecharEditar.addEventListener("click", fecharModalEdicao);

// Botão OK do Popup
if (popupBtnOk) popupBtnOk.addEventListener("click", fecharPopup);

// Fechar ao clicar fora (Overlay)
window.addEventListener("click", (e) => {
  if (e.target === modal) fecharModal();
  if (e.target === modalEditar) fecharModalEdicao();
  if (e.target === popupConfirmacao) fecharPopup();
});

// Inputs: Limpar erro ao digitar
if (inputNovoNome)
  inputNovoNome.addEventListener("input", () => limparErro(redeErrorEdit));
if (inputNovoEmail)
  inputNovoEmail.addEventListener("input", () => limparErro(redeErrorEdit));
document
  .getElementById("nomeRede")
  .addEventListener("input", () => limparErro(redeError));
document
  .getElementById("emailRede")
  .addEventListener("input", () => limparErro(redeError));

// ===== LÓGICA DE NEGÓCIO =====

// 1. CADASTRAR NOVA REDE
if (btnCadastrar) {
  btnCadastrar.addEventListener("click", () => {
    const nomeRede = document.getElementById("nomeRede").value;
    const emailRede = document.getElementById("emailRede").value;

    limparErro(redeError);

    const erroNome = nameValidator.validate(nomeRede);
    if (erroNome) {
      mostrarErro(redeError, erroNome);
      return;
    }

    const erroEmail = emailValidator.validate(emailRede);
    if (erroEmail) {
      mostrarErro(redeError, erroEmail);
      return;
    }

    fecharModal();
    abrirPopup("Rede cadastrada com sucesso!");
  });
}

// 2. SALVAR EDIÇÃO (NOVO)
if (btnSalvarEdit) {
  btnSalvarEdit.addEventListener("click", () => {
    const novoNome = inputNovoNome.value;
    const novoEmail = inputNovoEmail.value;

    limparErro(redeErrorEdit);

    // Valida Nome
    const erroNome = nameValidator.validate(novoNome);
    if (erroNome) {
      mostrarErro(redeErrorEdit, erroNome);
      return;
    }

    // Valida Email
    const erroEmail = emailValidator.validate(novoEmail);
    if (erroEmail) {
      mostrarErro(redeErrorEdit, erroEmail);
      return;
    }

    // Sucesso
    fecharModalEdicao();
    abrirPopup("Alterações salvas com sucesso!");
  });
}

// 3. APAGAR REDE (NOVO)
if (btnApagarEdit) {
  btnApagarEdit.addEventListener("click", () => {
    // Aqui entraria lógica de confirmação "Tem certeza?"
    // Mas para o protótipo, apaga direto:

    fecharModalEdicao();
    abrirPopup("Rede de Apoio removida!");
  });
}
