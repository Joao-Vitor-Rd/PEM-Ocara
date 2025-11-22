import { CasoService } from "../services/CasoService";
import { AssistidaService } from "../services/AssistidaService";
import { ICasoRepository } from "../repository/ICasoRepository";
import { Caso } from "../models/Caso/Caso";
import { PdfService } from "../services/PDFService";

export class CasoController {

    private PdfService: PdfService
    private casoService: CasoService;

    constructor(assistidaService: AssistidaService, casoRepository: ICasoRepository) {
        this.casoService = new CasoService(assistidaService, casoRepository);
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
}