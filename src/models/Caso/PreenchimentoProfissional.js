export class PreenchimentoProfissional {
    constructor(assistidaRespondeuSemAjuda, assistidaRespondeuComAuxilio, assistidaSemCondicoes, assistidaRecusou, terceiroComunicante, tipoViolencia) {
        this.assistidaRespondeuSemAjuda = assistidaRespondeuSemAjuda;
        this.assistidaRespondeuComAuxilio = assistidaRespondeuComAuxilio;
        this.assistidaSemCondicoes = assistidaSemCondicoes;
        this.assistidaRecusou = assistidaRecusou;
        this.terceiroComunicante = terceiroComunicante;
        this.tipoViolencia = tipoViolencia;
    }
    //Getters
    getAssistidaRespondeuSemAjuda() {
        return this.assistidaRespondeuSemAjuda;
    }
    getAssistidaRespondeuComAuxilio() {
        return this.assistidaRespondeuComAuxilio;
    }
    getAssistidaSemCondicoes() {
        return this.assistidaSemCondicoes;
    }
    getAssistidaRecusou() {
        return this.assistidaRecusou;
    }
    getTerceiroComunicante() {
        return this.terceiroComunicante;
    }
    getTipoViolencia() {
        return this.tipoViolencia;
    }
    //Setters
    setAssistidaRespondeuSemAjuda(value) {
        this.assistidaRespondeuSemAjuda = value;
    }
    setAssistidaRespondeuComAuxilio(value) {
        this.assistidaRespondeuComAuxilio = value;
    }
    setAssistidaSemCondicoes(value) {
        this.assistidaSemCondicoes = value;
    }
    setAssistidaRecusou(value) {
        this.assistidaRecusou = value;
    }
    setTerceiroComunicante(value) {
        this.terceiroComunicante = value;
    }
    setTipoViolencia(value) {
        this.tipoViolencia = value;
    }
}
