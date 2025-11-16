export class HistoricoViolencia {
    public ameacaFamiliar: string[];
    public agressaoFisica: string[];
    public outrasFormasViolencia: string[];
    public abusoSexual: boolean;
    public comportamentosAgressor: string[];
    public ocorrenciaPolicialMedidaProtetivaAgressor: boolean;
    public agressoesMaisFrequentesUltimamente: boolean;

    constructor(
        ameacaFamiliar: string[],
        agressaoFisica: string[],
        outrasFormasViolencia: string[],
        abusoSexual: boolean,
        comportamentosAgressor: string[],
        ocorrenciaPolicialMedidaProtetivaAgressor: boolean,
        agressoesMaisFrequentesUltimamente: boolean)
    {
        this.ameacaFamiliar = ameacaFamiliar;
        this.agressaoFisica = agressaoFisica;
        this.outrasFormasViolencia = outrasFormasViolencia;
        this.abusoSexual = abusoSexual;
        this.comportamentosAgressor = comportamentosAgressor;
        this.ocorrenciaPolicialMedidaProtetivaAgressor = ocorrenciaPolicialMedidaProtetivaAgressor;
        this.agressoesMaisFrequentesUltimamente = agressoesMaisFrequentesUltimamente;
    }

    //Getters

    public getAmeacaFamiliar(): string[] {
        return this.ameacaFamiliar;
    }
    public getAgressaoFisica(): string[] {
        return this.agressaoFisica;
    }
    public getOutrasFormasViolencia(): string[] {
        return this.outrasFormasViolencia;
    }
    public getAbusoSexual(): boolean {
        return this.abusoSexual;
    }
    public getComportamentosAgressor(): string[] {
        return this.comportamentosAgressor;
    }
    public getOcorrenciaPolicialMedidaProtetivaAgressor(): boolean {
        return this.ocorrenciaPolicialMedidaProtetivaAgressor;
    }
    public getAgressoesMaisFrequentesUltimamente(): boolean {
        return this.agressoesMaisFrequentesUltimamente;
    }

    //Setters

    private setAmeacaFamiliar(value: string[]): void {   
        this.ameacaFamiliar = value;
    }
    private setAgressaoFisica(value: string[]): void {
        this.agressaoFisica = value;
    }
    private setOutrasFormasViolencia(value: string[]): void {
        this.outrasFormasViolencia = value;
    }
    private setAbusoSexual(value: boolean): void {
        this.abusoSexual = value;
    }
    private setComportamentosAgressor(value: string[]): void {
        this.comportamentosAgressor = value;
    }
    private setOcorrenciaPolicialMedidaProtetivaAgressor(value: boolean): void {
        this.ocorrenciaPolicialMedidaProtetivaAgressor = value;
    }
    private setAgressoesMaisFrequentesUltimamente(value: boolean): void {
        this.agressoesMaisFrequentesUltimamente = value;
    }
}