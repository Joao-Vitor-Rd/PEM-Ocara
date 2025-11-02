import { Anexo } from "../assistida/Anexo"
import { Assistida } from "../assistida/Assistida";
import { Agressor } from "./Agressor";
import { HistoricoViolencia } from "./HistoricoViolencia";
import { OutrasInformacoesEncaminhamento } from "./OutrasInformacoesEncaminhamento";
import { OutrasInformacoesImportantes } from "./OutrasInformacoesImportantes";
import { PreenchimentoProfissional } from "./PreenchimentoProfissional";
import { SobreAgressor } from "./SobreAgressor";
import { SobreVoce } from "./SobreVoce";
import { Historico } from "./Historico";

export class Caso {
    private protocoloCaso?: number;
    private historico: Historico;
    private anexos: Anexo[] = [];
    private data: Date;
    private profissionalResponsavel: string;
    private descricao: string;

    private assistida: Assistida;
    private agressor: Agressor;
    private sobreAgressor: SobreAgressor;
    private historicoViolencia: HistoricoViolencia;
    private outrasInformacoesEncaminhamento: OutrasInformacoesEncaminhamento;
    private outrasInformacoesImportantes: OutrasInformacoesImportantes;
    private sobreVoce: SobreVoce;
    private preenchimentoProfissional: PreenchimentoProfissional;

    constructor(

        historico: Historico,
        nomeAssistida: string,
        idadeAssistida: number,
        identidadeGenero: string,
        nomeSocial: string,
        endereco: string,
        escolaridade: string,
        religiao: string,
        nacionalidade: string,
        zonaHabitacao: string,
        profissao: string,
        limitacaoFisica: string,
        numeroCadastroSocial: string,
        quanidadeDependentes: number,
        temDependentes: boolean,

        //Agressor
        nomeAgressor: string,
        idadeAgresssor: number,
        vinculoAssistida: string,
        dataOcorrida: Date,

        //SobreAgressor
        usoDrogasAlcool: string[],
        doencaMental: string,
        agressorCumpriuMedidaProtetiva: boolean,
        agressorTentativaSuicidio: boolean,
        agressorDesempregado: string,
        agressorPossuiArmaFogo: string,
        agressorAmeacouAlguem: string,

        //Historico Violencia
        ameacaFamiliar: boolean,
        agressaoFisica: boolean,
        outrasFormasViolencia: string,
        abusoSexual: boolean,
        comportamentosAgressor: string[],
        ocorrenciaPolicialMedidaProtetivaAgressor: boolean,
        agressoesMaisFrequentesUltimamente: boolean,

        //Outras Infor
        anotacoesLivres: string, 

        //PreenchimentoProfissional
        assistidaRespondeuSemAjuda: boolean,
        assistidaRespondeuComAuxilio: boolean,
        assistidaSemCondicoes: boolean,
        assistidaRecusou: boolean,
        terceiroComunicante: boolean,
        tipoViolencia: string,

        //Outras Infor Importantes
        moraEmAreaRisco: boolean,
        dependenteFinanceiroAgressor: boolean,
        aceitaAbrigamentoTemporario: boolean,

        //Sobre voce
        separacaoRecente: string,
        temFilhosComAgressor: boolean,
        qntFilhosComAgressor: number,
        temFilhosOutroRelacionamento: boolean,
        qntFilhosOutroRelacionamento: number,
        faixaFilhos: string[],
        filhosComDeficiencia: boolean,
        conflitoAgressor: string,
        filhosPresenciaramViolencia: boolean,
        violenciaDuranteGravidez: boolean,
        novoRelacionamentoAumentouAgressao: boolean,
        possuiDeficienciaDoenca: string,
        corRaca: string,

        data: Date, 
        profissionalResponsavel: string, 
        descricao: string 
    
    ) {
        this.historico = new Historico();

        this.assistida = new Assistida(
            nomeAssistida,
            idadeAssistida,
            identidadeGenero,
            nomeSocial,
            endereco,
            escolaridade,
            religiao,
            nacionalidade,
            zonaHabitacao,
            profissao,
            limitacaoFisica,
            numeroCadastroSocial,
            quanidadeDependentes,
            temDependentes
        );
        this.agressor = new Agressor(
            nomeAgressor,
            idadeAgresssor,
            vinculoAssistida,
            dataOcorrida
        );

        this.sobreAgressor = new SobreAgressor(
            usoDrogasAlcool,
            doencaMental,
            agressorCumpriuMedidaProtetiva,
            agressorTentativaSuicidio,
            agressorDesempregado,
            agressorPossuiArmaFogo,
            agressorAmeacouAlguem
        );

        this.historicoViolencia = new HistoricoViolencia(
            ameacaFamiliar,
            agressaoFisica,
            outrasFormasViolencia,
            abusoSexual,
            comportamentosAgressor,
            ocorrenciaPolicialMedidaProtetivaAgressor,
            agressoesMaisFrequentesUltimamente
        );

        this.outrasInformacoesEncaminhamento = new OutrasInformacoesEncaminhamento(
            anotacoesLivres
        );

        this.outrasInformacoesImportantes = new OutrasInformacoesImportantes(
            moraEmAreaRisco,
            dependenteFinanceiroAgressor,
            aceitaAbrigamentoTemporario
        );

        this.sobreVoce = new SobreVoce(
            separacaoRecente,
            temFilhosComAgressor,
            qntFilhosComAgressor,
            temFilhosOutroRelacionamento,
            qntFilhosOutroRelacionamento,
            faixaFilhos,
            filhosComDeficiencia,
            conflitoAgressor,
            filhosPresenciaramViolencia,
            violenciaDuranteGravidez,
            novoRelacionamentoAumentouAgressao,
            possuiDeficienciaDoenca,
            corRaca
        );

        this.preenchimentoProfissional = new PreenchimentoProfissional(
            assistidaRespondeuSemAjuda,
            assistidaRespondeuComAuxilio,
            assistidaSemCondicoes,
            assistidaRecusou,
            terceiroComunicante,
            tipoViolencia
        );

        this.data = data;
        this.profissionalResponsavel = profissionalResponsavel;
        this.descricao = descricao;
    }

    // Getters
    public getProtocoloCaso(): number | undefined {
        return this.protocoloCaso;
    }

    public getAnexos(): Anexo[] {
        return this.anexos;
    }

    public getAnexoById(idAnexo: number): Anexo | undefined{
        return this.anexos.find(anexos => anexos.getidAnexo() === idAnexo);
    }

    public getData(): Date {
        return this.data;
    }   

    public getProfissionalResponsavel(): string {
        return this.profissionalResponsavel;
    }   

    public getDescricao(): string { 
        return this.descricao;
    }

    

    //Setters
    public setAnexos(anexos: Anexo[]) {
        this.anexos = anexos;
    }

    public setProtocoloCaso(protocoloCaso: number) {
        this.protocoloCaso = protocoloCaso;
    }


    public setData(data: Date) {
        this.data = data;
    }

    public setProfissionalResponsavel(profissionalResponsavel: string) {
        this.profissionalResponsavel = profissionalResponsavel;
    } 

    public setDescricao(descricao: string) {
        this.descricao = descricao;
    }

    

}