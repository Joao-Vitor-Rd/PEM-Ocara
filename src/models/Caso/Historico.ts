export class Historico {
    private id?: number;
    private idCaso?: number;
    private idAssistida?: number;
    private mudaca?: string;
    private tipo?: string;
    private campo?: string;

    constructor(
        id?: number,
        idCaso?: number,
        idAssistida?: number,
        mudaca?: string,
        tipo?: string,
        campo?: string
    ) {
        this.id = id;
        this.idCaso = idCaso;
        this.idAssistida = idAssistida;
        this.mudaca = mudaca;
        this.tipo = tipo;
        this.campo = campo;
    }

    public getId(): number | undefined {
        return this.id;
    }

    public getIdCaso(): number | undefined {
        return this.idCaso;
    }

    public getIdAssistida(): number | undefined {
        return this.idAssistida;
    }

    public getMudaca(): string | undefined {
        return this.mudaca;
    }

    public getTipo(): string | undefined {
        return this.tipo;
    }

    public getCampo(): string | undefined {
        return this.campo;
    }
}