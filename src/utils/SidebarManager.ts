export function aplicarPermissoesDeAcesso() {
    const sessao = sessionStorage.getItem('usuarioLogado');
    
    if (!sessao) {
        window.api.openWindow('telaLogin');
        return;
    }

    const usuario = JSON.parse(sessao);
    const cargo = usuario.cargo;

    const elInicial = document.getElementById('telalnicial') || document.getElementById('navInicial') || document.getElementById('tela-inicial-btn');
    const elAssistidas = document.getElementById('listarAssistidas') || document.getElementById('navAssistidas') || document.getElementById('tela-assistidas-btn');
    const elRedeApoio = document.getElementById('telaRedeApoio') || document.getElementById('navRede');
    const elEstatisticas = document.getElementById('telaEstatisticas') || document.getElementById('navEstatisticas');
    const elConta = document.getElementById('telaConta') || document.getElementById('navConta'); // Assumindo que existe ID pra conta

    if (cargo === 'ADMINISTRADOR') {
        if (elInicial) elInicial.style.display = 'none';
        if (elAssistidas) elAssistidas.style.display = 'none';
        if (elRedeApoio) elRedeApoio.style.display = 'none';
        if (elEstatisticas) elEstatisticas.style.display = 'block';

        adicionarBotaoCadastroFuncionario();
    }

    else if (cargo === 'ASSISTENTE_SOCIAL') {
        //não lembro se tem que esconder algo dela, amanhã vejo isso
    }

    else if (cargo === 'JURIDICO') {
        if (elInicial) elInicial.style.display = 'none';
        if (elRedeApoio) elRedeApoio.style.display = 'none'; 
        if (elAssistidas) elAssistidas.style.display = 'block'; 
        if (elEstatisticas) elEstatisticas.style.display = 'block';
    }
}

function adicionarBotaoCadastroFuncionario() {
    const sidebarList = document.querySelector('.sidebar-nav ul');
    
    if (sidebarList && !document.getElementById('btn-novo-funcionario')) {
        const li = document.createElement('li');
        li.id = 'btn-novo-funcionario';
        li.innerHTML = `
            <a href="#" style="color: #ff9900;">
                <span class="material-symbols-outlined">person_add</span>
                <span>Novo Funcionário</span>
            </a>
        `;
        li.addEventListener('click', () => {
            window.api.openWindow('register');
        });
        sidebarList.appendChild(li);
    }
}

document.addEventListener('DOMContentLoaded', aplicarPermissoesDeAcesso);