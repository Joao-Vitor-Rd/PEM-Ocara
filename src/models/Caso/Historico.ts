import { Alteracao } from "./Alteracao";

export class Historico {
    private alteracoes: Alteracao[];

    constructor() {
        this.alteracoes = [];
    }

    public adicionarAlteracao(alteracao: Alteracao): void {
        this.alteracoes.push(alteracao);
    }

    public getAlteracoes(): Alteracao[] {
        return this.alteracoes;
    }
}