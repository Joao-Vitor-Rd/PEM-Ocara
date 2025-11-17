export class OutrasInformacoesImportantes {
    private moraEmAreaRisco: string;
    private dependenteFinanceiroAgressor: boolean;
    private aceitaAbrigamentoTemporario: boolean;

    constructor(
        moraEmAreaRisco: string,
        dependenteFinanceiroAgressor: boolean,
        aceitaAbrigamentoTemporario: boolean
    )
    {
        this.moraEmAreaRisco = moraEmAreaRisco;
        this.dependenteFinanceiroAgressor = dependenteFinanceiroAgressor;
        this.aceitaAbrigamentoTemporario = aceitaAbrigamentoTemporario;
    }
    
    //Getters

    public getMoraEmAreaRisco(): string {
        return this.moraEmAreaRisco;
    }
    public getDependenteFinanceiroAgressor(): boolean {
        return this.dependenteFinanceiroAgressor;
    }
    public getAceitaAbrigamentoTemporario(): boolean {
        return this.aceitaAbrigamentoTemporario;
    }

    //Setters

    private setMoraEmAreaRisco(value: string): void {
        this.moraEmAreaRisco = value;
    }
    private setDependenteFinanceiroAgressor(value: boolean): void {
        this.dependenteFinanceiroAgressor = value;
    }
    private setAceitaAbrigamentoTemporario(value: boolean): void {
        this.aceitaAbrigamentoTemporario = value;
    }
}