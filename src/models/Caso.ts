import { Anexo } from "./Anexo";
import { Formulario } from "./Formulario";

export class Caso {
    private protocoloCaso?: number;
    private anexos: Anexo[] = [];
    private formulario: Formulario;
    private data: Date;
    private profissionalResponsavel: string;
    private descricao: string;

    constructor(formulario: Formulario, data: Date, profissionalResponsavel: string, descricao: string) {
        this.formulario = formulario;
        this.data = data;
        this.profissionalResponsavel = profissionalResponsavel;
        this.descricao = descricao;
    }

    // Getters
    public getProtocoloCaso(): number | undefined {
        return this.protocoloCaso;
    }

    public getAnexos(): Anexo[] {
        return this.anexos;
    }

    public getAnexoById(idAnexo: number): Anexo | undefined{
        return this.anexos.find(anexos => anexos.getidAnexo() === idAnexo);
    }

    public getFormulario(): Formulario {
        return this.formulario;
    }   

    public getData(): Date {
        return this.data;
    }   

    public getProfissionalResponsavel(): string {
        return this.profissionalResponsavel;
    }   

    public getDescricao(): string { 
        return this.descricao;
    }

    

    //Setters
    public setAnexos(anexos: Anexo[]) {
        this.anexos = anexos;
    }

    public setProtocoloCaso(protocoloCaso: number) {
        this.protocoloCaso = protocoloCaso;
    }

    public setFormulario(formulario: Formulario) {
        this.formulario = formulario;
    }

    public setData(data: Date) {
        this.data = data;
    }

    public setProfissionalResponsavel(profissionalResponsavel: string) {
        this.profissionalResponsavel = profissionalResponsavel;
    } 

    public setDescricao(descricao: string) {
        this.descricao = descricao;
    }

    

}