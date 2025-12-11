class PasswordValidator {
  validate(senhaAtual, novaSenha, confirmarSenha) {
    if (senhaAtual === "" || novaSenha === "" || confirmarSenha === "") {
      return "Por favor, preencha todos os campos.";
    }
    if (novaSenha === senhaAtual) {
      return "A nova senha não pode ser igual à senha atual.";
    }
    if (novaSenha.length < 8) {
      return "A nova senha deve ter pelo menos 8 caracteres.";
    }
    if (!/[A-Z]/.test(novaSenha)) {
      return "A nova senha deve conter pelo menos uma letra maiúscula.";
    }
    if (!/[a-z]/.test(novaSenha)) {
      return "A nova senha deve conter pelo menos uma letra minúscula.";
    }
    if (!/[^A-Za-z0-9]/.test(novaSenha)) {
      return "A nova senha deve conter pelo menos um caractere especial (ex: !@#$%).";
    }
    if (novaSenha !== confirmarSenha) {
      return "As senhas não coincidem. Tente novamente.";
    }
    return null;
  }
}

class NameValidator {
  validate(novoNome) {
    if (novoNome.trim() === "") {
      return "Por favor, preencha o campo de nome.";
    }
    if (novoNome.trim().length < 3) {
      return "O nome deve ter pelo menos 3 caracteres.";
    }
    return null;
  }
}

class EmailValidator {
  validate(novoEmail) {
    const email = novoEmail.trim();

    if (email === "") {
      return "Por favor, preencha o campo de e-mail.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Por favor, insira um formato de e-mail válido.";
    }
    return null;
  }
}

const STORAGE_KEY = 'usuarioLogado';

function carregarUsuarioDaSessao() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Erro ao ler dados do usuário em sessão:', error);
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function salvarUsuarioNaSessao(usuario) {
  if (!usuario) {
    sessionStorage.removeItem(STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

function togglePassword(iconElement) {
  const inputWrapper = iconElement.parentElement;
  const input = inputWrapper.querySelector("input");

  if (input.type === "password") {
    input.type = "text";
    iconElement.textContent = "visibility";
  } else {
    input.type = "password";
    iconElement.textContent = "visibility_off";
  }
}

function initializePasswordIcons() {
  document
    .querySelectorAll(".input-wrapper .material-symbols-outlined")
    .forEach((icon) => {
      icon.textContent = "visibility_off";
      icon.style.cursor = "pointer";
      icon.addEventListener("click", () => togglePassword(icon));
    });
}
class ModalManager {
  constructor(modalId, triggerId, options = {}) {
    this.modal = document.getElementById(modalId);
    this.trigger = triggerId ? document.getElementById(triggerId) : null;
    this.beforeOpen = options.beforeOpen;

    if (!this.modal) {
      console.warn(`Modal não encontrado: ${modalId}`);
      return;
    }

    this.closeBtn = this.modal.querySelector(".modal-close, #popupBtnOk");
    this.inputs = this.modal.querySelectorAll("input");
    this.errorDisplay = this.modal.querySelector(".error-message");

    if (!this.closeBtn && modalId !== "modalCargo") {
      console.warn(`Botão de fechar/OK não encontrado no modal: ${modalId}`);
    }

    this.setupListeners();
  }

  setupListeners() {
    if (this.trigger) {
      this.trigger.addEventListener("click", () => {
        if (typeof this.beforeOpen === 'function') {
          this.beforeOpen();
        }
        this.open();
      });
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }
    window.addEventListener("click", (evento) => {
      if (evento.target === this.modal) {
        this.close();
      }
    });
  }

  open() {
    this.modal.classList.add("visible");
  }

  close() {
    this.modal.classList.remove("visible");

    if (this.inputs && this.inputs.length > 0) {
      this.inputs.forEach((input) => {
        if (
          (input.type === "text" || input.type === "password") &&
          !input.readOnly
        ) {
          input.value = "";
        }
      });
    }

    if (this.errorDisplay) {
      this.errorDisplay.textContent = "";
      this.errorDisplay.style.display = "none";
    }
  }

  setMessage(message) {
    const messageElement = this.modal.querySelector("#popupMensagem");
    if (messageElement) {
      messageElement.textContent = message;
    }
  }
}

class PasswordController {
  constructor(passwordValidator, passwordModalManager, successModalManager, profileState) {
    this.validator = passwordValidator;
    this.modalManager = passwordModalManager;
    this.successModalManager = successModalManager;
    this.profileState = profileState;
    this.btnAtualizar = document.querySelector("#modalSenha .btn-atualizar");
    this.senhaAtualInput = document.getElementById("senhaAtual");
    this.novaSenhaInput = document.getElementById("novaSenha");
    this.confirmarSenhaInput = document.getElementById("confirmarSenha");
    this.errorDisplay = document.getElementById("senhaError");
    this.setupListener();
  }

  setupListener() {
    if (!this.btnAtualizar) {
      console.warn("Botão de atualizar senha não encontrado.");
      return;
    }
    this.btnAtualizar.addEventListener("click", () =>
      this.handleUpdatePassword()
    );
  }

  async handleUpdatePassword() {
    const senhaAtual = this.senhaAtualInput.value;
    const novaSenha = this.novaSenhaInput.value;
    const confirmarSenha = this.confirmarSenhaInput.value;

    this.hideError();

    const errorMessage = this.validator.validate(
      senhaAtual,
      novaSenha,
      confirmarSenha
    );

    if (errorMessage) {
      this.showError(errorMessage);
      return;
    }

    const usuario = this.profileState.get();
    if (!usuario) {
      this.showError('Sessão expirada. Faça login novamente.');
      return;
    }

    this.setLoading(true);
    try {
      const resposta = await window.api.atualizarPerfil({
        email: usuario.email,
        nome: usuario.nome,
        senhaAtual,
        novaSenha
      });

      if (!resposta.success) {
        this.showError(resposta.error || 'Não foi possível atualizar a senha.');
        return;
      }

      if (resposta.funcionario) {
        this.profileState.apply(resposta.funcionario);
      }

      this.showSuccess('Senha atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      this.showError('Erro inesperado ao atualizar senha.');
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    if (!this.btnAtualizar) return;
    this.btnAtualizar.disabled = loading;
    this.btnAtualizar.classList.toggle('loading', loading);
  }

  showError(message) {
    this.errorDisplay.textContent = message;
    this.errorDisplay.style.display = "block";
  }

  hideError() {
    this.errorDisplay.textContent = "";
    this.errorDisplay.style.display = "none";
  }

  showSuccess(message) {
    this.modalManager.close();
    this.successModalManager.setMessage(message);
    this.successModalManager.open();
  }
}

class NameController {
  constructor(nameValidator, nameModalManager, successModalManager, profileState) {
    this.validator = nameValidator;
    this.modalManager = nameModalManager;
    this.successModalManager = successModalManager;
    this.profileState = profileState;
    this.btnAtualizar = document.querySelector("#modalNome .btn-atualizar");
    this.novoNomeInput = document.getElementById("novoNome");
    this.senhaConfirmacaoInput = document.getElementById('senhaConfirmacaoNome');
    this.errorDisplay = document.getElementById("nomeError");

    if (!this.btnAtualizar || !this.novoNomeInput || !this.errorDisplay || !this.senhaConfirmacaoInput) {
      console.warn("Elementos do modal de nome não encontrados.");
      return;
    }
    this.setupListener();
  }

  setupListener() {
    this.btnAtualizar.addEventListener("click", () => this.handleUpdateName());
  }

  async handleUpdateName() {
    const novoNome = this.novoNomeInput.value.trim();
    const senhaAtual = this.senhaConfirmacaoInput.value;
    this.hideError();

    const errorMessage = this.validator.validate(novoNome);

    if (errorMessage) {
      this.showError(errorMessage);
      return;
    }

    if (!senhaAtual) {
      this.showError('Informe sua senha atual para confirmar.');
      return;
    }

    const usuario = this.profileState.get();
    if (!usuario) {
      this.showError('Sessão expirada. Faça login novamente.');
      return;
    }

    this.setLoading(true);
    try {
      const resposta = await window.api.atualizarPerfil({
        email: usuario.email,
        nome: novoNome,
        senhaAtual
      });

      if (!resposta.success) {
        this.showError(resposta.error || 'Não foi possível atualizar o nome.');
        return;
      }

      if (resposta.funcionario) {
        this.profileState.apply(resposta.funcionario);
      } else {
        this.profileState.apply({ nome: novoNome });
      }

      this.showSuccess('Nome atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar nome:', error);
      this.showError('Erro inesperado ao atualizar nome.');
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    if (!this.btnAtualizar) return;
    this.btnAtualizar.disabled = loading;
    this.btnAtualizar.classList.toggle('loading', loading);
  }

  showError(message) {
    this.errorDisplay.textContent = message;
    this.errorDisplay.style.display = "block";
  }

  hideError() {
    this.errorDisplay.textContent = "";
    this.errorDisplay.style.display = "none";
  }

  showSuccess(message) {
    this.modalManager.close();
    this.successModalManager.setMessage(message);
    this.successModalManager.open();
  }
}

class EmailController {
  constructor(emailValidator, emailModalManager, successModalManager, profileState) {
    this.validator = emailValidator;
    this.modalManager = emailModalManager;
    this.successModalManager = successModalManager;
    this.profileState = profileState;
    this.btnAtualizar = document.querySelector("#modalEmail .btn-atualizar");
    this.novoEmailInput = document.getElementById("novoEmail");
    this.senhaConfirmacaoInput = document.getElementById('senhaConfirmacaoEmail');
    this.errorDisplay = document.getElementById("emailError");

    if (!this.btnAtualizar || !this.novoEmailInput || !this.errorDisplay || !this.senhaConfirmacaoInput) {
      console.warn("Elementos do modal de e-mail não encontrados.");
      return;
    }
    this.setupListener();
  }

  setupListener() {
    this.btnAtualizar.addEventListener("click", () => this.handleUpdateEmail());
  }

  async handleUpdateEmail() {
    const novoEmail = this.novoEmailInput.value.trim();
    const senhaAtual = this.senhaConfirmacaoInput.value;
    this.hideError();

    const usuario = this.profileState.get();
    if (!usuario) {
      this.showError('Sessão expirada. Faça login novamente.');
      return;
    }

    if (!novoEmail) {
      this.showError('Informe o novo e-mail.');
      return;
    }

    if (novoEmail === usuario.email) {
      this.showError('O novo e-mail deve ser diferente do atual.');
      return;
    }

    const errorMessage = this.validator.validate(novoEmail);
    if (errorMessage) {
      this.showError(errorMessage);
      return;
    }

    if (!senhaAtual) {
      this.showError('Informe sua senha atual para confirmar.');
      return;
    }

    this.setLoading(true);
    try {
      const resposta = await window.api.atualizarPerfil({
        email: usuario.email,
        nome: usuario.nome,
        senhaAtual,
        novoEmail
      });

      if (!resposta.success) {
        this.showError(resposta.error || 'Não foi possível atualizar o e-mail.');
        return;
      }

      if (resposta.funcionario) {
        this.profileState.apply(resposta.funcionario);
      } else {
        this.profileState.apply({ email: novoEmail });
      }

      this.showSuccess('E-mail atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar e-mail:', error);
      this.showError('Erro inesperado ao atualizar e-mail.');
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    if (!this.btnAtualizar) return;
    this.btnAtualizar.disabled = loading;
    this.btnAtualizar.classList.toggle('loading', loading);
  }

  showError(message) {
    this.errorDisplay.textContent = message;
    this.errorDisplay.style.display = "block";
  }

  hideError() {
    this.errorDisplay.textContent = "";
    this.errorDisplay.style.display = "none";
  }

  showSuccess(message) {
    this.modalManager.close();
    this.successModalManager.setMessage(message);
    this.successModalManager.open();
  }
}
class ProcuradoriaController {
  constructor(
    emailValidator,
    createModalMgr,
    updateModalMgr,
    successModalMgr,
    triggerId,
    credencialState,
    onStateChange
  ) {
    this.validator = emailValidator;
    this.createModal = createModalMgr;
    this.updateModal = updateModalMgr;
    this.successModal = successModalMgr;
    this.state = credencialState;
    this.onStateChange = typeof onStateChange === 'function' ? onStateChange : () => {};

    this.trigger = triggerId ? document.getElementById(triggerId) : null;

    this.inputCadastro = document.getElementById("inputCadastrarEmailProc");
    this.btnSalvarCadastro = document.querySelector(
      "#modalCadastrarEmailProc .btn-proc-large"
    );
    this.errorDisplayCadastro = document.getElementById("procErrorCadastro");

    this.inputAtualReadonly = document.getElementById("inputEmailProcAtual");
    this.inputNovo = document.getElementById("inputEmailProcNovo");
    this.btnSalvarAtualizacao = document.querySelector(
      "#modalAtualizarEmailProc .btn-proc-large"
    );
    this.errorDisplayAtualizacao = document.getElementById(
      "procErrorAtualizacao"
    );

    this.setupListeners();
  }

  setupListeners() {
    if (this.trigger) {
      this.trigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.abrirModalCorreto();
      });
    } else {
      console.warn("Trigger da Procuradoria não encontrado.");
    }

    if (this.btnSalvarCadastro) {
      this.btnSalvarCadastro.addEventListener("click", () =>
        this.handleCadastro()
      );
    }

    if (this.btnSalvarAtualizacao) {
      this.btnSalvarAtualizacao.addEventListener("click", () =>
        this.handleAtualizacao()
      );
    }
  }

  abrirModalCorreto() {
    if (this.state.email && this.state.senhaConfigurada) {
      this.sincronizarInputs();
      this.updateModal.open();
    } else {
      if (this.inputCadastro && this.state.email) {
        this.inputCadastro.value = this.state.email;
      }
      this.createModal.open();
    }
  }

  sincronizarInputs() {
    if (this.inputAtualReadonly) {
      this.inputAtualReadonly.value = this.state.email || "";
    }
    this.onStateChange();
  }

  async handleCadastro() {
    const email = (this.inputCadastro?.value || '').trim();
    this.hideError(this.errorDisplayCadastro);

    const erro = this.validator.validate(email);

    if (erro) {
      this.showError(erro, this.errorDisplayCadastro);
      return;
    }

    if (!this.state.senhaConfigurada) {
      this.state.email = email;
      this.createModal.close();
      this.sincronizarInputs();
      this.successModal.setMessage('E-mail cadastrado. Cadastre a senha da procuradoria para concluir.');
      this.successModal.open();
      return;
    }

    const resultado = await persistirCredenciaisInstitucionais(this.state, { email });
    if (resultado.error) {
      this.showError(resultado.error, this.errorDisplayCadastro);
      return;
    }

    this.createModal.close();
    this.sincronizarInputs();
    this.successModal.setMessage('E-mail cadastrado com sucesso!');
    this.successModal.open();
  }

  async handleAtualizacao() {
    const novoEmail = (this.inputNovo?.value || '').trim();
    this.hideError(this.errorDisplayAtualizacao);

    const erro = this.validator.validate(novoEmail);

    if (erro) {
      this.showError(erro, this.errorDisplayAtualizacao);
      return;
    }

    if (novoEmail === this.state.email) {
      this.showError(
        "O novo e-mail não pode ser igual ao atual.",
        this.errorDisplayAtualizacao
      );
      return;
    }

    if (!this.state.senhaConfigurada) {
      this.showError('Cadastre a senha institucional para concluir.', this.errorDisplayAtualizacao);
      return;
    }

    const resultado = await persistirCredenciaisInstitucionais(this.state, { email: novoEmail });
    if (resultado.error) {
      this.showError(resultado.error, this.errorDisplayAtualizacao);
      return;
    }

    this.state.email = novoEmail;
    this.updateModal.close();
    this.sincronizarInputs();
    this.successModal.setMessage("E-mail atualizado com sucesso!");
    this.successModal.open();
  }

  showError(message, element) {
    if (element) {
      element.textContent = message;
      element.style.display = "block";
    }
  }

  hideError(element) {
    if (element) {
      element.textContent = "";
      element.style.display = "none";
    }
  }
}
class SenhaProcuradoriaValidator {
  validate(senha, confirmarSenha) {
    if (senha.trim() === "" || confirmarSenha.trim() === "") {
      return "Por favor, preencha todos os campos.";
    }
    if (senha.length < 8) {
      return "A senha deve ter pelo menos 8 caracteres.";
    }
    if (!/[A-Z]/.test(senha)) {
      return "A senha deve conter pelo menos uma letra maiúscula.";
    }
    if (!/[a-z]/.test(senha)) {
      return "A senha deve conter pelo menos uma letra minúscula.";
    }
    if (!/[^A-Za-z0-9]/.test(senha)) {
      return "A senha deve conter pelo menos um caractere especial (ex: !@#$%).";
    }
    if (senha !== confirmarSenha) {
      return "As senhas não coincidem. Tente novamente.";
    }
    return null;
  }

  validateUpdate(senhaAtual, novaSenha, confirmarSenha) {
    if (
      senhaAtual.trim() === "" ||
      novaSenha.trim() === "" ||
      confirmarSenha.trim() === ""
    ) {
      return "Por favor, preencha todos os campos.";
    }
    if (novaSenha === senhaAtual) {
      return "A nova senha não pode ser igual à senha atual.";
    }
    const basicValidation = this.validate(novaSenha, confirmarSenha);
    return basicValidation;
  }
}

async function persistirCredenciaisInstitucionais(credencialState, payload) {
  try {
    const resposta = await window.api.salvarCredenciais({
      ...payload,
      servico: (payload.servico || credencialState.servico || 'gmail')
    });

    if (!resposta.success) {
      return { error: resposta.error || 'Não foi possível salvar as credenciais.' };
    }

    const dados = resposta.dados || null;
    if (dados) {
      if (typeof dados.email === 'string') {
        credencialState.email = dados.email;
      } else if (payload.email) {
        credencialState.email = payload.email;
      }

      if (typeof dados.senhaConfigurada === 'boolean') {
        credencialState.senhaConfigurada = dados.senhaConfigurada;
      } else if (payload.senha) {
        credencialState.senhaConfigurada = true;
      }

      if (dados.servico) {
        credencialState.servico = dados.servico;
      }
    } else {
      if (payload.email) {
        credencialState.email = payload.email;
      }
      if (payload.senha) {
        credencialState.senhaConfigurada = true;
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar credenciais:', error);
    return { error: 'Erro inesperado ao salvar credenciais.' };
  }
}

class SenhaProcuradoriaController {
  constructor(
    senhaValidator,
    createModalMgr,
    updateModalMgr,
    successModalMgr,
    triggerId,
    credencialState,
    onStateChange
  ) {
    this.validator = senhaValidator;
    this.createModal = createModalMgr;
    this.updateModal = updateModalMgr;
    this.successModal = successModalMgr;
    this.state = credencialState;
    this.onStateChange = typeof onStateChange === 'function' ? onStateChange : () => {};

    this.trigger = triggerId ? document.getElementById(triggerId) : null;

    this.inputSenhaCadastro = document.getElementById(
      "inputCadastrarSenhaProc"
    );
    this.inputConfirmarCadastro = document.getElementById(
      "inputConfirmarSenhaProc"
    );
    this.btnSalvarCadastro = document.querySelector(
      "#modalCadastrarSenhaProc .btn-proc-large"
    );
    this.errorDisplayCadastro = document.getElementById(
      "senhaErrorCadastroProc"
    );

    this.inputSenhaAtual = document.getElementById("inputSenhaProcAtual");
    this.inputNovaSenha = document.getElementById("inputNovaSenhaProc");
    this.inputConfirmarNova = document.getElementById(
      "inputConfirmarNovaSenhaProc"
    );
    this.btnSalvarAtualizacao = document.querySelector(
      "#modalAtualizarSenhaProc .btn-proc-large"
    );
    this.errorDisplayAtualizacao = document.getElementById(
      "senhaErrorAtualizacaoProc"
    );

    this.setupListeners();
  }

  setupListeners() {
    if (this.trigger) {
      this.trigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.abrirModalCorreto();
      });
    } else {
      console.warn("Trigger da Senha Procuradoria não encontrado.");
    }

    if (this.btnSalvarCadastro) {
      this.btnSalvarCadastro.addEventListener("click", () =>
        this.handleCadastro()
      );
    }

    if (this.btnSalvarAtualizacao) {
      this.btnSalvarAtualizacao.addEventListener("click", () =>
        this.handleAtualizacao()
      );
    }
  }

  abrirModalCorreto() {
    if (this.state.senhaConfigurada) {
      if (this.inputSenhaAtual) {
        this.inputSenhaAtual.value = '';
      }
      this.updateModal.open();
    } else {
      this.createModal.open();
    }
  }

  async handleCadastro() {
    const senha = this.inputSenhaCadastro?.value || '';
    const confirmar = this.inputConfirmarCadastro?.value || '';
    this.hideError(this.errorDisplayCadastro);

    if (!this.state.email) {
      this.showError('Cadastre o e-mail da procuradoria antes de definir a senha.', this.errorDisplayCadastro);
      return;
    }

    const erro = this.validator.validate(senha, confirmar);

    if (erro) {
      this.showError(erro, this.errorDisplayCadastro);
      return;
    }

    const resultado = await persistirCredenciaisInstitucionais(this.state, {
      email: this.state.email,
      senha
    });

    if (resultado.error) {
      this.showError(resultado.error, this.errorDisplayCadastro);
      return;
    }

    this.state.senhaConfigurada = true;
    this.createModal.close();
    this.onStateChange();
    this.successModal.setMessage("Senha cadastrada com sucesso!");
    this.successModal.open();
  }

  async handleAtualizacao() {
    const senhaAtual = this.inputSenhaAtual?.value || '';
    const novaSenha = this.inputNovaSenha?.value || '';
    const confirmarNova = this.inputConfirmarNova?.value || '';
    this.hideError(this.errorDisplayAtualizacao);

    if (!this.state.email) {
      this.showError('Cadastre o e-mail da procuradoria antes de atualizar a senha.', this.errorDisplayAtualizacao);
      return;
    }

    const erro = this.validator.validateUpdate(
      senhaAtual,
      novaSenha,
      confirmarNova
    );

    if (erro) {
      this.showError(erro, this.errorDisplayAtualizacao);
      return;
    }

    const resultado = await persistirCredenciaisInstitucionais(this.state, {
      email: this.state.email,
      senha: novaSenha
    });

    if (resultado.error) {
      this.showError(resultado.error, this.errorDisplayAtualizacao);
      return;
    }

    this.updateModal.close();
    this.onStateChange();
    this.successModal.setMessage("Senha atualizada com sucesso!");
    this.successModal.open();
  }

  showError(message, element) {
    if (element) {
      element.textContent = message;
      element.style.display = "block";
    }
  }

  hideError(element) {
    if (element) {
      element.textContent = "";
      element.style.display = "none";
    }
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  let usuarioAtual = carregarUsuarioDaSessao();

  if (!usuarioAtual) {
    await window.api.logout();
    window.api.openWindow('telaLogin');
    return;
  }

  const elementos = {
    infoNome: document.getElementById('infoNome'),
    infoCargo: document.getElementById('infoCargo'),
    infoEmail: document.getElementById('infoEmail'),
    nomeAtualInput: document.getElementById('nomeAtual'),
    cargoAtualInput: document.getElementById('cargoAtual'),
    emailAtualInput: document.getElementById('emailAtual')
  };

  const atualizarResumo = () => {
    if (!usuarioAtual) return;
    if (elementos.infoNome) elementos.infoNome.textContent = usuarioAtual.nome || 'Não informado';
    if (elementos.infoCargo) elementos.infoCargo.textContent = usuarioAtual.cargo || 'Não informado';
    if (elementos.infoEmail) elementos.infoEmail.textContent = usuarioAtual.email || 'Não informado';
    if (elementos.nomeAtualInput) elementos.nomeAtualInput.value = usuarioAtual.nome || '';
    if (elementos.cargoAtualInput) elementos.cargoAtualInput.value = usuarioAtual.cargo || '';
    if (elementos.emailAtualInput) elementos.emailAtualInput.value = usuarioAtual.email || '';
  };

  const atualizarUsuarioLocal = (novoEstado) => {
    usuarioAtual = novoEstado;
    salvarUsuarioNaSessao(usuarioAtual);
    atualizarResumo();
  };

  const profileState = {
    get: () => usuarioAtual,
    apply(partial) {
      if (!usuarioAtual) return;
      const merge = partial ? { ...usuarioAtual, ...partial } : usuarioAtual;
      atualizarUsuarioLocal(merge);
    }
  };

  const passwordValidator = new PasswordValidator();
  const emailValidator = new EmailValidator();
  const nameValidator = new NameValidator();
  const senhaProcValidator = new SenhaProcuradoriaValidator();

  const successModalManager = new ModalManager("popupConfirmacao");

  const nameModalManager = new ModalManager('modalNome', 'itemNome', {
    beforeOpen: atualizarResumo
  });
  new ModalManager('modalCargo', 'itemCargo', {
    beforeOpen: atualizarResumo
  });
  const emailModalManager = new ModalManager('modalEmail', 'itemEmail', {
    beforeOpen: atualizarResumo
  });
  const passwordModalManager = new ModalManager("modalSenha", "itemSenha");

  const procCreateModalMgr = new ModalManager("modalCadastrarEmailProc", null);
  const procUpdateModalMgr = new ModalManager("modalAtualizarEmailProc", null);
  const senhaProcCreateModalMgr = new ModalManager("modalCadastrarSenhaProc", null);
  const senhaProcUpdateModalMgr = new ModalManager("modalAtualizarSenhaProc", null);

  initializePasswordIcons();

  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      salvarUsuarioNaSessao(null);
      await window.api.logout();
      window.api.openWindow('telaLogin');
    });
  }

  const historicoBtn = document.getElementById('itemHistoricoMudancas');
  if (historicoBtn) {
    historicoBtn.addEventListener('click', () => {
      window.api.openWindow('historicoMudancas');
    });
  }

  const itemSobreAplicacao = document.getElementById('itemSobreAplicacao');
  if (itemSobreAplicacao) {
    itemSobreAplicacao.addEventListener('click', async () => {
      try {
        await window.api.definirOrigemSobreAplicacao('telaContaAdm');
      } catch (error) {
        console.error('Falha ao definir origem da tela sobre a aplicação:', error);
      }
      window.api.openWindow('telaSobreAplicacao');
    });
  }

  new PasswordController(
    passwordValidator,
    passwordModalManager,
    successModalManager,
    profileState
  );
  new EmailController(emailValidator, emailModalManager, successModalManager, profileState);
  new NameController(nameValidator, nameModalManager, successModalManager, profileState);

  const credencialState = {
    email: null,
    servico: 'gmail',
    senhaConfigurada: false
  };

  const atualizarCamposProcuradoria = () => {
    const campoAtual = document.getElementById('inputEmailProcAtual');
    if (campoAtual) {
      campoAtual.value = credencialState.email || '';
    }
  };

  const carregarCredenciaisIniciais = async () => {
    try {
      const resposta = await window.api.obterCredenciais();
      if (resposta.success && resposta.dados) {
        credencialState.email = resposta.dados.email || null;
        credencialState.servico = resposta.dados.servico || 'gmail';
        credencialState.senhaConfigurada = !!resposta.dados.senhaConfigurada;
      }
    } catch (error) {
      console.error('Erro ao carregar credenciais:', error);
    } finally {
      atualizarCamposProcuradoria();
    }
  };

  await carregarCredenciaisIniciais();

  new ProcuradoriaController(
    emailValidator,
    procCreateModalMgr,
    procUpdateModalMgr,
    successModalManager,
    "itemProcuradoria",
    credencialState,
    atualizarCamposProcuradoria
  );

  new SenhaProcuradoriaController(
    senhaProcValidator,
    senhaProcCreateModalMgr,
    senhaProcUpdateModalMgr,
    successModalManager,
    "itemSenhaProcuradoria",
    credencialState,
    atualizarCamposProcuradoria
  );

  atualizarResumo();
});
