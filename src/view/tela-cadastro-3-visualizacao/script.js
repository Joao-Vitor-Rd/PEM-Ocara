// Script de visualização da tela 3 - Encaminhamento

function preencherCampos() {
    console.log('[tela-3-script] 📄 Preenchendo campos...');
    
    // Obter dados do sessionStorage
    let dadosEncaminhamento = {};
    const dadosEncaminhamentoJSON = sessionStorage.getItem('dadosEncaminhamento');
    
    console.log('[tela-3-script] 🔍 Procurando dadosEncaminhamento no sessionStorage...');
    console.log('[tela-3-script] dadosEncaminhamentoJSON:', dadosEncaminhamentoJSON ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
    
    if (dadosEncaminhamentoJSON) {
        try {
            dadosEncaminhamento = JSON.parse(dadosEncaminhamentoJSON);
            console.log('[tela-3-script] ✅ Dados carregados:', dadosEncaminhamento);
        } catch (error) {
            console.error('[tela-3-script] ❌ Erro ao fazer parse:', error);
        }
    } else {
        console.warn('[tela-3-script] ⚠️  Nenhum dado em sessionStorage');
    }
    
    // Preencher textarea com dados do sessionStorage
    const textarea = document.getElementById('outras-informacoes');
    console.log('[tela-3-script] 🔍 textarea encontrado?', !!textarea);
    
    if (textarea) {
        if (dadosEncaminhamento.anotacoesLivres) {
            textarea.value = dadosEncaminhamento.anotacoesLivres;
            console.log('[tela-3-script] ✓ Textarea preenchida com:', dadosEncaminhamento.anotacoesLivres);
        } else {
            textarea.value = '';
            console.log('[tela-3-script] ⚠️  anotacoesLivres está vazia');
        }
    } else {
        console.warn('[tela-3-script] ⚠️  Campo outras-informacoes não encontrado no HTML');
    }
    
    console.log('[tela-3-script] ✅ Campos preenchidos com sucesso!');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('[tela-3-script] 📄 DOMContentLoaded');
    
    preencherCampos();

    // Navegação entre páginas
    const btnVoltar = document.getElementById('voltar');
    const btnFinalizar = document.getElementById('finalizar');

    // Botão Voltar - volta para tela 2
    if (btnVoltar) {
        btnVoltar.addEventListener('click', function() {
            console.log('[tela-3-script] ⬅️  Voltando para Tela 2');
            if (window.api && window.api.openWindow) {
                window.api.openWindow("telaVisualizacao2");
            } else {
                console.warn('[tela-3-script] ⚠️  window.api não disponível');
                window.history.back();
            }
        });
    } else {
        console.warn('[tela-3-script] ⚠️  Botão voltar não encontrado');
    }

    // Botão Finalizar - volta para tela de informações do caso
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', function() {
            console.log('[tela-3-script] ✓ Finalizando visualização');
            
            // Preservar ID do caso antes de limpar
            const idCaso = sessionStorage.getItem('idCasoVisualizacao');
            console.log('[tela-3-script] 📍 ID do caso a preservar:', idCaso);
            
            // Limpar dados de visualização
            sessionStorage.removeItem('dadosCaso');
            sessionStorage.removeItem('dadosAssistida');
            sessionStorage.removeItem('dadosEncaminhamento');
            sessionStorage.removeItem('idCasoVisualizacao');
            console.log('[tela-3-script] 🗑️  Dados de visualização limpos');
            
            // Restaurar ID para telaInformacoesCaso
            if (idCaso) {
                sessionStorage.setItem('idCasoAtual', idCaso);
                console.log('[tela-3-script] 📍 ID do caso preservado em idCasoAtual:', idCaso);
            }
            
            // Volta para a tela de informações do caso
            if (window.api && window.api.openWindow) {
                console.log('[tela-3-script] 🪟 Abrindo telaInformacoesCaso');
                window.api.openWindow("telaInformacoesCaso");
            } else {
                console.warn('[tela-3-script] ⚠️  window.api não disponível');
                window.history.back();
            }
        });
    } else {
        console.warn('[tela-3-script] ⚠️  Botão finalizar não encontrado');
    }
});

console.log('[tela-3-script] ✅ Script carregado!');