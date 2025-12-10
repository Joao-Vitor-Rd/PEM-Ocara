// src/controllers/ControladorOrgao.ts
import { OrgaoRedeApoio } from "../models/Rede-Apoio/OrgaoRedeApoio";
import { IOrgaoRepository } from "../repository/IOrgaoRepository";

interface OrgaoOperationResult {
  success: boolean;
  orgao?: OrgaoRedeApoio;
  error?: string;
}

export class ControladorOrgao {
  constructor(private readonly orgaoRepository: IOrgaoRepository) {}

  // Método que o main chama via IPC
  public async cadastrarOrgao(nome: string, email: string): Promise<OrgaoOperationResult> {
    const nomeTrim = (nome ?? "").trim();
    const emailTrim = (email ?? "").trim();

    if (!nomeTrim) {
      return { success: false, error: "Nome é obrigatório." };
    }

    if (!emailTrim) {
      return { success: false, error: "E-mail é obrigatório." };
    }

    const existente = await this.orgaoRepository.buscarPorEmail(emailTrim);
    if (existente) {
      return {
        success: false,
        error: "Já existe um órgão da rede de apoio cadastrado com esse e-mail.",
      };
    }

    const orgao = new OrgaoRedeApoio(nomeTrim, emailTrim);
    const criado = await this.orgaoRepository.criar(orgao);

    return { success: true, orgao: criado };
  }

  public async atualizarOrgao(id: number, nome?: string, email?: string): Promise<OrgaoOperationResult> {
    const orgaoId = Number(id);
    if (!Number.isInteger(orgaoId) || orgaoId <= 0) {
      return { success: false, error: "ID do órgão inválido." };
    }

    const orgaoExistente = await this.orgaoRepository.buscarPorId(orgaoId);
    if (!orgaoExistente) {
      return { success: false, error: "Órgão da rede de apoio não encontrado." };
    }

    const nomeTrim = (nome ?? "").trim();
    const emailTrim = (email ?? "").trim();

    if (!nomeTrim && !emailTrim) {
      return { success: false, error: "Informe ao menos um campo para atualizar." };
    }

    const novoNome = nomeTrim || orgaoExistente.getNome();
    const novoEmail = emailTrim || orgaoExistente.getEmail();

    if (!novoNome) {
      return { success: false, error: "Nome é obrigatório." };
    }

    if (!novoEmail) {
      return { success: false, error: "E-mail é obrigatório." };
    }

    if (novoEmail !== orgaoExistente.getEmail()) {
      const emailDuplicado = await this.orgaoRepository.buscarPorEmail(novoEmail);
      if (emailDuplicado && (emailDuplicado.getId() ?? 0) !== orgaoId) {
        return {
          success: false,
          error: "Já existe um órgão da rede de apoio cadastrado com esse e-mail.",
        };
      }
    }

    orgaoExistente.setNome(novoNome);
    orgaoExistente.setEmail(novoEmail);
    orgaoExistente.setId(orgaoId);

    const atualizado = await this.orgaoRepository.atualizar(orgaoExistente);
    return { success: true, orgao: atualizado };
  }

  public async removerOrgao(id: number): Promise<{ success: boolean; error?: string }> {
    const orgaoId = Number(id);
    if (!Number.isInteger(orgaoId) || orgaoId <= 0) {
      return { success: false, error: "ID do órgão inválido." };
    }

    const orgaoExistente = await this.orgaoRepository.buscarPorId(orgaoId);
    if (!orgaoExistente) {
      return { success: false, error: "Órgão da rede de apoio não encontrado." };
    }

    await this.orgaoRepository.remover(orgaoId);
    return { success: true };
  }

  // Método para listar na tela
  public async listarOrgaos() {
    return this.orgaoRepository.listarTodos();
  }
}
