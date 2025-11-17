import { Caso } from "../models/Caso/Caso";
import { AssistidaService } from "./AssistidaService";



export class CasoService {

    private assistidaService: AssistidaService;
    private casos: Caso[] = [];

    constructor(assistidaService?: AssistidaService) {
        this.assistidaService = assistidaService || new AssistidaService();
    }
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
        moraEmAreaRisco: string;
        dependenteFinanceiroAgressor: boolean;
        aceitaAbrigamentoTemporario: boolean;
        // Sobre voce
        separacaoRecente: string;
        temFilhosComAgressor: boolean;
        qntFilhosComAgressor: number;
        temFilhosOutroRelacionamento: boolean;
        qntFilhosOutroRelacionamento: number;
        faixaFilhos: string[];
        filhosComDeficiencia: number;
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
        // Se foi passado um protocoloAssistida, busca a assistida existente
        // Senão, cria uma nova
        let assistida = null;
        if ((dados as any).protocoloAssistida) {
            assistida = this.assistidaService.getAssistidaPorProtocolo((dados as any).protocoloAssistida);
        }
        
        if (!assistida) {
            assistida = this.assistidaService.criarAssistida(
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
                dados.temDependentes
            );
        }

        // Criar o caso COM a assistida já setada para não criar outra
        const novoCaso = new Caso(assistida);

        novoCaso.criarCaso(
            assistida.getNome(),
            assistida.getIdade(),
            assistida.getIdentidadeGenero(),
            assistida.getNomeSocial(),
            assistida.getEndereco(),
            assistida.getEscolaridade(),
            assistida.getReligiao(),
            assistida.getNacionalidade(),
            assistida.getZonaHabitacao(),
            assistida.getProfissao(),
            assistida.getLimitacaoFisica(),
            assistida.getNumeroCadastroSocial(),
            assistida.getQuantidadeDependentes(),
            assistida.getTemDependentes(),
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
        

        const protocoloAssistida = novoCaso.getAssistida()?.getProtocolo() || 0;
        
        this.assistidaService.addCasoAAssistida(protocoloAssistida, novoCaso);
        this.casos.push(novoCaso);

        return novoCaso;
    }

    public getCaso(protocolo: number): Caso | undefined {
        return this.casos.find(caso => caso.getProtocoloCaso() === protocolo);
    }

    public getCasosPorProtocoloAssistida(protocoloAssistida: number): Caso[] {
        const casosFiltrados = this.casos.filter(caso => caso.getAssistida()?.getProtocolo() === protocoloAssistida);
        
        return casosFiltrados;
    }
}