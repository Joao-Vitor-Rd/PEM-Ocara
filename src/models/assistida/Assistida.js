export class Assistida {
    constructor(nome, idade, identidadeGenero, nomeSocial, endereco, escolaridade, religiao, nacionalidade, zonaHabitacao, profissao, limitacaoFisica, numeroCadastroSocial, quantidadeDependentes, temDependentes) {
        this.casos = [];
        this.protocolo = this.generateId();
        this.nome = nome;
        this.idade = idade;
        this.identidadeGenero = identidadeGenero;
        this.nomeSocial = nomeSocial;
        this.endereco = endereco;
        this.escolaridade = escolaridade;
        this.religiao = religiao;
        this.nacionalidade = nacionalidade;
        this.zonaHabitacao = zonaHabitacao;
        this.profissao = profissao;
        this.limitacaoFisica = limitacaoFisica;
        this.numeroCadastroSocial = numeroCadastroSocial;
        this.quantidadeDependentes = quantidadeDependentes;
        this.temDependentes = temDependentes;
    }
    //Getters
    getProtocolo() {
        return this.protocolo;
    }
    getNome() {
        return this.nome;
    }
    getIdade() {
        return this.idade;
    }
    getIdentidadeGenero() {
        return this.identidadeGenero;
    }
    getNomeSocial() {
        return this.nomeSocial;
    }
    getEndereco() {
        return this.endereco;
    }
    getEscolaridade() {
        return this.escolaridade;
    }
    getReligiao() {
        return this.religiao;
    }
    getNacionalidade() {
        return this.nacionalidade;
    }
    getZonaHabitacao() {
        return this.zonaHabitacao;
    }
    getProfissao() {
        return this.profissao;
    }
    getLimitacaoFisica() {
        return this.limitacaoFisica;
    }
    getNumeroCadastroSocial() {
        return this.numeroCadastroSocial;
    }
    getQuantidadeDependentes() {
        return this.quantidadeDependentes;
    }
    getTemDependentes() {
        return this.temDependentes;
    }
    //Setters
    setProtocolo(value) {
        this.protocolo = value;
    }
    setNome(value) {
        this.nome = value;
    }
    setIdade(value) {
        this.idade = value;
    }
    setIdentidadeGenero(value) {
        this.identidadeGenero = value;
    }
    setNomeSocial(value) {
        this.nomeSocial = value;
    }
    setEndereco(value) {
        this.endereco = value;
    }
    setEscolaridade(value) {
        this.escolaridade = value;
    }
    setReligiao(value) {
        this.religiao = value;
    }
    setNacionalidade(value) {
        this.nacionalidade = value;
    }
    setZonaHabitacao(value) {
        this.zonaHabitacao = value;
    }
    setProfissao(value) {
        this.profissao = value;
    }
    setLimitacaoFisica(value) {
        this.limitacaoFisica = value;
    }
    setNumeroCadastroSocial(value) {
        this.numeroCadastroSocial = value;
    }
    setTemDependentes(value) {
        this.temDependentes = value;
    }
    setQuantidadeDependentes(value) {
        this.quantidadeDependentes = value;
    }
    setCasos(value) {
        this.casos = value;
    }
    addCaso(caso) {
        this.casos.push(caso);
    }
    generateId() {
        return Math.floor(Math.random() * 100) + 1;
    }
    toJSON() {
        return {
            protocolo: this.protocolo,
            nome: this.nome,
            idade: this.idade,
            identidadeGenero: this.identidadeGenero,
            nomeSocial: this.nomeSocial,
            endereco: this.endereco,
            escolaridade: this.escolaridade,
            religiao: this.religiao,
            nacionalidade: this.nacionalidade,
            zonaHabitacao: this.zonaHabitacao,
            profissao: this.profissao,
            limitacaoFisica: this.limitacaoFisica,
            numeroCadastroSocial: this.numeroCadastroSocial,
            temDependentes: this.temDependentes,
        };
    }
}
