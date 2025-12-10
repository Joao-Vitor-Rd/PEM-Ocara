/**
 * Gerenciamento de Modal para Cadastro e Edição de Rede de Apoio
 * Integração: Backend (Local) + Visual (Develop)
 */

// ===== 1. SELEÇÃO DE ELEMENTOS DO DOM =====

// --- Modal Cadastro ---
const btnAbrir = document.getElementById("btnAbrirModalRede");
const btnFechar = document.getElementById("fecharModalRede");
const modal = document.getElementById("modalRedeApoio");
const btnCadastrar = document.querySelector(".btn-atualizar"); // Botão cadastrar
const redeError = document.getElementById("redeError");

// --- Modal Edição (NOVO) ---
const modalEditar = document.getElementById("modalEditarRede");
const btnFecharEditar = document.getElementById("fecharModalEditar");
const btnSalvarEdit = document.getElementById("btnSalvarEdicao");
const btnApagarEdit = document.getElementById("btnApagarRede");
const redeErrorEdit = document.getElementById("redeErrorEdit");

// Inputs do Modal Edição
const inputIdEditar = document.getElementById("idRedeEditar"); // Hidden
const inputNomeAtual = document.getElementById("nomeAtualDisplay");
const inputEmailAtual = document.getElementById("emailAtualDisplay");
const inputNovoNome = document.getElementById("novoNome");
const inputNovoEmail = document.getElementById("novoEmail");

// --- Global / Outros ---
const popupConfirmacao = document.getElementById("popupConfirmacao");
const popupBtnOk = document.getElementById("popupBtnOk");
const popupMensagem = document.getElementById("popupMensagem");
const listaRedes = document.getElementById("listaRedes");

// ===== 2. NAVEGAÇÃO SIDEBAR =====
const menuAssistidas = document.getElementById("menuAssistidas");
const menuInicial = document.getElementById("menuInicial");

menuAssistidas?.addEventListener("click", () => window.api.openWindow("telaListarAssistidas"));
menuInicial?.addEventListener("click", () => window.api.openWindow("telaInicial"));


// ===== 3. CLASSES DE VALIDAÇÃO =====
class NameValidator {
  validate(novoNome) {
    const nomeTrimado = novoNome.trim();
    if (nomeTrimado === "") return "Por favor, preencha o campo de nome.";
    if (nomeTrimado.length < 3) return "O nome deve ter pelo menos 3 caracteres.";
    if (/^\d+$/.test(nomeTrimado)) return "O nome não pode conter apenas números.";
    if (!/[a-zA-Z]/.test(nomeTrimado)) return "O nome deve conter pelo menos uma letra.";
    return null;
  }
}

class EmailValidator {
  validate(novoEmail) {
    const email = novoEmail.trim();
    if (email === "") return "Por favor, preencha o campo de e-mail.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Por favor, insira um formato de e-mail válido.";
    return null;
  }
}

const nameValidator = new NameValidator();
const emailValidator = new EmailValidator();


// ===== 4. FUNÇÕES AUXILIARES E ESTADO =====

const limparFormularioCadastro = () => {
  document.getElementById("nomeRede").value = "";
  document.getElementById("emailRede").value = "";
  limparErro(redeError);
};

const limparFormularioEdicao = () => {
  if (inputIdEditar) inputIdEditar.value = "";
  if (inputNomeAtual) inputNomeAtual.value = "";
  if (inputEmailAtual) inputEmailAtual.value = "";
  if (inputNovoNome) inputNovoNome.value = "";
  if (inputNovoEmail) inputNovoEmail.value = "";
  limparErro(redeErrorEdit);
};

const mostrarErro = (elemento, mensagem) => {
  if (elemento) {
    elemento.textContent = mensagem;
    elemento.style.display = "block";
  }
};

const limparErro = (elemento) => {
  if (elemento) {
    elemento.textContent = "";
    elemento.style.display = "none";
  }
};

// --- Controle de Modais ---

// Abrir Cadastro
const abrirModal = () => {
  modal.classList.add("visible");
  limparErro(redeError);
};

// Fechar Cadastro
const fecharModal = () => {
  modal.classList.remove("visible");
  limparFormularioCadastro();
};

// Abrir Edição (Preenchendo dados)
// Essa função recebe o objeto 'orgao' vindo do banco
const abrirModalEdicao = (orgao) => {
  modalEditar.classList.add("visible");
  limparErro(redeErrorEdit);

  // Preenche os campos visuais
  inputNomeAtual.value = orgao.nome;
  inputEmailAtual.value = orgao.email || "Sem e-mail cadastrado";
  
  // Guarda o ID no input hidden para usar ao salvar/apagar
  inputIdEditar.value = orgao.id ?? "";
};

// Fechar Edição
const fecharModalEdicao = () => {
  modalEditar.classList.remove("visible");
  limparFormularioEdicao();
};

// Popup Global
const abrirPopup = (msg) => {
  if (msg) popupMensagem.textContent = msg;
  popupConfirmacao.classList.add("visible");
};

const fecharPopup = () => {
  popupConfirmacao.classList.remove("visible");
};


// ===== 5. RENDERIZAÇÃO (INTEGRAÇÃO COM BACKEND) =====

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
    // Cria a coluna e o card
    const col = document.createElement("div");
    col.className = "col-md-6";

    // HTML do Card
    col.innerHTML = `
      <div class="text-center card-paciente card-rede-apoio">
        <h3 class="mb-2">${orgao.nome}</h3>
        ${orgao.email ? `<p class="mb-1">${orgao.email}</p>` : ""}
      </div>
    `;

    // --- AQUI ESTÁ A MÁGICA ---
    // Adiciona o evento de click NESTE card específico
    const cardElement = col.querySelector(".card-rede-apoio");
    cardElement.addEventListener("click", () => {
      console.log("Card clicado, abrindo edição para:", orgao);
      abrirModalEdicao(orgao);
    });

    listaRedes.appendChild(col);
  });
};

const carregarRedes = async () => {
  try {
    if (!window.api || !window.api.listarOrgaosRedeApoio) {
      console.warn("API não disponível (Modo Dev/Mock)");
      return;
    }

    const resultado = await window.api.listarOrgaosRedeApoio();
    console.log("Redes carregadas:", resultado);

    if (resultado.success) {
      renderizarRedes(resultado.orgaos || []);
    } else {
      console.error(resultado.error);
    }
  } catch (err) {
    console.error("Erro ao carregar redes:", err);
  }
};


// ===== 6. EVENT LISTENERS GERAIS =====

// Botões Cadastro
if (btnAbrir) btnAbrir.addEventListener("click", abrirModal);
if (btnFechar) btnFechar.addEventListener("click", fecharModal);

// Botões Edição
if (btnFecharEditar) btnFecharEditar.addEventListener("click", fecharModalEdicao);

// Popup
if (popupBtnOk) popupBtnOk.addEventListener("click", fecharPopup);

// Fechar ao clicar fora (Overlay)
window.addEventListener("click", (e) => {
  if (e.target === modal) fecharModal();
  if (e.target === modalEditar) fecharModalEdicao();
  if (e.target === popupConfirmacao) fecharPopup();
});

// Limpar erros ao digitar
document.getElementById("nomeRede").addEventListener("input", () => limparErro(redeError));
document.getElementById("emailRede").addEventListener("input", () => limparErro(redeError));

if (inputNovoNome) inputNovoNome.addEventListener("input", () => limparErro(redeErrorEdit));
if (inputNovoEmail) inputNovoEmail.addEventListener("input", () => limparErro(redeErrorEdit));


// ===== 7. AÇÕES DE SUBMISSÃO (CADASTRAR, EDITAR, APAGAR) =====

// --- CADASTRAR ---
if (btnCadastrar) {
  btnCadastrar.addEventListener("click", async () => {
    const nomeRede = document.getElementById("nomeRede").value;
    const emailRede = document.getElementById("emailRede").value;

    limparErro(redeError);

    // Validação
    const erroNome = nameValidator.validate(nomeRede);
    if (erroNome) return mostrarErro(redeError, erroNome);

    const erroEmail = emailValidator.validate(emailRede);
    if (erroEmail) return mostrarErro(redeError, erroEmail);

    // Chamada ao Backend
    try {
      if (!window.api || !window.api.criarOrgaoRedeApoio) {
        alert("API não encontrada.");
        return;
      }

      const resultado = await window.api.criarOrgaoRedeApoio(nomeRede, emailRede);

      if (resultado.success) {
        fecharModal();
        abrirPopup("Rede cadastrada com sucesso!");
        carregarRedes(); // Atualiza a lista
      } else {
        mostrarErro(redeError, resultado.error || "Erro ao cadastrar.");
      }
    } catch (err) {
      console.error(err);
      mostrarErro(redeError, "Erro interno ao cadastrar.");
    }
  });
}

// --- SALVAR EDIÇÃO ---
if (btnSalvarEdit) {
  btnSalvarEdit.addEventListener("click", async () => {
    const id = Number(inputIdEditar.value);
    const novoNome = inputNovoNome.value.trim();
    const novoEmail = inputNovoEmail.value.trim();

    limparErro(redeErrorEdit);

    if (!id) {
      mostrarErro(redeErrorEdit, "Registro inválido. Abra o card novamente.");
      return;
    }

    if (!novoNome && !novoEmail) {
      mostrarErro(redeErrorEdit, "Preencha ao menos um campo para alterar.");
      return;
    }
    
    if (novoNome) {
        const erroNome = nameValidator.validate(novoNome);
        if (erroNome) return mostrarErro(redeErrorEdit, erroNome);
    }
    
    if (novoEmail) {
        const erroEmail = emailValidator.validate(novoEmail);
        if (erroEmail) return mostrarErro(redeErrorEdit, erroEmail);
    }

    if (!window.api || !window.api.atualizarOrgaoRedeApoio) {
      mostrarErro(redeErrorEdit, "API não encontrada.");
      return;
    }

    try {
      const resultado = await window.api.atualizarOrgaoRedeApoio(
        id,
        novoNome || undefined,
        novoEmail || undefined
      );

      if (!resultado.success) {
        mostrarErro(redeErrorEdit, resultado.error || "Erro ao atualizar registro.");
        return;
      }

      fecharModalEdicao();
      abrirPopup("Rede atualizada com sucesso!");
      await carregarRedes();
    } catch (error) {
      console.error("Erro ao atualizar rede:", error);
      mostrarErro(redeErrorEdit, "Erro interno ao atualizar.");
    }
  });
}

// --- APAGAR REDE ---
if (btnApagarEdit) {
  btnApagarEdit.addEventListener("click", async () => {
    const id = Number(inputIdEditar.value);
    limparErro(redeErrorEdit);

    if (!id) {
      mostrarErro(redeErrorEdit, "Registro inválido. Abra o card novamente.");
      return;
    }

    if (!window.api || !window.api.deletarOrgaoRedeApoio) {
      mostrarErro(redeErrorEdit, "API não encontrada.");
      return;
    }

    try {
      const resultado = await window.api.deletarOrgaoRedeApoio(id);

      if (!resultado.success) {
        mostrarErro(redeErrorEdit, resultado.error || "Erro ao remover registro.");
        return;
      }

      fecharModalEdicao();
      abrirPopup("Rede removida com sucesso!");
      await carregarRedes();
    } catch (error) {
      console.error("Erro ao remover rede:", error);
      mostrarErro(redeErrorEdit, "Erro interno ao remover.");
    }
  });
}

// Inicializa a tela carregando os dados
carregarRedes();