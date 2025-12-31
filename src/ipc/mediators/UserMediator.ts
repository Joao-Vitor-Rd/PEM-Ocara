import { Logger } from '../../utils/Logger';
import { UserController } from '../../controllers/userController';

export class UserMediator {
  constructor(private userController: UserController) {}

  async criar(data: { name: string; email: string }) {
    try {
      Logger.info('Requisição para criar usuário:', data);
      
      const result = this.userController.handleCreateUser(data.name, data.email);
      
      return result;
    } catch (error) {
      Logger.error('Erro ao criar usuário:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  async getAll() {
    try {
      Logger.info('Requisição para buscar todos os usuários');
      const users = this.userController.handleGetUsers();
      return {
        success: true,
        users: users.map(u => u.toJSON())
      };
    } catch (error) {
      Logger.error('Erro ao buscar usuários:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  async getById(id: string) {
    try {
      Logger.info('Requisição para buscar usuário:', id);
      const user = this.userController.handleGetUsers().find(u => u.getId() === id);
      
      if (!user) {
        return {
          success: false,
          error: 'Usuário não encontrado'
        };
      }
      
      return {
        success: true,
        user: user.toJSON()
      };
    } catch (error) {
      Logger.error('Erro ao buscar usuário:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
}
