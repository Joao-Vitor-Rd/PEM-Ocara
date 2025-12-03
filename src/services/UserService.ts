import { User } from '../models/User';

export class UserService {
  private users: User[] = [];

  public createUser(name: string, email: string): User {
    // Validações
    if (!name || name.trim() === '') {
      throw new Error('Nome é obrigatório');
    }

    if (!email || email.trim() === '') {
      throw new Error('Email é obrigatório');
    }

    if (!this.isValidEmail(email)) {
      throw new Error('Email inválido');
    }

    const user = new User(name, email);
    this.users.push(user);

    return user;
  }

  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(user => user.getId() === id);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}