export class SobreVoce {
    private separacaoRecente: string;
    private temFilhosComAgressor: boolean;
    private qntFilhosComAgressor: number;
    private temFilhosOutroRelacionamento: boolean;
    private qntFilhosOutroRelacionamento: number;
    private faixaFilhos: string[];
    private filhosComDeficiencia: number;
    private conflitoAgressor: string;
    private filhosPresenciaramViolencia: boolean;
    private violenciaDuranteGravidez: boolean;
    private novoRelacionamentoAumentouAgressao: boolean;
    private possuiDeficienciaDoenca: string;
    private corRaca: string;

    constructor(
        separacaoRecente: string,
        temFilhosComAgressor: boolean,
        qntFilhosComAgressor: number,
        temFilhosOutroRelacionamento: boolean,
        qntFilhosOutroRelacionamento: number,
        faixaFilhos: string[],
        filhosComDeficiencia: number,
        conflitoAgressor: string,
        filhosPresenciaramViolencia: boolean,
        violenciaDuranteGravidez: boolean,
        novoRelacionamentoAumentouAgressao: boolean,
        possuiDeficienciaDoenca: string,
        corRaca: string
    )
    {
        this.separacaoRecente = separacaoRecente;
        this.temFilhosComAgressor = temFilhosComAgressor;
        this.qntFilhosComAgressor = qntFilhosComAgressor;
        this.temFilhosOutroRelacionamento = temFilhosOutroRelacionamento;
        this.qntFilhosOutroRelacionamento = qntFilhosOutroRelacionamento;
        this.faixaFilhos = faixaFilhos;
        this.filhosComDeficiencia = filhosComDeficiencia;
        this.conflitoAgressor = conflitoAgressor;
        this.filhosPresenciaramViolencia = filhosPresenciaramViolencia;
        this.violenciaDuranteGravidez = violenciaDuranteGravidez;
        this.novoRelacionamentoAumentouAgressao = novoRelacionamentoAumentouAgressao;
        this.possuiDeficienciaDoenca = possuiDeficienciaDoenca;
        this.corRaca = corRaca;
    }

    //Getters

    public getSeparacaoRecente(): string {
        return this.separacaoRecente;
    }
    public getTemFilhosComAgressor(): boolean {
        return this.temFilhosComAgressor;
    }
    public getQntFilhosComAgressor(): number {
        return this.qntFilhosComAgressor;
    }
    public getTemFilhosOutroRelacionamento(): boolean {
        return this.temFilhosOutroRelacionamento;
    }
    public getQntFilhosOutroRelacionamento(): number {
        return this.qntFilhosOutroRelacionamento;
    }
    public getFaixaFilhos(): string[] {
        return this.faixaFilhos;
    }
    public getFilhosComDeficiencia(): number {
        return this.filhosComDeficiencia;
    }
    public getConflitoAgressor(): string {
        return this.conflitoAgressor;
    }
    public getFilhosPresenciaramViolencia(): boolean {
        return this.filhosPresenciaramViolencia;
    }
    public getViolenciaDuranteGravidez(): boolean {
        return this.violenciaDuranteGravidez;
    }
    public getNovoRelacionamentoAumentouAgressao(): boolean {
        return this.novoRelacionamentoAumentouAgressao;
    }
    public getPossuiDeficienciaDoenca(): string {
        return this.possuiDeficienciaDoenca;
    }
    public getCorRaca(): string {
        return this.corRaca;
    }

    //Setters

    private setSeparacaoRecente(value: string): void {
        this.separacaoRecente = value;
    }
    private setTemFilhosComAgressor(value: boolean): void {
        this.temFilhosComAgressor = value;
    }
    private setQntFilhosComAgressor(value: number): void {
        this.qntFilhosComAgressor = value;
    }
    private setTemFilhosOutroRelacionamento(value: boolean): void {
        this.temFilhosOutroRelacionamento = value;
    }
    private setQntFilhosOutroRelacionamento({ value }: { value: number; }): void {
        this.qntFilhosOutroRelacionamento = value;
    }
    private setFaixaFilhos(value: string[]): void {
        this.faixaFilhos = value;
    }
    private setFilhosComDeficiencia(value: number): void {
        this.filhosComDeficiencia = value;
    }
    private setConflitoAgressor(value: string): void {
        this.conflitoAgressor = value;
    }
    private setFilhosPresenciaramViolencia(value: boolean): void {
        this.filhosPresenciaramViolencia = value;
    }
    private setViolenciaDuranteGravidez(value: boolean): void {
        this.violenciaDuranteGravidez = value;
    }
    private setNovoRelacionamentoAumentouAgressao(value: boolean): void {
        this.novoRelacionamentoAumentouAgressao = value;
    }
    private setPossuiDeficienciaDoenca(value: string): void {
        this.possuiDeficienciaDoenca = value;
    }
    private setCorRaca(value: string): void {
        this.corRaca = value;
    }
}

