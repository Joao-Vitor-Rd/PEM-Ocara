import bcrypt from 'bcrypt';
import { Funcionario, PerfilUsuario } from '../models/Funcionario';
import { IFuncionarioRepository } from '../repository/IFuncionarioRepository';

/**
 * FuncionarioService
 * Responsável pelas regras de negócio e segurança da gestão de funcionários.
 * Ref: RNF-01 (Segurança da Informação) e RN-01 (Controle de Perfis).
 */
export class FuncionarioService {
    private repository: IFuncionarioRepository;
    private readonly SALT_ROUNDS = 10; // Custo do processamento do hash

    constructor(repository: IFuncionarioRepository) {
        this.repository = repository;
    }

    /**
     * Cria um novo funcionário.
     * - Verifica duplicidade de e-mail.
     * - Criptografa a senha antes de salvar.
     */
    async create(dados: Funcionario): Promise<any> {
        // 1. Verificar se o funcionário já existe
        const existe = await this.repository.findByEmail(dados.email);
        if (existe) {
            throw new Error('Já existe um funcionário cadastrado com este e-mail.');
        }

        // 2. Validar se o cargo é válido (RN-01)
        if (!Object.values(PerfilUsuario).includes(dados.cargo as PerfilUsuario)) {
            throw new Error('Cargo inválido.');
        }

        // 3. Criptografar a senha (RNF-01)
        const senhaHash = await bcrypt.hash(dados.senha, this.SALT_ROUNDS);
        
        // Atualiza a senha no objeto antes de passar pro repositório
        dados.senha = senhaHash;

        // 4. Salvar
        const criado = await this.repository.create(dados);

        // 5. Retornar sem a senha (Segurança)
        return this.removerSenha(criado);
    }

    /**
     * Lista todos os funcionários.
     * - Retorna a lista sem expor as senhas.
     */
    async findAll(): Promise<any[]> {
        const funcionarios = await this.repository.findAll();
        // Map para remover a senha de cada item
        return funcionarios.map(f => this.removerSenha(f));
    }

    /**
     * Busca um funcionário específico.
     */
    async findByEmail(email: string): Promise<any | null> {
        const funcionario = await this.repository.findByEmail(email);
        if (!funcionario) return null;
        
        return this.removerSenha(funcionario);
    }

    /**
     * Atualiza dados do funcionário.
     * - Se a senha for informada, faz o hash novamente.
     * - Se não for, mantém a antiga.
     */
    async update(email: string, dados: Partial<Funcionario>): Promise<any> {
        const funcionarioAtual = await this.repository.findByEmail(email);
        if (!funcionarioAtual) {
            throw new Error('Funcionário não encontrado.');
        }

        // Se estiver atualizando a senha, precisamos fazer o hash novamente
        // Verificamos se 'dados.senha' existe e não é vazio
        if (dados.senha && dados.senha.trim() !== '') {
            dados.senha = await bcrypt.hash(dados.senha, this.SALT_ROUNDS);
        } else {
            // Se não enviou senha nova, remove do objeto de atualização para não sobrepor com vazio/null
            delete dados.senha; 
        }

        const atualizado = await this.repository.update(email, dados);
        return this.removerSenha(atualizado);
    }

    /**
     * Remove um funcionário.
     */
    async delete(email: string): Promise<void> {
        const funcionario = await this.repository.findByEmail(email);
        if (!funcionario) throw new Error('Funcionário não encontrado.');
        
        await this.repository.delete(email);
    }

    /**
     * Helper para converter a Classe Funcionario em um objeto JSON seguro (sem senha).
     * O equivalente manual ao @JsonIgnore.
     */
    private removerSenha(funcionario: Funcionario): any {
        return {
            email: funcionario.email,
            nome: funcionario.nome,
            cargo: funcionario.cargo
            // Senha é propositalmente omitida aqui
        };
    }
}