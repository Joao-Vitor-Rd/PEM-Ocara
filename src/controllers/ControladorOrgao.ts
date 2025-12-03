// src/controllers/ControladorOrgao.ts
import { OrgaoRedeApoio } from "../models/Rede-Apoio/OrgaoRedeApoio";
import { IOrgaoRepository } from "../repository/IOrgaoRepository";

interface CadastrarOrgaoResult {
  success: boolean;
  orgao?: OrgaoRedeApoio;
  error?: string;
}

export class ControladorOrgao {
  constructor(private readonly orgaoRepository: IOrgaoRepository) {}

  // Método que o main chama via IPC
  public async cadastrarOrgao(nome: string, email: string): Promise<CadastrarOrgaoResult> {
    const nomeTrim = (nome ?? "").trim();
    const emailTrim = (email ?? "").trim();

    if (!nomeTrim) {
      return { success: false, error: "Nome é obrigatório." };
    }

    if (!emailTrim) {
      return { success: false, error: "E-mail é obrigatório." };
    }

    // Regra simples de duplicidade por e-mail
    const existente = await this.orgaoRepository.buscarPorEmail(emailTrim);
    if (existente) {
      return {
        success: false,
        error: "Já existe um órgão da rede de apoio cadastrado com esse e-mail.",
      };
    }

    // Por enquanto, só temos nome e email vindos da tela
    const orgao = new OrgaoRedeApoio(nomeTrim, emailTrim);

    const criado = await this.orgaoRepository.criar(orgao);

    return { success: true, orgao: criado };
  }

  // Método para listar na tela
  public async listarOrgaos() {
    const orgaos = await this.orgaoRepository.listarTodos();
    return orgaos;
  }
}
