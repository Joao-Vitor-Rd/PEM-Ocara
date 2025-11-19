export class User {
  private id: string;
  private name: string;
  private email: string;
  private createdAt: Date;

  constructor(name: string, email: string) {
    this.id = this.generateId();
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt.toISOString()
    };
  }
}