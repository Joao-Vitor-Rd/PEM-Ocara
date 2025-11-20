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
     * @returns Promise<number> - ID do caso salvo
     * @throws Error - Se houver erro na persistência
     */
    salvar(caso: Caso): Promise<number>;

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
    
}

