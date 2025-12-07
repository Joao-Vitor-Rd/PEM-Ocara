import { AssistidaService } from "../services/AssistidaService";
import { Assistida } from "../models/assistida/Assistida";
import { ICasoRepository } from "../repository/ICasoRepository";

export class AssistidaController {

    private assistidaService: AssistidaService;

    constructor(casoRepository: ICasoRepository) {
        this.assistidaService = new AssistidaService(casoRepository);
    }

    public getAssistidaService(): AssistidaService {
        return this.assistidaService;
    }

    public async handlerListarTodasAssistidas() {
        return await this.assistidaService.getTodasAssistidas();
    }

    public async handlerBuscarAssistidaPorId(id: number) {
        return await this.assistidaService.getAssistidaPorId(id);
    }
    public handlerCriarAssistida(
        nome: string,
        idade: number,
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
        quantidadeDependentes: number,
        temDependentes: boolean
    ): {
        success: boolean;
        assistida?: Assistida;
        error?: string
    } {

        try {
            const assistida = this.assistidaService.criarAssistida(
                nome,
                idade,
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
                quantidadeDependentes,
                temDependentes,
            );
            return {
                success: true,
                assistida: assistida,
            };
        } catch(error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Error ao Enviar Mensagem ao Servico"
            }
        }

    }

    public async handlerAtualizarAssistida(
        id: number,
        nome: string,
        idade: number,
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
        quantidadeDependentes: number,
        temDependentes: boolean
    ): Promise<{
        success: boolean;
        assistida?: any;
        error?: string
    }> {

        try {
            const assistida = await this.assistidaService.atualizarAssistida(
                id,
                nome,
                idade,
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
                quantidadeDependentes,
                temDependentes
            );
            return {
                success: true,
                assistida: assistida,
            };
        } catch(error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erro ao atualizar assistida"
            }
        }

    }
    
    public async handlergetEnderecosAssistidas(): Promise<any[]> {
        return await this.assistidaService.getEnderecosAssistidas();
    }

}