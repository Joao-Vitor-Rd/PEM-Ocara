export class OrgaoRedeApoio {
    private id?: number;
    private nome: string;
    private email: string;

    constructor(nome: string, email: string, id?: number) {
        this.nome = nome;
        this.email = email;
        this.id = id;
    }

    public getId(): number | undefined {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getNome(): string {
        return this.nome;
    }

    public getEmail(): string {
        return this.email;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public toJSON() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email
        };
    }
}