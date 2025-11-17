class PasswordValidator {
    validate(senhaAtual, novaSenha, confirmarSenha) {
        if (senhaAtual === '' || novaSenha === '' || confirmarSenha === '') {
            return 'Por favor, preencha todos os campos.';
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
        if (novoEmail === '') {
            return 'Por favor, preencha o campo de e-mail.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(novoEmail)) {
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
        this.trigger = document.getElementById(triggerId);
    
        if (!this.modal || !this.trigger) { 
            console.warn(`Modal ou Gatilho não encontrado: ${modalId}, ${triggerId}`);
            return;
        }

        this.closeBtn = this.modal.querySelector('.modal-close');
        this.inputs = this.modal.querySelectorAll('input');        
        this.errorDisplay = this.modal.querySelector('.error-message'); 

        if (!this.closeBtn) {
            console.warn(`Botão de fechar não encontrado no modal: ${modalId}`);
            return;
        }

        this.setupListeners();
    }

    setupListeners() {
        this.trigger.addEventListener('click', () => this.open());
        this.closeBtn.addEventListener('click', () => this.close());
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

        this.inputs.forEach(input => {
            if ((input.type === 'text' || input.type === 'password') && !input.readOnly) {
                input.value = '';
            }
        });

        if (this.errorDisplay) {
            this.errorDisplay.textContent = '';
            this.errorDisplay.style.display = 'none';
        }
    }
}

class PasswordController {
    constructor(passwordValidator, passwordModalManager) {
        this.validator = passwordValidator;
        this.modalManager = passwordModalManager;
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
        
        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';

        const errorMessage = this.validator.validate(senhaAtual, novaSenha, confirmarSenha);

        if (errorMessage) {
            this.showError(errorMessage);
        } else {
            this.showSuccess();
        }
    }

    showError(message) {
        this.errorDisplay.textContent = message;
        this.errorDisplay.style.display = 'block';
    }

    showSuccess() {
        alert('Senha atualizada com sucesso! (Isso é uma simulação)');
        this.modalManager.close();
    }
}

class NameController {
    constructor(nameValidator, nameModalManager) {
        this.validator = nameValidator;
        this.modalManager = nameModalManager;
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

        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';

        const errorMessage = this.validator.validate(novoNome);

        if (errorMessage) {
            this.showError(errorMessage);
        } else {
            this.showSuccess();
        }
    }

    showError(message) {
        this.errorDisplay.textContent = message;
        this.errorDisplay.style.display = 'block';
    }

    showSuccess() {
        alert('Nome atualizado com sucesso! (Isso é uma simulação)');
        this.modalManager.close();
    }
}

class EmailController {
    constructor(emailValidator, emailModalManager) {
        this.validator = emailValidator;
        this.modalManager = emailModalManager;
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
        
        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';

        const errorMessage = this.validator.validate(novoEmail);

        if (errorMessage) {
            this.showError(errorMessage);
        } else {
            this.showSuccess();
        }
    }

    showError(message) {
        this.errorDisplay.textContent = message;
        this.errorDisplay.style.display = 'block';
    }

    showSuccess() {
        alert('E-mail atualizado com sucesso! (Isso é uma simulação)');
        this.modalManager.close();
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const passwordValidator = new PasswordValidator();
    const emailValidator = new EmailValidator();
    const nameValidator = new NameValidator();

    const nameModalManager = new ModalManager('modalNome', 'itemNome');
    new ModalManager('modalCargo', 'itemCargo');
    
    const emailModalManager = new ModalManager('modalEmail', 'itemEmail');
    const passwordModalManager = new ModalManager('modalSenha', 'itemSenha');

    initializePasswordIcons();
    
    new PasswordController(passwordValidator, passwordModalManager);
    new EmailController(emailValidator, emailModalManager);
    new NameController(nameValidator, nameModalManager);

});