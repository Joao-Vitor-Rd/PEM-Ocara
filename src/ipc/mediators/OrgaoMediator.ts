import { Logger } from '../../utils/Logger';
import { ControladorOrgao } from '../../controllers/ControladorOrgao';

export class OrgaoMediator {
  constructor(private orgaoController: ControladorOrgao) {}

  async criar(data: { nome: string; email: string }) {
    try {
      Logger.info('Requisição para criar órgão da rede de apoio:', data);
      const result = await this.orgaoController.cadastrarOrgao(data.nome, data.email);

      if (!result.success || !result.orgao) {
        return {
          success: false,
          error: result.error ?? 'Erro ao cadastrar órgão da rede de apoio',
        };
      }
      
      const orgao = result.orgao;
      return {
        success: true,
        orgao: {
          id: orgao.getId(),
          nome: orgao.getNome(),
          email: orgao.getEmail(),
        },
      };
    } catch (error) {
      Logger.error('Erro ao criar órgão da rede de apoio:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async listarTodos() {
    try {
      Logger.info('Requisição para listar órgãos da rede de apoio');
      const orgaos = await this.orgaoController.listarOrgaos();

      return {
        success: true,
        orgaos: orgaos.map(orgao => ({
            id: orgao.getId(),
            nome: orgao.getNome(),
            email: orgao.getEmail(),
          })
        ),
      };
    } catch (error) {
      Logger.error('Erro ao listar órgãos da rede de apoio:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        orgaos: [],
      };
    }
  }

  async atualizar(data: { id: number; nome?: string; email?: string }) {
    try {
      Logger.info('Requisição para atualizar órgão da rede de apoio:', data);
      const result = await this.orgaoController.atualizarOrgao(data.id, data.nome, data.email);

      if (!result.success || !result.orgao) {
        return {
          success: false,
          error: result.error ?? 'Erro ao atualizar órgão da rede de apoio',
        };
      }

      const orgao = result.orgao;
      return {
        success: true,
        orgao: {
          id: orgao.getId(),
          nome: orgao.getNome(),
          email: orgao.getEmail(),
        },
      };
    } catch (error) {
      Logger.error('Erro ao atualizar órgão da rede de apoio:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  async deletar(id: number) {
    try {
      Logger.info('Requisição para remover órgão da rede de apoio:', id);
      const result = await this.orgaoController.removerOrgao(id);
      if (!result.success) {
        return result;
      }

      return { success: true };
    } catch (error) {
      Logger.error('Erro ao remover órgão da rede de apoio:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }
}
