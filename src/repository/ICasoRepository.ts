import { Caso } from "../models/Caso/Caso";

/**
 * ICasoRepository
 * 
 * Interface que define o contrato para persistência de casos.
 * Implementa inversão de dependência permitindo múltiplas implementações (PostgreSQL, MySQL, etc).
 */
export interface ICasoRepository {
    /**
     * Salva um novo caso no banco de dados
     * @param caso - Objeto Caso a ser salvo com todas as suas relações
     * @returns Promise<{idCaso: number, idAssistida: number}> - IDs do caso e assistida salvos
     * @throws Error - Se houver erro na persistência
     */
    salvar(caso: Caso): Promise<{ idCaso: number; idAssistida: number }>;

    /**
     * Recupera todas as assistidas do banco
     * @returns Promise<any[]> - Lista de assistidas
     */
    getAllAssistidas(): Promise<any[]>;

    /**
     * Recupera todos os casos de uma assistida
     * @param idAssistida - ID da assistida
     * @returns Promise<any[]> - Lista de casos
     */
    getAllCasosAssistida(idAssistida: number): Promise<any[]>;

    /**
     * Recupera um caso específico com todas suas relações
     * @param idCaso - ID do caso
     * @returns Promise<any> - Dados completos do caso
     */
    getCaso(idCaso: number): Promise<any>;

    /**
     * Recupera informações gerais de um caso específico
     * @param idCaso - ID do caso
     * @returns Promise<any> - Informações gerais do caso
     */
    getInformacoesGeraisDoCaso(idCaso: number): Promise<any>;
    /**
     * Recupera o total de casos no ano, com mês e quantidade
     * @returns Promise<number> - Total de casos no ano, e nome dos meses
     */
    getTotalCasosNoAno(): Promise<any[]>;

    getEnderecosAssistidas(): Promise<any[]>;

    getTotalCasos(): Promise<number>;

    getTotalCasosMes(mes: number, ano: number): Promise<number>;

    /**
     * Recupera o total de casos no ano filtrado por regiões e data
     * @param regioes - Array de regiões/endereços para filtrar
     * @param dataInicio - Data inicial (YYYY-MM-DD) - opcional
     * @param dataFim - Data final (YYYY-MM-DD) - opcional
     * @returns Promise<any[]> - Total de casos por mês filtrados
     */
    getTotalCasosNoAnoFiltrado(regioes: string[], dataInicio?: string, dataFim?: string): Promise<any[]>;

    /**
     * Recupera endereços das assistidas filtrados por data
     * @param dataInicio - Data inicial (YYYY-MM-DD)
     * @param dataFim - Data final (YYYY-MM-DD)
     * @returns Promise<any[]> - Endereços e quantidades
     */
    getEnderecosAssistidasFiltrado(dataInicio?: string, dataFim?: string): Promise<any[]>;

    /**
     * Recupera total de casos com filtros de região e data
     * @param regioes - Array de regiões para filtrar
     * @param dataInicio - Data inicial (YYYY-MM-DD)
     * @param dataFim - Data final (YYYY-MM-DD)
     * @returns Promise<number> - Total filtrado
     */
    getTotalCasosFiltrado(regioes: string[], dataInicio?: string, dataFim?: string): Promise<number>;
}