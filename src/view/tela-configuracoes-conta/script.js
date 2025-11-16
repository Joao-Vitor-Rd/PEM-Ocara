
function setupModal(modalId, triggerId) {
    const modal = document.getElementById(modalId);
    const trigger = document.getElementById(triggerId);
    const closeBtn = modal.querySelector('.modal-close');

    trigger.addEventListener('click', () => {
        modal.classList.add('visible');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('visible');
    });

    window.addEventListener('click', (evento) => {
        if (evento.target === modal) {
            modal.classList.remove('visible');
        }
    });
}

setupModal('modalNome', 'itemNome');
setupModal('modalCargo', 'itemCargo');
setupModal('modalEmail', 'itemEmail');
setupModal('modalSenha', 'itemSenha');

window.addEventListener('click', (evento) => {
    if (evento.target === modalNome) {
        modalNome.classList.remove('visible');
    }
    if (evento.target === modalCargo) {
        modalCargo.classList.remove('visible');
    }
});
