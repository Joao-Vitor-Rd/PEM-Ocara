import { Anexo } from "../models/assistida/Anexo";

/**
 * IAnexoRepository
 * 
 * Interface que define o contrato para persistência de anexos.
 * Implementa inversão de dependência permitindo múltiplas implementações (PostgreSQL, MySQL, etc).
 */
export interface IAnexoRepository {
    /**
     * Salva um novo anexo no banco de dados
     * @param anexo - Objeto Anexo a ser salvo
     * @param idCaso - ID do caso ao qual o anexo pertence
     * @param idAssistida - ID da assistida
     * @param relatorio - Se o anexo é um relatório (true) ou prova (false)
     * @returns Promise<number> - ID do anexo salvo
     * @throws Error - Se houver erro na persistência
     */
    salvar(anexo: Anexo, idCaso: number, idAssistida: number, relatorio?: boolean): Promise<number>;

    /**
     * Recupera todos os anexos de um caso específico
     * @param idCaso - ID do caso
     * @returns Promise<Anexo[]> - Array com todos os anexos do caso
     * @throws Error - Se houver erro na recuperação
     */
    getAnexosCaso(idCaso: number): Promise<Anexo[]>;

    /**
     * Recupera um anexo específico pelo ID
     * @param idAnexo - ID do anexo
     * @returns Promise<Anexo | null> - Objeto Anexo ou null se não encontrado
     * @throws Error - Se houver erro na recuperação
     */
    getAnexoById(idAnexo: number): Promise<Anexo | null>;

    /**
     * Deleta um anexo do banco de dados
     * @param idAnexo - ID do anexo a ser deletado
     * @returns Promise<boolean> - true se deletado com sucesso, false caso contrário
     * @throws Error - Se houver erro na deleção
     */
    deletarAnexo(idAnexo: number): Promise<boolean>;
}
