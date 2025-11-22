export class Encaminhamento {
    constructor(dataEncaminhamento, motivoEncaminhamento, observacoes, OrgaoDestino, AssistenteSocialResponsavel, CasoRelacionado) {
        this.dataEncaminhamento = dataEncaminhamento;
        this.motivoEncaminhamento = motivoEncaminhamento;
        this.observacoes = observacoes;
        this.OrgaoDestino = OrgaoDestino;
        this.AssistenteSocialResponsavel = AssistenteSocialResponsavel;
        this.CasoRelacionado = CasoRelacionado;
    }
    // Getters
    getIdEncaminhamento() {
        return this.idEncaminhamento;
    }
    getDataEncaminhamento() {
        return this.dataEncaminhamento;
    }
    getMotivoEncaminhamento() {
        return this.motivoEncaminhamento;
    }
    getObservacoes() {
        return this.observacoes;
    }
    getOrgaoDestino() {
        return this.OrgaoDestino;
    }
    getCasoRelacionado() {
        return this.CasoRelacionado;
    }
    getAssistenteSocialResponsavel() {
        return this.AssistenteSocialResponsavel;
    }
    // Setters
    setIdEncaminhamento(idEncaminhamento) {
        this.idEncaminhamento = idEncaminhamento;
    }
    setDataEncaminhamento(dataEncaminhamento) {
        this.dataEncaminhamento = dataEncaminhamento;
    }
    setMotivoEncaminhamento(motivoEncaminhamento) {
        this.motivoEncaminhamento = motivoEncaminhamento;
    }
    setObservacoes(observacoes) {
        this.observacoes = observacoes;
    }
    setOrgaoDestino(OrgaoDestino) {
        this.OrgaoDestino = OrgaoDestino;
    }
    setCasoRelacionado(CasoRelacionado) {
        this.CasoRelacionado = CasoRelacionado;
    }
    setAssistenteSocialResponsavel(AssistenteSocialResponsavel) {
        this.AssistenteSocialResponsavel = AssistenteSocialResponsavel;
    }
}
