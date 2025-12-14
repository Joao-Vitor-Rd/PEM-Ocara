/**
 * Representa as configurações de E-mail Institucional e SMTP.
 * Mapeia a tabela CREDENCIAIS_PROCURADORIA.
 */
export class Credencial {
    private _id?: number;
    private _email: string;
    private _senha: string;
    private _servico: string; // Ex: 'gmail', 'outlook', ou host customizado

    constructor(email: string, senha: string, servico: string = 'gmail', id?: number) {
        this._email = email;
        this._senha = senha;
        this._servico = servico;
        this._id = id;
    }

    // Getters e Setters
    public get email(): string { return this._email; }
    public set email(v: string) { this._email = v; }

    public get senha(): string { return this._senha; }
    public set senha(v: string) { this._senha = v; }

    public get servico(): string { return this._servico; }
    public set servico(v: string) { this._servico = v; }

    public get id(): number | undefined { return this._id; }
    public set id(v: number | undefined) { this._id = v; }
}