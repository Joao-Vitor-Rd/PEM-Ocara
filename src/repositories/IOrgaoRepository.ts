import { OrgaoRedeApoio } from "../models/Rede-Apoio/OrgaoRedeApoio";

export interface IOrgaoRepository {
  criar(orgao: OrgaoRedeApoio): Promise<OrgaoRedeApoio>;
  listarTodos(): Promise<OrgaoRedeApoio[]>;
  buscarPorEmail(email: string): Promise<OrgaoRedeApoio | null>;
  atualizar(orgao: OrgaoRedeApoio): Promise<OrgaoRedeApoio>;
  remover(email: string): Promise<void>;
}
