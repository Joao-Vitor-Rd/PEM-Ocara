/// <reference path="../types/windown.d.ts" />

export {}

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
    titulo.textContent = `Erro de Validação: ${mensagem}`;
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

const pxmBtn = document.getElementById('proximo') as HTMLButtonElement; 
const voltarBtn = document.getElementById('voltar') as HTMLButtonElement;

// Helpers
function getCheckedValues(selector: string): string[] {
    return Array.from(document.querySelectorAll(selector)).map(input => (input as HTMLInputElement).value);
}

function setCheckboxesFromValues(selectorAll: string, values: string[]) {
    const inputs = document.querySelectorAll<HTMLInputElement>(selectorAll);
    inputs.forEach(i => {
        i.checked = false;
    });
    inputs.forEach(i => {
        if (values.includes(i.value)) {
            i.checked = true;
        }
    });
}

function setRadiosFromValue(name: string, value?: string) {
    if (!value) return;
    const radio = document.querySelector<HTMLInputElement>(`input[name="${name}"][value="${CSS.escape(value)}"]`);
    if (radio) radio.checked = true;
}

function setInputValue(id: string, value: string | number | undefined) {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (!el) return;
    el.value = value !== undefined && value !== null ? String(value) : '';
}

window.addEventListener('DOMContentLoaded', () => {
    try {
        const dadosAssistidaJSON = sessionStorage.getItem('dadosAssistida');
        if (dadosAssistidaJSON) {
            const dadosAssistida = JSON.parse(dadosAssistidaJSON);
        }

        const dadosCasoJSON = sessionStorage.getItem('dadosCaso');
        if (!dadosCasoJSON) return;
        const dadosCaso = JSON.parse(dadosCasoJSON);

        // Agressor
        setInputValue('nome-completo-agressor', dadosCaso.nomeAgressor);
        setInputValue('idade', dadosCaso.idadeAgresssor);
        setInputValue('vinculo', dadosCaso.vinculoAssistida);
        if (dadosCaso.dataOcorrida) {
            try {
                const d = new Date(dadosCaso.dataOcorrida);
                setInputValue('data-fato', d.toISOString().slice(0,10));
            } catch {}
        }

        // Bloco I - histórico
        if (Array.isArray(dadosCaso._ameacas) && dadosCaso._ameacas.length) {
            setCheckboxesFromValues('input[id^="q01-ameaca"]', dadosCaso._ameacas);
        } else if (Array.isArray(dadosCaso.ameacas) && dadosCaso.ameacas.length) {
            setCheckboxesFromValues('input[id^="q01-ameaca"]', dadosCaso.ameacas);
        }

        if (Array.isArray(dadosCaso._agressoesGraves) && dadosCaso._agressoesGraves.length) {
            setCheckboxesFromValues('input[id^="q02-agressao"]', dadosCaso._agressoesGraves);
        } else if (Array.isArray(dadosCaso.agressoes) && dadosCaso.agressoes.length) {
            setCheckboxesFromValues('input[id^="q02-agressao"]', dadosCaso.agressoes);
        }

        if (Array.isArray(dadosCaso._outrasAgressoes) && dadosCaso._outrasAgressoes.length) {
            setCheckboxesFromValues('input[id^="q03-agressao"]', dadosCaso._outrasAgressoes);
        } else if (Array.isArray(dadosCaso.outrasAgressoes) && dadosCaso.outrasAgressoes.length) {
            setCheckboxesFromValues('input[id^="q03-agressao"]', dadosCaso.outrasAgressoes);
        }

    const estuproVal = dadosCaso._estupro ?? (dadosCaso.abusoSexual ? 'Sim' : (dadosCaso.abusoSexual === false ? 'Não' : undefined));
    setRadiosFromValue('q04-estupro', estuproVal);

    if (Array.isArray(dadosCaso._comportamentos)) setCheckboxesFromValues('input[id^="q05-comportamento"]', dadosCaso._comportamentos);
    else if (Array.isArray(dadosCaso.comportamentosAgressor)) setCheckboxesFromValues('input[id^="q05-comportamento"]', dadosCaso.comportamentosAgressor);

    const boMedidaVal = dadosCaso._boMedida ?? (dadosCaso.ocorrenciaPolicialMedidaProtetivaAgressor ? 'Sim' : (dadosCaso.ocorrenciaPolicialMedidaProtetivaAgressor === false ? 'Não' : undefined));
    setRadiosFromValue('q06-bo-medida', boMedidaVal);

    const freqVal = dadosCaso._frequenciaAumento ?? (dadosCaso.agressoesMaisFrequentesUltimamente ? 'Sim' : (dadosCaso.agressoesMaisFrequentesUltimamente === false ? 'Não' : undefined));
    setRadiosFromValue('q07-frequencia-aumento', freqVal);

    // Bloco II - agressor
    if (Array.isArray(dadosCaso._usoAbusivo)) setCheckboxesFromValues('input[id^="q08-uso-abusivo"]', dadosCaso._usoAbusivo);
    else if (Array.isArray(dadosCaso.usoDrogasAlcool)) setCheckboxesFromValues('input[id^="q08-uso-abusivo"]', dadosCaso.usoDrogasAlcool);

    setRadiosFromValue('q09-doenca-mental', dadosCaso._doencaMental ?? dadosCaso.doencaMental);

    const descumpriuVal = dadosCaso._descumpriuMedida ?? (dadosCaso.agressorCumpriuMedidaProtetiva ? 'Sim' : (dadosCaso.agressorCumpriuMedidaProtetiva === false ? 'Não' : undefined));
    setRadiosFromValue('q10-descumpriu-medida', descumpriuVal);

    setRadiosFromValue('q11-tentativa-suicidio', dadosCaso._tentativaSuicidio ?? (dadosCaso.agressorTentativaSuicidio ? 'Sim' : (dadosCaso.agressorTentativaSuicidio === false ? 'Não' : undefined)));
    setRadiosFromValue('q12-desempregado-dificuldades', dadosCaso._desempregadoDificuldades ?? dadosCaso.agressorDesempregado);
        setRadiosFromValue('q13-acesso-armas', dadosCaso._acessoArmas ?? dadosCaso.agressorPossuiArmaFogo);
        if (Array.isArray(dadosCaso._ameacouAgrediuOutros) && dadosCaso._ameacouAgrediuOutros.length) {
            setCheckboxesFromValues('input[id^="q14-ameacou-agrediu"]', dadosCaso._ameacouAgrediuOutros);
        } else if (Array.isArray(dadosCaso.ameacouAgrediuOutros) && dadosCaso.ameacouAgrediuOutros.length) {
            setCheckboxesFromValues('input[id^="q14-ameacou-agrediu"]', dadosCaso.ameacouAgrediuOutros);
        }        // Bloco III - sobre você
        setRadiosFromValue('q15-separacao', dadosCaso.separacaoRecente);
  
        setRadiosFromValue('q17-novo-relacionamento', dadosCaso.novoRelacionamentoAumentouAgressao ? 'Sim' : (dadosCaso.novoRelacionamentoAumentouAgressao === false ? 'Não' : undefined));
        setRadiosFromValue('q18-deficiencia', dadosCaso.possuiDeficienciaDoenca ? 'Sim' : (dadosCaso.possuiDeficienciaDoenca ? undefined : 'Não'));
        setInputValue('q18-qual-deficiencia', dadosCaso.possuiDeficienciaDoenca || '');
        setRadiosFromValue('cor', dadosCaso.corRaca);

        setRadiosFromValue('q20-local-risco', dadosCaso.moraEmAreaRisco ? 'Sim' : (dadosCaso.moraEmAreaRisco === false ? 'Não' : undefined));
        setRadiosFromValue('q21-dependente-financeira', dadosCaso.dependenteFinanceiroAgressor ? 'Sim' : (dadosCaso.dependenteFinanceiroAgressor === false ? 'Não' : undefined));
        setRadiosFromValue('q22-abrigamento', dadosCaso.aceitaAbrigamentoTemporario ? 'Sim' : (dadosCaso.aceitaAbrigamentoTemporario === false ? 'Não' : undefined));

    } catch (err) {
        console.error('Erro ao preencher telaCadastro2 a partir do sessionStorage:', err);
    }
});

voltarBtn.addEventListener('click', async (event) => {
    try {
        const currentDadosCasoJSON = sessionStorage.getItem('dadosCaso');
        const currentDados = currentDadosCasoJSON ? JSON.parse(currentDadosCasoJSON) : {};

        currentDados.nomeAgressor = (document.getElementById('nome-completo-agressor') as HTMLInputElement)?.value.trim() || currentDados.nomeAgressor || "";
        currentDados.idadeAgresssor = parseInt((document.getElementById('idade') as HTMLInputElement)?.value || currentDados.idadeAgresssor || 0);
        currentDados.vinculoAssistida = (document.getElementById('vinculo') as HTMLInputElement)?.value.trim() || currentDados.vinculoAssistida || "";
        const dataVal = (document.getElementById('data-fato') as HTMLInputElement)?.value;
        if (dataVal) currentDados.dataOcorrida = new Date(dataVal).toISOString();

        const ameacas = Array.from(document.querySelectorAll<HTMLInputElement>('input[id^="q01-ameaca"]:checked')).map(i => i.value);
        if (ameacas.length) currentDados.ameacas = ameacas;

        const agressoes = Array.from(document.querySelectorAll<HTMLInputElement>('input[id^="q02-agressao"]:checked')).map(i => i.value);
        if (agressoes.length) currentDados.agressoes = agressoes;

        const outrasAgressoes = Array.from(document.querySelectorAll<HTMLInputElement>('input[id^="q03-agressao"]:checked')).map(i => i.value);
        if (outrasAgressoes.length) currentDados.outrasAgressoes = outrasAgressoes;

        sessionStorage.setItem('dadosCaso', JSON.stringify(currentDados));
    } catch (err) {
        console.error('Erro ao salvar dados antes de voltar:', err);
    }

    const mudarTela = await window.api.openWindow("telaCadastroAssistida");
});

const isRadioChecked = (name: string): boolean => {
    return document.querySelector(`input[name="${name}"]:checked`) !== null;
};

const isCheckboxGroupChecked = (selector: string): boolean => {
    return document.querySelectorAll(selector).length > 0;
};

pxmBtn.addEventListener('click', async (event) => {
    // Passo 2: Dados do Agressor
    const nomeAgressor = (document.getElementById('nome-completo-agressor') as HTMLInputElement).value.trim();
    const idadeAgressor = (document.getElementById('idade') as HTMLInputElement).value.trim();
    const vinculo = (document.getElementById('vinculo') as HTMLInputElement).value.trim();
    const dataFato = (document.getElementById('data-fato') as HTMLInputElement).value.trim();

    // Bloco I - Sobre o Histórico de Violência
    const ameacas: string[] = Array.from(document.querySelectorAll('input[id^="q01-ameaca"]:checked')).map(input => (input as HTMLInputElement).value);
    const agressoesGraves: string[] = Array.from(document.querySelectorAll('input[id^="q02-agressao"]:checked')).map(input => (input as HTMLInputElement).value);
    const outrasAgressoes: string[] = Array.from(document.querySelectorAll('input[id^="q03-agressao"]:checked')).map(input => (input as HTMLInputElement).value);
    const estupro = (document.querySelector('input[name="q04-estupro"]:checked') as HTMLInputElement)?.value;
    const comportamentos: string[] = Array.from(document.querySelectorAll('input[id^="q05-comportamento"]:checked')).map(input => (input as HTMLInputElement).value);
    const boMedida = (document.querySelector('input[name="q06-bo-medida"]:checked') as HTMLInputElement)?.value;
    const frequenciaAumento = (document.querySelector('input[name="q07-frequencia-aumento"]:checked') as HTMLInputElement)?.value;

    // Bloco II - Sobre o (a) Agressor(a)
    const usoAbusivo: string[] = Array.from(document.querySelectorAll('input[id^="q08-uso-abusivo"]:checked')).map(input => (input as HTMLInputElement).value);
    const doencaMental = (document.querySelector('input[name="q09-doenca-mental"]:checked') as HTMLInputElement)?.value;
    const descumpriuMedida = (document.querySelector('input[name="q10-descumpriu-medida"]:checked') as HTMLInputElement)?.value;
    const tentativaSuicidio = (document.querySelector('input[name="q11-tentativa-suicidio"]:checked') as HTMLInputElement)?.value;
    const desempregadoDificuldades = (document.querySelector('input[name="q12-desempregado-dificuldades"]:checked') as HTMLInputElement)?.value;
    const acessoArmas = (document.querySelector('input[name="q13-acesso-armas"]:checked') as HTMLInputElement)?.value;
    const ameacouAgrediuOutros: string[] = Array.from(document.querySelectorAll('input[id^="q14-ameacou-agrediu"]:checked')).map(input => (input as HTMLInputElement).value);    // Bloco III - Sobre Você
    const separacao = (document.querySelector('input[name="q15-separacao"]:checked') as HTMLInputElement)?.value;
    const temFilhosComAgressor = (document.getElementById('q16-tem-filhos-sim-agressor') as HTMLInputElement).checked;
    const quantosComAgressor = temFilhosComAgressor ? parseInt((document.getElementById('q16-quantos-agressor') as HTMLInputElement).value) : 0;
    const temFilhosDeOutro = (document.getElementById('q16-tem-filhos-sim-outro') as HTMLInputElement).checked;
    const quantosDeOutro = temFilhosDeOutro ? parseInt((document.getElementById('q16-quantos-outro') as HTMLInputElement).value) : 0;
    const temFilhos = temFilhosComAgressor || temFilhosDeOutro;
    const corRaca = (document.querySelector('input[name="cor"]:checked') as HTMLInputElement)?.value || "";

    let faixaEtaria: string[] = [];
    if (temFilhos) {
        faixaEtaria = Array.from(document.querySelectorAll('input[id^="q16-1-faixa-etaria"]:checked')).map(input => (input as HTMLInputElement).value);
    }

    // Coletar dados das questões condicionais (16.2 a 16.5)
    const conflitosComAgressor = Array.from(document.querySelectorAll('input[id^="q16-3-conflito"]:checked')).map(input => (input as HTMLInputElement).value);

    // Coletar dados questão 18 
    const temDeficienciaOuDoenca = (document.querySelector('input[name="q18-deficiencia"]:checked') as HTMLInputElement)?.value === 'Sim';
    const qualDeficiencia = temDeficienciaOuDoenca ? (document.getElementById('q18-qual-deficiencia') as HTMLInputElement)?.value || "" : "";

    // Coletar dados questões 20, 21, 22
    const moraEmAreaRiscoRadio = (document.querySelector('input[name="q20-local-risco"]:checked') as HTMLInputElement)?.value === 'Sim';
    const dependenteFinanceiroAgressorRadio = (document.querySelector('input[name="q21-dependente-financeira"]:checked') as HTMLInputElement)?.value === 'Sim';
    const aceitaAbrigamentoTemporarioRadio = (document.querySelector('input[name="q22-abrigamento"]:checked') as HTMLInputElement)?.value === 'Sim';
    

    // Validações individuais com mensagens específicas
    if (!nomeAgressor || !nomeAgressor.trim()) {
        mostrarErro('O nome do agressor é obrigatório');
        return;
    }

    if (!idadeAgressor || !idadeAgressor.trim()) {
        mostrarErro('A idade do agressor é obrigatória');
        return;
    }

    if (!vinculo || !vinculo.trim()) {
        mostrarErro('O vínculo com a assistida é obrigatório');
        return;
    }

    if (!dataFato || !dataFato.trim()) {
        mostrarErro('A data da ocorrência é obrigatória');
        return;
    }

    if(ameacas.length === 0) {
        mostrarErro('Por favor, selecione ao menos uma opção sobre ameaças');
        return;
    }

    if(agressoesGraves.length === 0) {
        mostrarErro('Por favor, selecione ao menos uma opção sobre agressões graves');
        return;
    }

    if (outrasAgressoes.length === 0) {
        mostrarErro('Por favor, selecione ao menos uma opção sobre outras agressões');
        return;
    }

    if (!isRadioChecked('q04-estupro')) {
        mostrarErro('Por favor, responda sobre abuso sexual');
        return;
    }

    if (comportamentos.length === 0) {
        mostrarErro('Por favor, selecione ao menos uma opção sobre comportamentos');
        return;
    }

    if (boMedida === undefined) {
        mostrarErro('Por favor, responda sobre ocorrência policial/medida protetiva');
        return;
    }

    if (frequenciaAumento === undefined) {
        mostrarErro('Por favor, responda sobre aumento de frequência das agressões');
        return;
    }

    if (usoAbusivo.length === 0) {
        mostrarErro('Por favor, selecione ao menos uma opção sobre uso abusivo de drogas/álcool');
        return;
    }

    if (doencaMental === undefined) {
        mostrarErro('Por favor, responda sobre doença mental diagnosticada');
        return;
    }

    if (descumpriuMedida === undefined) {
        mostrarErro('Por favor, responda sobre cumprimento de medida protetiva');
        return;
    }

    if (!isRadioChecked('q06-bo-medida')) {
        mostrarErro('Por favor, responda sobre ocorrência policial/medida protetiva');
        return;
    }

    if (!isRadioChecked('q07-frequencia-aumento')) {
        mostrarErro('Por favor, responda sobre aumento de frequência das agressões');
        return;
    }

    if (!isRadioChecked('q10-descumpriu-medida')) {
        mostrarErro('Por favor, responda sobre cumprimento de medida protetiva');
        return;
    }

    if (!isRadioChecked('q11-tentativa-suicidio')) {
        mostrarErro('Por favor, responda sobre tentativa de suicídio');
        return;
    }

    if (!isRadioChecked('q12-desempregado-dificuldades')) {
        mostrarErro('Por favor, responda sobre desemprego/dificuldades');
        return;
    }

    if (!isRadioChecked('q13-acesso-armas')) {
        mostrarErro('Por favor, responda sobre acesso a armas de fogo');
        return;
    }

    if (ameacouAgrediuOutros.length === 0) {
        mostrarErro('Por favor, selecione ao menos uma opção sobre ameaças/agressões a outros');
        return;
    }

    if (!isRadioChecked('q15-separacao')) {
        mostrarErro('Por favor, responda sobre separação recente');
        return;
    }

    // Validar questão 16 - Tem filhos?
    const temFilhosNaoCheckbox = (document.getElementById('q16-tem-filhos-nao') as HTMLInputElement)?.checked;
    const temAlgumFilho = temFilhosComAgressor || temFilhosDeOutro || temFilhosNaoCheckbox;
    
    if (!temAlgumFilho) {
        mostrarErro('Por favor, responda se tem filhos');
        return;
    }

    // Se tem filhos com agressor, validar quantidade e faixa etária
    if (temFilhosComAgressor) {
        if (!quantosComAgressor || quantosComAgressor <= 0 || isNaN(quantosComAgressor)) {
            mostrarErro('Por favor, informe a quantidade de filhos com o agressor');
            return;
        }
    }

    // Se tem filhos de outro relacionamento, validar quantidade
    if (temFilhosDeOutro) {
        if (!quantosDeOutro || quantosDeOutro <= 0 || isNaN(quantosDeOutro)) {
            mostrarErro('Por favor, informe a quantidade de filhos de outro relacionamento');
            return;
        }
    }

    // Se tem algum filho, validar faixa etária
    if (temFilhos) {
        if (faixaEtaria.length === 0) {
            mostrarErro('Por favor, selecione ao menos uma faixa etária dos filhos');
            return;
        }

        // Validar questão 16.2 - Deficiência dos filhos
        if (!isRadioChecked('q16-2-deficiencia')) {
            mostrarErro('Por favor, responda se algum filho tem deficiência');
            return;
        }

        // Validar questão 16.3 - Conflito com agressor
        if (!isRadioChecked('q16-3-conflito-nao')) {
            mostrarErro('Por favor, responda sobre conflitos com o agressor relacionado aos filhos');
            return;
        }

        // Validar questão 16.4 - Filhos presenciaram violência
        if (!isRadioChecked('q16-4-presenciaram-violencia')) {
            mostrarErro('Por favor, responda se filhos presenciaram violência');
            return;
        }

        // Validar questão 16.5 - Violência durante gravidez
        if (!isRadioChecked('q16-5-violencia-gravidez')) {
            mostrarErro('Por favor, responda sobre violência durante gravidez');
            return;
        }
    }

    // Validar questão 17 - Novo relacionamento
    if (!isRadioChecked('q17-novo-relacionamento')) {
        mostrarErro('Por favor, responda sobre novo relacionamento e aumento de agressões');
        return;
    }

    // Validar questão 18 - Deficiência própria
    if (!isRadioChecked('q18-deficiencia')) {
        mostrarErro('Por favor, responda se tem alguma deficiência ou doença');
        return;
    }

    // Validar questão 19 - Cor/raça
    if (!isRadioChecked('cor')) {
        mostrarErro('Por favor, selecione sua cor/raça');
        return;
    }

    // Validar questão 20 - Mora em área de risco
    if (!isRadioChecked('q20-local-risco')) {
        mostrarErro('Por favor, responda se mora em área de risco');
        return;
    }

    // Validar questão 21 - Dependente financeira
    if (!isRadioChecked('q21-dependente-financeira')) {
        mostrarErro('Por favor, responda se é dependente financeira do agressor');
        return;
    }

    // Validar questão 22 - Aceita abrigamento
    if (!isRadioChecked('q22-abrigamento')) {
        mostrarErro('Por favor, responda se aceita abrigamento temporário');
        return;
    }

    // Agressor
    const idadeAgressorNumber = idadeAgressor ? parseInt(idadeAgressor) : 0;

    // Bloco I (Conversão de Array/String para Boolean)
    const ameacaFamiliar = ameacas.length > 0 && !ameacas.includes("Não");
    const agressaoFisica = (agressoesGraves.length > 0 && !agressoesGraves.includes("Não")) || (outrasAgressoes.length > 0);
    const outrasFormasViolencia = [...outrasAgressoes, ...comportamentos].join('; ');
    const abusoSexual = estupro === 'Sim';
    const comportamentosAgressor = comportamentos; 
    const ocorrenciaPolicialMedidaProtetivaAgressor = boMedida === 'Sim';
    const agressoesMaisFrequentesUltimamente = frequenciaAumento === 'Sim';

    // Bloco II (Conversão de String para Boolean)
    const usoDrogasAlcool = usoAbusivo; // Já é string[]
    const agressorCumpriuMedidaProtetiva = descumpriuMedida === 'Sim';
    const agressorTentativaSuicidio = tentativaSuicidio === 'Sim';
    const agressorAmeacouAlguem = ameacouAgrediuOutros.length > 0 ? "Sim" : "Não"; // O service espera STRING

    // Bloco III (Conversão de String/Number)
    const separacaoRecente = separacao; // O service espera STRING
    const qntFilhosComAgressorNumber = quantosComAgressor;
    const qntFilhosOutroRelacionamentoNumber = quantosDeOutro;
    

    // número de filhos com deficiência (se aplicável)
    const filhosComDeficiencia = (document.querySelector('input[name="q16-2-deficiencia"]:checked') as HTMLInputElement)?.value === 'Sim' ? parseInt((document.getElementById('q16-2-quantos-deficiencia') as HTMLInputElement)?.value || '0') : 0;
    const conflitoAgressor = conflitosComAgressor.join('; ');
    const filhosPresenciaramViolencia = temFilhos ? (document.querySelector('input[name="q16-4-presenciaram-violencia"]:checked') as HTMLInputElement)?.value === 'Sim' : false;
    const violenciaDuranteGravidez = temFilhos ? (document.querySelector('input[name="q16-5-violencia-gravidez"]:checked') as HTMLInputElement)?.value === 'Sim' : false;
    const novoRelacionamentoAumentouAgressao = (document.querySelector('input[name="q17-novo-relacionamento"]:checked') as HTMLInputElement)?.value === 'Sim'; 
    const possuiDeficienciaDoenca = qualDeficiencia;


    const dadosPasso1Mock = {
        nomeAssistida: "N/A", idadeAssistida: 0, identidadeGenero: "N/A", nomeSocial: "N/A", endereco: "N/A", 
        escolaridade: "N/A", religiao: "N/A", nacionalidade: "N/A", zonaHabitacao: "N/A", profissao: "N/A", 
        limitacaoFisica: "N/A", numeroCadastroSocial: "N/A", quantidadeDependentes: 0, temDependentes: false,
    };

    try {
        const dadosAssistidaJSON = sessionStorage.getItem('dadosAssistida');
        let assistidaDados: any = null;

        if (dadosAssistidaJSON) {
            try {
                const dadosRaw = JSON.parse(dadosAssistidaJSON);

                assistidaDados = {
                    protocoloAssistida: dadosRaw.protocolo || undefined,
                    nomeAssistida: dadosRaw.nome || "N/A",
                    idadeAssistida: dadosRaw.idade || 0,
                    identidadeGenero: dadosRaw.identidadeGenero || "N/A",
                    nomeSocial: dadosRaw.nomeSocial || "N/A",
                    endereco: dadosRaw.endereco || "N/A",
                    escolaridade: dadosRaw.escolaridade || "N/A",
                    religiao: dadosRaw.religiao || "N/A",
                    nacionalidade: dadosRaw.nacionalidade || "N/A",
                    zonaHabitacao: dadosRaw.zonaHabitacao || "N/A",
                    profissao: dadosRaw.profissao || "N/A",
                    limitacaoFisica: dadosRaw.limitacaoFisica || "N/A",
                    numeroCadastroSocial: dadosRaw.numeroCadastroSocial || "N/A",
                    quantidadeDependentes: dadosRaw.quantidadeDependentes || 0,
                    temDependentes: dadosRaw.temDependentes || false,
                };
            } catch (parseError) {
                console.error('Erro ao fazer parse dos dados da assistida:', parseError);
                assistidaDados = dadosPasso1Mock;
            }
        } else {
            console.warn('Dados da assistida não encontrados no localStorage');
            assistidaDados = dadosPasso1Mock;
        }

        const dadosParaServiceAtualizado = {
            ...assistidaDados,
            
            nomeAgressor,
            idadeAgresssor: idadeAgressorNumber,
            vinculoAssistida: vinculo,
            dataOcorrida: new Date(dataFato), 

            usoDrogasAlcool,
            doencaMental, 
            agressorCumpriuMedidaProtetiva,
            agressorTentativaSuicidio,
            agressorDesempregado: desempregadoDificuldades,
            agressorPossuiArmaFogo: acessoArmas,
            agressorAmeacouAlguem,

            ameacaFamiliar,
            agressaoFisica,
            outrasFormasViolencia,
            abusoSexual,
            comportamentosAgressor,
            ocorrenciaPolicialMedidaProtetivaAgressor,
            agressoesMaisFrequentesUltimamente,

            anotacoesLivres: "",
            moraEmAreaRisco: moraEmAreaRiscoRadio,
            dependenteFinanceiroAgressor: dependenteFinanceiroAgressorRadio,
            aceitaAbrigamentoTemporario: aceitaAbrigamentoTemporarioRadio,
            assistidaRespondeuSemAjuda: false,
            assistidaRespondeuComAuxilio: false,
            assistidaSemCondicoes: false,
            assistidaRecusou: false,
            terceiroComunicante: false,
            tipoViolencia: "",

            _ameacas: ameacas,
            _agressoesGraves: agressoesGraves,
            _outrasAgressoes: outrasAgressoes,
            _estupro: estupro,
            _comportamentos: comportamentos,
            _boMedida: boMedida,
            _frequenciaAumento: frequenciaAumento,
            _usoAbusivo: usoAbusivo,
            _doencaMental: doencaMental,
            _descumpriuMedida: descumpriuMedida,
            _tentativaSuicidio: tentativaSuicidio,
            _desempregadoDificuldades: desempregadoDificuldades,
            _acessoArmas: acessoArmas,
            _ameacouAgrediuOutros: ameacouAgrediuOutros,

            separacaoRecente, 
            temFilhosComAgressor: temFilhosComAgressor,
            qntFilhosComAgressor: qntFilhosComAgressorNumber, 
            temFilhosOutroRelacionamento: temFilhosDeOutro, 
            qntFilhosOutroRelacionamento: qntFilhosOutroRelacionamentoNumber, 
            faixaFilhos: faixaEtaria, 
            filhosComDeficiencia, 
            conflitoAgressor,
            filhosPresenciaramViolencia,
            violenciaDuranteGravidez, 
            novoRelacionamentoAumentouAgressao, 
            possuiDeficienciaDoenca,
            corRaca, 

            data: new Date(),
            profissionalResponsavel: "N/A",
            descricao: "",
        };

        sessionStorage.setItem('dadosCaso', JSON.stringify(dadosParaServiceAtualizado));
        window.api.openWindow("telaCadastro3");
   } catch (error) {
       console.error("Erro ao processar o formulário:", error);
       mostrarErro(error instanceof Error ? error.message : "Erro ao processar o formulário. Por favor, tente novamente.");
   }
});