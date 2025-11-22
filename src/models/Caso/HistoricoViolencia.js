export class HistoricoViolencia {
    constructor(ameacaFamiliar, agressaoFisica, outrasFormasViolencia, abusoSexual, comportamentosAgressor, ocorrenciaPolicialMedidaProtetivaAgressor, agressoesMaisFrequentesUltimamente) {
        this.ameacaFamiliar = ameacaFamiliar;
        this.agressaoFisica = agressaoFisica;
        this.outrasFormasViolencia = outrasFormasViolencia;
        this.abusoSexual = abusoSexual;
        this.comportamentosAgressor = comportamentosAgressor;
        this.ocorrenciaPolicialMedidaProtetivaAgressor = ocorrenciaPolicialMedidaProtetivaAgressor;
        this.agressoesMaisFrequentesUltimamente = agressoesMaisFrequentesUltimamente;
    }
    //Getters
    getAmeacaFamiliar() {
        return this.ameacaFamiliar;
    }
    getAgressaoFisica() {
        return this.agressaoFisica;
    }
    getOutrasFormasViolencia() {
        return this.outrasFormasViolencia;
    }
    getAbusoSexual() {
        return this.abusoSexual;
    }
    getComportamentosAgressor() {
        return this.comportamentosAgressor;
    }
    getOcorrenciaPolicialMedidaProtetivaAgressor() {
        return this.ocorrenciaPolicialMedidaProtetivaAgressor;
    }
    getAgressoesMaisFrequentesUltimamente() {
        return this.agressoesMaisFrequentesUltimamente;
    }
    //Setters
    setAmeacaFamiliar(value) {
        this.ameacaFamiliar = value;
    }
    setAgressaoFisica(value) {
        this.agressaoFisica = value;
    }
    setOutrasFormasViolencia(value) {
        this.outrasFormasViolencia = value;
    }
    setAbusoSexual(value) {
        this.abusoSexual = value;
    }
    setComportamentosAgressor(value) {
        this.comportamentosAgressor = value;
    }
    setOcorrenciaPolicialMedidaProtetivaAgressor(value) {
        this.ocorrenciaPolicialMedidaProtetivaAgressor = value;
    }
    setAgressoesMaisFrequentesUltimamente(value) {
        this.agressoesMaisFrequentesUltimamente = value;
    }
}
