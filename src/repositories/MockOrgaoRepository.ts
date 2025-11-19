// src/repositories/MockOrgaoRepository.ts
import { OrgaoRedeApoio } from "../models/Rede-Apoio/OrgaoRedeApoio";
import { IOrgaoRepository } from "./IOrgaoRepository";

export class MockOrgaoRepository implements IOrgaoRepository {
  private orgaos: OrgaoRedeApoio[] = [];

  public async criar(orgao: OrgaoRedeApoio): Promise<OrgaoRedeApoio> {
    const existente = this.orgaos.find(o => o.getEmail() === orgao.getEmail());
    if (existente) {
      throw new Error("Já existe um órgão da rede de apoio com esse e-mail.");
    }

    this.orgaos.push(orgao);
    return orgao;
  }

  public async listarTodos(): Promise<OrgaoRedeApoio[]> {
    // retorna uma cópia pra evitar mutação externa
    return [...this.orgaos];
  }

  public async buscarPorEmail(email: string): Promise<OrgaoRedeApoio | null> {
    const orgao = this.orgaos.find(o => o.getEmail() === email);
    return orgao ?? null;
  }

  public async atualizar(orgaoAtualizado: OrgaoRedeApoio): Promise<OrgaoRedeApoio> {
    const index = this.orgaos.findIndex(o => o.getEmail() === orgaoAtualizado.getEmail());
    if (index === -1) {
      throw new Error("Órgão não encontrado para atualização.");
    }

    this.orgaos[index] = orgaoAtualizado;
    return orgaoAtualizado;
  }

  public async remover(email: string): Promise<void> {
    this.orgaos = this.orgaos.filter(o => o.getEmail() !== email);
  }
}
