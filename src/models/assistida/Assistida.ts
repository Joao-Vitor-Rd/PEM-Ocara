import { Caso } from "../Caso/Caso";

export class Assistida {
    private protocolo: number;
    private nome: string;
    private idade: number;
    private identidadeGenero: string;
    private nomeSocial: string;
    private endereco: string;
    private escolaridade: string;
    private religiao: string;
    private nacionalidade: string;
    private zonaHabitacao: string;
    private profissao: string;
    private limitacaoFisica: string;
    private numeroCadastroSocial: string;
    private temDependentes: boolean;
    private quantidadeDependentes: number;
    private casos: Caso[] = [];

    constructor(
        nome: string,
        idade: number,
        identidadeGenero: string,
        nomeSocial: string,
        endereco: string,
        escolaridade: string,
        religiao: string,
        nacionalidade: string,
        zonaHabitacao: string,
        profissao: string,
        limitacaoFisica: string,
        numeroCadastroSocial: string,
        quantidadeDependentes: number,
        temDependentes: boolean
    ) {
        this.protocolo = this.generateId();
        this.nome = nome;
        this.idade = idade;
        this.identidadeGenero = identidadeGenero;
        this.nomeSocial = nomeSocial;
        this.endereco = endereco;
        this.escolaridade = escolaridade;
        this.religiao = religiao;
        this.nacionalidade = nacionalidade;
        this.zonaHabitacao = zonaHabitacao;
        this.profissao = profissao;
        this.limitacaoFisica = limitacaoFisica;
        this.numeroCadastroSocial = numeroCadastroSocial;
        this.quantidadeDependentes = quantidadeDependentes;
        this.temDependentes = temDependentes;
    }

    //Getters

    public getProtocolo(): number {
        return this.protocolo;
    }   
    public getNome(): string {
        return this.nome;
    }
    public getIdade(): number {
        return this.idade;
    }
    public getIdentidadeGenero(): string {
        return this.identidadeGenero;
    }
    public getNomeSocial(): string {
        return this.nomeSocial;
    }   
    public getEndereco(): string {
        return this.endereco;
    }   
    public getEscolaridade(): string {  
        return this.escolaridade;
    }
    public getReligiao(): string {
        return this.religiao;
    }
    public getNacionalidade(): string {
        return this.nacionalidade;
    }
    public getZonaHabitacao(): string {
        return this.zonaHabitacao;
    }
    public getProfissao(): string {
        return this.profissao;
    }
    public getLimitacaoFisica(): string {
        return this.limitacaoFisica;
    }
    public getNumeroCadastroSocial(): string {
        return this.numeroCadastroSocial;
    }

    public getQuantidadeDependentes(): number {
        return this.quantidadeDependentes;
    }
    public getTemDependentes(): boolean {
        return this.temDependentes;
    }

    //Setters

    private setProtocolo(value: number): void {
        this.protocolo = value;
    }
    private setNome(value: string): void {
        this.nome = value;
    }
    private setIdade(value: number): void {
        this.idade = value;
    }
    private setIdentidadeGenero(value: string): void {
        this.identidadeGenero = value;
    }
    private setNomeSocial(value: string): void {
        this.nomeSocial = value;
    }
    private setEndereco(value: string): void {
        this.endereco = value;
    }
    private setEscolaridade(value: string): void {
        this.escolaridade = value;
    }
    private setReligiao(value: string): void {
        this.religiao = value;
    }
    private setNacionalidade(value: string): void {
        this.nacionalidade = value;
    }
    private setZonaHabitacao(value: string): void {
        this.zonaHabitacao = value;
    }
    private setProfissao(value: string): void {
        this.profissao = value;
    }
    private setLimitacaoFisica(value: string): void {
        this.limitacaoFisica = value;
    }
    private setNumeroCadastroSocial(value: string): void {
        this.numeroCadastroSocial = value;
    }
    private setTemDependentes(value: boolean): void {
        this.temDependentes = value;
    }
    private setQuantidadeDependentes(value: number): void {
        this.quantidadeDependentes = value;
    }

    private setCasos(value: Caso[]): void {
        this.casos = value;
    }

    public addCaso(caso: Caso): void {
        this.casos.push(caso);
    }
    

    private generateId(): number {
        return Math.floor(Math.random() * 100) + 1;
    }

    public toJSON() {
        return {
            protocolo: this.protocolo,
            nome: this.nome,
            idade: this.idade,
            identidadeGenero: this.identidadeGenero,
            nomeSocial: this.nomeSocial,
            endereco: this.endereco,
            escolaridade: this.escolaridade,
            religiao: this.religiao,
            nacionalidade: this.nacionalidade,
            zonaHabitacao: this.zonaHabitacao,
            profissao: this.profissao,
            limitacaoFisica: this.limitacaoFisica,
            numeroCadastroSocial: this.numeroCadastroSocial,
            temDependentes: this.temDependentes,
        };
    }

}