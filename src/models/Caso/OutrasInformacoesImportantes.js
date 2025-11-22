export class OutrasInformacoesImportantes {
    constructor(moraEmAreaRisco, dependenteFinanceiroAgressor, aceitaAbrigamentoTemporario) {
        this.moraEmAreaRisco = moraEmAreaRisco;
        this.dependenteFinanceiroAgressor = dependenteFinanceiroAgressor;
        this.aceitaAbrigamentoTemporario = aceitaAbrigamentoTemporario;
    }
    //Getters
    getMoraEmAreaRisco() {
        return this.moraEmAreaRisco;
    }
    getDependenteFinanceiroAgressor() {
        return this.dependenteFinanceiroAgressor;
    }
    getAceitaAbrigamentoTemporario() {
        return this.aceitaAbrigamentoTemporario;
    }
    //Setters
    setMoraEmAreaRisco(value) {
        this.moraEmAreaRisco = value;
    }
    setDependenteFinanceiroAgressor(value) {
        this.dependenteFinanceiroAgressor = value;
    }
    setAceitaAbrigamentoTemporario(value) {
        this.aceitaAbrigamentoTemporario = value;
    }
}
