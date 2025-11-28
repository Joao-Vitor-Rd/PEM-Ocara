document.addEventListener("DOMContentLoaded", () => {
  // Mapeamento dos elementos do formulário
  const form = document.getElementById("form-cadastro");
  const campos = {
    nome: document.getElementById("nome"),
    email: document.getElementById("email"),
    cargo: document.getElementById("cargo"),
    senha: document.getElementById("senha"),
    confirmarSenha: document.getElementById("confirmar-senha"),
  };

  // --- 1. Controle de Visibilidade da Senha ---
  const iconesSenha = document.querySelectorAll(
    ".input-com-icone .select-icone"
  );

  iconesSenha.forEach((icone) => {
    icone.addEventListener("click", (e) => {
      e.preventDefault();
      const input = icone.previousElementSibling;

      // Alterna entre type="text" e "password"
      if (input.type === "password") {
        input.type = "text";
        icone.innerText = "visibility";
      } else {
        input.type = "password";
        icone.innerText = "visibility_off";
      }
    });
  });

  // --- 2. Interceptação do Submit (Ponto de Integração) ---
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Impede o reload padrão

    if (validarTudo()) {
      // BACKEND: Aqui você deve inserir a chamada para a API (fetch/axios)
      // Se a resposta da API for 200/201, chame mostrarPopup()
      mostrarPopup();
    }
  });

  // --- Regras de Validação (Front-end) ---
  function validarTudo() {
    let formValido = true;

    // Nome: Mínimo 3 chars
    const nomeValor = campos.nome.value.trim();
    if (nomeValor.length < 3) {
      setErro(campos.nome, "O nome deve ter no mínimo 3 caracteres.");
      formValido = false;
    } else {
      setSucesso(campos.nome);
    }

    // Email: Regex padrão
    const emailValor = campos.email.value.trim();
    if (!isEmailValido(emailValor)) {
      setErro(campos.email, "Insira um e-mail válido.");
      formValido = false;
    } else {
      setSucesso(campos.email);
    }

    // Cargo: Obrigatório seleção
    const cargoValor = campos.cargo.value;
    if (!cargoValor) {
      setErro(campos.cargo, "Selecione um cargo.");
      formValido = false;
    } else {
      setSucesso(campos.cargo);
    }

    // --- NOVA VALIDAÇÃO DE SENHA (Implementada) ---
    const senhaValor = campos.senha.value.trim();
    let erroSenha = null;

    // Verifica regras sequencialmente
    if (senhaValor.length < 8) {
      erroSenha = "A senha deve ter pelo menos 8 caracteres.";
    } else if (!/[A-Z]/.test(senhaValor)) {
      erroSenha = "A senha deve conter pelo menos uma letra maiúscula.";
    } else if (!/[a-z]/.test(senhaValor)) {
      erroSenha = "A senha deve conter pelo menos uma letra minúscula.";
    } else if (!/[^A-Za-z0-9]/.test(senhaValor)) {
      // Regex busca qualquer coisa que NÃO seja letra ou número
      erroSenha =
        "A senha deve conter pelo menos um caractere especial (ex: !@#$%).";
    }

    // Aplica o resultado da validação da senha
    if (erroSenha) {
      setErro(campos.senha, erroSenha);
      formValido = false;
    } else {
      setSucesso(campos.senha);
    }

    // Confirmar Senha: Deve ser idêntica
    const confirmarValor = campos.confirmarSenha.value.trim();
    if (confirmarValor !== senhaValor || confirmarValor === "") {
      setErro(campos.confirmarSenha, "As senhas não coincidem.");
      formValido = false;
    } else {
      setSucesso(campos.confirmarSenha);
    }

    return formValido;
  }

  // --- Funções Auxiliares de UI (Erro/Sucesso) ---

  function setErro(input, mensagem) {
    // Busca o pai .campo-grupo para injetar a mensagem
    const grupoPrincipal = input.closest(".campo-grupo");

    input.classList.add("erro");

    let msgElement = grupoPrincipal.querySelector(".error-message");

    // Cria o elemento de mensagem se não existir
    if (!msgElement) {
      msgElement = document.createElement("p");
      msgElement.className = "error-message";
      grupoPrincipal.appendChild(msgElement);
    }

    msgElement.innerText = mensagem;
  }

  function setSucesso(input) {
    const grupoPrincipal = input.closest(".campo-grupo");
    input.classList.remove("erro");

    // Remove mensagem de erro antiga, se houver
    const msgElement = grupoPrincipal.querySelector(".error-message");
    if (msgElement) {
      msgElement.remove();
    }
  }

  function isEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // --- Lógica do Modal de Confirmação ---
  const popup = document.getElementById("popupConfirmacao");
  const btnOk = document.getElementById("popupBtnOk");

  function mostrarPopup() {
    popup.classList.add("visible");
  }

  // Reseta o formulário e limpa erros ao fechar o modal
  const fecharPopup = () => {
    popup.classList.remove("visible");
    form.reset();
    document.querySelectorAll(".error-message").forEach((e) => e.remove());
    document
      .querySelectorAll(".input-campo")
      .forEach((e) => e.classList.remove("erro"));
  };

  btnOk.addEventListener("click", fecharPopup);

  popup.addEventListener("click", (e) => {
    if (e.target === popup) fecharPopup();
  });
});
