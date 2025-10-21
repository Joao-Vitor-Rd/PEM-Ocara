import { Anexo } from "./Anexo";

export class Caso {
    private protocoloCaso?: number;
    private anexos: Anexo[] = [];
    
    constructor(protocoloCaso: number) {
        this.protocoloCaso = protocoloCaso;
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
}