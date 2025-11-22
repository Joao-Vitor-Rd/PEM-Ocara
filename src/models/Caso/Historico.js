export class Historico {
    constructor() {
        this.alteracoes = [];
    }
    adicionarAlteracao(alteracao) {
        this.alteracoes.push(alteracao);
    }
    getAlteracoes() {
        return this.alteracoes;
    }
}
