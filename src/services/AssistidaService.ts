import { Assistida } from "../models/assistida/Assistida";
import { ICasoRepository } from "../repository/ICasoRepository";
import { Logger } from "../utils/Logger";

export class AssistidaService {
    private assistida: Assistida[] = [];
    private casoRepository: ICasoRepository;

    constructor(casoRepository: ICasoRepository) {
        this.casoRepository = casoRepository;
    }

    public criarAssistida(
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
    ) {
        if (!nome || nome.trim() === '') {
            throw new Error('Nome da assistida é obrigatório');
        }

        if (!endereco || endereco.trim() === '') {
            throw new Error('Endereço da assistida é obrigatório');
        }

        if (!idade || idade <= 0) {
            throw new Error('Idade da assistida é obrigatória e deve ser maior que zero');
        }

        if (!profissao || profissao.trim() === '') {
            throw new Error('Profissão da assistida é obrigatória');
        }

        if (!nacionalidade || nacionalidade.trim() === '') {
            throw new Error('Nacionalidade da assistida é obrigatória');
        }

        const novaAssistida = new Assistida(
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

        this.assistida.push(novaAssistida);
        return novaAssistida;
    }

    public async getTodasAssistidas() {
        try {
            const assistidas = await this.casoRepository.getAllAssistidas();
            return assistidas;
        } catch (error) {
            Logger.error('Erro ao buscar assistidas:', error);
            return [];
        }
    }

    public async getCasosAssistida(idAssistida: number) {
        try {
            const casos = await this.casoRepository.getAllCasosAssistida(idAssistida);
            return casos;
        } catch (error) {
            Logger.error('Erro ao buscar casos da assistida:', error);
            return [];
        }
    }

}