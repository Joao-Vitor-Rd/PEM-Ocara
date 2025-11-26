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
    constructor(modalId, triggerId) {
        this.modal = document.getElementById(modalId);
        this.trigger = triggerId ? document.getElementById(triggerId) : null;
    
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
            this.trigger.addEventListener('click', () => this.open());
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
    constructor(passwordValidator, passwordModalManager, successModalManager) {
        this.validator = passwordValidator;
        this.modalManager = passwordModalManager;
        this.successModalManager = successModalManager;
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

    handleUpdatePassword() {
        const senhaAtual = this.senhaAtualInput.value;
        const novaSenha = this.novaSenhaInput.value;
        const confirmarSenha = this.confirmarSenhaInput.value;
        
        this.hideError();

        const errorMessage = this.validator.validate(senhaAtual, novaSenha, confirmarSenha);

        if (errorMessage) {
            this.showError(errorMessage);
        } else {
            this.showSuccess('Senha atualizada com sucesso!');
        }
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
    constructor(nameValidator, nameModalManager, successModalManager) {
        this.validator = nameValidator;
        this.modalManager = nameModalManager;
        this.successModalManager = successModalManager;
        this.btnAtualizar = document.querySelector('#modalNome .btn-atualizar');
        this.novoNomeInput = document.getElementById('novoNome');
        this.errorDisplay = document.getElementById('nomeError'); 

        if (!this.btnAtualizar || !this.novoNomeInput || !this.errorDisplay) {
            console.warn('Elementos do modal de nome não encontrados.');
            return;
        }
        this.setupListener();
    }

    setupListener() {
        this.btnAtualizar.addEventListener('click', () => this.handleUpdateName());
    }

    handleUpdateName() {
        const novoNome = this.novoNomeInput.value;
        this.hideError();

        const errorMessage = this.validator.validate(novoNome);

        if (errorMessage) {
            this.showError(errorMessage);
        } else {
            this.showSuccess('Nome atualizado com sucesso!');
        }
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
    constructor(emailValidator, emailModalManager, successModalManager) {
        this.validator = emailValidator;
        this.modalManager = emailModalManager;
        this.successModalManager = successModalManager;
        this.btnAtualizar = document.querySelector('#modalEmail .btn-atualizar');
        this.novoEmailInput = document.getElementById('novoEmail');
        this.errorDisplay = document.getElementById('emailError'); 

        if (!this.btnAtualizar || !this.novoEmailInput || !this.errorDisplay) {
            console.warn('Elementos do modal de e-mail não encontrados.');
            return;
        }
        this.setupListener();
    }

    setupListener() {
        this.btnAtualizar.addEventListener('click', () => this.handleUpdateEmail());
    }

    handleUpdateEmail() {
        const novoEmail = this.novoEmailInput.value;
        this.hideError();

        const errorMessage = this.validator.validate(novoEmail);

        if (errorMessage) {
            this.showError(errorMessage);
        } else {
            this.showSuccess('E-mail atualizado com sucesso!');
        }
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

document.addEventListener('DOMContentLoaded', () => {

    const passwordValidator = new PasswordValidator();
    const emailValidator = new EmailValidator();
    const nameValidator = new NameValidator();
    
    const successModalManager = new ModalManager('popupConfirmacao');

    const nameModalManager = new ModalManager('modalNome', 'itemNome');
    const cargoModalManager = new ModalManager('modalCargo', 'itemCargo');
    
    const emailModalManager = new ModalManager('modalEmail', 'itemEmail');
    const passwordModalManager = new ModalManager('modalSenha', 'itemSenha');

    initializePasswordIcons();
    
    new PasswordController(passwordValidator, passwordModalManager, successModalManager);
    new EmailController(emailValidator, emailModalManager, successModalManager);
    new NameController(nameValidator, nameModalManager, successModalManager);

});