class AssistenteSocial {
    private nome: string;
    private emailInstitucional: string;

    constructor(nome: string, emailInstitucional: string) {
        this.nome = nome;
        this.emailInstitucional = emailInstitucional;
    }

    // Getters
    public getNome(): string {
        return this.nome;
    }

    public getEmailInstitucional(): string {
        return this.emailInstitucional;
    }

    // Setters
    public setNome(nome: string): void {
        this.nome = nome;
    }

    public setEmailInstitucional(emailInstitucional: string): void {
        this.emailInstitucional = emailInstitucional;
    }
}