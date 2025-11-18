/**
 * Gerenciamento de Modal para Cadastro de Rede de Apoio
 *
 * Este script controla a abertura, fechamento, validação e submissão
 * do formulário de cadastro de rede de apoio, incluindo feedback visual
 * para o usuário através de modais e mensagens de erro.
 */

// ===== SELEÇÃO DE ELEMENTOS DO DOM =====
// Elementos principais da interface
const btnAbrir = document.getElementById("btnAbrirModalRede");
const btnFechar = document.getElementById("fecharModalRede");
const modal = document.getElementById("modalRedeApoio");
const popupConfirmacao = document.getElementById("popupConfirmacao");
const popupBtnOk = document.getElementById("popupBtnOk");
const popupMensagem = document.getElementById("popupMensagem");
const btnCadastrar = document.querySelector(".btn-atualizar");

// Elemento único para exibição de mensagens de erro
const redeError = document.getElementById("redeError");

// ===== CLASSES DE VALIDAÇÃO =====
/**
 * Validador para campos de nome
 * Implementa regras de negócio específicas para nomes
 */
class NameValidator {
  validate(novoNome) {
    const nomeTrimado = novoNome.trim();

    // Validação de campo obrigatório
    if (nomeTrimado === "") {
      return "Por favor, preencha o campo de nome.";
    }

    // Validação de comprimento mínimo
    if (nomeTrimado.length < 3) {
      return "O nome deve ter pelo menos 3 caracteres.";
    }

    // Validação contra apenas números
    if (/^\d+$/.test(nomeTrimado)) {
      return "O nome não pode conter apenas números.";
    }

    // Validação de presença de letras
    if (!/[a-zA-Z]/.test(nomeTrimado)) {
      return "O nome deve conter pelo menos uma letra.";
    }

    return null; // Retorna null quando a validação é bem-sucedida
  }
}

/**
 * Validador para campos de email
 * Verifica formato válido de endereço de email
 */
class EmailValidator {
  validate(novoEmail) {
    const email = novoEmail.trim();

    // Validação de campo obrigatório
    if (email === "") {
      return "Por favor, preencha o campo de e-mail.";
    }

    // Validação de formato usando regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Por favor, insira um formato de e-mail válido.";
    }

    return null; // Retorna null quando a validação é bem-sucedida
  }
}

// Instâncias dos validadores para reutilização
const nameValidator = new NameValidator();
const emailValidator = new EmailValidator();

// ===== GERENCIAMENTO DE ESTADO DO FORMULÁRIO =====
/**
 * Limpa todos os campos do formulário e remove mensagens de erro
 * @returns {void}
 */
const limparFormulario = () => {
  document.getElementById("nomeRede").value = "";
  document.getElementById("emailRede").value = "";
  limparErro();
};

// ===== CONTROLE DE MODAL =====
/**
 * Abre o modal de cadastro e prepara o ambiente para novo preenchimento
 * @returns {void}
 */
const abrirModal = () => {
  modal.classList.add("visible");
  limparErro(); // Garante que erros anteriores sejam limpos
};

/**
 * Fecha o modal de cadastro e limpa o formulário
 * @returns {void}
 */
const fecharModal = () => {
  modal.classList.remove("visible");
  limparFormulario(); // Reseta o estado do formulário ao fechar
};

// ===== CONTROLE DE POPUP DE CONFIRMAÇÃO =====
/**
 * Exibe popup de confirmação de sucesso
 * @returns {void}
 */
const abrirPopup = () => {
  popupConfirmacao.classList.add("visible");
};

/**
 * Fecha o popup de confirmação
 * @returns {void}
 */
const fecharPopup = () => {
  popupConfirmacao.classList.remove("visible");
};

// ===== GERENCIAMENTO DE MENSAGENS DE ERRO =====
/**
 * Exibe mensagem de erro para o usuário
 * @param {string} mensagem - Texto da mensagem de erro a ser exibida
 * @returns {void}
 */
const mostrarErro = (mensagem) => {
  redeError.textContent = mensagem;
  redeError.style.display = "block";
};

/**
 * Limpa mensagens de erro da interface
 * @returns {void}
 */
const limparErro = () => {
  redeError.textContent = "";
  redeError.style.display = "none";
};

// ===== CONFIGURAÇÃO DE EVENT LISTENERS =====
// Controle de abertura e fechamento de modais
btnAbrir.addEventListener("click", abrirModal);
btnFechar.addEventListener("click", fecharModal);
popupBtnOk.addEventListener("click", fecharPopup);

// Fechar modais ao clicar fora do conteúdo
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    fecharModal();
  }
});

popupConfirmacao.addEventListener("click", (e) => {
  if (e.target === popupConfirmacao) {
    fecharPopup();
  }
});

// ===== LÓGICA PRINCIPAL DE CADASTRO =====
/**
 * Handler principal para o processo de cadastro
 * Executa validações em sequência e procede com cadastro se válido
 * @returns {void}
 */
btnCadastrar.addEventListener("click", () => {
  // Captura dos valores atuais dos campos
  const nomeRede = document.getElementById("nomeRede").value;
  const emailRede = document.getElementById("emailRede").value;

  // Limpa estado anterior de erro
  limparErro();

  // Pipeline de validações - nome tem prioridade
  const erroNome = nameValidator.validate(nomeRede);
  if (erroNome) {
    mostrarErro(erroNome);
    return; // Interrompe execução se nome for inválido
  }

  // Validação de email só executa se nome for válido
  const erroEmail = emailValidator.validate(emailRede);
  if (erroEmail) {
    mostrarErro(erroEmail);
    return; // Interrompe execução se email for inválido
  }

  // Fluxo de sucesso - todas as validações passaram
  fecharModal();
  popupMensagem.textContent = "Rede cadastrada com sucesso!";
  abrirPopup();
  limparFormulario(); // Limpeza adicional por segurança
});

// ===== MELHORIA DE USABILIDADE =====
// Limpa mensagens de erro durante a digitação para feedback imediato
document.getElementById("nomeRede").addEventListener("input", limparErro);
document.getElementById("emailRede").addEventListener("input", limparErro);
