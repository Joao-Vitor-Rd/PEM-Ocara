export function ativarNavegacao() {
    const rotas: { [key: string]: string } = {
        'listarAssistidas': 'telaListarAssistidas',
        'navAssistidas': 'telaListarAssistidas',
        'tela-assistidas-btn': 'telaListarAssistidas',
        
        'telaRedeApoio': 'telaRedeApoio',
        'navRede': 'telaRedeApoio',
        
        'telalnicial': 'telaInicial',
        'navInicial': 'telaInicial',
        'tela-inicial-btn': 'telaInicial',
        
        'telaEstatisticas': 'telaEstatisticas',
        'navEstatisticas': 'telaEstatisticas',
        
        'telaConta': 'telaConfiguracoesConta',
        'navConta': 'telaConfiguracoesConta',

        'logoutButton': 'logout'
    };

    for (const [id, rota] of Object.entries(rotas)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (rota === 'logout') {
                    fazerLogout();
                } else {
                    window.api.openWindow(rota);
                }
            });
        }
    }
}

function fazerLogout() {
    sessionStorage.clear();
    window.api.openWindow('telaLogin');
}