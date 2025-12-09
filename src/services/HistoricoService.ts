import { IHistoricoRepository } from "../repository/IHistoricoRepository";

export class HistoricoService {

    private historicoRepository: IHistoricoRepository;
    
    constructor(historicoRepository: IHistoricoRepository) {
        this.historicoRepository = historicoRepository;
    }

    async salvarHistorico(caso: any): Promise<number> {
        try {
            const historicoId = await this.historicoRepository.salvar(caso);
            return historicoId;
        } catch (error) {
            throw new Error(`Erro ao salvar histórico: ${error}`);
        }
    }

    async registrarDelecaoAnexo(idCaso: number, idAssistida: number, nomeArquivoComExtensao: string, nomeFuncionario: string, emailFuncionario: string): Promise<number> {
        try {
            const historicoId = await this.historicoRepository.registrarDelecaoAnexo(idCaso, idAssistida, nomeArquivoComExtensao, nomeFuncionario, emailFuncionario);
            return historicoId;
        } catch (error) {
            throw new Error(`Erro ao registrar deleção de anexo: ${error}`);
        }
    }

    async listarHistorico(pagina: number = 1, itensPorPagina: number = 10): Promise<any> {
        try {
            return await this.historicoRepository.listar(pagina, itensPorPagina);
        } catch (error) {
            throw new Error(`Erro ao listar histórico: ${error}`);
        }
    }

}
