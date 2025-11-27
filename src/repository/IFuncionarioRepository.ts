import { Funcionario } from "../models/Funcionario";

/**
 * IFuncionarioRepository
 * * Contrato para a persistência de dados de Funcionários.
 * Segue o padrão do ICasoRepository.
 */
export interface IFuncionarioRepository {
    
    /**
     * Cria um novo registro de funcionário no banco.
     * @param funcionario - Objeto Funcionario preenchido
     * @returns Promise<Funcionario> - O objeto salvo (útil para confirmação)
     */
    create(funcionario: Funcionario): Promise<Funcionario>;

    /**
     * Busca um funcionário pelo seu ID (E-mail).
     * @param email - Chave primária
     * @returns Promise<Funcionario | null> - Retorna null se não encontrar
     */
    findByEmail(email: string): Promise<Funcionario | null>;

    /**
     * Lista todos os funcionários cadastrados.
     * @returns Promise<Funcionario[]>
     */
    findAll(): Promise<Funcionario[]>;

    /**
     * Atualiza os dados de um funcionário existente.
     * @param email - ID do funcionário a ser alterado
     * @param dados - Objeto parcial com os campos a serem atualizados
     */
    update(email: string, dados: Partial<Funcionario>): Promise<Funcionario>;

    /**
     * Remove um funcionário do banco.
     * @param email - ID do funcionário a remover
     */
    delete(email: string): Promise<void>;
}