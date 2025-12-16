/// <reference path="../types/windown.d.ts" />

export {}

/**
 * Renderer para tela de visualização do Cadastro 3
 * Busca dados do banco de dados via query getCaso
 * Armazena em sessionStorage para o script da tela preenchê-los
 */

document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 Tela de Visualização de Cadastro 3 carregada');
    
    try {
        // Obter ID do caso do sessionStorage
        const idCasoStr = sessionStorage.getItem('idCasoVisualizacao');
        if (!idCasoStr) {
            console.error('ID do caso não encontrado em sessionStorage');
            return;
        }
        
        const idCaso = parseInt(idCasoStr);
        console.log('[telaCadastro3Visualizacao] Carregando caso:', idCaso);
        
        // Buscar caso completo do banco (uma única query)
        const resultado = await window.api.getCasoCompletoVisualizacao(idCaso);
        
        if (!resultado.success || !resultado.caso) {
            console.error('Erro ao buscar caso:', resultado.error);
            return;
        }
        
        const casoData = resultado.caso;
        console.log('[telaCadastro3Visualizacao] Dados recebidos:', casoData);
        
        // Armazenar dados de encaminhamento em sessionStorage
        const dadosEncaminhamento = transformarDadosEncaminhamentoParaFormulario(casoData);
        sessionStorage.setItem('dadosEncaminhamento', JSON.stringify(dadosEncaminhamento));
        console.log('[telaCadastro3Visualizacao] Dados armazenados em sessionStorage');
        
    } catch (error) {
        console.error('Erro ao carregar dados da visualização:', error);
    }
});

/**
 * Transforma os dados retornados pela query getCaso
 * para o formato esperado pelo script da tela 3 (Encaminhamento)
 */
function transformarDadosEncaminhamentoParaFormulario(casoData: any): any {
    const dadosEncaminhamento: any = {};
    
    if (casoData.caso) {
        dadosEncaminhamento.anotacoesLivres = casoData.caso.outras_informacoes || '';
    }
    
    return dadosEncaminhamento;
}
