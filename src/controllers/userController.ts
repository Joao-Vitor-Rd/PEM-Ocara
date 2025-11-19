import { UserService } from '../services/UserService';
import { User } from '../models/User';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public handleCreateUser(name: string, email: string): { success: boolean; user?: User; error?: string } {
    try {
      const user = this.userService.createUser(name, email);
      return {
        success: true,
        user: user
      };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  public handleGetUsers(): User[] {
    return this.userService.getUsers();
  }
}