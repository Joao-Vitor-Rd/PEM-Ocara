export class OrgaoRedeApoio {
    private nome: string;
    private email: string;

    constructor(nome: string, email: string) {
        this.nome = nome;
        this.email = email;
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
            nome: this.nome,
            email: this.email
        };
    }
}