/// <reference path="../types/windown.d.ts" />

export {}

/**
 * Renderer para tela de visualização do Cadastro 1
 * Busca dados do banco de dados via query getCaso
 * Armazena em sessionStorage para o script da tela preenchê-los
 */

document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 Tela de Visualização de Cadastro 1 carregada');
    
    try {
        // Obter ID do caso do sessionStorage
        const idCasoStr = sessionStorage.getItem('idCasoVisualizacao');
        if (!idCasoStr) {
            console.error('ID do caso não encontrado em sessionStorage');
            return;
        }
        
        const idCaso = parseInt(idCasoStr);
        console.log('[telaCadastro1Visualizacao] Carregando caso:', idCaso);
        
        // Buscar caso completo do banco (uma única query)
        const resultado = await window.api.getCasoCompletoVisualizacao(idCaso);
        
        if (!resultado.success || !resultado.caso) {
            console.error('Erro ao buscar caso:', resultado.error);
            return;
        }
        
        const casoData = resultado.caso;
        console.log('[telaCadastro1Visualizacao] Dados recebidos:', casoData);
        
        // Transformar dados da query para o formato esperado pela tela
        const dadosAssistida = transformarDadosAssistidaParaFormulario(casoData);
        
        // Armazenar em sessionStorage para o script da tela preenchê-los
        sessionStorage.setItem('dadosAssistida', JSON.stringify(dadosAssistida));
        console.log('[telaCadastro1Visualizacao] Dados armazenados em sessionStorage');
        
    } catch (error) {
        console.error('Erro ao carregar dados da visualização:', error);
    }
});

/**
 * Transforma os dados retornados pela query getCaso
 * para o formato esperado pelo script da tela 1 (Assistida)
 */
function transformarDadosAssistidaParaFormulario(casoData: any): any {
    const dadosAssistida: any = {};
    
    if (casoData.assistida) {
        const a = casoData.assistida;
        dadosAssistida.nomeCompleto = a.nome || '';
        dadosAssistida.idade = a.idade || 0;
        dadosAssistida.endereco = a.endereco || '';
        dadosAssistida.identidadeGenero = a.identidadegenero || '';
        dadosAssistida.nomeSocial = a.n_social || '';
        dadosAssistida.escolaridade = a.escolaridade || '';
        dadosAssistida.religiao = a.religiao || '';
        dadosAssistida.nacionalidade = a.nacionalidade || '';
        dadosAssistida.zonaHabitacao = a.zona || '';
        dadosAssistida.profissao = a.ocupacao || '';
        dadosAssistida.numeroCadastro = a.cad_social || '';
        dadosAssistida.dependentes = a.dependentes || 0;
    }
    
    return dadosAssistida;
}
