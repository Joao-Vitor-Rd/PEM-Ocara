import { CasoService } from "../services/CasoService";
import { AssistidaService } from "../services/AssistidaService";
import { ICasoRepository } from "../repository/ICasoRepository";
import { IAnexoRepository } from "../repository/IAnexoRepository";
import { Caso } from "../models/Caso/Caso";
import { PdfService } from "../services/PDFService";

export class CasoController {

    private PdfService: PdfService
    private casoService: CasoService;

    constructor(assistidaService: AssistidaService, casoRepository: ICasoRepository, anexoRepository?: IAnexoRepository) {
        this.casoService = new CasoService(assistidaService, casoRepository, anexoRepository);
        this.PdfService = new PdfService(this.casoService);
    }

    handlerCriarCaso(dados: {
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
    }): Caso {
        return this.casoService.criarCaso(dados);
    }

    getCaso(protocolo: number): Caso | undefined {
        return this.casoService.getCaso(protocolo);
    }

    getCasosPorProtocoloAssistida(protocoloAssistida: number): Caso[] {
        return this.casoService.getCasosPorProtocoloAssistida(protocoloAssistida);
    }

    async handlerCriarPdfCaso(protocoloCaso: number): Promise<string> {
        try {
            const caminhoDoPdf = await this.PdfService.criarPdfDeFormulario(protocoloCaso);
            console.log(`PDF gerado com sucesso em: ${caminhoDoPdf}`);
            return caminhoDoPdf;
            } catch (error) {
                console.error("Erro ao gerar PDF:", error);
                throw new Error("Falha ao gerar PDF.");
        }
    }

    async handlerPreviewCaso(dados: any): Promise<string> {
        try {
            const casoTemporario = this.casoService.instanciarCasoSemSalvar(dados);

            const path = await this.PdfService.gerarPdfPreview(casoTemporario);
            return path;
        } catch (error) {
            console.error("Erro no controller preview:", error);
            throw error;
        }
    }
    
    async getInformacoesGeraisDoCaso(idCaso: number): Promise<any> {
        return await this.casoService.getInformacoesGeraisDoCaso(idCaso);
    }

    async getTotalCasosNoAno(): Promise<any[]> {
        return await this.casoService.getTotalCasosNoAno();
    }

    async getTotalCasos(): Promise<number> {
        return this.casoService.totalCasos();
    }

    async getTotalCasosMes(mes: number, ano: number): Promise<number> {
        return this.casoService.totalCasosMes(mes, ano);
    }

    async getTotalCasosNoAnoFiltrado(regioes: string[], dataInicio?: string, dataFim?: string): Promise<any[]> {
        return this.casoService.getTotalCasosNoAnoFiltrado(regioes, dataInicio, dataFim);
    }

    async getEnderecosAssistidasFiltrado(dataInicio?: string, dataFim?: string): Promise<any[]> {
        return this.casoService.getEnderecosAssistidasFiltrado(dataInicio, dataFim);
    }

    async getTotalCasosFiltrado(regioes: string[], dataInicio?: string, dataFim?: string): Promise<number> {
        return this.casoService.getTotalCasosFiltrado(regioes, dataInicio, dataFim);
    }

    async handlerRecuperarAnexosDoCaso(idCaso: number): Promise<any[]> {
        try {
            const anexos = await this.casoService.recuperarAnexosDoCaso(idCaso);
            return anexos;
        } catch (error) {
            console.error(`✗ CasoController: Erro ao recuperar anexos:`, error);
            throw error;
        }
    }

    async handlerSalvarAnexo(anexo: any, idCaso: number, idAssistida: number): Promise<boolean> {
        try {
            console.log(`📎 CasoController: Salvando anexo '${anexo.nome}' para caso ${idCaso}`);
            const success = await this.casoService.salvarAnexo(anexo, idCaso, idAssistida);
            if (success) {
                console.log(`✓ CasoController: Anexo salvo com sucesso`);
            } else {
                console.warn(`⚠ CasoController: Falha ao salvar anexo`);
            }
            return success;
        } catch (error) {
            console.error(`✗ CasoController: Erro ao salvar anexo:`, error);
            throw error;
        }
    }

    async handlerExcluirAnexo(idAnexo: number): Promise<boolean> {
        try {
            const success = await this.casoService.excluirAnexo(idAnexo);
            return success;
        } catch (error) {
            console.error(`CasoController: Erro ao excluir anexo:`, error);
            throw error;
        }
    }
}