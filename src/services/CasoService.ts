import { Caso } from "../models/Caso/Caso";
import { Historico } from "../models/Caso/Historico";

export class CasoService {

    private caso: Caso = new Caso();

    criarCaso(dados: {
        // Assistida
        nomeAssistida: string;
        idadeAssistida: number;
        identidadeGenero: string;
        nomeSocial: string;
        endereco: string;
        escolaridade: string;
        religiao: string;
        nacionalidade: string;
        zonaHabitacao: string;
        profissao: string;
        limitacaoFisica: string;
        numeroCadastroSocial: string;
        quantidadeDependentes: number;
        temDependentes: boolean;
        // Agressor
        nomeAgressor: string;
        idadeAgresssor: number;
        vinculoAssistida: string;
        dataOcorrida: Date;
        // SobreAgressor
        usoDrogasAlcool: string[];
        doencaMental: string;
        agressorCumpriuMedidaProtetiva: boolean;
        agressorTentativaSuicidio: boolean;
        agressorDesempregado: string;
        agressorPossuiArmaFogo: string;
        agressorAmeacouAlguem: string;
        // Historico Violencia
        ameacaFamiliar: boolean;
        agressaoFisica: boolean;
        outrasFormasViolencia: string;
        abusoSexual: boolean;
        comportamentosAgressor: string[];
        ocorrenciaPolicialMedidaProtetivaAgressor: boolean;
        agressoesMaisFrequentesUltimamente: boolean;
        // Outras Infor
        anotacoesLivres: string;
        // PreenchimentoProfissional
        assistidaRespondeuSemAjuda: boolean;
        assistidaRespondeuComAuxilio: boolean;
        assistidaSemCondicoes: boolean;
        assistidaRecusou: boolean;
        terceiroComunicante: boolean;
        tipoViolencia: string;
        // Outras Infor Importantes
        moraEmAreaRisco: boolean;
        dependenteFinanceiroAgressor: boolean;
        aceitaAbrigamentoTemporario: boolean;
        // Sobre voce
        separacaoRecente: string;
        temFilhosComAgressor: boolean;
        qntFilhosComAgressor: number;
        temFilhosOutroRelacionamento: boolean;
        qntFilhosOutroRelacionamento: number;
        faixaFilhos: string[];
        filhosComDeficiencia: boolean;
        conflitoAgressor: string;
        filhosPresenciaramViolencia: boolean;
        violenciaDuranteGravidez: boolean;
        novoRelacionamentoAumentouAgressao: boolean;
        possuiDeficienciaDoenca: string;
        corRaca: string;
        // Caso
        data: Date;
        profissionalResponsavel: string;
        descricao: string;
    }) {
        this.caso = new Caso();
        this.caso.criarCaso(
            dados.nomeAssistida,
            dados.idadeAssistida,
            dados.identidadeGenero,
            dados.nomeSocial,
            dados.endereco,
            dados.escolaridade,
            dados.religiao,
            dados.nacionalidade,
            dados.zonaHabitacao,
            dados.profissao,
            dados.limitacaoFisica,
            dados.numeroCadastroSocial,
            dados.quantidadeDependentes,
            dados.temDependentes,
            dados.nomeAgressor,
            dados.idadeAgresssor,
            dados.vinculoAssistida,
            dados.dataOcorrida,
            dados.usoDrogasAlcool,
            dados.doencaMental,
            dados.agressorCumpriuMedidaProtetiva,
            dados.agressorTentativaSuicidio,
            dados.agressorDesempregado,
            dados.agressorPossuiArmaFogo,
            dados.agressorAmeacouAlguem,
            dados.ameacaFamiliar,
            dados.agressaoFisica,
            dados.outrasFormasViolencia,
            dados.abusoSexual,
            dados.comportamentosAgressor,
            dados.ocorrenciaPolicialMedidaProtetivaAgressor,
            dados.agressoesMaisFrequentesUltimamente,
            dados.anotacoesLivres,
            dados.assistidaRespondeuSemAjuda,
            dados.assistidaRespondeuComAuxilio,
            dados.assistidaSemCondicoes,
            dados.assistidaRecusou,
            dados.terceiroComunicante,
            dados.tipoViolencia,
            dados.moraEmAreaRisco,
            dados.dependenteFinanceiroAgressor,
            dados.aceitaAbrigamentoTemporario,
            dados.separacaoRecente,
            dados.temFilhosComAgressor,
            dados.qntFilhosComAgressor,
            dados.temFilhosOutroRelacionamento,
            dados.qntFilhosOutroRelacionamento,
            dados.faixaFilhos,
            dados.filhosComDeficiencia,
            dados.conflitoAgressor,
            dados.filhosPresenciaramViolencia,
            dados.violenciaDuranteGravidez,
            dados.novoRelacionamentoAumentouAgressao,
            dados.possuiDeficienciaDoenca,
            dados.corRaca,
            dados.data,
            dados.profissionalResponsavel,
            dados.descricao
        );
    }

    public getCaso(): Caso {
        return this.caso;
    }
}