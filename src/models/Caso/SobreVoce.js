export class SobreVoce {
    constructor(separacaoRecente, temFilhosComAgressor, qntFilhosComAgressor, temFilhosOutroRelacionamento, qntFilhosOutroRelacionamento, faixaFilhos, filhosComDeficiencia, conflitoAgressor, filhosPresenciaramViolencia, violenciaDuranteGravidez, novoRelacionamentoAumentouAgressao, possuiDeficienciaDoenca, corRaca) {
        this.separacaoRecente = separacaoRecente;
        this.temFilhosComAgressor = temFilhosComAgressor;
        this.qntFilhosComAgressor = qntFilhosComAgressor;
        this.temFilhosOutroRelacionamento = temFilhosOutroRelacionamento;
        this.qntFilhosOutroRelacionamento = qntFilhosOutroRelacionamento;
        this.faixaFilhos = faixaFilhos;
        this.filhosComDeficiencia = filhosComDeficiencia;
        this.conflitoAgressor = conflitoAgressor;
        this.filhosPresenciaramViolencia = filhosPresenciaramViolencia;
        this.violenciaDuranteGravidez = violenciaDuranteGravidez;
        this.novoRelacionamentoAumentouAgressao = novoRelacionamentoAumentouAgressao;
        this.possuiDeficienciaDoenca = possuiDeficienciaDoenca;
        this.corRaca = corRaca;
    }
    //Getters
    getSeparacaoRecente() {
        return this.separacaoRecente;
    }
    getTemFilhosComAgressor() {
        return this.temFilhosComAgressor;
    }
    getQntFilhosComAgressor() {
        return this.qntFilhosComAgressor;
    }
    getTemFilhosOutroRelacionamento() {
        return this.temFilhosOutroRelacionamento;
    }
    getQntFilhosOutroRelacionamento() {
        return this.qntFilhosOutroRelacionamento;
    }
    getFaixaFilhos() {
        return this.faixaFilhos;
    }
    getFilhosComDeficiencia() {
        return this.filhosComDeficiencia;
    }
    getConflitoAgressor() {
        return this.conflitoAgressor;
    }
    getFilhosPresenciaramViolencia() {
        return this.filhosPresenciaramViolencia;
    }
    getViolenciaDuranteGravidez() {
        return this.violenciaDuranteGravidez;
    }
    getNovoRelacionamentoAumentouAgressao() {
        return this.novoRelacionamentoAumentouAgressao;
    }
    getPossuiDeficienciaDoenca() {
        return this.possuiDeficienciaDoenca;
    }
    getCorRaca() {
        return this.corRaca;
    }
    //Setters
    setSeparacaoRecente(value) {
        this.separacaoRecente = value;
    }
    setTemFilhosComAgressor(value) {
        this.temFilhosComAgressor = value;
    }
    setQntFilhosComAgressor(value) {
        this.qntFilhosComAgressor = value;
    }
    setTemFilhosOutroRelacionamento(value) {
        this.temFilhosOutroRelacionamento = value;
    }
    setQntFilhosOutroRelacionamento({ value }) {
        this.qntFilhosOutroRelacionamento = value;
    }
    setFaixaFilhos(value) {
        this.faixaFilhos = value;
    }
    setFilhosComDeficiencia(value) {
        this.filhosComDeficiencia = value;
    }
    setConflitoAgressor(value) {
        this.conflitoAgressor = value;
    }
    setFilhosPresenciaramViolencia(value) {
        this.filhosPresenciaramViolencia = value;
    }
    setViolenciaDuranteGravidez(value) {
        this.violenciaDuranteGravidez = value;
    }
    setNovoRelacionamentoAumentouAgressao(value) {
        this.novoRelacionamentoAumentouAgressao = value;
    }
    setPossuiDeficienciaDoenca(value) {
        this.possuiDeficienciaDoenca = value;
    }
    setCorRaca(value) {
        this.corRaca = value;
    }
}
