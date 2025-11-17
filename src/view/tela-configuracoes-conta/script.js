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

function setupModal(modalId, triggerId) {
    const modal = document.getElementById(modalId);
    const trigger = document.getElementById(triggerId);

    if (!modal || !trigger) {
        console.warn(`Modal ou Gatilho não encontrado: ${modalId}, ${triggerId}`);
        return;
    }

    const closeBtn = modal.querySelector('.modal-close');

    if (!closeBtn) {
        console.warn(`Botão de fechar não encontrado no modal: ${modalId}`);
        return;
    }

    const closeModal = () => {
        modal.classList.remove('visible');

        if (modalId === 'modalSenha') {
            const novaSenhaInput = modal.querySelector('#novaSenha');
            const confirmarSenhaInput = modal.querySelector('#confirmarSenha');
            const senhaError = modal.querySelector('#senhaError');

            if (novaSenhaInput) novaSenhaInput.value = '';
            if (confirmarSenhaInput) confirmarSenhaInput.value = '';
            
            if (senhaError) {
                senhaError.textContent = '';
                senhaError.style.display = 'none';
            }
        }
    };

    trigger.addEventListener('click', () => {
        modal.classList.add('visible');
    });

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (evento) => {
        if (evento.target === modal) {
            closeModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {

    setupModal('modalNome', 'itemNome');
    setupModal('modalCargo', 'itemCargo');
    setupModal('modalEmail', 'itemEmail');
    setupModal('modalSenha', 'itemSenha');

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

            if (senhaAtual === '' || novaSenha === '' || confirmarSenha === '') {
                senhaError.textContent = 'Por favor, preencha todos os campos.';
                senhaError.style.display = 'block';
                return;
            }

            if (novaSenha.length < 8) {
                senhaError.textContent = 'A nova senha deve ter pelo menos 8 caracteres.';
                senhaError.style.display = 'block';
                return;
            }
            
            if (!/[A-Z]/.test(novaSenha)) {
                senhaError.textContent = 'A nova senha deve conter pelo menos uma letra maiúscula.';
                senhaError.style.display = 'block';
                return;
            }
            
            if (!/[a-z]/.test(novaSenha)) {
                senhaError.textContent = 'A nova senha deve conter pelo menos uma letra minúscula.';
                senhaError.style.display = 'block';
                return;
            }

            if (!/[^A-Za-z0-9]/.test(novaSenha)) {
                senhaError.textContent = 'A nova senha deve conter pelo menos um caractere especial (ex: !@#$%).';
                senhaError.style.display = 'block';
                return;
            }

            if (novaSenha !== confirmarSenha) {
                senhaError.textContent = 'As senhas não coincidem. Tente novamente.';
                senhaError.style.display = 'block';
                return;
            }

            alert('Senha atualizada com sucesso! (Isso é uma simulação)');

            novaSenhaInput.value = '';
            confirmarSenhaInput.value = '';
            
            modalSenha.classList.remove('visible');
        });
    }

});