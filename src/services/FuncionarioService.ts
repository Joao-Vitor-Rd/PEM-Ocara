import * as bcrypt from 'bcrypt';
import { Funcionario, PerfilUsuario } from "../models/Funcionario";
import { IFuncionarioRepository } from "../repository/IFuncionarioRepository";

export class FuncionarioService {
    private funcionarioRepository: IFuncionarioRepository;

    constructor(funcionarioRepository: IFuncionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    public async autenticar(email: string, senhaPura: string): Promise<Omit<Funcionario, 'senha'>> {
        const funcionario = await this.funcionarioRepository.findByEmail(email);

        if (!funcionario) {
            throw new Error("E-mail ou senha inválidos.");
        }

        const senhaValida = await bcrypt.compare(senhaPura, funcionario.senha);

        if (!senhaValida) {
            throw new Error("E-mail ou senha inválidos.");
        }

        return this.sanitizarFuncionario(funcionario);
    }

    public async criarFuncionario(dados: Funcionario): Promise<Omit<Funcionario, 'senha'>> {
        if (!dados.email || !dados.senha || !dados.nome || !dados.cargo) {
            throw new Error("Todos os campos são obrigatórios.");
        }

        const existe = await this.funcionarioRepository.findByEmail(dados.email);
        if (existe) {
            throw new Error("Já existe um funcionário cadastrado com este e-mail.");
        }

        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(dados.senha, saltRounds);
        
        dados.senha = senhaHash;

        const novoFuncionario = await this.funcionarioRepository.create(dados);

        return this.sanitizarFuncionario(novoFuncionario);
    }

    public async atualizarPerfil(
        emailAtual: string, 
        nome: string, 
        senhaAtual: string, 
        novaSenha?: string, 
        novoEmail?: string
    ): Promise<Omit<Funcionario, 'senha'>> {
        const funcionario = await this.funcionarioRepository.findByEmail(emailAtual);
        if (!funcionario) {
            throw new Error("Usuário não encontrado.");
        }

        const senhaCorreta = await bcrypt.compare(senhaAtual, funcionario.senha);
        if (!senhaCorreta) {
            throw new Error("A senha atual informada está incorreta.");
        }

        const dadosAtualizacao: Partial<Funcionario> = {};

        if (nome && nome.trim() !== "") {
            dadosAtualizacao.nome = nome;
        }

        if (novoEmail && novoEmail !== emailAtual) {
            const emailEmUso = await this.funcionarioRepository.findByEmail(novoEmail);
            if (emailEmUso) {
                throw new Error("O novo e-mail informado já está em uso.");
            }
            dadosAtualizacao.email = novoEmail;
        }

        if (novaSenha && novaSenha.trim() !== "") {
            const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
            dadosAtualizacao.senha = novaSenhaHash;
        }

        const funcionarioAtualizado = await this.funcionarioRepository.update(emailAtual, dadosAtualizacao);

        return this.sanitizarFuncionario(funcionarioAtualizado);
    }

    public async findAll(): Promise<Omit<Funcionario, 'senha'>[]> {
        const funcionarios = await this.funcionarioRepository.findAll();
        return funcionarios.map(f => this.sanitizarFuncionario(f));
    }

    public async delete(email: string): Promise<void> {
        await this.funcionarioRepository.delete(email);
    }

    private sanitizarFuncionario(funcionario: Funcionario): any {
        return {
            email: funcionario.email,
            nome: funcionario.nome,
            cargo: funcionario.cargo
        };
    }
}