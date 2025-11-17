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
import { Encaminhamento } from "../Rede-Apoio/Encaminhamento";

export class Caso {
    private protocoloCaso?: number;
    private historico: Historico;
    private anexos: Anexo[] = [];
    private encaminhamentos: Encaminhamento[] = [];
    private data: Date = new Date();
    private profissionalResponsavel: string = "";
    private descricao: string = "";

    private assistida?: Assistida;
    private agressor?: Agressor;
    private sobreAgressor?: SobreAgressor;
    private historicoViolencia?: HistoricoViolencia;
    private outrasInformacoesEncaminhamento?: OutrasInformacoesEncaminhamento;
    private outrasInformacoesImportantes?: OutrasInformacoesImportantes;
    private sobreVoce?: SobreVoce;
    private preenchimentoProfissional?: PreenchimentoProfissional;

    
    constructor(assistida?: Assistida) {
        this.historico = new Historico();
        if (assistida) {
            this.assistida = assistida;
        }
    }

    criarCaso(
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
        moraEmAreaRisco: string,
        dependenteFinanceiroAgressor: boolean,
        aceitaAbrigamentoTemporario: boolean,

        //Sobre voce
        separacaoRecente: string,
        temFilhosComAgressor: boolean,
        qntFilhosComAgressor: number,
        temFilhosOutroRelacionamento: boolean,
        qntFilhosOutroRelacionamento: number,
        faixaFilhos: string[],
        filhosComDeficiencia: number,
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
        this.protocoloCaso = 1;
        this.historico = new Historico();

        // Se a assistida já foi criada no construtor, use-a. Caso contrário, crie uma nova
        if (!this.assistida) {
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
        }
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

    public getAssistida(): Assistida | undefined {
        return this.assistida;
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

    public getHistorico(): Historico {
        return this.historico;
    }

    public getEncaminhamentos(): Encaminhamento[] {
        return this.encaminhamentos;
    }

    public getAgressor(): Agressor | undefined {
        return this.agressor;
    }

    public getSobreAgressor(): SobreAgressor | undefined {
        return this.sobreAgressor;
    }

    public getHistoricoViolencia(): HistoricoViolencia | undefined {
        return this.historicoViolencia;
    }

    public getOutrasInformacoesEncaminhamento(): OutrasInformacoesEncaminhamento | undefined {
        return this.outrasInformacoesEncaminhamento;
    }

    public getOutrasInformacoesImportantes(): OutrasInformacoesImportantes | undefined {
        return this.outrasInformacoesImportantes;
    }

    public getSobreVoce(): SobreVoce | undefined {
        return this.sobreVoce;
    }

    public getPreenchimentoProfissional(): PreenchimentoProfissional | undefined {
        return this.preenchimentoProfissional;
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

    public adicionarEncaminhamento(encaminhamento: Encaminhamento) {
        this.encaminhamentos.push(encaminhamento);
    }

    public toJSON() {
        return {
            protocoloCaso: this.protocoloCaso ?? 0,
            data: this.data ?? new Date(),
            profissionalResponsavel: this.profissionalResponsavel ?? "",
            descricao: this.descricao ?? "",
            assistida: this.assistida ? this.assistida.toJSON() : {
                nome: "",
                idade: 0,
                identidadeGenero: "",
                nomeSocial: "",
                endereco: "",
                escolaridade: "",
                religiao: "",
                nacionalidade: "",
                zonaHabitacao: "",
                profissao: "",
                limitacaoFisica: "",
                numeroCadastroSocial: "",
                quantidadeDependentes: 0,
                temDependentes: false
            },
            agressor: {
                nome: this.agressor?.getNome() ?? "",
                idade: this.agressor?.getIdade() ?? 0,
                vinculoAssistida: this.agressor?.getVinculoAssistida() ?? "",
                dataOcorrida: this.agressor?.getDataOcorrida() ?? new Date()
            },
            sobreAgressor: {
                usoDrogasAlcool: this.sobreAgressor?.getUsoDrogasAlcool() ?? [],
                doencaMental: this.sobreAgressor?.getDoencaMental() ?? "",
                agressorCumpriuMedidaProtetiva: this.sobreAgressor?.getAgressorCumpriuMedidaProtetiva() ?? false,
                agressorTentativaSuicidio: this.sobreAgressor?.getAgressorTentativaSuicidio() ?? false,
                agressorDesempregado: this.sobreAgressor?.getAgressorDesempregado() ?? "",
                agressorPossuiArmaFogo: this.sobreAgressor?.getAgressorPossuiArmaFogo() ?? "",
                agressorAmeacouAlguem: this.sobreAgressor?.getAgressorAmeacouAlguem() ?? ""
            },
            historicoViolencia: {
                ameacaFamiliar: this.historicoViolencia?.getAmeacaFamiliar() ?? false,
                agressaoFisica: this.historicoViolencia?.getAgressaoFisica() ?? false,
                outrasFormasViolencia: this.historicoViolencia?.getOutrasFormasViolencia() ?? "",
                abusoSexual: this.historicoViolencia?.getAbusoSexual() ?? false,
                comportamentosAgressor: this.historicoViolencia?.getComportamentosAgressor() ?? [],
                ocorrenciaPolicialMedidaProtetivaAgressor: this.historicoViolencia?.getOcorrenciaPolicialMedidaProtetivaAgressor() ?? false,
                agressoesMaisFrequentesUltimamente: this.historicoViolencia?.getAgressoesMaisFrequentesUltimamente() ?? false
            },
            outrasInformacoesEncaminhamento: {
                anotacoesLivres: this.outrasInformacoesEncaminhamento?.getAnotacoesLivres() ?? ""
            },
            outrasInformacoesImportantes: {
                moraEmAreaRisco: this.outrasInformacoesImportantes?.getMoraEmAreaRisco() ?? false,
                dependenteFinanceiroAgressor: this.outrasInformacoesImportantes?.getDependenteFinanceiroAgressor() ?? false,
                aceitaAbrigamentoTemporario: this.outrasInformacoesImportantes?.getAceitaAbrigamentoTemporario() ?? false
            },
            sobreVoce: {
                separacaoRecente: this.sobreVoce?.getSeparacaoRecente() ?? "",
                temFilhosComAgressor: this.sobreVoce?.getTemFilhosComAgressor() ?? false,
                qntFilhosComAgressor: this.sobreVoce?.getQntFilhosComAgressor() ?? 0,
                temFilhosOutroRelacionamento: this.sobreVoce?.getTemFilhosOutroRelacionamento() ?? false,
                qntFilhosOutroRelacionamento: this.sobreVoce?.getQntFilhosOutroRelacionamento() ?? 0,
                faixaFilhos: this.sobreVoce?.getFaixaFilhos() ?? [],
                filhosComDeficiencia: this.sobreVoce?.getFilhosComDeficiencia() ?? false,
                conflitoAgressor: this.sobreVoce?.getConflitoAgressor() ?? "",
                filhosPresenciaramViolencia: this.sobreVoce?.getFilhosPresenciaramViolencia() ?? false,
                violenciaDuranteGravidez: this.sobreVoce?.getViolenciaDuranteGravidez() ?? false,
                novoRelacionamentoAumentouAgressao: this.sobreVoce?.getNovoRelacionamentoAumentouAgressao() ?? false,
                possuiDeficienciaDoenca: this.sobreVoce?.getPossuiDeficienciaDoenca() ?? "",
                corRaca: this.sobreVoce?.getCorRaca() ?? ""
            },
            preenchimentoProfissional: {
                assistidaRespondeuSemAjuda: this.preenchimentoProfissional?.getAssistidaRespondeuSemAjuda() ?? false,
                assistidaRespondeuComAuxilio: this.preenchimentoProfissional?.getAssistidaRespondeuComAuxilio() ?? false,
                assistidaSemCondicoes: this.preenchimentoProfissional?.getAssistidaSemCondicoes() ?? false,
                assistidaRecusou: this.preenchimentoProfissional?.getAssistidaRecusou() ?? false,
                terceiroComunicante: this.preenchimentoProfissional?.getTerceiroComunicante() ?? false,
                tipoViolencia: this.preenchimentoProfissional?.getTipoViolencia() ?? ""
            },
            anexos: this.anexos ?? [],
            encaminhamentos: this.encaminhamentos ?? []
        };
    }
}