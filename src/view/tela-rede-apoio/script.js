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

// Container da lista de redes de apoio
const listaRedes = document.getElementById("listaRedes");

// Elemento único para exibição de mensagens de erro
const redeError = document.getElementById("redeError");

// ===== MENU LATERAL (SIDEBAR) =====
const menuAssistidas = document.getElementById("menuAssistidas");
const menuRedeApoio = document.getElementById("menuRedeApoio");
const menuInicial = document.getElementById("menuInicial");

menuAssistidas?.addEventListener("click", (event) => {
  event.preventDefault();
  window.api.openWindow("telaListarAssistidas");
});

menuInicial?.addEventListener("click", (event) => {
  event.preventDefault();
  window.api.openWindow("telaInicial");
});

// Estamos na própria tela de Rede de Apoio; aqui é opcional recarregar
menuRedeApoio?.addEventListener("click", (event) => {
  event.preventDefault();
  // window.api.openWindow("telaRedeApoio");
});

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

// ===== LISTAGEM DE REDES DE APOIO =====
/**
 * Renderiza os cards de redes de apoio no container #listaRedes
 * @param {Array<any>} orgaos
 */
const renderizarRedes = (orgaos) => {
  if (!listaRedes) return;

  listaRedes.innerHTML = "";

  if (!orgaos || orgaos.length === 0) {
    listaRedes.innerHTML = `
      <div class="col-12">
        <p class="text-center text-muted">Nenhuma rede de apoio cadastrada.</p>
      </div>
    `;
    return;
  }

  orgaos.forEach((orgao) => {
    const col = document.createElement("div");
    col.className = "col-md-6";

    col.innerHTML = `
      <div class="text-center card-paciente card-rede-apoio">
        <h3 class="mb-2">${orgao.nome}</h3>
        ${orgao.email ? `<p class="mb-1">${orgao.email}</p>` : ""}
      </div>
    `;

    listaRedes.appendChild(col);
  });
};

/**
 * Busca no backend (mock) a lista de redes cadastradas
 */
const carregarRedes = async () => {
  try {
    if (!window.api || !window.api.listarOrgaosRedeApoio) {
      console.error("API listarOrgaosRedeApoio não disponível");
      return;
    }

    const resultado = await window.api.listarOrgaosRedeApoio();
    console.log("Redes de apoio carregadas:", resultado);

    if (!resultado.success) {
      console.error(resultado.error || "Erro ao listar redes de apoio");
      return;
    }

    renderizarRedes(resultado.orgaos || []);
  } catch (err) {
    console.error("Erro ao carregar redes de apoio:", err);
  }
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
 */
btnCadastrar.addEventListener("click", async () => {
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

  // Chama backend via IPC
  try {
    if (!window.api || !window.api.criarOrgaoRedeApoio) {
      console.error("API do Electron não disponível.");
      mostrarErro("Erro interno: API não disponível.");
      return;
    }

    const resultado = await window.api.criarOrgaoRedeApoio(
      nomeRede,
      emailRede
    );
    console.log("Resultado cadastro rede de apoio:", resultado);

    if (!resultado || !resultado.success) {
      const mensagemErro =
        resultado?.error || "Não foi possível cadastrar a rede de apoio.";
      mostrarErro(mensagemErro);
      return;
    }

    // Sucesso
    fecharModal();
    popupMensagem.textContent = "Rede cadastrada com sucesso!";
    abrirPopup();
    limparFormulario();

    // Recarrega a lista com a nova rede
    await carregarRedes();
  } catch (err) {
    console.error("Erro ao cadastrar Rede de Apoio:", err);
    mostrarErro("Erro interno ao cadastrar a rede de apoio.");
  }
});

// ===== MELHORIA DE USABILIDADE =====
// Limpa mensagens de erro durante a digitação para feedback imediato
document.getElementById("nomeRede").addEventListener("input", limparErro);
document.getElementById("emailRede").addEventListener("input", limparErro);

// Carrega as redes cadastradas ao abrir a tela
carregarRedes();
