import { Caso } from "../models/Caso/Caso";

/**
 * IHistoricoRepository
 * 
 * Interface que define o contrato para persistência de histórico.
 * Implementa inversão de dependência permitindo múltiplas implementações (PostgreSQL, MySQL, etc).
 */
export interface IHistoricoRepository {
    /**
     * Salva um novo histórico no banco de dados
     * @param caso - Objeto Caso com todos os dados e IDs necessários
     * @returns Promise<number> - ID do primeiro histórico salvo
     * @throws Error - Se houver erro na persistência
     */
    salvar(caso: Caso): Promise<number>;

     /**
     * Atualizar um histórico no banco de dados
     * @param caso - Objeto Caso com todos os dados e IDs necessários
     * @returns Promise<number> - ID do historico salvo
     * @throws Error - Se houver erro na persistência
     */
    atualizar(caso: Caso): Promise<number>;

    /**
     * Registra a deleção de um anexo/arquivo no histórico
     * @param idCaso - ID do caso
     * @param idAssistida - ID da assistida
     * @param nomeArquivoComExtensao - Nome do arquivo com extensão (ex: documento.pdf)
     * @param nomeFuncionario - Nome do funcionário que deletou
     * @param emailFuncionario - Email do funcionário
     * @returns Promise<number> - ID do registro de histórico criado
     */
    registrarDelecaoAnexo(
        idCaso: number,
        idAssistida: number,
        nomeArquivoComExtensao: string,
        nomeFuncionario: string,
        emailFuncionario: string
    ): Promise<number>;

    /**
     * Lista todos os registros de histórico com paginação
     * @param pagina - Número da página (começa em 1)
     * @param itensPorPagina - Quantidade de itens por página (padrão: 10)
     * @returns Promise com array de registros e informações de paginação
     */
    listar(pagina: number, itensPorPagina: number): Promise<{
        registros: any[];
        totalRegistros: number;
        totalPaginas: number;
        paginaAtual: number;
    }>;

}