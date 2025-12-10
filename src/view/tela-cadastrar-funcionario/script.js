const STORAGE_KEY = 'usuarioLogado';
const SIDEBAR_TYPE_KEY = 'sidebarType';

function getUsuarioLogado() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error('Erro ao ler dados do usuário logado:', error);
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

function isAdminUser(usuario) {
    return (usuario?.cargo ?? '').toUpperCase() === 'ADMINISTRADOR';
}

function resolveSidebarType(usuarioAtual) {
    const saved = sessionStorage.getItem(SIDEBAR_TYPE_KEY);
    if (saved === 'admin' || saved === 'normal') {
        return saved;
    }

    const derived = isAdminUser(usuarioAtual) ? 'admin' : 'normal';
    sessionStorage.setItem(SIDEBAR_TYPE_KEY, derived);
    return derived;
}

function configureSidebarNavigation(sidebarType) {
    const navConfig = [
        {
            selector: '#listarFuncionarios',
            targets: { admin: 'telaListarFuncionarios', normal: 'telaListarFuncionarios' }
        },
        {
            selector: '#navRede',
            targets: { admin: 'telaRedeApoioAdm', normal: 'telaRedeApoio' }
        },
        {
            selector: '#navInicial',
            targets: { admin: 'telaInicialAdm', normal: 'telaInicial' }
        },
        {
            selector: '#navEstatisticas',
            targets: { admin: 'telaEstatisticasAdm', normal: 'telaEstatisticas' }
        },
        {
            selector: '#navConta',
            targets: { admin: 'telaContaAdm', normal: 'telaConfiguracoesConta' }
        }
    ];

    navConfig.forEach(({ selector, targets }) => {
        const element = document.querySelector(selector);
        if (!element) {
            return;
        }

        element.addEventListener('click', (event) => {
            event.preventDefault();
            const windowName = targets[sidebarType] || targets.admin;
            if (windowName) {
                window.api.openWindow(windowName);
            }
        });
    });
}

function wireCloseButton(destination) {
    const closeButton = document.querySelector('.btn-fechar-pagina');
    if (!closeButton) return;
    closeButton.addEventListener('click', (event) => {
        event.preventDefault();
        window.api.openWindow(destination);
    });
}

function renderAccessDenied() {
    const container = document.querySelector('.form-container');
    if (container) {
        container.innerHTML = `
            <div class="acesso-restrito" style="text-align:center; padding:48px 24px;">
                <h2 style="color:#C94A2C; margin-bottom:16px;">Acesso restrito</h2>
                <p style="color:#5A5A5A; margin-bottom:24px;">Somente administradores podem cadastrar novos funcionários.</p>
                <button type="button" class="botão-cadastrar voltar-dashboard">Voltar para o início</button>
            </div>
        `;
        const voltarBtn = container.querySelector('.voltar-dashboard');
        voltarBtn?.addEventListener('click', () => {
            window.api.openWindow('telaInicial');
        });
    }

    const title = document.querySelector('.title h1');
    if (title) {
        title.textContent = 'Acesso restrito';
    }
}

class NameValidator {
    validate(nome) {
        const valor = nome?.trim() ?? '';
        if (!valor) {
            return 'Por favor, preencha o campo obrigatório.';
        }
        if (valor.length < 3) {
            return 'O nome deve ter pelo menos 3 caracteres.';
        }
        return null;
    }
}

class EmailValidator {
    validate(email) {
        const emailLimpo = email?.trim() ?? '';
        if (!emailLimpo) {
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
        if (!cargoElement || !cargoElement.value) {
            return 'Por favor, preencha o campo obrigatório.';
        }
        return null;
    }
}

class PasswordValidator {
    validate(senha) {
        const senhaLimpa = senha?.trim() ?? '';
        if (!senhaLimpa) {
            return 'Por favor, preencha o campo obrigatório.';
        }

        if (senhaLimpa.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
        if (!/[A-Z]/.test(senhaLimpa)) return 'A senha deve conter pelo menos uma letra maiúscula.';
        if (!/[a-z]/.test(senhaLimpa)) return 'A senha deve conter pelo menos uma letra minúscula.';
        if (!/[^A-Za-z0-9]/.test(senhaLimpa)) return 'A senha deve conter pelo menos um caractere especial.';

        return null;
    }
}

window.togglePassword = function(iconElement) {
    const inputWrapper = iconElement.parentElement;
    const input = inputWrapper?.querySelector('input');

    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
        iconElement.textContent = 'visibility';
    } else {
        input.type = 'password';
        iconElement.textContent = 'visibility_off';
    }
};

function initializePasswordIcons() {
    document.querySelectorAll('.toggle-pass').forEach(icon => {
        icon.textContent = 'visibility_off';
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
        this.modal?.classList.add('visible'); 
    }

    close() {
        this.modal?.classList.remove('visible');
        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
    }
    
    setOnClose(callback) {
        this.onCloseCallback = callback;
    }

    setMessage(message) {
        const messageElement = this.modal?.querySelector('#popupMensagem');
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
        this.formElement = document.querySelector('form');
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
        this.globalError = document.getElementById('formError');
        this.btnCadastrar = document.querySelector('.botão-cadastrar');

        if (!this.btnCadastrar) return;

        this.successModalManager.setOnClose(() => this.resetForm());
        this.init();
    }

    init() {
        this.btnCadastrar.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.handleRegistration();
        });

        this.nomeInput?.addEventListener('input', () => this.hideError(this.nomeInput, this.nomeError));
        this.emailInput?.addEventListener('input', () => this.hideError(this.emailInput, this.emailError));
        this.cargoInput?.addEventListener('change', () => this.hideError(this.cargoInput, this.cargoError));
        this.senhaInput?.addEventListener('input', () => this.hideError(this.senhaInput, this.senhaError));
        this.confirmarInput?.addEventListener('input', () => this.hideError(this.confirmarInput, this.confirmarError));
    }

    resetForm() {
        this.formElement?.reset();
        this.hideError(this.nomeInput, this.nomeError);
        this.hideError(this.emailInput, this.emailError);
        this.hideError(this.cargoInput, this.cargoError);
        this.hideError(this.senhaInput, this.senhaError);
        this.hideError(this.confirmarInput, this.confirmarError);
        this.clearGlobalError();
    }

    setLoading(isLoading) {
        if (!this.btnCadastrar) return;
        this.btnCadastrar.disabled = isLoading;
        this.btnCadastrar.textContent = isLoading ? 'Cadastrando...' : 'Cadastrar Funcionário';
    }

    showGlobalError(message) {
        if (!this.globalError) return;
        this.globalError.textContent = message;
        this.globalError.style.display = message ? 'block' : 'none';
    }

    clearGlobalError() {
        this.showGlobalError('');
    }

    async handleRegistration() {
        let isValid = true;
        this.clearGlobalError();

        const nomeMsg = this.nameValidator.validate(this.nomeInput?.value ?? '');
        if (nomeMsg) { this.showError(this.nomeInput, this.nomeError, nomeMsg); isValid = false; }
        const emailMsg = this.emailValidator.validate(this.emailInput?.value ?? '');
        if (emailMsg) { this.showError(this.emailInput, this.emailError, emailMsg); isValid = false; }
        const cargoMsg = this.cargoValidator.validate(this.cargoInput);
        if (cargoMsg) { this.showError(this.cargoInput, this.cargoError, cargoMsg); isValid = false; }
        const senhaMsg = this.passwordValidator.validate(this.senhaInput?.value ?? '');
        if (senhaMsg) { this.showError(this.senhaInput, this.senhaError, senhaMsg); isValid = false; }
        const confirmaValue = this.confirmarInput?.value ?? '';
        const senhaValue = this.senhaInput?.value ?? '';

        if (!confirmaValue.trim()) {
            this.showError(this.confirmarInput, this.confirmarError, 'Por favor, preencha o campo obrigatório.');
            isValid = false;
        } else if (senhaValue !== confirmaValue) {
            this.showError(this.confirmarInput, this.confirmarError, 'As senhas não coincidem.');
            isValid = false;
        }

        if (!isValid) return;

        const payload = {
            nome: this.nomeInput.value.trim(),
            email: this.emailInput.value.trim(),
            cargo: this.cargoInput.value,
            senha: senhaValue
        };

        this.setLoading(true);
        try {
            const resposta = await window.api.cadastrarFuncionario(payload);
            if (!resposta || !resposta.success) {
                throw new Error(resposta?.error || 'Não foi possível cadastrar o funcionário.');
            }

            this.successModalManager.setMessage('Funcionário cadastrado com sucesso!');
            this.successModalManager.open();
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error);
            const mensagem = error instanceof Error ? error.message : 'Erro inesperado ao cadastrar funcionário.';
            this.showGlobalError(mensagem);
        } finally {
            this.setLoading(false);
        }
    }

    showError(input, errorElement, message) {
        if (!input || !errorElement) return;
        input.style.borderColor = '#C94A2C';
        input.style.borderWidth = '2px';
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    hideError(input, errorElement) {
        if (!input || !errorElement) return;
        input.style.borderColor = '#63468C';
        input.style.borderWidth = '1px';
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    initializePasswordIcons();

    const usuarioAtual = getUsuarioLogado();
    if (!usuarioAtual) {
        await window.api.logout();
        window.api.openWindow('telaLogin');
        return;
    }

    const sidebarType = resolveSidebarType(usuarioAtual);
    configureSidebarNavigation(sidebarType);

    if (!isAdminUser(usuarioAtual)) {
        const destino = sidebarType === 'admin' ? 'telaListarFuncionarios' : 'telaInicial';
        wireCloseButton(destino);
        renderAccessDenied();
        return;
    }

    wireCloseButton('telaListarFuncionarios');

    const validators = {
        name: new NameValidator(),
        email: new EmailValidator(),
        cargo: new CargoValidator(),
        password: new PasswordValidator()
    };

    const successModalManager = new ModalManager('popupConfirmacao');

    new RegistrationController(validators, successModalManager);
});
