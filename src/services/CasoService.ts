import { Caso } from "../models/Caso/Caso";
import { Anexo } from "../models/assistida/Anexo";
import { AssistidaService } from "./AssistidaService";
import { ICasoRepository } from "../repository/ICasoRepository";
import { IAnexoRepository } from "../repository/IAnexoRepository";

export class CasoService {

    private assistidaService: AssistidaService;
    private casoRepository: ICasoRepository;
    private anexoRepository?: IAnexoRepository;
    private casos: Caso[] = [];

    constructor(assistidaService: AssistidaService, casoRepository: ICasoRepository, anexoRepository?: IAnexoRepository) {
        this.assistidaService = assistidaService;
        this.casoRepository = casoRepository;
        this.anexoRepository = anexoRepository;
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
        agressorAmeacouAlguem: string[];
        // Historico Violencia
        ameacaFamiliar: string[];
        agressaoFisica: string[];
        outrasFormasViolencia: string[];
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
        // Anexos
        anexos?: any[];
    
    }) {
        // Criar nova assistida sempre
        const assistida = this.assistidaService.criarAssistida(
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
            Array.isArray(dados.tipoViolencia) ? dados.tipoViolencia : [dados.tipoViolencia],
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

        // Adicionar anexos se houver
        if (dados.anexos && Array.isArray(dados.anexos) && dados.anexos.length > 0) {
            const anexosObjetos = dados.anexos.map((a: any) => 
                new Anexo(a.nome || a.nomeAnexo || '', a.tamanho || 0, a.tipo || '', a.dados || null)
            );
            novoCaso.setAnexos(anexosObjetos);
        }

        const protocoloAssistida = novoCaso.getAssistida()?.getProtocolo() || 0;
        
        this.casos.push(novoCaso);

        return novoCaso;
    }
    
    public instanciarCasoSemSalvar(dados: any): Caso {
        
        const assistida = this.assistidaService.criarAssistida(
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
        
        const novoCaso = new Caso(assistida);

        const dataOcorridaConvertida = dados.dataOcorrida ? new Date(dados.dataOcorrida) : new Date();
        const dataAtendimentoConvertida = dados.data ? new Date(dados.data) : new Date();

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
            dataOcorridaConvertida,
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
            dataAtendimentoConvertida,
            dados.profissionalResponsavel,
            dados.descricao
        );

        novoCaso.setProtocoloCaso(0);

        // Adicionar anexos se houver
        if (dados.anexos && Array.isArray(dados.anexos) && dados.anexos.length > 0) {
            const anexosObjetos = dados.anexos.map((a: any) => 
                new Anexo(a.nome || a.nomeAnexo || '', a.tamanho || 0, a.tipo || '', a.dados || null)
            );
            novoCaso.setAnexos(anexosObjetos);
        }

        return novoCaso;
    }
    public getCaso(protocolo: number): Caso | undefined {
        return this.casos.find(caso => caso.getProtocoloCaso() === protocolo);
    }

    public getCasosPorProtocoloAssistida(protocoloAssistida: number): Caso[] {
        const casosFiltrados = this.casos.filter(caso => caso.getAssistida()?.getProtocolo() === protocoloAssistida);
        
        return casosFiltrados;
    }

    public mapearCasoDoBanco(dados: any): any {
        return {
            assistida: {
                id: dados.assistida?.id,
                nome: dados.assistida?.nome,
                idade: dados.assistida?.idade,
                identidadeGenero: dados.assistida?.identidadegenero,
                nomeSocial: dados.assistida?.n_social,
                endereco: dados.assistida?.endereco,
                escolaridade: dados.assistida?.escolaridade,
                religiao: dados.assistida?.religiao,
                nacionalidade: dados.assistida?.nacionalidade,
                zona: dados.assistida?.zona,
                ocupacao: dados.assistida?.ocupacao,
                cadSocial: dados.assistida?.cad_social,
                dependentes: dados.assistida?.dependentes,
                corRaca: dados.assistida?.cor_raca
            },
            // Dados do Caso
            caso: {
                idCaso: dados.caso?.id_caso,
                data: dados.caso?.data,
                separacao: dados.caso?.separacao,
                novoRelacionamento: dados.caso?.novo_relac,
                abrigo: dados.caso?.abrigo,
                dependenteFinanceiro: dados.caso?.depen_finc,
                moraAreaRisco: dados.caso?.mora_risco,
                medida: dados.caso?.medida,
                frequencia: dados.caso?.frequencia,
                anotacoesLivres: dados.caso?.anotacoes_livres
            },
            // Dados do Agressor
            agressor: {
                id: dados.agressor?.id_agressor,
                nome: dados.agressor?.nome,
                idade: dados.agressor?.idade,
                vinculo: dados.agressor?.vinculo,
                doenca: dados.agressor?.doenca,
                medidaProtetiva: dados.agressor?.medida_protetiva,
                suicidio: dados.agressor?.suicidio,
                financeiro: dados.agressor?.financeiro,
                armaFogo: dados.agressor?.arma_de_fogo
            },
            // Substâncias e ameaças do agressor
            substanciasAgressor: dados.substanciasAgressor || [],
            ameacasAgressor: dados.ameacasAgressor || [],
            // Violência
            violencia: {
                id: dados.violencia?.id_violencia,
                estupro: dados.violencia?.estupro,
                dataOcorrencia: dados.violencia?.data_ocorrencia
            },
            tiposViolencia: dados.tiposViolencia || [],
            ameacasViolencia: dados.ameacasViolencia || [],
            agressoesViolencia: dados.agressoesViolencia || [],
            comportamentosViolencia: dados.comportamentosViolencia || [],
            // Filhos
            filhos: (dados.filhos || []).map((f: any) => ({
                seqFilho: f.seq_filho,
                faixaEtaria: f.faixa_etaria,
                deficiencia: f.qtd_filhos_deficiencia,
                viuViolencia: f.viu_violencia,
                violenciaGravidez: f.violencia_gravidez,
                qtdAgressor: f.qtd_filho_agressor,
                qtdOutroRelacionamento: f.qtd_filho_outro_relacionamento
            })),
            // Anexos
            anexos: (dados.anexos || []).map((a: any) => ({
                id: a.id_anexo,
                nome: a.nome,
                tipo: a.tipo,
                dados: a.dados
            })),
            // Funcionário responsável
            funcionarioResponsavel: dados.funcionario
        };
    }

    async getInformacoesGeraisDoCaso(idCaso: number): Promise<any> {
        try {
            const infosCaso = await this.casoRepository.getInformacoesGeraisDoCaso(idCaso);
            return infosCaso;
        } catch (error) {
            console.error('Erro ao obter informações gerais do caso:', error);
            throw error;
        }
    }

    async getTotalCasosNoAno(): Promise<any[]> {
        try {
            const totalCasos = await this.casoRepository.getTotalCasosNoAno();
            return totalCasos;
        } catch (error) {
            console.error('Erro ao obter total de casos no ano:', error);
            throw error;
        }
    }

    async totalCasos(): Promise<number> {
        try {
            const total = await this.casoRepository.getTotalCasos();
            return total;
        } catch (error) {
            console.error('Erro ao obter total de casos:', error);
            throw error;
        }
    }

    async totalCasosMes(mes: number, ano: number): Promise<number> {
        try {
            const total = await this.casoRepository.getTotalCasosMes(mes, ano);
            return total;
        } catch (error) {
            console.error('Erro ao obter total de casos do mês:', error);
            throw error;
        }
    }

    async getTotalCasosNoAnoFiltrado(regioes: string[], dataInicio?: string, dataFim?: string): Promise<any[]> {
        try {
            const totalCasos = await this.casoRepository.getTotalCasosNoAnoFiltrado(regioes, dataInicio, dataFim);
            return totalCasos;
        } catch (error) {
            console.error('Erro ao obter total de casos no ano filtrado:', error);
            throw error;
        }
    }

    async getEnderecosAssistidasFiltrado(dataInicio?: string, dataFim?: string): Promise<any[]> {
        try {
            const enderecos = await this.casoRepository.getEnderecosAssistidasFiltrado(dataInicio, dataFim);
            return enderecos;
        } catch (error) {
            console.error('Erro ao obter endereços filtrados:', error);
            throw error;
        }
    }

    /**
     * Salva um anexo no repositório de anexos
     */
    async salvarAnexo(anexo: any, idCaso: number, idAssistida: number): Promise<boolean> {
        try {
            if (!this.anexoRepository) {
                console.warn('AnexoRepository não inicializado');
                return false;
            }

            const anexoObj = new Anexo(
                anexo.nome || anexo.nomeAnexo,
                anexo.tamanho || 0,
                anexo.tipo,
                anexo.dados
            );
            
            const idAnexoSalvo = await this.anexoRepository.salvar(anexoObj, idCaso, idAssistida);
            
            if (idAnexoSalvo) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Erro ao salvar anexo:', error);
            throw error;
        }
    }

    /**
     * Recupera anexos de um caso do banco de dados
     */

    async excluirAnexo(idAnexo: number): Promise<boolean> {
        try {
            if (!this.anexoRepository) {
                return false;
            }
            const success = await this.anexoRepository.deletarAnexo(idAnexo);
            return success;
        } catch (error) {
            console.error('Erro ao excluir anexo:', error);
            throw error;
        }
    }

    async recuperarAnexosDoCaso(idCaso: number): Promise<Anexo[]> {
        try {
            if (!this.anexoRepository) {
                const caso = await this.casoRepository.getCaso(idCaso);
                
                if (!caso) {
                    return [];
                }
                
                // Fallback: recupera do objeto caso se disponível
                if (!caso.getAnexos || caso.getAnexos().length === 0) {
                    return [];
                }
                
                return caso.getAnexos();
            }

            const anexos = await this.anexoRepository.getAnexosCaso(idCaso);
            return anexos;
        } catch (error) {
            console.error('Erro ao recuperar anexos:', error);
            return [];
        }
    }

    async getTotalCasosFiltrado(regioes: string[], dataInicio?: string, dataFim?: string): Promise<number> {
        try {
            const total = await this.casoRepository.getTotalCasosFiltrado(regioes, dataInicio, dataFim);
            return total;
        } catch (error) {
            console.error('Erro ao obter total de casos filtrado:', error);
            throw error;
        }
    }
}