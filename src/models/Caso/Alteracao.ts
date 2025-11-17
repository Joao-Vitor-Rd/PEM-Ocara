export class Alteracao {
    private idAlteracao?: number;
    private tipoAlteracao: string;
    private descricao: string;
    private dataAlteracao: Date;
    private usuarioResponsavel: string;

    constructor(tipoAlteracao: string, descricao: string, dataAlteracao: Date, usuarioResponsavel: string) {
        this.tipoAlteracao = tipoAlteracao;
        this.descricao = descricao;
        this.dataAlteracao = dataAlteracao;
        this.usuarioResponsavel = usuarioResponsavel;
    }

    // Getters
    public getIdAlteracao(): number | undefined {
        return this.idAlteracao;
    }

    public getTipoAlteracao(): string {
        return this.tipoAlteracao;
    }

    public getDescricao(): string {
        return this.descricao;
    }

    public getDataAlteracao(): Date {
        return this.dataAlteracao;
    }

    public getUsuarioResponsavel(): string {
        return this.usuarioResponsavel;
    }

    // Setters
    public setIdAlteracao(idAlteracao: number): void {
        this.idAlteracao = idAlteracao;
    }
    public setTipoAlteracao(tipoAlteracao: string): void {
        this.tipoAlteracao = tipoAlteracao;
    }

    public setDescricao(descricao: string): void {
        this.descricao = descricao;
    }

    public setDataAlteracao(dataAlteracao: Date): void {
        this.dataAlteracao = dataAlteracao;
    }

    public setUsuarioResponsavel(usuarioResponsavel: string): void {
        this.usuarioResponsavel = usuarioResponsavel;
    }

}