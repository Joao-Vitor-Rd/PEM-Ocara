import { Logger } from '../../utils/Logger';
import { HistoricoController } from '../../controllers/HistoricoController';

export class HistoricoMediator {
  constructor(private historicoController: HistoricoController) {}

  async salvar(dados: any) {
    try {
      Logger.info('Requisição para salvar histórico do caso:', dados);
      
      const historicoId = await this.historicoController.handlerSalvarHistorico(dados.caso);
      
      return {
        success: true,
        historicoId
      };
    } catch (error) {
      Logger.error('Erro ao salvar histórico do caso:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao salvar histórico do caso'
      };
    }
  }

  async registrarDelecao(dados: any) {
    try {
      Logger.info('Requisição para registrar deleção de anexo no histórico:', dados);
      
      const historicoId = await this.historicoController.handlerRegistrarDelecaoAnexo(
        dados.idCaso,
        dados.idAssistida,
        dados.nomeArquivoComExtensao,
        dados.nomeFuncionario,
        dados.emailFuncionario
      );
      
      return {
        success: true,
        historicoId
      };
    } catch (error) {
      Logger.error('Erro ao registrar deleção de anexo no histórico:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao registrar deleção'
      };
    }
  }

  async listar(pagina: number = 1, itensPorPagina: number = 10) {
    try {
      Logger.info(`Requisição para listar histórico - Página: ${pagina}, Itens por página: ${itensPorPagina}`);
      
      const resultado = await this.historicoController.handlerListarHistorico(pagina, itensPorPagina);
      
      return {
        success: true,
        data: resultado
      };
    } catch (error) {
      Logger.error('Erro ao listar histórico:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao listar histórico'
      };
    }
  }
}
