export class Agressor {
    private nome: string;
    private idade: number;
    private vinculoAssistida: string;
    private dataOcorrida: Date;

    constructor(
        nome: string,
        idade: number,
        vinculoAssistida: string,
        dataOcorrida: Date)
    {
        this.nome = nome;
        this.idade = idade;
        this.vinculoAssistida = vinculoAssistida;
        this.dataOcorrida = dataOcorrida;
    }

    //Getters

    public getNome(): string {
        return this.nome;
    }
    public getIdade(): number {
        return this.idade;
    }
    public getVinculoAssistida(): string {
        return this.vinculoAssistida;
    }
    public getDataOcorrida(): Date {
        return this.dataOcorrida;
    }

    //Setters

    private setNome(value: string): void {
        this.nome = value;
    }
    private setIdade(value: number): void {
        this.idade = value;
    }
    private setVinculoAssistida(value: string): void {
        this.vinculoAssistida = value;
    }
    private setDataOcorrida(value: Date): void {
        this.dataOcorrida = value;
    }
}