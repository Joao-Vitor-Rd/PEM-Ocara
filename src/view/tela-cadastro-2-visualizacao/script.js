// ========================================
// SCRIPT DE VISUALIZAÇÃO - TELA 2
// Avaliação de Risco (SOMENTE LEITURA)
// ========================================

const dadosMockados = {
    nomeAgressor: "João Pedro Oliveira",
    idadeAgressor: 38,
    vinculo: "Ex-companheiro",
    dataFato: "2024-11-15",
    q01Ameacas: ["FACA", "OUTRA"],
    q02AgressoesFisicas: ["ENFORCAMENTO", "SUFOCAMENTO"],
    q03OutrasAgressoes: ["SOCOS", "CHUTES", "TAPAS"],
    q04Estupro: "Não",
    q05Comportamentos: ["FRASE_NINGUEM", "PERSEGUIU", "CIUME_EXCESSIVO"],
    q06BoMedida: "Sim",
    q07FrequenciaAumento: "Sim",
    q08UsoAbusivo: ["ALCOOL"],
    q09DoencaMental: "NAO",
    q10DescumpriuMedida: "Não",
    q11TentativaSuicidio: "Não",
    q12Desempregado: "Sim",
    q13AcessoArmas: "Não-sei",
    q14AmeacouOutros: ["FILHOS", "FAMILIARES"],
    q15Separacao: "Sim",
    q16TemFilhos: true,
    q16FilhosAgressor: 2,
    q16FilhosOutro: 0,
    q16_1FaixaEtaria: ["0-11", "12-17"],
    q16_2Deficiencia: "Não",
    q16_3Conflito: ["PENSAO"],
    q16_4PresenciaramViolencia: "Sim",
    q16_5ViolenciaGravidez: "Sim",
    q17NovoRelacionamento: "Não",
    q18Deficiencia: "Não",
    q19CorRaca: "Parda",
    q20LocalRisco: "Sim",
    q21DependenteFinanceira: "Sim",
    q22Abrigamento: "Não"
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Tela de Visualização 2 carregada');
    
    // ========================================
    // PREENCHER CAMPOS
    // ========================================
    
    // Campos de texto básicos
    document.getElementById('nome-completo-agressor').value = dadosMockados.nomeAgressor;
    document.getElementById('idade').value = dadosMockados.idadeAgressor;
    document.getElementById('vinculo').value = dadosMockados.vinculo;
    document.getElementById('data-fato').value = dadosMockados.dataFato;

    // Funções helper
    function marcarCheckboxes(ids, valores) {
        valores.forEach(valor => {
            ids.forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox && checkbox.value === valor) {
                    checkbox.checked = true;
                }
            });
        });
    }

    function marcarRadio(name, valor) {
        const radios = document.querySelectorAll(`input[name="${name}"]`);
        radios.forEach(radio => {
            if (radio.value === valor) {
                radio.checked = true;
            }
        });
    }

    // Preencher todos os campos do formulário
    marcarCheckboxes(['q01-ameaca-arma', 'q01-ameaca-faca', 'q01-ameaca-outra', 'q01-ameaca-nao'], dadosMockados.q01Ameacas);
    marcarCheckboxes(['q02-agressao-queimadura', 'q02-agressao-enforcamento', 'q02-agressao-sufocamento', 'q02-agressao-tiro', 'q02-agressao-afogamento', 'q02-agressao-facada', 'q02-agressao-paulada', 'q02-agressao-nenhuma'], dadosMockados.q02AgressoesFisicas);
    marcarCheckboxes(['q03-agressao-socos', 'q03-agressao-chutes', 'q03-agressao-tapas', 'q03-agressao-empurroes', 'q03-agressao-puxoes-cabelo', 'q03-agressao-nenhuma'], dadosMockados.q03OutrasAgressoes);
    marcarRadio('q04-estupro', dadosMockados.q04Estupro);
    marcarCheckboxes(['q05-comportamento-frase-possessiva', 'q05-comportamento-perseguicao', 'q05-comportamento-proibiu-visitas', 'q05-comportamento-proibiu-trabalhar', 'q05-comportamento-contato-insistente', 'q05-comportamento-impediu-acesso-bens', 'q05-comportamento-ciumes-controle', 'q05-comportamento-nenhum'], dadosMockados.q05Comportamentos);
    marcarRadio('q06-bo-medida', dadosMockados.q06BoMedida);
    marcarRadio('q07-frequencia-aumento', dadosMockados.q07FrequenciaAumento);
    marcarCheckboxes(['q08-uso-abusivo-alcool', 'q08-uso-abusivo-drogas', 'q08-uso-abusivo-nao', 'q08-uso-abusivo-nao-sei'], dadosMockados.q08UsoAbusivo);
    marcarRadio('q09-doenca-mental', dadosMockados.q09DoencaMental);
    marcarRadio('q10-descumpriu-medida', dadosMockados.q10DescumpriuMedida);
    marcarRadio('q11-tentativa-suicidio', dadosMockados.q11TentativaSuicidio);
    marcarRadio('q12-desempregado-dificuldades', dadosMockados.q12Desempregado);
    marcarRadio('q13-acesso-armas', dadosMockados.q13AcessoArmas);
    marcarCheckboxes(['q14-ameacou-agrediu-filhos', 'q14-ameacou-agrediu-familiares', 'q14-ameacou-agrediu-outras-pessoas', 'q14-ameacou-agrediu-animais', 'q14-ameacou-agrediu-nao', 'q14-ameacou-agrediu-nao-sei'], dadosMockados.q14AmeacouOutros);
    marcarRadio('q15-separacao', dadosMockados.q15Separacao);
    
    // Q16 - Filhos (lógica especial)
    if (dadosMockados.q16TemFilhos) {
        if (dadosMockados.q16FilhosAgressor > 0) {
            const checkAgressor = document.getElementById('q16-tem-filhos-sim-agressor');
            if (checkAgressor) checkAgressor.checked = true;
            const inputQuantos = document.getElementById('q16-quantos-agressor');
            if (inputQuantos) inputQuantos.value = dadosMockados.q16FilhosAgressor;
        }
        if (dadosMockados.q16FilhosOutro > 0) {
            const checkOutro = document.getElementById('q16-tem-filhos-sim-outro');
            if (checkOutro) checkOutro.checked = true;
            const inputQuantos = document.getElementById('q16-quantos-outro');
            if (inputQuantos) inputQuantos.value = dadosMockados.q16FilhosOutro;
        }
        const secaoFilhos = document.getElementById('se-tem-filhos');
        if (secaoFilhos) secaoFilhos.style.display = 'flex';
    } else {
        const checkNao = document.getElementById('q16-tem-filhos-nao');
        if (checkNao) checkNao.checked = true;
    }
    
    marcarCheckboxes(['q16-1-faixa-etaria-0-11', 'q16-1-faixa-etaria-12-17', 'q16-1-faixa-etaria-18-mais'], dadosMockados.q16_1FaixaEtaria);
    marcarRadio('q16-2-deficiencia', dadosMockados.q16_2Deficiencia);
    marcarCheckboxes(['q16-3-conflito-guarda', 'q16-3-conflito-visitas', 'q16-3-conflito-pensao', 'q16-3-conflito-nao'], dadosMockados.q16_3Conflito);
    marcarRadio('q16-4-presenciaram-violencia', dadosMockados.q16_4PresenciaramViolencia);
    marcarRadio('q16-5-violencia-gravidez', dadosMockados.q16_5ViolenciaGravidez);
    marcarRadio('q17-novo-relacionamento', dadosMockados.q17NovoRelacionamento);
    marcarRadio('q18-deficiencia', dadosMockados.q18Deficiencia);
    marcarRadio('cor', dadosMockados.q19CorRaca);
    marcarRadio('q20-local-risco', dadosMockados.q20LocalRisco);
    marcarRadio('q21-dependente-financeira', dadosMockados.q21DependenteFinanceira);
    marcarRadio('q22-abrigamento', dadosMockados.q22Abrigamento);

    console.log(' Campos preenchidos com sucesso!');

    // ========================================
    // NAVEGAÇÃO
    // ========================================
    
    const btnVoltar = document.getElementById('voltar');
    const btnProximo = document.getElementById('proximo');

    // Botão Voltar
    if (btnVoltar) {
        btnVoltar.addEventListener('click', function() {
            console.log('⬅️ Voltando para Tela 1');
            if (window.api && window.api.openWindow) {
                window.api.openWindow("telaVisualizacao1");
            } else {
                window.history.back();
            }
        });
    }

    // Botão Próximo
    if (btnProximo) {
        btnProximo.addEventListener('click', function() {
            console.log('➡️ Indo para Tela 3');
            if (window.api && window.api.openWindow) {
                window.api.openWindow("telaVisualizacao3");
            } else {
                console.warn('window.api não disponível');
            }
        });
    }
});

console.log('Script de visualização 2 carregado!');