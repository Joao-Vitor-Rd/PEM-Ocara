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
        this.errorDisplay = this.modal.querySelector('#senhaError');

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
            if (input.type === 'text' || input.type === 'password') {
                input.value = '';
            }
        });

        if (this.errorDisplay) {
            this.errorDisplay.textContent = '';
            this.errorDisplay.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const passwordValidator = new PasswordValidator();

    new ModalManager('modalNome', 'itemNome');
    new ModalManager('modalCargo', 'itemCargo');
    new ModalManager('modalEmail', 'itemEmail');

    const passwordModalManager = new ModalManager('modalSenha', 'itemSenha');

    const icons = document.querySelectorAll('.password-toggle-icon');
    icons.forEach(icon => {
        icon.textContent = "visibility";
        icon.classList.add('material-symbols-outlined');
    });

    const modalSenha = document.getElementById('modalSenha');

    if (modalSenha) {
        const btnAtualizarSenha = modalSenha.querySelector('.btn-atualizar');
        const senhaAtualInput = document.getElementById('senhaAtual');
        const novaSenhaInput = document.getElementById('novaSenha');
        const confirmarSenhaInput = document.getElementById('confirmarSenha');
        const senhaError = document.getElementById('senhaError');

        btnAtualizarSenha.addEventListener('click', () => {

            const senhaAtual = senhaAtualInput.value;
            const novaSenha = novaSenhaInput.value;
            const confirmarSenha = confirmarSenhaInput.value;
            senhaError.textContent = '';
            senhaError.style.display = 'none';
            const errorMessage = passwordValidator.validate(senhaAtual, novaSenha, confirmarSenha);

            if (errorMessage) {
                senhaError.textContent = errorMessage;
                senhaError.style.display = 'block';
                return;
            }
            alert('Senha atualizada com sucesso! (Isso é uma simulação)');

            novaSenhaInput.value = '';
            confirmarSenhaInput.value = '';

            passwordModalManager.close();
        });
    }

});