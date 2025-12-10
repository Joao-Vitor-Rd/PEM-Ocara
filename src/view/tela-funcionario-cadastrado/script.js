const STORAGE_KEY = 'usuarioLogado';
const SIDEBAR_TYPE_KEY = 'sidebarType';

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

document.addEventListener('DOMContentLoaded', async () => {
    const usuarioAtual = getUsuarioLogado();
    if (!usuarioAtual) {
        await window.api.logout();
        window.api.openWindow('telaLogin');
        return;
    }

    const sidebarType = resolveSidebarType(usuarioAtual);
    configureSidebarNavigation(sidebarType);
    configurarBotaoCadastro(usuarioAtual);
});
