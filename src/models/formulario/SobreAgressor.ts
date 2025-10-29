export class SobreAgressor {
    private usoDrogasAlcool: string[];
    private doencaMental: string;
    private agressorCumpriuMedidaProtetiva: boolean;
    private agressorTentativaSuicidio: boolean;
    private agressorDesempregado: string;
    private agressorPossuiArmaFogo: string;
    private agressorAmeacouAlguem: string;

    constructor(
        usoDrogasAlcool: string[],
        doencaMental: string,
        agressorCumpriuMedidaProtetiva: boolean,
        agressorTentativaSuicidio: boolean,
        agressorDesempregado: string,
        agressorPossuiArmaFogo: string,
        agressorAmeacouAlguem: string
    )
    {
        this.usoDrogasAlcool = usoDrogasAlcool;
        this.doencaMental = doencaMental;
        this.agressorCumpriuMedidaProtetiva = agressorCumpriuMedidaProtetiva;
        this.agressorTentativaSuicidio = agressorTentativaSuicidio;
        this.agressorDesempregado = agressorDesempregado;
        this.agressorPossuiArmaFogo = agressorPossuiArmaFogo;
        this.agressorAmeacouAlguem = agressorAmeacouAlguem;
    }

    //Getters
    
    public getUsoDrogasAlcool(): string[] {
        return this.usoDrogasAlcool;
    }
    public getDoencaMental(): string {
        return this.doencaMental;
    }
    public getAgressorCumpriuMedidaProtetiva(): boolean {
        return this.agressorCumpriuMedidaProtetiva;
    }
    public getAgressorTentativaSuicidio(): boolean {
        return this.agressorTentativaSuicidio;
    }
    public getAgressorDesempregado(): string {
        return this.agressorDesempregado;
    }
    public getAgressorPossuiArmaFogo(): string {
        return this.agressorPossuiArmaFogo;
    }
    public getAgressorAmeacouAlguem(): string {
        return this.agressorAmeacouAlguem;
    }

    //Setters

    private setUsoDrogasAlcool(value: string[]): void {
        this.usoDrogasAlcool = value;
    }
    private setDoencaMental(value: string): void {
        this.doencaMental = value;
    }
    private setAgressorCumpriuMedidaProtetiva(value: boolean): void {
        this.agressorCumpriuMedidaProtetiva = value;
    }
    private setAgressorTentativaSuicidio(value: boolean): void {
        this.agressorTentativaSuicidio = value;
    }
    private setAgressorDesempregado(value: string): void {
        this.agressorDesempregado = value;
    }
    private setAgressorPossuiArmaFogo(value: string): void {
        this.agressorPossuiArmaFogo = value;
    }
    private setAgressorAmeacouAlguem(value: string): void {
        this.agressorAmeacouAlguem = value;
    }
}