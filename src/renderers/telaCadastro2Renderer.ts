/// <reference path="../types/windown.d.ts" />

export {}

function getCheckedValues(selector: string): string[] {
    return Array.from(document.querySelectorAll<HTMLInputElement>(selector + ':checked')).map(input => input.value);
}

function getCheckedIds(selector: string): string[] {
    return Array.from(document.querySelectorAll<HTMLInputElement>(selector + ':checked')).map(input => input.id);
}

function setCheckboxValues(selector: string, values: string[]): void {
    const inputs = document.querySelectorAll<HTMLInputElement>(selector);
    inputs.forEach(input => {
        input.checked = values.includes(input.value);
    });
}

function setCheckboxById(selector: string, ids: string[]): void {
    const inputs = document.querySelectorAll<HTMLInputElement>(selector);
    inputs.forEach(input => {
        input.checked = ids.includes(input.id);
    });
}

function getRadioValue(name: string): string | undefined {
    const radio = document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`);
    return radio?.value;
}

function setRadioValue(name: string, value: string | undefined): void {
    if (!value) return;
    const radio = document.querySelector<HTMLInputElement>(`input[name="${name}"][value="${value}"]`);
    if (radio) radio.checked = true;
}

function getInputValue(id: string): string {
    return (document.getElementById(id) as HTMLInputElement)?.value || '';
}

function setInputValue(id: string, value: string | number | undefined): void {
    const input = document.getElementById(id) as HTMLInputElement;
    if (input && value !== undefined && value !== null) {
        input.value = String(value);
    }
}

function mostrarErro(mensagem: string) {
    let modal = document.getElementById('erro-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'erro-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        document.body.appendChild(modal);
    }

    const conteudo = document.createElement('div');
    conteudo.style.cssText = `
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    const titulo = document.createElement('h3');
    titulo.textContent = 'Erro de Validação';
    titulo.style.color = '#d9534f';

    const texto = document.createElement('p');
    texto.textContent = mensagem;
    texto.style.marginTop = '15px';

    const botao = document.createElement('button');
    botao.textContent = 'OK';
    botao.style.cssText = `
        margin-top: 20px;
        padding: 10px 30px;
        background-color: #d9534f;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    `;

    botao.addEventListener('click', () => {
        modal!.remove();
    });

    conteudo.appendChild(titulo);
    conteudo.appendChild(texto);
    conteudo.appendChild(botao);

    modal.innerHTML = '';
    modal.appendChild(conteudo);
    modal.style.display = 'flex';
}


const btnProximo = document.getElementById('proximo') as HTMLButtonElement;
const btnVoltar = document.getElementById('voltar') as HTMLButtonElement;


window.addEventListener('DOMContentLoaded', () => {
    try {
        const dadosCasoJSON = sessionStorage.getItem('dadosCaso');
        if (!dadosCasoJSON) return;

        const dadosCaso = JSON.parse(dadosCasoJSON);

        // Dados do Agressor
        setInputValue('nome-completo-agressor', dadosCaso.nomeAgressor);
        setInputValue('idade', dadosCaso.idadeAgresssor);
        setInputValue('vinculo', dadosCaso.vinculoAssistida);
        
        if (dadosCaso.dataOcorrida) {
            let dateStr = '';
            if (typeof dadosCaso.dataOcorrida === 'string') {
                dateStr = dadosCaso.dataOcorrida.split('T')[0];
            } else if (dadosCaso.dataOcorrida instanceof Date) {
                dateStr = dadosCaso.dataOcorrida.toISOString().split('T')[0];
            } else if (dadosCaso.dataOcorrida) {
                const date = new Date(dadosCaso.dataOcorrida);
                if (!isNaN(date.getTime())) {
                    dateStr = date.toISOString().split('T')[0];
                }
            }
            if (dateStr) {
                setInputValue('data-fato', dateStr);
            }
        }

        // Bloco I - Histórico de Violência
        setCheckboxValues('input[id^="q01-ameaca"]', dadosCaso._ameacas || []);
        setCheckboxValues('input[id^="q02-agressao"]', dadosCaso._agressoesGraves || []);
        setCheckboxValues('input[id^="q03-agressao"]', dadosCaso._outrasAgressoes || []);
        setRadioValue('q04-estupro', dadosCaso._estupro);
        setCheckboxValues('input[id^="q05-comportamento"]', dadosCaso._comportamentos || []);
        setRadioValue('q06-bo-medida', dadosCaso._boMedida);
        setRadioValue('q07-frequencia-aumento', dadosCaso._frequenciaAumento);

        // Bloco II - Sobre o Agressor
        setCheckboxValues('input[id^="q08-uso-abusivo"]', dadosCaso._usoDrogas || []);
        setRadioValue('q09-doenca-mental', dadosCaso._doencaMental);
        setRadioValue('q10-descumpriu-medida', dadosCaso._descumpriuMedida);
        setRadioValue('q11-tentativa-suicidio', dadosCaso._tentativaSuicidio);
        setRadioValue('q12-desempregado-dificuldades', dadosCaso._desempregadoDificuldades);
        setRadioValue('q13-acesso-armas', dadosCaso._acessoArmas);
        setCheckboxValues('input[id^="q14-ameacou-agrediu"]', dadosCaso._ameacouAgrediu || []);

        // Bloco III - Sobre Você
        setRadioValue('q15-separacao', dadosCaso.separacaoRecente);
        setRadioValue('q17-novo-relacionamento', dadosCaso.novoRelacionamentoAumentouAgressao ? 'Sim' : (dadosCaso.novoRelacionamentoAumentouAgressao === false ? 'Não' : undefined));
        
        // Q16 - Filhos
        setCheckboxById('input[id^="q16-tem-filhos"]', dadosCaso._temFilhosIds || []);
        if (dadosCaso._q16QuantosAgressor) setInputValue('q16-quantos-agressor', dadosCaso._q16QuantosAgressor);
        if (dadosCaso._q16QuantosOutro) setInputValue('q16-quantos-outro', dadosCaso._q16QuantosOutro);
        setCheckboxValues('input[id^="q16-1-faixa-etaria"]', dadosCaso._q16FaixaEtariaIds || []);
        setRadioValue('q16-2-deficiencia', dadosCaso._q16Deficiencia);
        if (dadosCaso._q16QuantosDeficiencia) setInputValue('q16-2-quantos-deficiencia', dadosCaso._q16QuantosDeficiencia);
        setCheckboxValues('input[id^="q16-3-conflito"]', dadosCaso._q16ConflitosIds || []);
        setRadioValue('q16-4-presenciaram-violencia', dadosCaso._q16Presenciaram);
        setRadioValue('q16-5-violencia-gravidez', dadosCaso._q16ViolenciaGravidez);
        
        setRadioValue('q18-deficiencia', dadosCaso.possuiDeficienciaDoenca);
        if (dadosCaso.possuiDeficienciaDoenca && dadosCaso.possuiDeficienciaDoenca !== 'Sim' && dadosCaso.possuiDeficienciaDoenca !== 'Não') {
            setInputValue('q18-qual-deficiencia', dadosCaso.possuiDeficienciaDoenca);
        }
        
        if (dadosCaso.corRaca) setRadioValue('cor', dadosCaso.corRaca);
        if (dadosCaso._moraEmAreaRisco) setRadioValue('q20-local-risco', dadosCaso._moraEmAreaRisco);
        if (dadosCaso._dependenteFinanceira) setRadioValue('q21-dependente-financeira', dadosCaso._dependenteFinanceira);
        if (dadosCaso._abrigamentoTemporario) setRadioValue('q22-abrigamento', dadosCaso._abrigamentoTemporario);

    } catch (error) {
        console.error('Erro ao prefill telaCadastro2:', error);
    }
});


btnVoltar.addEventListener('click', async () => {
    try {
        const dadosCasoJSON = sessionStorage.getItem('dadosCaso');
        const dadosCaso = dadosCasoJSON ? JSON.parse(dadosCasoJSON) : {};

        // Dados do Agressor
        dadosCaso.nomeAgressor = getInputValue('nome-completo-agressor');
        dadosCaso.idadeAgresssor = parseInt(getInputValue('idade')) || 0;
        dadosCaso.vinculoAssistida = getInputValue('vinculo');
        const dataFato = getInputValue('data-fato');
        if (dataFato) {
            dadosCaso.dataOcorrida = new Date(dataFato).toISOString();
        }

        // Bloco I - Histórico
        dadosCaso._ameacas = getCheckedValues('input[id^="q01-ameaca"]');
        dadosCaso._agressoesGraves = getCheckedValues('input[id^="q02-agressao"]');
        dadosCaso._outrasAgressoes = getCheckedValues('input[id^="q03-agressao"]');
        dadosCaso._estupro = getRadioValue('q04-estupro');
        dadosCaso._comportamentos = getCheckedValues('input[id^="q05-comportamento"]');
        dadosCaso._boMedida = getRadioValue('q06-bo-medida');
        dadosCaso._frequenciaAumento = getRadioValue('q07-frequencia-aumento');

        // Bloco II - Sobre Agressor
        dadosCaso._usoDrogas = getCheckedValues('input[id^="q08-uso-abusivo"]');
        dadosCaso._doencaMental = getRadioValue('q09-doenca-mental');
        dadosCaso._descumpriuMedida = getRadioValue('q10-descumpriu-medida');
        dadosCaso._tentativaSuicidio = getRadioValue('q11-tentativa-suicidio');
        dadosCaso._desempregadoDificuldades = getRadioValue('q12-desempregado-dificuldades');
        dadosCaso._acessoArmas = getRadioValue('q13-acesso-armas');
        dadosCaso._ameacouAgrediu = getCheckedValues('input[id^="q14-ameacou-agrediu"]');

        // Bloco III - Sobre Você
        dadosCaso.separacaoRecente = getRadioValue('q15-separacao');
        const novoRelac = getRadioValue('q17-novo-relacionamento');
        dadosCaso.novoRelacionamentoAumentouAgressao = novoRelac ? novoRelac === 'Sim' : undefined;
        
        // Q16 - Filhos
        dadosCaso._temFilhosIds = getCheckedIds('input[id^="q16-tem-filhos"]');
        dadosCaso._q16QuantosAgressor = getInputValue('q16-quantos-agressor');
        dadosCaso._q16QuantosOutro = getInputValue('q16-quantos-outro');
        dadosCaso._q16FaixaEtariaIds = getCheckedIds('input[id^="q16-1-faixa-etaria"]');
        dadosCaso._q16Deficiencia = getRadioValue('q16-2-deficiencia');
        dadosCaso._q16QuantosDeficiencia = getInputValue('q16-2-quantos-deficiencia');
        dadosCaso._q16ConflitosIds = getCheckedIds('input[id^="q16-3-conflito"]');
        dadosCaso._q16Presenciaram = getRadioValue('q16-4-presenciaram-violencia');
        dadosCaso._q16ViolenciaGravidez = getRadioValue('q16-5-violencia-gravidez');
        
        const deficienciaResposta = getRadioValue('q18-deficiencia');
        const deficienciaDescricao = getInputValue('q18-qual-deficiencia');
        dadosCaso.possuiDeficienciaDoenca = deficienciaResposta === 'Sim' ? deficienciaDescricao : deficienciaResposta;
        
        dadosCaso.corRaca = getRadioValue('cor');
        dadosCaso._moraEmAreaRisco = getRadioValue('q20-local-risco');
        dadosCaso._dependenteFinanceira = getRadioValue('q21-dependente-financeira');
        dadosCaso._abrigamentoTemporario = getRadioValue('q22-abrigamento');

        sessionStorage.setItem('dadosCaso', JSON.stringify(dadosCaso));
        await window.api.openWindow('telaCadastroAssistida');

    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        mostrarErro(error instanceof Error ? error.message : 'Erro ao salvar dados. Tente novamente.');
    }
});


btnProximo.addEventListener('click', async () => {
    try {
        // Coleta de dados
        const nomeAgressor = getInputValue('nome-completo-agressor').trim();
        const idadeAgressor = getInputValue('idade').trim();
        const vinculo = getInputValue('vinculo').trim();
        const dataFato = getInputValue('data-fato').trim();

        const ameacas = getCheckedValues('input[id^="q01-ameaca"]');
        const agressoesGraves = getCheckedValues('input[id^="q02-agressao"]');
        const outrasAgressoes = getCheckedValues('input[id^="q03-agressao"]');
        const estupro = getRadioValue('q04-estupro');
        const comportamentos = getCheckedValues('input[id^="q05-comportamento"]');
        const boMedida = getRadioValue('q06-bo-medida');
        const frequenciaAumento = getRadioValue('q07-frequencia-aumento');

        const usoDrogas = getCheckedValues('input[id^="q08-uso-abusivo"]');
        const doencaMental = getRadioValue('q09-doenca-mental');
        const descumpriuMedida = getRadioValue('q10-descumpriu-medida');
        const tentativaSuicidio = getRadioValue('q11-tentativa-suicidio');
        const desempregadoDificuldades = getRadioValue('q12-desempregado-dificuldades');
        const acessoArmas = getRadioValue('q13-acesso-armas');
        const ameacouAgrediu = getCheckedValues('input[id^="q14-ameacou-agrediu"]');

        const separacao = getRadioValue('q15-separacao');
        const novoRelacionamento = getRadioValue('q17-novo-relacionamento');
        
        // Q16 - Filhos
        const temFilhosIds = getCheckedIds('input[id^="q16-tem-filhos"]');
        const q16QuantosAgressor = getInputValue('q16-quantos-agressor');
        const q16QuantosOutro = getInputValue('q16-quantos-outro');
        const q16FaixaEtariaIds = getCheckedValues('input[id^="q16-1-faixa-etaria"]');
        const q16Deficiencia = getRadioValue('q16-2-deficiencia');
        const q16QuantosDeficiencia = getInputValue('q16-2-quantos-deficiencia');
        const q16ConflitosIds = getCheckedValues('input[id^="q16-3-conflito"]');
        const q16Presenciaram = getRadioValue('q16-4-presenciaram-violencia');
        const q16ViolenciaGravidez = getRadioValue('q16-5-violencia-gravidez');
        
        const deficienciaResposta = getRadioValue('q18-deficiencia');
        const deficienciaDescricao = getInputValue('q18-qual-deficiencia');
        const deficiencia = deficienciaResposta === 'Sim' ? deficienciaDescricao : deficienciaResposta;
        const corRaca = getRadioValue('cor');
        const moraEmAreaRisco = getRadioValue('q20-local-risco');
        const dependenteFinanceira = getRadioValue('q21-dependente-financeira');
        const abrigamento = getRadioValue('q22-abrigamento');

        // Validações
        if (!nomeAgressor) {
            mostrarErro('Nome do agressor é obrigatório');
            return;
        }
        if (!idadeAgressor) {
            mostrarErro('Idade do agressor é obrigatória');
            return;
        }
        if (!vinculo) {
            mostrarErro('Vínculo é obrigatório');
            return;
        }
        if (!dataFato) {
            mostrarErro('Data do fato é obrigatória');
            return;
        }
        if (ameacas.length === 0) {
            mostrarErro('Selecione ao menos uma opção sobre ameaças');
            return;
        }
        if (agressoesGraves.length === 0) {
            mostrarErro('Selecione ao menos uma opção sobre agressões graves');
            return;
        }
        if (outrasAgressoes.length === 0) {
            mostrarErro('Selecione ao menos uma opção sobre outras agressões');
            return;
        }
        if (!estupro) {
            mostrarErro('Responda sobre abuso sexual');
            return;
        }
        if (comportamentos.length === 0) {
            mostrarErro('Selecione ao menos um comportamento');
            return;
        }
        if (!boMedida) {
            mostrarErro('Responda sobre ocorrência policial/medida protetiva');
            return;
        }
        if (!frequenciaAumento) {
            mostrarErro('Responda sobre frequência de agressões');
            return;
        }
        if (usoDrogas.length === 0) {
            mostrarErro('Selecione ao menos uma opção sobre uso de drogas/álcool');
            return;
        }
        if (!doencaMental) {
            mostrarErro('Responda sobre doença mental');
            return;
        }
        if (!descumpriuMedida) {
            mostrarErro('Responda sobre cumprimento de medida protetiva');
            return;
        }
        if (!tentativaSuicidio) {
            mostrarErro('Responda sobre tentativa de suicídio');
            return;
        }
        if (!desempregadoDificuldades) {
            mostrarErro('Responda sobre desemprego/dificuldades');
            return;
        }
        if (!acessoArmas) {
            mostrarErro('Responda sobre acesso a armas');
            return;
        }
        if (ameacouAgrediu.length === 0) {
            mostrarErro('Selecione ao menos uma opção sobre ameaças/agressões');
            return;
        }
        if (!separacao) {
            mostrarErro('Responda sobre separação recente');
            return;
        }
        if (!novoRelacionamento) {
            mostrarErro('Responda sobre novo relacionamento');
            return;
        }
        if (temFilhosIds.length === 0) {
            mostrarErro('Responda se tem filhos');
            return;
        }
        if (!q16Deficiencia && temFilhosIds.length > 0 && !temFilhosIds.includes('q16-tem-filhos-nao')) {
            mostrarErro('Responda sobre deficiência dos filhos');
            return;
        }
        if (!q16Presenciaram && temFilhosIds.length > 0 && !temFilhosIds.includes('q16-tem-filhos-nao')) {
            mostrarErro('Responda se filhos presenciaram violência');
            return;
        }
        if (!q16ViolenciaGravidez && temFilhosIds.length > 0 && !temFilhosIds.includes('q16-tem-filhos-nao')) {
            mostrarErro('Responda sobre violência na gravidez');
            return;
        }
        if (!deficiencia) {
            mostrarErro('Responda sobre deficiência/doença');
            return;
        }
        if (!corRaca) {
            mostrarErro('Selecione sua cor/raça');
            return;
        }
        if (!moraEmAreaRisco) {
            mostrarErro('Responda se mora em área de risco');
            return;
        }
        if (!dependenteFinanceira) {
            mostrarErro('Responda se é dependente financeira');
            return;
        }
        if (!abrigamento) {
            mostrarErro('Responda sobre abrigamento');
            return;
        }

        // Salvar dados
        const dadosCasoJSON = sessionStorage.getItem('dadosCaso');
        const dadosCaso = dadosCasoJSON ? JSON.parse(dadosCasoJSON) : {};

        // Dados do Agressor
        dadosCaso.nomeAgressor = nomeAgressor;
        dadosCaso.idadeAgresssor = parseInt(idadeAgressor);
        dadosCaso.vinculoAssistida = vinculo;
        dadosCaso.dataOcorrida = new Date(dataFato).toISOString();

        // Raw values para prefill
        dadosCaso._ameacas = ameacas;
        dadosCaso._agressoesGraves = agressoesGraves;
        dadosCaso._outrasAgressoes = outrasAgressoes;
        dadosCaso._estupro = estupro;
        dadosCaso._comportamentos = comportamentos;
        dadosCaso._boMedida = boMedida;
        dadosCaso._frequenciaAumento = frequenciaAumento;
        dadosCaso._usoDrogas = usoDrogas;
        dadosCaso._doencaMental = doencaMental;
        dadosCaso._descumpriuMedida = descumpriuMedida;
        dadosCaso._tentativaSuicidio = tentativaSuicidio;
        dadosCaso._desempregadoDificuldades = desempregadoDificuldades;
        dadosCaso._acessoArmas = acessoArmas;
        dadosCaso._ameacouAgrediu = ameacouAgrediu;

        // Q16 - Filhos
        dadosCaso._temFilhosIds = temFilhosIds;
        dadosCaso._q16QuantosAgressor = q16QuantosAgressor;
        dadosCaso._q16QuantosOutro = q16QuantosOutro;
        dadosCaso._q16FaixaEtariaIds = q16FaixaEtariaIds;
        dadosCaso._q16Deficiencia = q16Deficiencia;
        dadosCaso._q16QuantosDeficiencia = q16QuantosDeficiencia;
        dadosCaso._q16ConflitosIds = q16ConflitosIds;
        dadosCaso._q16Presenciaram = q16Presenciaram;
        dadosCaso._q16ViolenciaGravidez = q16ViolenciaGravidez;

        // Converter dados Q16 para tipos corretos do modelo SobreVoce
        dadosCaso.temFilhosComAgressor = temFilhosIds.some(id => id.includes('agressor'));
        dadosCaso.qntFilhosComAgressor = dadosCaso.temFilhosComAgressor ? (parseInt(q16QuantosAgressor) || 0) : 0;
        dadosCaso.temFilhosOutroRelacionamento = temFilhosIds.some(id => id.includes('outro'));
        dadosCaso.qntFilhosOutroRelacionamento = dadosCaso.temFilhosOutroRelacionamento ? (parseInt(q16QuantosOutro) || 0) : 0;
        dadosCaso.faixaFilhos = q16FaixaEtariaIds || [];
        dadosCaso.filhosComDeficiencia = parseInt(q16QuantosDeficiencia) || 0;
        dadosCaso.conflitoAgressor = q16ConflitosIds.length > 0 ? q16ConflitosIds.join('; ') : '';
        dadosCaso.filhosPresenciaramViolencia = q16Presenciaram === 'Sim';
        dadosCaso.violenciaDuranteGravidez = q16ViolenciaGravidez === 'Sim';

        // Valores convertidos para envio ao backend
        dadosCaso.ameacaFamiliar = ameacas;
        dadosCaso.agressaoFisica = agressoesGraves;
        dadosCaso.outrasFormasViolencia = outrasAgressoes;
        dadosCaso.abusoSexual = estupro === 'Sim';
        dadosCaso.comportamentosAgressor = comportamentos;
        dadosCaso.ocorrenciaPolicialMedidaProtetivaAgressor = boMedida === 'Sim';
        console.log('[Q06 DEBUG] boMedida valor:', boMedida, 'tipo:', typeof boMedida);
        console.log('[Q06 DEBUG] ocorrenciaPolicialMedidaProtetivaAgressor convertido:', dadosCaso.ocorrenciaPolicialMedidaProtetivaAgressor);
        dadosCaso.agressoesMaisFrequentesUltimamente = frequenciaAumento === 'Sim';
        dadosCaso.usoDrogasAlcool = usoDrogas;
        // Q09: Já vem do HTML formatado como SIM_MEDICACAO, SIM_SEM_MEDICACAO, NAO, NAO_SEI - manter como está
        dadosCaso.doencaMental = doencaMental || '';
        dadosCaso.agressorCumpriuMedidaProtetiva = descumpriuMedida === 'Sim';
        dadosCaso.agressorTentativaSuicidio = tentativaSuicidio === 'Sim';
        // Q12 e Q13: converter para UPPERCASE_WITH_UNDERSCORE
        dadosCaso.agressorDesempregado = desempregadoDificuldades
            ? desempregadoDificuldades.replace(/ã/g, 'A').toUpperCase().replace(/\s+/g, '_')
            : '';
        dadosCaso.agressorPossuiArmaFogo = acessoArmas
            ? acessoArmas.replace(/ã/g, 'A').toUpperCase().replace(/\s+/g, '_')
            : '';
        dadosCaso.agressorAmeacouAlguem = ameacouAgrediu; // Array de strings - campo especial do agressor
        dadosCaso.separacaoRecente = separacao; // String "Sim"/"Não" - campo especial
        dadosCaso.novoRelacionamentoAumentouAgressao = novoRelacionamento === 'Sim';
        dadosCaso.possuiDeficienciaDoenca = deficiencia || '';
        dadosCaso.corRaca = corRaca;
        // Q20: converter para SIM/NAO/NAO_SEI (tem 3 opções)
        dadosCaso._moraEmAreaRisco = moraEmAreaRisco ? moraEmAreaRisco.replace(/ã/g, 'A').toUpperCase().replace(/\s+/g, '_') : '';
        dadosCaso.moraEmAreaRisco = moraEmAreaRisco ? moraEmAreaRisco.replace(/ã/g, 'A').toUpperCase().replace(/\s+/g, '_') : '';
        dadosCaso._dependenteFinanceira = dependenteFinanceira;
        dadosCaso.dependenteFinanceiroAgressor = dependenteFinanceira === 'Sim';
        dadosCaso._abrigamentoTemporario = abrigamento;
        dadosCaso.aceitaAbrigamentoTemporario = abrigamento === 'Sim';

        sessionStorage.setItem('dadosCaso', JSON.stringify(dadosCaso));
        await window.api.openWindow('telaCadastro3');

    } catch (error) {
        console.error('Erro ao processar formulário:', error);
        mostrarErro(error instanceof Error ? error.message : 'Erro ao processar formulário');
    }
});
