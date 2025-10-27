import { Assistida } from "../assistida/Assistida";

export class Formulario {
    private idFormulario?: number;
    private assistida: Assistida;
    
    constructor(assistida: Assistida) {
        this.assistida = assistida;
    }

    //Getters

    public getAssistida(): Assistida {
        return this.assistida;
    }

    public getIdFormulario(): number | undefined {
        return this.idFormulario;
    }

    public setIdFormulario(idFormulario: number) {
        this.idFormulario = idFormulario;
    }

    public setAssistida(assistida: Assistida) {
        this.assistida = assistida;
    }
}