export class Alteracao {
    constructor(tipoAlteracao, descricao, dataAlteracao, usuarioResponsavel) {
        this.tipoAlteracao = tipoAlteracao;
        this.descricao = descricao;
        this.dataAlteracao = dataAlteracao;
        this.usuarioResponsavel = usuarioResponsavel;
    }
    // Getters
    getIdAlteracao() {
        return this.idAlteracao;
    }
    getTipoAlteracao() {
        return this.tipoAlteracao;
    }
    getDescricao() {
        return this.descricao;
    }
    getDataAlteracao() {
        return this.dataAlteracao;
    }
    getUsuarioResponsavel() {
        return this.usuarioResponsavel;
    }
    // Setters
    setIdAlteracao(idAlteracao) {
        this.idAlteracao = idAlteracao;
    }
    setTipoAlteracao(tipoAlteracao) {
        this.tipoAlteracao = tipoAlteracao;
    }
    setDescricao(descricao) {
        this.descricao = descricao;
    }
    setDataAlteracao(dataAlteracao) {
        this.dataAlteracao = dataAlteracao;
    }
    setUsuarioResponsavel(usuarioResponsavel) {
        this.usuarioResponsavel = usuarioResponsavel;
    }
}
