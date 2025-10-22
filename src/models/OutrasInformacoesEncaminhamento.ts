export class outrasInformacoesEncaminhamento {
    public anotacoesLivres: string;

    constructor(
        anotacoesLivres: string)
    {
        this.anotacoesLivres = anotacoesLivres;
    }

    //Getters

    public getAnotacoesLivres(): string {
        return this.anotacoesLivres;
    }

    //Setters

    private setAnotacoesLivres(value: string): void {
        this.anotacoesLivres = value;
    }
}