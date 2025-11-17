export class OrgaoRedeApoio {
    private nome: string;
    private objetivo: string;
    private email: string;
    private telefone: string;
    private endereco: string;

    constructor(nome: string, objetivo: string, email: string, telefone: string, endereco: string) {
        this.nome = nome;
        this.objetivo = objetivo;
        this.email = email;
        this.telefone = telefone;
        this.endereco = endereco;
    }

    // Getters
    public getNome(): string {
        return this.nome;
    }

    public getObjetivo(): string {
        return this.objetivo;
    }

    public getEmail(): string {
        return this.email;
    }

    public getTelefone(): string {
        return this.telefone;
    }

    public getEndereco(): string {
        return this.endereco;
    }
    

    // Setters
    public setNome(nome: string): void {
        this.nome = nome;
    }

    public setObjetivo(objetivo: string): void {
        this.objetivo = objetivo;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setTelefone(telefone: string): void {
        this.telefone = telefone;
    }

    public setEndereco(endereco: string): void {
        this.endereco = endereco;
    }
}
