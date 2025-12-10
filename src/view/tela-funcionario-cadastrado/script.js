const STORAGE_KEY = 'usuarioLogado';

function getUsuarioLogado() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error('Erro ao recuperar usuário logado:', error);
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

function isAdminUser(usuario) {
    return (usuario?.cargo ?? '').toUpperCase() === 'ADMINISTRADOR';
}

function configurarBotaoCadastro(usuario) {
    const botao = document.querySelector('.btn-assistida');
    if (!botao) return;

    if (!isAdminUser(usuario)) {
        botao.style.display = 'none';
        const coluna = botao.closest('.col-12');
        if (coluna && !coluna.querySelector('.aviso-acesso')) {
            const aviso = document.createElement('p');
            aviso.className = 'aviso-acesso fw-semibold text-danger mt-2';
            aviso.textContent = 'Somente administradores podem cadastrar novos funcionários.';
            coluna.appendChild(aviso);
        }
        inserirAvisoNoTitulo();
        return;
    }

    botao.addEventListener('click', (event) => {
        event.preventDefault();
        window.api.openWindow('telaCadastrarFuncionario');
    });
}

function inserirAvisoNoTitulo() {
    const container = document.querySelector('section.container');
    if (!container || container.querySelector('.alert-acesso')) return;

    const alerta = document.createElement('div');
    alerta.className = 'alert alert-warning alert-acesso text-center mt-3';
    alerta.textContent = 'Você pode visualizar os funcionários cadastrados, mas apenas administradores conseguem incluir novos registros.';

    const titulo = container.querySelector('h2');
    if (titulo && titulo.parentElement) {
        titulo.parentElement.insertBefore(alerta, titulo.nextSibling);
    } else {
        container.prepend(alerta);
    }
}

function manterNavegacaoAtual() {
    const navFuncionarios = document.getElementById('listarFuncionarios');
    navFuncionarios?.addEventListener('click', (event) => {
        event.preventDefault();
        window.api.openWindow('telaListarFuncionarios');
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const usuarioAtual = getUsuarioLogado();
    if (!usuarioAtual) {
        await window.api.logout();
        window.api.openWindow('telaLogin');
        return;
    }

    manterNavegacaoAtual();
    configurarBotaoCadastro(usuarioAtual);
});
