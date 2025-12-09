import { HistoricoService } from "../services/HistoricoService";
import { IHistoricoRepository } from "../repository/IHistoricoRepository";


export class HistoricoController {

    private historicoService: HistoricoService;

    constructor(historicoRepository: IHistoricoRepository) {
        this.historicoService = new HistoricoService(historicoRepository);
    }

    handlerSalvarHistorico(caso: any): Promise<number> {
        // caso já contém todos os campos necessários (idCaso, idAssistida, emailFuncionario, etc)
        return this.historicoService.salvarHistorico(caso);
    }

    handlerRegistrarDelecaoAnexo(idCaso: number, idAssistida: number, nomeArquivoComExtensao: string, nomeFuncionario: string, emailFuncionario: string): Promise<number> {
        return this.historicoService.registrarDelecaoAnexo(idCaso, idAssistida, nomeArquivoComExtensao, nomeFuncionario, emailFuncionario);
    }

    handlerListarHistorico(pagina: number = 1, itensPorPagina: number = 10): Promise<any> {
        return this.historicoService.listarHistorico(pagina, itensPorPagina);
    }
}