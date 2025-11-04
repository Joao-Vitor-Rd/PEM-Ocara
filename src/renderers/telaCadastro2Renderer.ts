/// <reference path="../types/windown.d.ts" />

export {}

const pxmBtn = document.getElementById('proximo') as HTMLButtonElement; 
const voltarBtn = document.getElementById('voltar') as HTMLButtonElement;
const errorModal = document.getElementById('error-modal') as HTMLDivElement;
const modalMessage = document.getElementById('modal-message') as HTMLDivElement;

voltarBtn.addEventListener('click', async (event) => {
    const mudarTela = await window.api.openWindow("telaCadastroAssistida");
});

const isRadioChecked = (name: string): boolean => {
    return document.querySelector(`input[name="${name}"]:checked`) !== null;
};

const isCheckboxGroupChecked = (selector: string): boolean => {
    return document.querySelectorAll(selector).length > 0;
};

pxmBtn.addEventListener('click', async (event) => {

    event.preventDefault();

    // Passo 2: Dados do Agressor
    const nomeAgressor = (document.getElementById('nome-completo-agressor') as HTMLInputElement).value.trim();
    const idadeAgressor = (document.getElementById('idade') as HTMLInputElement).value.trim();
    const vinculo = (document.getElementById('vinculo') as HTMLInputElement).value.trim();
    const dataFato = (document.getElementById('data-fato') as HTMLInputElement).value.trim();

    // Bloco I - Sobre o Histórico de Violência
    const ameacas: string[] = Array.from(document.querySelectorAll('input[name^="ameaca-"]:checked')).map(input => (input as HTMLInputElement).value);
    const agressoesGraves: string[] = Array.from(document.querySelectorAll('input[name^="agressões-"][name$="queimadura"], input[name^="agressões-"][name$="enforcamento"], input[name^="agressões-"][name$="sufocamento"], input[name^="agressões-"][name$="tiro"], input[name^="agressões-"][name$="afogamento"], input[name^="agressões-"][name$="facada"], input[name^="agressões-"][name$="paulada"], input[id="q02-agressao-nenhuma"]'))
        .map(input => (input as HTMLInputElement).value);
    const outrasAgressoes: string[] = Array.from(document.querySelectorAll('input[id^="q03-agressao-"]:checked'))
        .filter(input => (input as HTMLInputElement).id !== 'q03-agressao-nenhuma')
        .map(input => (input as HTMLInputElement).value);
    const estupro = (document.querySelector('input[name="q04-estupro"]:checked') as HTMLInputElement)?.value;
    const comportamentos: string[] = Array.from(document.querySelectorAll('input[id^="q05-comportamento-"]:checked'))
        .filter(input => (input as HTMLInputElement).id !== 'q05-comportamento-nenhum')
        .map(input => {
            const label = (input as HTMLInputElement).labels?.[0];
            return label?.textContent?.trim() || '';
        })
        .filter(text => text !== '');
    const boMedida = (document.querySelector('input[name="q06-bo-medida"]:checked') as HTMLInputElement)?.value;
    const frequenciaAumento = (document.querySelector('input[name="q07-frequencia-aumento"]:checked') as HTMLInputElement)?.value;

    // Bloco II - Sobre o (a) Agressor(a)
    const usoAbusivo: string[] = Array.from(document.querySelectorAll('input[id^="q08-uso-abusivo-"]:checked'))
        .filter(input => (input as HTMLInputElement).id !== 'q08-uso-abusivo-nao' && (input as HTMLInputElement).id !== 'q08-uso-abusivo-nao-sei')
        .map(input => {
            const label = (input as HTMLInputElement).labels?.[0];
            return label?.textContent?.trim() || '';
        })
        .filter(text => text !== '');
    const doencaMental = (document.querySelector('input[name="q09-doenca-mental"]:checked') as HTMLInputElement)?.value;
    const descumpriuMedida = (document.querySelector('input[name="q10-descumpriu-medida"]:checked') as HTMLInputElement)?.value;
    const tentativaSuicidio = (document.querySelector('input[name="q11-tentativa-suicidio"]:checked') as HTMLInputElement)?.value;
    const desempregadoDificuldades = (document.querySelector('input[name="q12-desempregado-dificuldades"]:checked') as HTMLInputElement)?.value;
    const acessoArmas = (document.querySelector('input[name="q13-acesso-armas"]:checked') as HTMLInputElement)?.value;
    const ameacouAgrediuOutros: string[] = Array.from(document.querySelectorAll('input[id^="q14-ameacou-agrediu-"]:checked'))
        .filter(input => (input as HTMLInputElement).id !== 'q14-ameacou-agrediu-nao' && (input as HTMLInputElement).id !== 'q14-ameacou-agrediu-nao-sei')
        .map(input => {
            const label = (input as HTMLInputElement).labels?.[0];
            return label?.textContent?.trim() || '';
        })
        .filter(text => text !== '');    // Bloco III - Sobre Você
    const separacao = (document.querySelector('input[name="q15-separacao"]:checked') as HTMLInputElement)?.value;
    const temFilhosComAgressor = (document.getElementById('q16-tem-filhos-sim-agressor') as HTMLInputElement).checked;
    const quantosComAgressor = temFilhosComAgressor ? parseInt((document.getElementById('q16-quantos-agressor') as HTMLInputElement).value) : 0;
    const temFilhosDeOutro = (document.getElementById('q16-tem-filhos-sim-outro') as HTMLInputElement).checked;
    const quantosDeOutro = temFilhosDeOutro ? parseInt((document.getElementById('q16-quantos-outro') as HTMLInputElement).value) : 0;
    const temFilhosNao = (document.getElementById('q16-tem-filhos-nao') as HTMLInputElement).checked;
    const temFilhos = temFilhosComAgressor || temFilhosDeOutro;

    let faixaEtaria: string[] = [];
    if (temFilhos) {
        faixaEtaria = Array.from(document.querySelectorAll('input[id^="q16-1-faixa-etaria-"]:checked'))
            .map(input => {
                const label = (input as HTMLInputElement).labels?.[0];
                return label?.textContent?.trim() || '';
            })
            .filter(text => text !== '');
    }
    

    if (!nomeAgressor || !vinculo || !dataFato || !isRadioChecked('q04-estupro') || !isRadioChecked('q06-bo-medida') || 
        !isRadioChecked('q07-frequencia-aumento') || !isRadioChecked('q10-descumpriu-medida') || !isRadioChecked('q11-tentativa-suicidio') || 
        !isRadioChecked('q12-desempregado-dificuldades') || !isRadioChecked('q13-acesso-armas') || !isRadioChecked('q15-separacao')) {
        
        modalMessage.textContent = "Por favor, preencha todos os campos obrigatórios (marcados com *).";
        errorModal.style.display = 'flex';
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
    

    const filhosComDeficiencia = false; 
    const conflitoAgressor = ""; 
    const filhosPresenciaramViolencia = false;
    const violenciaDuranteGravidez = false;
    const novoRelacionamentoAumentouAgressao = false; 
    const possuiDeficienciaDoenca = "";
    const corRaca = ""; 


    const dadosPasso1Mock = {
        nomeAssistida: "N/A", idadeAssistida: 0, identidadeGenero: "N/A", nomeSocial: "N/A", endereco: "N/A", 
        escolaridade: "N/A", religiao: "N/A", nacionalidade: "N/A", zonaHabitacao: "N/A", profissao: "N/A", 
        limitacaoFisica: "N/A", numeroCadastroSocial: "N/A", quantidadeDependentes: 0, temDependentes: false,
    };

    try {
        // Recuperar dados da assistida armazenados no localStorage
        const dadosAssistidaJSON = localStorage.getItem('dadosAssistida');
        let assistidaDados: any = null;

        if (dadosAssistidaJSON) {
            try {
                assistidaDados = JSON.parse(dadosAssistidaJSON);
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
            
            // Agressor
            nomeAgressor,
            idadeAgresssor: idadeAgressorNumber,
            vinculoAssistida: vinculo,
            dataOcorrida: new Date(dataFato), // Convertido para Date
            
            // SobreAgressor
            usoDrogasAlcool,
            doencaMental, // STRING (do service)
            agressorCumpriuMedidaProtetiva, // BOOLEAN
            agressorTentativaSuicidio, // BOOLEAN
            agressorDesempregado: desempregadoDificuldades, // STRING (do service)
            agressorPossuiArmaFogo: acessoArmas, // STRING (do service)
            agressorAmeacouAlguem, // STRING
            
            // Historico Violencia
            ameacaFamiliar, // BOOLEAN
            agressaoFisica, // BOOLEAN
            outrasFormasViolencia, // STRING
            abusoSexual, // BOOLEAN
            comportamentosAgressor, // STRING[]
            ocorrenciaPolicialMedidaProtetivaAgressor, // BOOLEAN
            agressoesMaisFrequentesUltimamente, // BOOLEAN
            
            // Outras Infor
            anotacoesLivres: "",
            moraEmAreaRisco: false,
            dependenteFinanceiroAgressor: false,
            aceitaAbrigamentoTemporario: false,
            assistidaRespondeuSemAjuda: false,
            assistidaRespondeuComAuxilio: false,
            assistidaSemCondicoes: false,
            assistidaRecusou: false,
            terceiroComunicante: false,
            tipoViolencia: "",

            // Sobre voce (Bloco III)
            separacaoRecente, // STRING (do service)
            temFilhosComAgressor: temFilhosComAgressor, // BOOLEAN
            qntFilhosComAgressor: qntFilhosComAgressorNumber, // NUMBER
            temFilhosOutroRelacionamento: temFilhosDeOutro, // BOOLEAN
            qntFilhosOutroRelacionamento: qntFilhosOutroRelacionamentoNumber, // NUMBER
            faixaFilhos: faixaEtaria, // STRING[]
            filhosComDeficiencia, // BOOLEAN (fallback)
            conflitoAgressor, // STRING (fallback)
            filhosPresenciaramViolencia, // BOOLEAN (fallback)
            violenciaDuranteGravidez, // BOOLEAN (fallback)
            novoRelacionamentoAumentouAgressao, // BOOLEAN (fallback)
            possuiDeficienciaDoenca, // STRING (fallback)
            corRaca, // STRING (fallback)

            // Dados do Caso
            data: new Date(),
            profissionalResponsavel: "N/A",
            descricao: "",
        };

        const result = await window.api.criarCaso(dadosParaServiceAtualizado);
        
        if (result.success && result.caso) {
            modalMessage.innerHTML = `<p>✅ Caso cadastrado com sucesso! Protocolo: ${result.caso.getProtocoloCaso()}</p>`;
            errorModal.style.display = 'flex';
            // Limpar localStorage após sucesso
            localStorage.removeItem('dadosAssistida');
        } else {
            throw new Error(result.error || 'Erro desconhecido ao criar caso');
        }
   } catch (error) {
       console.error("Erro ao processar o formulário:", error);
       modalMessage.innerHTML = `<p>❌ Ocorreu um erro: ${(error as Error).message}</p>`;
       errorModal.style.display = 'flex';
   }
});