export class Caso {
    constructor(formulario, data, profissionalResponsavel, descricao) {
        this.anexos = [];
        this.formulario = formulario;
        this.data = data;
        this.profissionalResponsavel = profissionalResponsavel;
        this.descricao = descricao;
    }
    // Getters
    getProtocoloCaso() {
        return this.protocoloCaso;
    }
    getAnexos() {
        return this.anexos;
    }
    getAnexoById(idAnexo) {
        return this.anexos.find(anexos => anexos.getidAnexo() === idAnexo);
    }
    getFormulario() {
        return this.formulario;
    }
    getData() {
        return this.data;
    }
    getProfissionalResponsavel() {
        return this.profissionalResponsavel;
    }
    getDescricao() {
        return this.descricao;
    }
    //Setters
    setAnexos(anexos) {
        this.anexos = anexos;
    }
    setProtocoloCaso(protocoloCaso) {
        this.protocoloCaso = protocoloCaso;
    }
    setFormulario(formulario) {
        this.formulario = formulario;
    }
    setData(data) {
        this.data = data;
    }
    setProfissionalResponsavel(profissionalResponsavel) {
        this.profissionalResponsavel = profissionalResponsavel;
    }
    setDescricao(descricao) {
        this.descricao = descricao;
    }
}
