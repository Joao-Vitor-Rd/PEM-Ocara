import { Credencial } from "../models/Credencial";

export interface ICredencialRepository {
    /**
     * Busca as credenciais configuradas (Sempre ID=1).
     */
    obterCredenciais(): Promise<Credencial | null>;

    /**
     * Atualiza as credenciais do sistema.
     */
    atualizarCredenciais(credencial: Credencial): Promise<void>;
}