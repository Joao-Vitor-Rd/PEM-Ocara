import { UserService } from "../service/UserService";
import { User } from "../model/User";

/**
 * User Controller
 * Manages the communication between the view and service
 */
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Handle creating a new user
   */
  public handleCreateUser(name: string): User | null {
    if (!name || name.trim() === "") {
      console.error("Nome do usuário não pode ser vazio");
      return null;
    }

    try {
      const user = this.userService.createUser(name.trim());
      console.log(`Usuário criado: ${user.getName()}`);
      return user;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return null;
    }
  }

  /**
   * Handle getting all users
   */
  public handleGetAllUsers(): User[] {
    return this.userService.getAllUsers();
  }

  /**
   * Handle getting a user by name
   */
  public handleGetUserByName(name: string): User | undefined {
    return this.userService.getUserByName(name);
  }

  /**
   * Handle deleting a user
   */
  public handleDeleteUser(name: string): boolean {
    const success = this.userService.deleteUser(name);
    if (success) {
      console.log(`Usuário deletado: ${name}`);
    } else {
      console.error(`Usuário não encontrado: ${name}`);
    }
    return success;
  }
}
