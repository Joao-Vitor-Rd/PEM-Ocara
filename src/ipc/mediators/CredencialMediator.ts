import { Logger } from '../../utils/Logger';
import { ControladorCredencial } from '../../controllers/ControladorCredencial';

export class CredencialMediator {
  constructor(private credencialController: ControladorCredencial) {}

  async salvar(data: any): Promise<any> {
    try {
      Logger.info('Requisição para salvar credenciais de e-mail...');
      return await this.credencialController.salvarCredenciais(data);
    } catch (error) {
      Logger.error('Erro ao salvar credenciais:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  async obter(): Promise<any> {
    try {
      Logger.info('Requisição para obter credenciais atuais...');
      return await this.credencialController.obterCredenciais();
    } catch (error) {
      Logger.error('Erro ao obter credenciais:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }
}
