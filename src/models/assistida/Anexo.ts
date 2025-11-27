export class Anexo {
    private idAnexo?: number;
    private nomeAnexo: string;
    private tamanho: number;
    private tipo: string;
    private dados?: any;
    
    constructor(nomeAnexo: string, tamanho: number, tipo: string, dados?: any) {
        this.nomeAnexo = nomeAnexo;
        this.tamanho = tamanho;
        this.tipo = tipo;
        this.dados = dados;
    }

    //Getters
    
    public getIdAnexo(): number | undefined {
        return this.idAnexo;
    }

    public getNomeAnexo(): string {
        return this.nomeAnexo;
    }

    public getTamanho(): number {
        return this.tamanho;
    }

    public getTipo(): string {
        return this.tipo;
    }

    public getDados(): any {
        return this.dados;
    }

    //Setters

    public setIdAnexo(idAnexo: number): void {
        this.idAnexo = idAnexo;
    }

    public setNomeAnexo(nomeAnexo: string): void {
        this.nomeAnexo = nomeAnexo;
    }

    public setTamanho(tamanho: number): void {
        this.tamanho = tamanho;
    }

    public setTipo(tipo: string): void {
        this.tipo = tipo;
    }

    public setDados(dados: any): void {
        this.dados = dados;
    }

}