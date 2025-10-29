export class PreenchimentoProfissional {
    private assistidaRespondeuSemAjuda: boolean;
    private assistidaRespondeuComAuxilio: boolean;
    private assistidaSemCondicoes: boolean;
    private assistidaRecusou: boolean;
    private terceiroComunicante: boolean;
    private tipoViolencia: string;

    constructor(
        assistidaRespondeuSemAjuda: boolean,
        assistidaRespondeuComAuxilio: boolean,
        assistidaSemCondicoes: boolean,
        assistidaRecusou: boolean,
        terceiroComunicante: boolean,
        tipoViolencia: string
    )
        {
        this.assistidaRespondeuSemAjuda = assistidaRespondeuSemAjuda;
        this.assistidaRespondeuComAuxilio = assistidaRespondeuComAuxilio;
        this.assistidaSemCondicoes = assistidaSemCondicoes;
        this.assistidaRecusou = assistidaRecusou;
        this.terceiroComunicante = terceiroComunicante;
        this.tipoViolencia = tipoViolencia;
    }

    //Getters

    public getAssistidaRespondeuSemAjuda(): boolean {
        return this.assistidaRespondeuSemAjuda;
    }
    public getAssistidaRespondeuComAuxilio(): boolean {
        return this.assistidaRespondeuComAuxilio;
    }
    public getAssistidaSemCondicoes(): boolean {
        return this.assistidaSemCondicoes;
    }
    public getAssistidaRecusou(): boolean {
        return this.assistidaRecusou;
    }
    public getTerceiroComunicante(): boolean {
        return this.terceiroComunicante;
    }
    public getTipoViolencia(): string {
        return this.tipoViolencia;
    }

    //Setters

    private setAssistidaRespondeuSemAjuda(value: boolean): void {
        this.assistidaRespondeuSemAjuda = value;
    }
    private setAssistidaRespondeuComAuxilio(value: boolean): void {
        this.assistidaRespondeuComAuxilio = value;
    }
    private setAssistidaSemCondicoes(value: boolean): void {
        this.assistidaSemCondicoes = value;
    }
    private setAssistidaRecusou(value: boolean): void {
        this.assistidaRecusou = value;
    }
    private setTerceiroComunicante(value: boolean): void {
        this.terceiroComunicante = value;
    }
    private setTipoViolencia(value: string): void {
        this.tipoViolencia = value;
    }
}