export class OrgaoRedeApoio {
    constructor(nome, objetivo, email, telefone, endereco) {
        this.nome = nome;
        this.objetivo = objetivo;
        this.email = email;
        this.telefone = telefone;
        this.endereco = endereco;
    }
    // Getters
    getNome() {
        return this.nome;
    }
    getObjetivo() {
        return this.objetivo;
    }
    getEmail() {
        return this.email;
    }
    getTelefone() {
        return this.telefone;
    }
    getEndereco() {
        return this.endereco;
    }
    // Setters
    setNome(nome) {
        this.nome = nome;
    }
    setObjetivo(objetivo) {
        this.objetivo = objetivo;
    }
    setEmail(email) {
        this.email = email;
    }
    setTelefone(telefone) {
        this.telefone = telefone;
    }
    setEndereco(endereco) {
        this.endereco = endereco;
    }
}
