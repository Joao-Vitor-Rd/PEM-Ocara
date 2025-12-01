class NameValidator {
    validate(nome) {
        if (!nome || nome.trim() === '') {
            return 'Por favor, preencha o campo obrigatório.';
        }
        if (nome.trim().length < 3) {
            return 'O nome deve ter pelo menos 3 caracteres.';
        }
        return null;
    }
}

class EmailValidator {
    validate(email) {
        const emailLimpo = email.trim();
        if (!emailLimpo || emailLimpo === '') {
            return 'Por favor, preencha o campo obrigatório.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailLimpo)) {
            return 'Por favor, insira um formato de e-mail válido.';
        }
        return null;
    }
}

class CargoValidator {
    validate(cargoElement) {
        if (!cargoElement || cargoElement.selectedIndex === 0 || cargoElement.value === "") {
            return 'Por favor, preencha o campo obrigatório.';
        }
        return null;
    }
}

class PasswordValidator {
    validate(senha) {
        if (!senha || senha === '') {
            return 'Por favor, preencha o campo obrigatório.';
        }
        
        if (senha.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
        if (!/[A-Z]/.test(senha)) return 'A senha deve conter pelo menos uma letra maiúscula.';
        if (!/[a-z]/.test(senha)) return 'A senha deve conter pelo menos uma letra minúscula.';
        if (!/[^A-Za-z0-9]/.test(senha)) return 'A senha deve conter pelo menos um caractere especial.';
        
        return null;
    }
}

window.togglePassword = function(iconElement) {
    const inputWrapper = iconElement.parentElement;
    const input = inputWrapper.querySelector('input');

    if (input.type === "password") {
        input.type = "text";
        iconElement.textContent = "visibility";
    } else {
        input.type = "password";
        iconElement.textContent = "visibility_off";
    }
}

function initializePasswordIcons() {
    document.querySelectorAll('.toggle-pass').forEach(icon => {
        icon.textContent = "visibility_off";
    });
}

class ModalManager {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
    
        if (!this.modal) { 
            console.warn(`Modal não encontrado: ${modalId}`);
            return;
        }

        this.closeBtn = this.modal.querySelector('#btnFecharPopup'); 
        this.setupListeners();
    }

    setupListeners() {
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
        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
    }
    
    setOnClose(callback) {
        this.onCloseCallback = callback;
    }

    setMessage(message) {
        const messageElement = this.modal.querySelector('#popupMensagem');
        if (messageElement) {
            messageElement.textContent = message;
        }
    }
}

class RegistrationController {
    constructor(validators, successModalManager) {
        this.nameValidator = validators.name;
        this.emailValidator = validators.email;
        this.cargoValidator = validators.cargo;
        this.passwordValidator = validators.password;
        this.successModalManager = successModalManager;
        this.nomeInput = document.getElementById('nome');
        this.emailInput = document.getElementById('email');
        this.cargoInput = document.getElementById('cargo');
        this.senhaInput = document.getElementById('senha');
        this.confirmarInput = document.getElementById('confirmar');
        this.nomeError = document.getElementById('nomeError');
        this.emailError = document.getElementById('emailError');
        this.cargoError = document.getElementById('cargoError');
        this.senhaError = document.getElementById('senhaError');
        this.confirmarError = document.getElementById('confirmarError');
        this.btnCadastrar = document.querySelector('.botão-cadastrar');

        if (!this.btnCadastrar) return;
        this.init();
    }

    init() {
        this.btnCadastrar.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });

        this.nomeInput.addEventListener('input', () => this.hideError(this.nomeInput, this.nomeError));
        this.emailInput.addEventListener('input', () => this.hideError(this.emailInput, this.emailError));
        this.cargoInput.addEventListener('change', () => this.hideError(this.cargoInput, this.cargoError));
        this.senhaInput.addEventListener('input', () => this.hideError(this.senhaInput, this.senhaError));
        this.confirmarInput.addEventListener('input', () => this.hideError(this.confirmarInput, this.confirmarError));
        this.successModalManager.setOnClose(() => {
            document.querySelector('form').reset();
            this.cargoInput.selectedIndex = 0;
        });
    }

    handleRegistration() {
        let isValid = true;

        const nomeMsg = this.nameValidator.validate(this.nomeInput.value);
        if (nomeMsg) { this.showError(this.nomeInput, this.nomeError, nomeMsg); isValid = false; }
        const emailMsg = this.emailValidator.validate(this.emailInput.value);
        if (emailMsg) { this.showError(this.emailInput, this.emailError, emailMsg); isValid = false; }
        const cargoMsg = this.cargoValidator.validate(this.cargoInput);
        if (cargoMsg) { this.showError(this.cargoInput, this.cargoError, cargoMsg); isValid = false; }
        const senhaMsg = this.passwordValidator.validate(this.senhaInput.value);
        if (senhaMsg) { this.showError(this.senhaInput, this.senhaError, senhaMsg); isValid = false; }
        const confirmaValue = this.confirmarInput.value;
        const senhaValue = this.senhaInput.value;

        if (!confirmaValue || confirmaValue === '') {
            this.showError(this.confirmarInput, this.confirmarError, 'Por favor, preencha o campo obrigatório.');
            isValid = false;
        } else if (senhaValue !== confirmaValue) {
            this.showError(this.confirmarInput, this.confirmarError, 'As senhas não coincidem.');
            isValid = false;
        }

        if (isValid) {
            this.successModalManager.setMessage('Funcionário cadastrado com sucesso!');
            this.successModalManager.open();
        }
    }

    showError(input, errorElement, message) {
        input.style.borderColor = "#C94A2C";
        input.style.borderWidth = "2px";
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    hideError(input, errorElement) {
        input.style.borderColor = "#63468C";
        input.style.borderWidth = "1px";
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializePasswordIcons();

    const validators = {
        name: new NameValidator(),
        email: new EmailValidator(),
        cargo: new CargoValidator(),
        password: new PasswordValidator()
    };

    const successModalManager = new ModalManager('popupConfirmacao');

    new RegistrationController(validators, successModalManager);
});