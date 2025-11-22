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
    constructor(assistida) {
        this.anexos = [];
        this.encaminhamentos = [];
        this.data = new Date();
        this.profissionalResponsavel = "";
        this.descricao = "";
        this.historico = new Historico();
        if (assistida) {
            this.assistida = assistida;
        }
    }
    criarCaso(nomeAssistida, idadeAssistida, identidadeGenero, nomeSocial, endereco, escolaridade, religiao, nacionalidade, zonaHabitacao, profissao, limitacaoFisica, numeroCadastroSocial, quanidadeDependentes, temDependentes, 
    //Agressor
    nomeAgressor, idadeAgresssor, vinculoAssistida, dataOcorrida, 
    //SobreAgressor
    usoDrogasAlcool, doencaMental, agressorCumpriuMedidaProtetiva, agressorTentativaSuicidio, agressorDesempregado, agressorPossuiArmaFogo, agressorAmeacouAlguem, 
    //Historico Violencia
    ameacaFamiliar, agressaoFisica, outrasFormasViolencia, abusoSexual, comportamentosAgressor, ocorrenciaPolicialMedidaProtetivaAgressor, agressoesMaisFrequentesUltimamente, 
    //Outras Infor
    anotacoesLivres, 
    //PreenchimentoProfissional
    assistidaRespondeuSemAjuda, assistidaRespondeuComAuxilio, assistidaSemCondicoes, assistidaRecusou, terceiroComunicante, tipoViolencia, 
    //Outras Infor Importantes
    moraEmAreaRisco, dependenteFinanceiroAgressor, aceitaAbrigamentoTemporario, 
    //Sobre voce
    separacaoRecente, temFilhosComAgressor, qntFilhosComAgressor, temFilhosOutroRelacionamento, qntFilhosOutroRelacionamento, faixaFilhos, filhosComDeficiencia, conflitoAgressor, filhosPresenciaramViolencia, violenciaDuranteGravidez, novoRelacionamentoAumentouAgressao, possuiDeficienciaDoenca, corRaca, data, profissionalResponsavel, descricao) {
        this.protocoloCaso = 1;
        this.historico = new Historico();
        // Se a assistida já foi criada no construtor, use-a. Caso contrário, crie uma nova
        if (!this.assistida) {
            this.assistida = new Assistida(nomeAssistida, idadeAssistida, identidadeGenero, nomeSocial, endereco, escolaridade, religiao, nacionalidade, zonaHabitacao, profissao, limitacaoFisica, numeroCadastroSocial, quanidadeDependentes, temDependentes);
        }
        this.agressor = new Agressor(nomeAgressor, idadeAgresssor, vinculoAssistida, dataOcorrida);
        this.sobreAgressor = new SobreAgressor(usoDrogasAlcool, doencaMental, agressorCumpriuMedidaProtetiva, agressorTentativaSuicidio, agressorDesempregado, agressorPossuiArmaFogo, agressorAmeacouAlguem);
        this.historicoViolencia = new HistoricoViolencia(ameacaFamiliar, agressaoFisica, outrasFormasViolencia, abusoSexual, comportamentosAgressor, ocorrenciaPolicialMedidaProtetivaAgressor, agressoesMaisFrequentesUltimamente);
        this.outrasInformacoesEncaminhamento = new OutrasInformacoesEncaminhamento(anotacoesLivres);
        this.outrasInformacoesImportantes = new OutrasInformacoesImportantes(moraEmAreaRisco, dependenteFinanceiroAgressor, aceitaAbrigamentoTemporario);
        this.sobreVoce = new SobreVoce(separacaoRecente, temFilhosComAgressor, qntFilhosComAgressor, temFilhosOutroRelacionamento, qntFilhosOutroRelacionamento, faixaFilhos, filhosComDeficiencia, conflitoAgressor, filhosPresenciaramViolencia, violenciaDuranteGravidez, novoRelacionamentoAumentouAgressao, possuiDeficienciaDoenca, corRaca);
        this.preenchimentoProfissional = new PreenchimentoProfissional(assistidaRespondeuSemAjuda, assistidaRespondeuComAuxilio, assistidaSemCondicoes, assistidaRecusou, terceiroComunicante, tipoViolencia);
        this.data = data;
        this.profissionalResponsavel = profissionalResponsavel;
        this.descricao = descricao;
    }
    // Getters
    getProtocoloCaso() {
        return this.protocoloCaso;
    }
    getAssistida() {
        return this.assistida;
    }
    getAnexos() {
        return this.anexos;
    }
    getAnexoById(idAnexo) {
        return this.anexos.find(anexos => anexos.getidAnexo() === idAnexo);
    }
    getData() {
        return this.data;
    }
    getProfissionalResponsavel() {
        return this.profissionalResponsavel;
    }
    getDescricao() {
        return this.descricao;
    }
    getHistorico() {
        return this.historico;
    }
    getEncaminhamentos() {
        return this.encaminhamentos;
    }
    getAgressor() {
        return this.agressor;
    }
    getSobreAgressor() {
        return this.sobreAgressor;
    }
    getHistoricoViolencia() {
        return this.historicoViolencia;
    }
    getOutrasInformacoesEncaminhamento() {
        return this.outrasInformacoesEncaminhamento;
    }
    getOutrasInformacoesImportantes() {
        return this.outrasInformacoesImportantes;
    }
    getSobreVoce() {
        return this.sobreVoce;
    }
    getPreenchimentoProfissional() {
        return this.preenchimentoProfissional;
    }
    //Setters
    setAnexos(anexos) {
        this.anexos = anexos;
    }
    setProtocoloCaso(protocoloCaso) {
        this.protocoloCaso = protocoloCaso;
    }
    setData(data) {
        this.data = data;
    }
    setProfissionalResponsavel(profissionalResponsavel) {
        this.profissionalResponsavel = profissionalResponsavel;
    }
    setDescricao(descricao) {
        this.descricao = descricao;
    }
    adicionarEncaminhamento(encaminhamento) {
        this.encaminhamentos.push(encaminhamento);
    }
    toJSON() {
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
                agressorAmeacouAlguem: this.sobreAgressor?.getAgressorAmeacouAlguem() ?? []
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
                tipoViolencia: this.preenchimentoProfissional?.getTipoViolencia() ?? []
            },
            anexos: this.anexos ?? [],
            encaminhamentos: this.encaminhamentos ?? []
        };
    }
}
