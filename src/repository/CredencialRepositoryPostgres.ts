import { Pool } from "pg";
import { ICredencialRepository } from "./ICredencialRepository";
import { Credencial } from "../models/Credencial";

export class CredencialRepositoryPostgres implements ICredencialRepository {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async obterCredenciais(): Promise<Credencial | null> {
        // Busca sempre o ID 1
        const query = `SELECT * FROM CREDENCIAIS_PROCURADORIA WHERE id = 1`;
        
        try {
            const result = await this.pool.query(query);
            
            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];
            // Mapeia snake_case do banco para o objeto
            return new Credencial(
                row.email_institucional,
                row.senha_email,
                row.servico_smtp
            );
        } catch (error) {
            console.error('Erro ao buscar credenciais:', error);
            throw error;
        }
    }

    async atualizarCredenciais(credencial: Credencial): Promise<void> {
        const query = `
            UPDATE CREDENCIAIS_PROCURADORIA
            SET email_institucional = $1,
                senha_email = $2,
                servico_smtp = $3
            WHERE id = 1
        `;

        const values = [
            credencial.email,
            credencial.senha,
            credencial.servico
        ];

        try {
            await this.pool.query(query, values);
        } catch (error) {
            console.error('Erro ao atualizar credenciais:', error);
            throw error;
        }
    }
}