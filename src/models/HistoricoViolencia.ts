export class HistoricoViolencia {
    public ameacaFamiliar: boolean;
    public agressaoFisica: boolean;
    public outrasFormasViolencia: string;
    public abusoSexual: boolean;
    public comportamentosAgressor: string[];
    public ocorrenciaPolicialMedidaProtetivaAgressor: boolean;
    public agressoesMaisFrequentesUltimamente: boolean;

    constructor(
        ameacaFamiliar: boolean,
        agressaoFisica: boolean,
        outrasFormasViolencia: string,
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

    public getAmeacaFamiliar(): boolean {
        return this.ameacaFamiliar;
    }
    public getAgressaoFisica(): boolean {
        return this.agressaoFisica;
    }
    public getOutrasFormasViolencia(): string {
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

    private setAmeacaFamiliar(value: boolean): void {   
        this.ameacaFamiliar = value;
    }
    private setAgressaoFisica(value: boolean): void {
        this.agressaoFisica = value;
    }
    private setOutrasFormasViolencia(value: string): void {
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