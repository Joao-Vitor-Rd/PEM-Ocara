export class Anexo {
    private idAnexo?: number;
    private tamanho: number;
    private tipo: string;
    
    constructor(tamanho: number, tipo: string) {
        this.tamanho = tamanho;
        this.tipo = tipo;
    }

    //Getters
    
    public getidAnexo(): number | undefined {
        return this.idAnexo;
    }

    public getTamanho(): number{
        return this.tamanho;
    }

    public getTipo(): string {
        return this.tipo;
    }

    //Setters

    public setIdAnexo(idAnexo: number): void{
        this.idAnexo = idAnexo;
    }

    public setTipo(tipo: string): void{
        this.tipo = tipo;
    }

}