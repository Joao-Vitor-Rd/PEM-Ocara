export class Anexo {
    constructor(tamanho, tipo) {
        this.tamanho = tamanho;
        this.tipo = tipo;
    }
    //Getters
    getidAnexo() {
        return this.idAnexo;
    }
    getTamanho() {
        return this.tamanho;
    }
    getTipo() {
        return this.tipo;
    }
    //Setters
    setIdAnexo(idAnexo) {
        this.idAnexo = idAnexo;
    }
    setTipo(tipo) {
        this.tipo = tipo;
    }
}
