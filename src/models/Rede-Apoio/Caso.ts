class Caso {
    private idCaso: number;
    private protocolo: string;
    private data: Date;
    private profissionalResponsavel: string;
    private motivoEncaminhamento: string;
    private descricao: string;


    constructor( idCaso: number, protocolo: string, data: Date, profissionalResponsavel: string,
         motivoEncaminhamento: string, descricao: string) {
        this.idCaso = idCaso;
        this.protocolo = protocolo;
        this.data = data;
        this.profissionalResponsavel = profissionalResponsavel;
        this.motivoEncaminhamento = motivoEncaminhamento;
        this.descricao = descricao;
    }

    //Getters

    public getIdCaso(): number {
        return this.idCaso;
    }
    public getProtocolo(): string {
        return this.protocolo;
    }
    public getData(): Date {
        return this.data;
    }
    public getProfissionalResponsavel(): string {
        return this.profissionalResponsavel;
    }
    public getMotivoEncaminhamento(): string {
        return this.motivoEncaminhamento;
    }
    public getDescricao(): string {
        return this.descricao;
    }

    //Setters

    public setIdCaso(value: number): void {
        this.idCaso = value;
    }

    public setProtocolo(value: string): void {
        this.protocolo = value;
    }

    public setData(value: Date): void {
        this.data = value;
    }

    public setProfissionalResponsavel(value: string): void {
        this.profissionalResponsavel = value;
    }

    public setMotivoEncaminhamento(value: string): void {
        this.motivoEncaminhamento = value;
    }

    public setDescricao(value: string): void {
        this.descricao = value;
    }
}

