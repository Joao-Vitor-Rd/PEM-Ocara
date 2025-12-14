// Dados mockados para visualização da tela 3
const dadosMockados = {
    anotacoesLivres: `A assistida relatou que sofre violência doméstica há aproximadamente 5 anos. 
    
Últimos episódios ocorreram em novembro/2024, quando o agressor a ameaçou de morte em frente aos filhos.

Encaminhamentos realizados:
- Orientação jurídica sobre medida protetiva
- Suporte psicológico (agendado para próxima semana)
- Encaminhamento para rede de apoio municipal

Observações:
- Assistida demonstra medo constante
- Necessita acompanhamento psicológico urgente
- Família está ciente da situação e oferecendo apoio`
};

document.addEventListener('DOMContentLoaded', function() {
    // Preencher textarea com dados mockados
    const textarea = document.getElementById('outras-informacoes');
    if (textarea) {
        textarea.value = dadosMockados.anotacoesLivres;
    }

    // Navegação entre páginas
    const btnVoltar = document.getElementById('voltar');
    const btnFinalizar = document.getElementById('finalizar');

    // Botão Voltar - volta para tela 2
    if (btnVoltar) {
        btnVoltar.addEventListener('click', function() {
            if (window.api && window.api.openWindow) {
                window.api.openWindow("telaVisualizacao2");
            }
        });
    }

    // Botão Finalizar - volta para tela de informações do caso
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', function() {
            // Volta para a tela de informações do caso
             if (window.api && window.api.openWindow) {
                window.api.openWindow("telaInformacoesCaso");
            }
           
        
        });
    }
});