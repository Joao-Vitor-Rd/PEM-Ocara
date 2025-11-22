export class Agressor {
    constructor(nome, idade, vinculoAssistida, dataOcorrida) {
        this.nome = nome;
        this.idade = idade;
        this.vinculoAssistida = vinculoAssistida;
        this.dataOcorrida = dataOcorrida;
    }
    //Getters
    getNome() {
        return this.nome;
    }
    getIdade() {
        return this.idade;
    }
    getVinculoAssistida() {
        return this.vinculoAssistida;
    }
    getDataOcorrida() {
        return this.dataOcorrida;
    }
    //Setters
    setNome(value) {
        this.nome = value;
    }
    setIdade(value) {
        this.idade = value;
    }
    setVinculoAssistida(value) {
        this.vinculoAssistida = value;
    }
    setDataOcorrida(value) {
        this.dataOcorrida = value;
    }
}
