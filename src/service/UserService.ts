import { User } from "../model/User";

/**
 * User Service (Servico)
 * Handles business logic for user management
 */
export class UserService {
  private users: User[] = [];

  /**
   * Create a new user
   */
  public createUser(name: string): User {
    const user = new User(name);
    this.users.push(user);
    return user;
  }

  /**
   * Get all users
   */
  public getAllUsers(): User[] {
    return this.users;
  }

  /**
   * Get user by name
   */
  public getUserByName(name: string): User | undefined {
    return this.users.find((user) => user.getName() === name);
  }

  /**
   * Delete user by name
   */
  public deleteUser(name: string): boolean {
    const index = this.users.findIndex((user) => user.getName() === name);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}
