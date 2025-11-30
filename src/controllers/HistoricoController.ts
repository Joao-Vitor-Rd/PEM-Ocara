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
}