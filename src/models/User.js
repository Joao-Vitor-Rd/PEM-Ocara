export class User {
    constructor(name, email) {
        this.id = this.generateId();
        this.name = name;
        this.email = email;
        this.createdAt = new Date();
    }
    generateId() {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getEmail() {
        return this.email;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            createdAt: this.createdAt.toISOString()
        };
    }
}
