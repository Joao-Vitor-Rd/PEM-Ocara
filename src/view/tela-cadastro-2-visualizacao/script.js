// ========================================
// SCRIPT DE VISUALIZAÇÃO - TELA 2
// Avaliação de Risco (SOMENTE LEITURA)
// ========================================

function preencherCampos() {
    console.log('[tela-2-script] 📄 DOMContentLoaded - Preenchendo campos...');
    
    // Obter dados do sessionStorage
    let dadosCaso = {};
    const dadosCasoJSON = sessionStorage.getItem('dadosCaso');
    
    console.log('[tela-2-script] 🔍 Procurando dadosCaso no sessionStorage...');
    console.log('[tela-2-script] dadosCasoJSON:', dadosCasoJSON ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
    
    if (dadosCasoJSON) {
        try {
            dadosCaso = JSON.parse(dadosCasoJSON);
            console.log('[tela-2-script] ✅ Dados carregados:', dadosCaso);
        } catch (error) {
            console.error('[tela-2-script] ❌ Erro ao fazer parse:', error);
            return;
        }
    } else {
        console.warn('[tela-2-script] ⚠️  Nenhum dado em sessionStorage');
    }
    
    // Funções helper
    function marcarCheckboxes(ids, valores) {
        if (!valores || valores.length === 0) {
            console.log('[tela-2-script] marcarCheckboxes - valores vazio');
            return;
        }
        console.log('[tela-2-script] marcarCheckboxes:', ids, '=', valores);
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
        if (!valor && valor !== false && valor !== 0) {
            console.log('[tela-2-script] marcarRadio - valor vazio para', name);
            return;
        }
        
        let valorConvertido = valor;
        
        // CASOS ESPECIAIS POR QUESTÃO
        if (name === 'q04-estupro') {
            // Q4: valores simples Sim/Não (boolean true/false)
            if (typeof valor === 'boolean') {
                valorConvertido = valor ? 'Sim' : 'Não';
            } else if (valor === 'SIM' || valor === 'Sim') {
                valorConvertido = 'Sim';
            } else if (valor === 'NAO' || valor === 'Não') {
                valorConvertido = 'Não';
            }
            console.log('[tela-2-script] Q4 ESPECIAL (boolean):', valor, '→', valorConvertido);
        } else if (name === 'q09-doenca-mental') {
            // Q9: valores podem ser SIM_MEDICACAO, SIM_SEM_MEDICACAO, NAO, NAO_SEI
            if (valor === 'NAO_SEI' || valor === 'NAO-SEI') {
                valorConvertido = 'NAO_SEI';
            } else if (valor === 'NAO' || valor === 'Não' || valor === false) {
                valorConvertido = 'NAO';
            } else if (typeof valor === 'string') {
                valorConvertido = valor; // Manter como está
            }
            console.log('[tela-2-script] Q9 ESPECIAL:', valor, '→', valorConvertido);
        } else if (name === 'q10-descumpriu-medida') {
            // Q10: valores simples Sim/Não (boolean true/false)
            if (typeof valor === 'boolean') {
                valorConvertido = valor ? 'Sim' : 'Não';
            } else if (valor === 'SIM' || valor === 'Sim') {
                valorConvertido = 'Sim';
            } else if (valor === 'NAO' || valor === 'Não') {
                valorConvertido = 'Não';
            }
            console.log('[tela-2-script] Q10 ESPECIAL (boolean):', valor, '→', valorConvertido);
        } else if (name === 'q11-tentativa-suicidio') {
            // Q11: valores simples Sim/Não (boolean true/false)
            if (typeof valor === 'boolean') {
                valorConvertido = valor ? 'Sim' : 'Não';
            } else if (valor === 'SIM' || valor === 'Sim') {
                valorConvertido = 'Sim';
            } else if (valor === 'NAO' || valor === 'Não') {
                valorConvertido = 'Não';
            }
            console.log('[tela-2-script] Q11 ESPECIAL (boolean):', valor, '→', valorConvertido);
        } else if (name === 'q12-desempregado-dificuldades') {
            // Q12: valores podem ser NAO-SEI (com hífen), SIM, NAO
            if (valor === 'NAO-SEI' || valor === 'NAO_SEI') {
                valorConvertido = 'Não-sei';
            } else if (valor === 'SIM' || valor === 'Sim') {
                valorConvertido = 'Sim';
            } else if (valor === 'NAO' || valor === 'Não') {
                valorConvertido = 'Não';
            }
            console.log('[tela-2-script] Q12 ESPECIAL:', valor, '→', valorConvertido);
        } else if (name === 'q13-acesso-armas') {
            // Q13: valores podem ser NAO-SEI (com hífen), SIM, NAO
            if (valor === 'NAO-SEI' || valor === 'NAO_SEI') {
                valorConvertido = 'Não-sei';
            } else if (valor === 'SIM' || valor === 'Sim') {
                valorConvertido = 'Sim';
            } else if (valor === 'NAO' || valor === 'Não') {
                valorConvertido = 'Não';
            }
            console.log('[tela-2-script] Q13 ESPECIAL:', valor, '→', valorConvertido);
        } else if (name === 'q21-dependente-financeira') {
            // Q21: valores simples Sim/Não (boolean true/false)
            if (typeof valor === 'boolean') {
                valorConvertido = valor ? 'Sim' : 'Não';
            } else if (valor === 'SIM' || valor === 'Sim') {
                valorConvertido = 'Sim';
            } else if (valor === 'NAO' || valor === 'Não') {
                valorConvertido = 'Não';
            }
            console.log('[tela-2-script] Q21 ESPECIAL (boolean):', valor, '→', valorConvertido);
        } else if (name === 'q22-abrigamento') {
            // Q22: valores simples Sim/Não (boolean true/false)
            if (typeof valor === 'boolean') {
                valorConvertido = valor ? 'Sim' : 'Não';
            } else if (valor === 'SIM' || valor === 'Sim') {
                valorConvertido = 'Sim';
            } else if (valor === 'NAO' || valor === 'Não') {
                valorConvertido = 'Não';
            }
            console.log('[tela-2-script] Q22 ESPECIAL (boolean):', valor, '→', valorConvertido);
        } else {
            // Padrão para outras questões
            if (typeof valor === 'boolean') {
                valorConvertido = valor ? 'Sim' : 'Não';
            } else if (typeof valor === 'string') {
                const upper = valor.toUpperCase();
                if (upper === 'SIM') valorConvertido = 'Sim';
                else if (upper === 'NAO') valorConvertido = 'Não';
            }
        }
        
        console.log('[tela-2-script] 🔍 Procurando radio name:', name, '- value procurado:', valorConvertido);
        const radios = document.querySelectorAll(`input[name="${name}"]`);
        
        if (radios.length === 0) {
            console.warn('[tela-2-script] ⚠️  ERRO: Nenhum radio encontrado para name:', name);
            return;
        }
        
        console.log('[tela-2-script] 📊 Total de radios encontrados:', radios.length);
        
        let encontrou = false;
        radios.forEach((radio, index) => {
            console.log('[tela-2-script]   [' + index + '] radio.value="' + radio.value + '"');
            if (radio.value === valorConvertido) {
                radio.checked = true;
                console.log('[tela-2-script] ✅ MARCADO:', name, '= "' + valorConvertido + '"');
                encontrou = true;
            }
        });
        
        if (!encontrou) {
            console.warn('[tela-2-script] ❌ ERRO: Nenhum radio com value "' + valorConvertido + '" encontrado para ' + name);
        }
    }

    // Preencher campos de texto básicos
    const nomeAgressorInput = document.getElementById('nome-completo-agressor');
    if (nomeAgressorInput && dadosCaso.nomeAgressor) {
        nomeAgressorInput.value = dadosCaso.nomeAgressor;
        console.log('[tela-2-script] ✓ Nome agressor:', dadosCaso.nomeAgressor);
    }
    
    const idadeInput = document.getElementById('idade');
    if (idadeInput && dadosCaso.idadeAgresssor) {
        idadeInput.value = dadosCaso.idadeAgresssor;
        console.log('[tela-2-script] ✓ Idade:', dadosCaso.idadeAgresssor);
    }
    
    const vinculoInput = document.getElementById('vinculo');
    if (vinculoInput && dadosCaso.vinculoAssistida) {
        vinculoInput.value = dadosCaso.vinculoAssistida;
        console.log('[tela-2-script] ✓ Vínculo:', dadosCaso.vinculoAssistida);
    }
    
    // Preencher data do fato
    console.log('[tela-2-script] 🔍 DEBUG Data:');
    console.log('  dataOcorrencia:', dadosCaso.dataOcorrencia);
    console.log('  tipo:', typeof dadosCaso.dataOcorrencia);
    
    const dataInput = document.getElementById('data-fato');
    console.log('[tela-2-script] 🔍 dataInput encontrado?', !!dataInput);
    
    if (dataInput && dadosCaso.dataOcorrencia) {
        try {
            // Converter ISO date para formato legível dd/MM/yyyy
            const data = new Date(dadosCaso.dataOcorrencia);
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            const dataFormatada = `${dia}/${mes}/${ano}`;
            dataInput.value = dataFormatada;
            console.log('[tela-2-script] ✅ Data do fato preenchida:', dataFormatada, '(original:', dadosCaso.dataOcorrencia + ')');
        } catch (erro) {
            console.error('[tela-2-script] ❌ Erro ao formatar data:', erro);
        }
    } else {
        if (!dataInput) {
            console.warn('[tela-2-script] ⚠️  Campo data-fato não encontrado no HTML');
        }
        if (!dadosCaso.dataOcorrencia) {
            console.warn('[tela-2-script] ⚠️  dataOcorrencia está vazia:', dadosCaso.dataOcorrencia);
        }
    }

    // Preencher todos os campos do formulário
    marcarCheckboxes(['q01-ameaca-arma', 'q01-ameaca-faca', 'q01-ameaca-outra', 'q01-ameaca-nao'], dadosCaso._ameacas);
    marcarCheckboxes(['q02-agressao-queimadura', 'q02-agressao-enforcamento', 'q02-agressao-sufocamento', 'q02-agressao-tiro', 'q02-agressao-afogamento', 'q02-agressao-facada', 'q02-agressao-paulada', 'q02-agressao-nenhuma'], dadosCaso._agressoesGraves);
    marcarCheckboxes(['q03-agressao-socos', 'q03-agressao-chutes', 'q03-agressao-tapas', 'q03-agressao-empurroes', 'q03-agressao-puxoes-cabelo', 'q03-agressao-nenhuma'], dadosCaso._outrasAgressoes);
    marcarRadio('q04-estupro', dadosCaso._estupro);
    marcarCheckboxes(['q05-comportamento-frase-possessiva', 'q05-comportamento-perseguicao', 'q05-comportamento-proibiu-visitas', 'q05-comportamento-proibiu-trabalhar', 'q05-comportamento-contato-insistente', 'q05-comportamento-impediu-acesso-bens', 'q05-comportamento-ciumes-controle', 'q05-comportamento-nenhum'], dadosCaso._comportamentos);
    marcarRadio('q06-bo-medida', dadosCaso._boMedida);
    marcarRadio('q07-frequencia-aumento', dadosCaso._frequenciaAumento);
    marcarCheckboxes(['q08-uso-abusivo-alcool', 'q08-uso-abusivo-drogas', 'q08-uso-abusivo-nao', 'q08-uso-abusivo-nao-sei'], dadosCaso._usoDrogas);
    marcarRadio('q09-doenca-mental', dadosCaso._doencaMental);
    
    // 🔍 DEBUG: Log de Q10-Q13
    console.log('[tela-2-script] 🔍 DEBUG Q10-Q13 antes de marcarRadio:');
    console.log('  _descumpriuMedida (Q10):', dadosCaso._descumpriuMedida);
    console.log('  _tentativaSuicidio (Q11):', dadosCaso._tentativaSuicidio);
    console.log('  _desempregadoDificuldades (Q12):', dadosCaso._desempregadoDificuldades);
    console.log('  _acessoArmas (Q13):', dadosCaso._acessoArmas);
    
    marcarRadio('q10-descumpriu-medida', dadosCaso._descumpriuMedida);
    marcarRadio('q11-tentativa-suicidio', dadosCaso._tentativaSuicidio);
    marcarRadio('q12-desempregado-dificuldades', dadosCaso._desempregadoDificuldades);
    marcarRadio('q13-acesso-armas', dadosCaso._acessoArmas);
    marcarCheckboxes(['q14-ameacou-agrediu-filhos', 'q14-ameacou-agrediu-familiares', 'q14-ameacou-agrediu-outras-pessoas', 'q14-ameacou-agrediu-animais', 'q14-ameacou-agrediu-nao', 'q14-ameacou-agrediu-nao-sei'], dadosCaso._ameacouAgrediu);
    marcarRadio('q15-separacao', dadosCaso.separacaoRecente);
    
    // Q16 - Filhos (lógica especial)
    const secaoFilhos = document.getElementById('se-tem-filhos');
    
    if (dadosCaso._temFilhosIds && dadosCaso._temFilhosIds.length > 0) {
        // Tem filhos - mostrar seção
        console.log('[tela-2-script] Q16 - Tem filhos, mostrando seção Q16.x');
        dadosCaso._temFilhosIds.forEach(id => {
            const check = document.getElementById(id);
            if (check) {
                check.checked = true;
            }
        });
        
        if (dadosCaso._q16QuantosAgressor) {
            const inputQuantos = document.getElementById('q16-quantos-agressor');
            if (inputQuantos) inputQuantos.value = dadosCaso._q16QuantosAgressor;
        }
        if (dadosCaso._q16QuantosOutro) {
            const inputQuantos = document.getElementById('q16-quantos-outro');
            if (inputQuantos) inputQuantos.value = dadosCaso._q16QuantosOutro;
        }
        if (secaoFilhos) {
            secaoFilhos.style.display = 'flex';
            console.log('[tela-2-script] Q16 - Seção Q16.x visível');
        }
    } else {
        // Não tem filhos - ocultar seção
        console.log('[tela-2-script] Q16 - Não tem filhos, ocultando seção Q16.x');
        const checkNao = document.getElementById('q16-tem-filhos-nao');
        if (checkNao) checkNao.checked = true;
        if (secaoFilhos) {
            secaoFilhos.style.display = 'none';
            console.log('[tela-2-script] Q16 - Seção Q16.x oculta');
        }
    }
    
    marcarCheckboxes(['q16-1-faixa-etaria-0-11', 'q16-1-faixa-etaria-12-17', 'q16-1-faixa-etaria-18-mais'], dadosCaso._q16FaixaEtariaIds);
    
    // Q16.2 - Deficiência dos filhos (marca Sim se houver número, senão marca Não)
    const inputQ162Deficiencia = document.getElementById('q16-2-quantos-deficiencia');
    if (inputQ162Deficiencia && dadosCaso._q16Deficiencia) {
        inputQ162Deficiencia.value = dadosCaso._q16Deficiencia;
        console.log('[tela-2-script] Q16.2 - Quantos com deficiência preenchido:', dadosCaso._q16Deficiencia);
        
        // Se houver número, marca Sim
        if (dadosCaso._q16Deficiencia && dadosCaso._q16Deficiencia !== '0' && dadosCaso._q16Deficiencia !== '') {
            const radioSim = document.getElementById('q16-2-deficiencia-sim');
            if (radioSim) {
                radioSim.checked = true;
                console.log('[tela-2-script] Q16.2 - Marcado: Sim (pois tem número)');
            }
        } else {
            // Se não houver número ou for 0, marca Não
            const radioNao = document.getElementById('q16-2-deficiencia-nao');
            if (radioNao) {
                radioNao.checked = true;
                console.log('[tela-2-script] Q16.2 - Marcado: Não (pois não tem número ou é 0)');
            }
        }
    }
    
    marcarCheckboxes(['q16-3-conflito-guarda', 'q16-3-conflito-visitas', 'q16-3-conflito-pensao', 'q16-3-conflito-nao'], dadosCaso._q16ConflitosIds);
    marcarRadio('q16-4-presenciaram-violencia', dadosCaso._q16Presenciaram);
    marcarRadio('q16-5-violencia-gravidez', dadosCaso._q16ViolenciaGravidez);
    marcarRadio('q17-novo-relacionamento', dadosCaso.novoRelacionamentoAumentouAgressao ? 'Sim' : (dadosCaso.novoRelacionamentoAumentouAgressao === false ? 'Não' : undefined));
    marcarRadio('q18-deficiencia', dadosCaso.possuiDeficienciaDoenca);
    marcarRadio('cor', dadosCaso.corRaca);
    marcarRadio('q20-local-risco', dadosCaso._moraEmAreaRisco);
    marcarRadio('q21-dependente-financeira', dadosCaso._dependenteFinanceira);
    marcarRadio('q22-abrigamento', dadosCaso._abrigamentoTemporario);

    const inputQ18Deficiencia = document.getElementById('q18-qual-deficiencia');
    if (inputQ18Deficiencia && dadosCaso.possuiDeficienciaDoenca) {
        console.log('[tela-2-script] Q18 - Valor retornado:', dadosCaso.possuiDeficienciaDoenca);
        if (dadosCaso.possuiDeficienciaDoenca.toString().toUpperCase() === 'NÃO' || 
            dadosCaso.possuiDeficienciaDoenca.toString().toUpperCase() === 'NAO' ||
            dadosCaso.possuiDeficienciaDoenca.trim() === '') {
            const radioNao = document.getElementById('q18-deficiencia-nao');
            if (radioNao) {
                radioNao.checked = true;
                console.log('[tela-2-script] Q18 - Marcado: Não');
            }
        } else {
            inputQ18Deficiencia.value = dadosCaso.possuiDeficienciaDoenca;
            const radioSim = document.getElementById('q18-deficiencia-sim');
            if (radioSim) {
                radioSim.checked = true;
                console.log('[tela-2-script] Q18 - Marcado: Sim (com texto:', dadosCaso.possuiDeficienciaDoenca + ')');
            }
        }
    }

    console.log('[tela-2-script] ✅ Campos preenchidos com sucesso!');
}

document.addEventListener('DOMContentLoaded', preencherCampos);

// ========================================
// NAVEGAÇÃO
// ========================================

const btnVoltar = document.getElementById('voltar');
const btnProximo = document.getElementById('proximo');

if (btnVoltar) {
    btnVoltar.addEventListener('click', function() {
        console.log('[tela-2-script] ⬅️  Voltando para Tela 1');
        if (window.api && window.api.openWindow) {
            window.api.openWindow("telaVisualizacao1");
        } else {
            window.history.back();
        }
    });
}

if (btnProximo) {
    btnProximo.addEventListener('click', function() {
        console.log('[tela-2-script] ➡️  Indo para Tela 3');
        if (window.api && window.api.openWindow) {
            window.api.openWindow("telaVisualizacao3");
        }
    });
}

console.log('[tela-2-script] ✅ Script carregado!');