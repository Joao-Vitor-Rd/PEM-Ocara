class PasswordValidator {
    validate(senhaAtual, novaSenha, confirmarSenha) {
        if (senhaAtual === '' || novaSenha === '' || confirmarSenha === '') {
            return 'Por favor, preencha todos os campos.';
        }
        if (novaSenha === senhaAtual) {
            return 'A nova senha não pode ser igual à senha atual.';
        }
        if (novaSenha.length < 8) {
            return 'A nova senha deve ter pelo menos 8 caracteres.';
        }
        if (!/[A-Z]/.test(novaSenha)) {
            return 'A nova senha deve conter pelo menos uma letra maiúscula.';
        }
        if (!/[a-z]/.test(novaSenha)) {
            return 'A nova senha deve conter pelo menos uma letra minúscula.';
        }
        if (!/[^A-Za-z0-9]/.test(novaSenha)) {
            return 'A nova senha deve conter pelo menos um caractere especial (ex: !@#$%).';
        }
        if (novaSenha !== confirmarSenha) {
            return 'As senhas não coincidem. Tente novamente.';
        }
        return null;
    }
}

class NameValidator {
    validate(novoNome) {
        if (novoNome.trim() === '') {
            return 'Por favor, preencha o campo de nome.';
        }
        if (novoNome.trim().length < 3) {
            return 'O nome deve ter pelo menos 3 caracteres.';
        }
        return null;
    }
}

class EmailValidator {
    validate(novoEmail) {
        const email = novoEmail.trim();

        if (email === '') {
            return 'Por favor, preencha o campo de e-mail.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Por favor, insira um formato de e-mail válido.';
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
    const input = inputWrapper.querySelector('input');

    if (input.type === "password") {
        input.type = "text";
        iconElement.textContent = "visibility_off";
    } else {
        input.type = "password";
        iconElement.textContent = "visibility";
    }
}

function initializePasswordIcons() {
    document.querySelectorAll('.password-toggle-icon').forEach(icon => {
        icon.textContent = "visibility";
        icon.classList.add('material-symbols-outlined');
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

        this.closeBtn = this.modal.querySelector('.modal-close, #popupBtnOk'); 
        this.inputs = this.modal.querySelectorAll('input');   
        this.errorDisplay = this.modal.querySelector('.error-message'); 

        if (!this.closeBtn && modalId !== 'modalCargo') {
            console.warn(`Botão de fechar/OK não encontrado no modal: ${modalId}`);
        }

        this.setupListeners();
    }

    setupListeners() {
        if (this.trigger) {
            this.trigger.addEventListener('click', () => {
                if (typeof this.beforeOpen === 'function') {
                    this.beforeOpen();
                }
                this.open();
            });
        }
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        window.addEventListener('click', (evento) => {
            if (evento.target === this.modal) {
                this.close();
            }
        });
    }

    open() {
        this.modal.classList.add('visible'); 
    }

    close() {
        this.modal.classList.remove('visible');

        if (this.inputs && this.inputs.length > 0) {
            this.inputs.forEach(input => {
                if ((input.type === 'text' || input.type === 'password') && !input.readOnly) {
                    input.value = '';
                }
            });
        }
        
        if (this.errorDisplay) {
            this.errorDisplay.textContent = '';
            this.errorDisplay.style.display = 'none';
        }    
    }
    
    setMessage(message) {
        const messageElement = this.modal.querySelector('#popupMensagem');
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
        this.btnAtualizar = document.querySelector('#modalSenha .btn-atualizar'); 
        this.senhaAtualInput = document.getElementById('senhaAtual');
        this.novaSenhaInput = document.getElementById('novaSenha');
        this.confirmarSenhaInput = document.getElementById('confirmarSenha');
        this.errorDisplay = document.getElementById('senhaError'); 
        this.setupListener();
    }

    setupListener() {
        if (!this.btnAtualizar) {
            console.warn('Botão de atualizar senha não encontrado.');
            return;
        }
        this.btnAtualizar.addEventListener('click', () => this.handleUpdatePassword());
    }

    async handleUpdatePassword() {
        const senhaAtual = this.senhaAtualInput.value;
        const novaSenha = this.novaSenhaInput.value;
        const confirmarSenha = this.confirmarSenhaInput.value;
        
        this.hideError();

        const errorMessage = this.validator.validate(senhaAtual, novaSenha, confirmarSenha);

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
        this.errorDisplay.style.display = 'block';
    }

    hideError() {
        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';
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
        this.btnAtualizar = document.querySelector('#modalNome .btn-atualizar');
        this.novoNomeInput = document.getElementById('novoNome');
        this.senhaConfirmacaoInput = document.getElementById('senhaConfirmacaoNome');
        this.errorDisplay = document.getElementById('nomeError'); 

        if (!this.btnAtualizar || !this.novoNomeInput || !this.errorDisplay || !this.senhaConfirmacaoInput) {
            console.warn('Elementos do modal de nome não encontrados.');
            return;
        }
        this.setupListener();
    }

    setupListener() {
        this.btnAtualizar.addEventListener('click', () => this.handleUpdateName());
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
        this.errorDisplay.style.display = 'block';
    }

    hideError() {
        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';
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
        this.btnAtualizar = document.querySelector('#modalEmail .btn-atualizar');
        this.novoEmailInput = document.getElementById('novoEmail');
        this.senhaConfirmacaoInput = document.getElementById('senhaConfirmacaoEmail');
        this.errorDisplay = document.getElementById('emailError'); 

        if (!this.btnAtualizar || !this.novoEmailInput || !this.errorDisplay || !this.senhaConfirmacaoInput) {
            console.warn('Elementos do modal de e-mail não encontrados.');
            return;
        }
        this.setupListener();
    }

    setupListener() {
        this.btnAtualizar.addEventListener('click', () => this.handleUpdateEmail());
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
        this.errorDisplay.style.display = 'block';
    }

    hideError() {
        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';
    }

    showSuccess(message) {
        this.modalManager.close();
        this.successModalManager.setMessage(message);
        this.successModalManager.open();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
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
    
    const successModalManager = new ModalManager('popupConfirmacao');

    const nameModalManager = new ModalManager('modalNome', 'itemNome', {
        beforeOpen: atualizarResumo
    });
    new ModalManager('modalCargo', 'itemCargo', {
        beforeOpen: atualizarResumo
    });
    const emailModalManager = new ModalManager('modalEmail', 'itemEmail', {
        beforeOpen: atualizarResumo
    });
    const passwordModalManager = new ModalManager('modalSenha', 'itemSenha');

    initializePasswordIcons();

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            salvarUsuarioNaSessao(null);
            await window.api.logout();
            window.api.openWindow('telaLogin');
        });
    }
    
    new PasswordController(passwordValidator, passwordModalManager, successModalManager, profileState);
    new EmailController(emailValidator, emailModalManager, successModalManager, profileState);
    new NameController(nameValidator, nameModalManager, successModalManager, profileState);

    atualizarResumo();
});

