
export enum PerfilUsuario {
    ADMIN = 'ADMINISTRADOR',
    ASSISTENTE_SOCIAL = 'ASSISTENCIA_SOCIAL',
    JURIDICO = 'JURIDICO',
    COORDENACAO = 'COORDENACAO'
}


export class Funcionario {
    
    private _email: string;
    private _nome: string;
    private _cargo: PerfilUsuario | string;
    private _senha: string;


    constructor(email: string, nome: string, cargo: PerfilUsuario | string, senha: string) {
        this._email = email;
        this._nome = nome;
        this._cargo = cargo;
        this._senha = senha;
    }

    
    public get email(): string {
        return this._email;
    }

    public set email(email: string) {
        this._email = email;
    }

    public get nome(): string {
        return this._nome;
    }

    public set nome(nome: string) {
        this._nome = nome;
    }

    public get cargo(): PerfilUsuario | string {
        return this._cargo;
    }

    public set cargo(cargo: PerfilUsuario | string) {
        this._cargo = cargo;
    }

    public get senha(): string {
        return this._senha;
    }

    public set senha(senha: string) {
        this._senha = senha;
    }
}