import { Logger } from '../../utils/Logger';
import { AssistidaController } from '../../controllers/AssistidaController';

export class AssistidaMediator {
  constructor(private assistidaController: AssistidaController) {}

  async getEnderecos() {
    Logger.info("Requisição: obter endereços das Assistidas");
    try {
      const enderecos = await this.assistidaController.handlergetEnderecosAssistidas();
      return {
        success: true,
        enderecos: enderecos
      };
    } catch (error) {
      Logger.error('Erro ao buscar assistidas:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  async criar(data: any) {
    const result = this.assistidaController.handlerCriarAssistida(
      data.nome,
      data.idade,
      data.identidadeGenero,
      data.nomeSocial,
      data.endereco,
      data.escolaridade,
      data.religiao,
      data.nacionalidade,
      data.zonaHabitacao,
      data.profissao,
      data.limitacaoFisica,
      data.numeroCadastroSocial,
      data.quantidadeDependentes,
      data.temDependentes
    );

    return result;
  }

  async listarTodas() {
    Logger.info('Requisição para listar todas as assistidas');
    const assistidas = await this.assistidaController.handlerListarTodasAssistidas();
    
    return {
      success: true,
      assistidas
    };
  }

  async buscarPorId(id: number) {
    Logger.info(`Requisição para buscar assistida com ID: ${id}`);
    const assistida = await this.assistidaController.handlerBuscarAssistidaPorId(id);
    
    if (!assistida) {
      return {
        success: false,
        error: 'Assistida não encontrada'
      };
    }
    
    return {
      success: true,
      assistida
    };
  }

  async atualizar(data: any) {
    Logger.info(`Requisição para atualizar assistida com ID: ${data.id}`);
    
    const resultado = await this.assistidaController.handlerAtualizarAssistida(
      data.id,
      data.nome || '',
      data.idade || 0,
      data.identidadeGenero || '',
      data.nomeSocial || '',
      data.endereco || '',
      data.escolaridade || '',
      data.religiao || '',
      data.nacionalidade || '',
      data.zonaHabitacao || '',
      data.profissao || '',
      data.limitacaoFisica || '',
      data.numeroCadastroSocial || '',
      data.quantidadeDependentes || 0,
      data.temDependentes || false
    );
    
    return resultado;
  }
}
