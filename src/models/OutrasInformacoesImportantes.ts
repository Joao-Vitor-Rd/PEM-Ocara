export class outrasInformacoesImportantes {
    private moraEmAreaRisco: boolean;
    private dependenteFinanceiroAgressor: boolean;
    private aceitaAbrigamentoTemporario: boolean;

    constructor(
        moraEmAreaRisco: boolean,
        dependenteFinanceiroAgressor: boolean,
        aceitaAbrigamentoTemporario: boolean)
    {
        this.moraEmAreaRisco = moraEmAreaRisco;
        this.dependenteFinanceiroAgressor = dependenteFinanceiroAgressor;
        this.aceitaAbrigamentoTemporario = aceitaAbrigamentoTemporario;
    }
    
    //Getters

    public getMoraEmAreaRisco(): boolean {
        return this.moraEmAreaRisco;
    }
    public getDependenteFinanceiroAgressor(): boolean {
        return this.dependenteFinanceiroAgressor;
    }
    public getAceitaAbrigamentoTemporario(): boolean {
        return this.aceitaAbrigamentoTemporario;
    }

    //Setters

    private setMoraEmAreaRisco(value: boolean): void {
        this.moraEmAreaRisco = value;
    }
    private setDependenteFinanceiroAgressor(value: boolean): void {
        this.dependenteFinanceiroAgressor = value;
    }
    private setAceitaAbrigamentoTemporario(value: boolean): void {
        this.aceitaAbrigamentoTemporario = value;
    }
}