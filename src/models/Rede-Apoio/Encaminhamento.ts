import {Caso} from "../Caso/Caso";
import { OrgaoRedeApoio } from "../Rede-Apoio/OrgaoRedeApoio";
import { AssistenteSocial } from "../AssistenteSocial";

export class Encaminhamento {
    private idEncaminhamento?: number;
    private dataEncaminhamento: Date;
    private motivoEncaminhamento: string;
    private observacoes: string;
    private OrgaoDestino: OrgaoRedeApoio;
    private AssistenteSocialResponsavel: AssistenteSocial;
    private CasoRelacionado: Caso;

    constructor(dataEncaminhamento: Date, motivoEncaminhamento: string, observacoes: string, OrgaoDestino: OrgaoRedeApoio, AssistenteSocialResponsavel: AssistenteSocial, CasoRelacionado: Caso) {
        this.dataEncaminhamento = dataEncaminhamento;
        this.motivoEncaminhamento = motivoEncaminhamento;
        this.observacoes = observacoes;
        this.OrgaoDestino = OrgaoDestino;
        this.AssistenteSocialResponsavel = AssistenteSocialResponsavel;
        this.CasoRelacionado = CasoRelacionado;
    }

    // Getters
    public getIdEncaminhamento(): number | undefined {
        return this.idEncaminhamento;
    }
    public getDataEncaminhamento(): Date {
        return this.dataEncaminhamento;
    }
    public getMotivoEncaminhamento(): string {
        return this.motivoEncaminhamento;
    }
    public getObservacoes(): string {
        return this.observacoes;
    }
    public getOrgaoDestino(): OrgaoRedeApoio {
        return this.OrgaoDestino;
    }
    public getCasoRelacionado(): Caso {
        return this.CasoRelacionado;
    }
    public getAssistenteSocialResponsavel(): AssistenteSocial {
        return this.AssistenteSocialResponsavel;
    }

    // Setters
    public setIdEncaminhamento(idEncaminhamento: number): void {
        this.idEncaminhamento = idEncaminhamento;
    }
    public setDataEncaminhamento(dataEncaminhamento: Date): void {
        this.dataEncaminhamento = dataEncaminhamento;
    }
    public setMotivoEncaminhamento(motivoEncaminhamento: string): void {
        this.motivoEncaminhamento = motivoEncaminhamento;
    }
    public setObservacoes(observacoes: string): void {
        this.observacoes = observacoes;
    }
    public setOrgaoDestino(OrgaoDestino: OrgaoRedeApoio): void {
        this.OrgaoDestino = OrgaoDestino;
    }
    public setCasoRelacionado(CasoRelacionado: Caso): void {
        this.CasoRelacionado = CasoRelacionado;
    }
    public setAssistenteSocialResponsavel(AssistenteSocialResponsavel: AssistenteSocial): void {
        this.AssistenteSocialResponsavel = AssistenteSocialResponsavel;
    }
}