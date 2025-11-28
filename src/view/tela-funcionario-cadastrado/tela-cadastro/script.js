document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");

  const campos = {
    nome: document.getElementById("nome"),
    email: document.getElementById("email"),
    cargo: document.getElementById("cargo"),
    senha: document.getElementById("senha"),
    confirmarSenha: document.getElementById("confirmar-senha"),
  };

  // --- 1. Lógica do Ícone de Senha ---
  const iconesSenha = document.querySelectorAll(
    ".input-com-icone .select-icone"
  );

  iconesSenha.forEach((icone) => {
    icone.addEventListener("click", (e) => {
      e.preventDefault();
      const input = icone.previousElementSibling;

      if (input.type === "password") {
        input.type = "text";
        icone.innerText = "visibility";
      } else {
        input.type = "password";
        icone.innerText = "visibility_off";
      }
    });
  });

  // --- 2. Validação ao Enviar ---
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (validarTudo()) {
      mostrarPopup();
    }
  });

  function validarTudo() {
    let formValido = true;

    // Validar Nome
    const nomeValor = campos.nome.value.trim();
    if (nomeValor.length < 3) {
      setErro(campos.nome, "O nome deve ter no mínimo 3 caracteres.");
      formValido = false;
    } else {
      setSucesso(campos.nome);
    }

    // Validar Email
    const emailValor = campos.email.value.trim();
    if (!isEmailValido(emailValor)) {
      setErro(campos.email, "Insira um e-mail válido.");
      formValido = false;
    } else {
      setSucesso(campos.email);
    }

    // Validar Cargo (AQUI ESTAVA O PROBLEMA, AGORA VAI FUNCIONAR)
    const cargoValor = campos.cargo.value;
    if (!cargoValor) {
      setErro(campos.cargo, "Selecione um cargo.");
      formValido = false;
    } else {
      setSucesso(campos.cargo);
    }

    // Validar Senha
    const senhaValor = campos.senha.value.trim();
    if (senhaValor.length < 6) {
      setErro(campos.senha, "A senha deve ter no mínimo 6 caracteres.");
      formValido = false;
    } else {
      setSucesso(campos.senha);
    }

    // Validar Confirmar Senha
    const confirmarValor = campos.confirmarSenha.value.trim();
    if (confirmarValor !== senhaValor || confirmarValor === "") {
      setErro(campos.confirmarSenha, "As senhas não conferem.");
      formValido = false;
    } else {
      setSucesso(campos.confirmarSenha);
    }

    return formValido;
  }

  // --- FUNÇÕES VISUAIS CORRIGIDAS ---

  function setErro(input, mensagem) {
    // CORREÇÃO: O .closest procura a div principal (.campo-grupo)
    // não importa se é input normal, senha ou select.
    const grupoPrincipal = input.closest(".campo-grupo");

    input.classList.add("erro");

    let msgElement = grupoPrincipal.querySelector(".error-message");

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

    const msgElement = grupoPrincipal.querySelector(".error-message");
    if (msgElement) {
      msgElement.remove();
    }
  }

  function isEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // --- Popup ---
  const popup = document.getElementById("popupConfirmacao");
  const btnOk = document.getElementById("popupBtnOk");
  const btnFechar = document.querySelector(".btn-fechar");

  function mostrarPopup() {
    popup.classList.add("visible");
  }

  btnOk.addEventListener("click", () => {
    popup.classList.remove("visible");
    form.reset();
    document.querySelectorAll(".error-message").forEach((e) => e.remove());
    document
      .querySelectorAll(".input-campo")
      .forEach((e) => e.classList.remove("erro"));
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.remove("visible");
      form.reset();
      document.querySelectorAll(".error-message").forEach((e) => e.remove());
      document
        .querySelectorAll(".input-campo")
        .forEach((e) => e.classList.remove("erro"));
    }
  });
});
