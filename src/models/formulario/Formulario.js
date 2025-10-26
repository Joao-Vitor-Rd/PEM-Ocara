export class Formulario {
    constructor(assistida) {
        this.assistida = assistida;
    }
    //Getters
    getAssistida() {
        return this.assistida;
    }
    getIdFormulario() {
        return this.idFormulario;
    }
    setIdFormulario(idFormulario) {
        this.idFormulario = idFormulario;
    }
    setAssistida(assistida) {
        this.assistida = assistida;
    }
}
