import { Funcionario, PerfilUsuario } from '../models/Funcionario';
import { IFuncionarioRepository } from '../repository/IFuncionarioRepository';

/**
 * FuncionarioService
 * Responsável pelas regras de negócio e segurança da gestão de funcionários.
 * Ref: RNF-01 (Segurança da Informação) e RN-01 (Controle de Perfis).
 */
export class FuncionarioService {
    private repository: IFuncionarioRepository;

    constructor(repository: IFuncionarioRepository) {
        this.repository = repository;
    }

    /**
     * Cria um novo funcionário.
     * - Verifica duplicidade de e-mail.
        * - Armazena a senha exatamente como foi informada.
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

        // 3. Salvar diretamente (sem hash)
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
        * - Se a senha for informada, substitui diretamente pelo novo valor.
        * - Se não for, mantém a antiga.
     */
    async update(email: string, dados: Partial<Funcionario>): Promise<any> {
        const funcionarioAtual = await this.repository.findByEmail(email);
        if (!funcionarioAtual) {
            throw new Error('Funcionário não encontrado.');
        }

        // Se estiver atualizando a senha, aceita o novo valor diretamente
        if (!dados.senha || dados.senha.trim() === '') {
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

    async atualizarPerfil(
        email: string, 
        nome: string, 
        senhaAtual: string, 
        novaSenha?: string,
        novoEmail?: string
    ): Promise<any> {
        // 1. Buscar usuário no banco
        const funcionario = await this.repository.findByEmail(email);
        if (!funcionario) {
            throw new Error('Usuário não encontrado.');
        }

        // 2. VERIFICAÇÃO DE SEGURANÇA (Obrigatória)
        const senhaValida = senhaAtual === funcionario.senha;
        if (!senhaValida) {
            throw new Error('A senha atual está incorreta.');
        }

        // 3. Preparar dados para atualização
        // Só permitimos mudar Nome e Senha (Cargo e Email são protegidos)
        const dadosAtualizacao: Partial<Funcionario> = {
            nome: nome
        };

        if (novoEmail && novoEmail.trim() !== '' && novoEmail !== email) {
            const existente = await this.repository.findByEmail(novoEmail);
            if (existente) {
                throw new Error('Já existe um usuário com este e-mail.');
            }
            dadosAtualizacao.email = novoEmail.trim();
        }

        // 4. Se o usuário quiser trocar a senha
        if (novaSenha && novaSenha.trim() !== '') {
            dadosAtualizacao.senha = novaSenha;
        }

        // 5. Salvar alterações
        const atualizado = await this.repository.update(email, dadosAtualizacao);

        return this.removerSenha(atualizado);
    }

    /**
     * Realiza a autenticação básica de um funcionário.
     * - Busca o usuário pelo e-mail
        * - Compara a senha informada com o valor salvo
     * - Retorna os dados sanitizados (sem senha) quando válido
     */
    async autenticar(email: string, senha: string): Promise<any> {
        if (!email || !senha) {
            throw new Error('Informe e-mail e senha.');
        }

        const funcionario = await this.repository.findByEmail(email);
        if (!funcionario) {
            throw new Error('Usuário não encontrado.');
        }

        const senhaValida = senha === funcionario.senha;
        if (!senhaValida) {
            throw new Error('Senha inválida.');
        }

        return this.removerSenha(funcionario);
    }
}