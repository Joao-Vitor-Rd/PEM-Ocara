import { Assistida } from "../models/Assistida";

export class AssistidaService {
    private assistida: Assistida[] = [];

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
        temDependentes: boolean
    ) {
        if (!nome || nome.trim() === '') {
            throw new Error('Nome e obrigatorio');
        }

        if (!endereco || endereco.trim() === '') {
            throw new Error('Endereco e obrigatorio');
        }

        if (!idade) {
            throw new Error('Idade e obrigatorio');
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
             temDependentes
        );

        this.assistida.push(novaAssistida);
        return novaAssistida;
    }

    public getTodasAssistidas(): Assistida[] {
        return this.assistida;
    }

    public getAssistidaPorProtocolo(id: number): Assistida | undefined {
        return this.assistida.find(assistida => assistida.getProtocolo() == id);
    }

}