export class AssistenteSocial {
    private name: string;
    private emailInstitucional: string;

    constructor(name: string, emailInstitucional: string) {
        this.name = name;
        this.emailInstitucional = emailInstitucional;
    }

    public getName(): string {
        return this.name;
    }

    public getEmailInstitucional(): string {
        return this.emailInstitucional;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setEmailInstitucional(emailInstitucional: string): void {
        this.emailInstitucional = emailInstitucional;
    }
}