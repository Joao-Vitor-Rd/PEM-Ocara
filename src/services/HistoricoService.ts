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

}
