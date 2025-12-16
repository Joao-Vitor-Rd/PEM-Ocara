/// <reference path="../types/windown.d.ts" />

export {}

/**
 * Renderer para tela de visualização do Cadastro 2
 * Busca dados do banco de dados via query getCaso
 * Armazena em sessionStorage para o script da tela preenchê-los
 */

async function carregarDados() {
    console.log('[telaCadastro2Visualizacao] Iniciando carregamento de dados...');
    
    try {
        // Obter ID do caso do sessionStorage
        const idCasoStr = sessionStorage.getItem('idCasoVisualizacao');
        console.log('[telaCadastro2Visualizacao] idCasoVisualizacao:', idCasoStr);
        
        if (!idCasoStr) {
            console.error('[telaCadastro2Visualizacao] ID do caso não encontrado em sessionStorage');
            return;
        }
        
        const idCaso = parseInt(idCasoStr);
        console.log('[telaCadastro2Visualizacao] Chamando API para caso:', idCaso);
        
        // Buscar caso completo do banco (uma única query)
        const resultado = await window.api.getCasoCompletoVisualizacao(idCaso);
        console.log('[telaCadastro2Visualizacao] Resposta API:', resultado);
        
        if (!resultado.success || !resultado.caso) {
            console.error('[telaCadastro2Visualizacao] Erro ao buscar caso:', resultado.error);
            return;
        }
        
        const casoData = resultado.caso;
        console.log('[telaCadastro2Visualizacao] Dados recebidos:', casoData);
        
        // Transformar dados da query para o formato esperado pela tela
        const dadosCaso = transformarDadosParaFormulario(casoData);
        console.log('[telaCadastro2Visualizacao] Dados transformados:', dadosCaso);
        
        // Armazenar em sessionStorage para o script da tela preenchê-los
        sessionStorage.setItem('dadosCaso', JSON.stringify(dadosCaso));
        console.log('[telaCadastro2Visualizacao] ✓ Dados armazenados em sessionStorage');
        
        // Disparar evento customizado para notificar que dados estão prontos
        window.dispatchEvent(new CustomEvent('dadosCasoCarregados', { detail: dadosCaso }));
        console.log('[telaCadastro2Visualizacao] ✓ Evento disparado');
        
    } catch (error) {
        console.error('[telaCadastro2Visualizacao] Erro ao carregar dados:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[telaCadastro2Visualizacao] DOMContentLoaded acionado');
    await carregarDados();
});

// Carregar dados imediatamente, não esperar por DOMContentLoaded
carregarDados();

/**
 * Transforma os dados retornados pela query getCaso
 * para o formato esperado pelo script da tela
 */
function transformarDadosParaFormulario(casoData: any): any {
    // Estrutura esperada pelo telaCadastro2Renderer.ts
    const dadosCaso: any = {};
    
    // Assistida
    if (casoData.assistida) {
        dadosCaso.possuiDeficienciaDoenca = casoData.assistida.limitacao || 'Não';
        dadosCaso.corRaca = casoData.assistida.cor_raca || '';
    }
    
    // Caso (informações gerais)
    if (casoData.caso) {
        dadosCaso._moraEmAreaRisco = casoData.caso.q20_mora_risco;
        dadosCaso._dependenteFinanceira = casoData.caso.q21_depen_finc;
        dadosCaso._abrigamentoTemporario = casoData.caso.q22_abrigo;
        dadosCaso.separacaoRecente = casoData.caso.q15_separacao;
        dadosCaso.novoRelacionamentoAumentouAgressao = casoData.caso.q17_novo_relac === 'Sim';
    }
    
    // Agressor
    if (casoData.agressor) {
        dadosCaso.nomeAgressor = casoData.agressor.nome || '';
        dadosCaso.idadeAgresssor = casoData.agressor.idade || 0;
        dadosCaso.vinculoAssistida = casoData.agressor.vinculo || '';
        dadosCaso._doencaMental = casoData.agressor.q9_doenca;
        dadosCaso._descumpriuMedida = casoData.agressor.q10_medida_protetiva ? 'Sim' : 'Não';
        dadosCaso._tentativaSuicidio = casoData.agressor.q11_suicidio ? 'Sim' : 'Não';
        dadosCaso._desempregadoDificuldades = casoData.agressor.q12_financeiro;
        dadosCaso._acessoArmas = casoData.agressor.q13_arma_de_fogo;
    }
    
    // Questões (Q1-Q22)
    if (casoData.questoes) {
        const q = casoData.questoes;
        
        // Q1-Q5: Violência
        dadosCaso._ameacas = q.q1_ameacas_violencia || [];
        dadosCaso._agressoesGraves = q.q2_agressoes_violencia || [];
        dadosCaso._outrasAgressoes = q.q3_tipos_violencia || [];
        dadosCaso._estupro = q.q4_estupro ? 'Sim' : 'Não';
        dadosCaso._comportamentos = q.q5_comportamentos || [];
        
        // Q6-Q8: Medida e Frequência
        // Q6 e Q7 são booleanos no banco, converter para Sim/Não
        dadosCaso._boMedida = q.q6_medida ? 'Sim' : 'Não';
        dadosCaso._frequenciaAumento = q.q7_frequencia ? 'Sim' : 'Não';
        dadosCaso._usoDrogas = q.q8_substancias || [];
        
        // Q10, Q14: Medida Protetiva e Ameaças
        dadosCaso._ameacouAgrediu = q.q14_ameacas_agressor || [];
        
        // Q16: Filhos
        if (q.q16_filhos) {
            const filhos = q.q16_filhos;
            if (filhos.q16a_com_agressor > 0) {
                dadosCaso._temFilhosIds = ['q16-tem-filhos-sim-agressor'];
                dadosCaso._q16QuantosAgressor = filhos.q16a_com_agressor;
            }
            if (filhos.q16o_outro_relacionamento > 0) {
                if (!dadosCaso._temFilhosIds) dadosCaso._temFilhosIds = [];
                dadosCaso._temFilhosIds.push('q16-tem-filhos-sim-outro');
                dadosCaso._q16QuantosOutro = filhos.q16o_outro_relacionamento;
            }
            dadosCaso._q16FaixaEtariaIds = filhos.q16p1_faixa_etaria || [];
            dadosCaso._q16Deficiencia = filhos.q16p2_com_deficiencia;
            dadosCaso._q16ConflitosIds = filhos.q16p3_conflitos || [];
            dadosCaso._q16Presenciaram = filhos.q16p4_viu_violencia ? 'Sim' : 'Não';
            dadosCaso._q16ViolenciaGravidez = filhos.q16p5_violencia_gravidez ? 'Sim' : 'Não';
        }
    }
    
    return dadosCaso;
}
