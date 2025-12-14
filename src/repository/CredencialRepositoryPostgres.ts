import { Pool } from "pg";
import { ICredencialRepository } from "./ICredencialRepository";
import { Credencial } from "../models/Credencial";

export class CredencialRepositoryPostgres implements ICredencialRepository {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async obterCredenciais(): Promise<Credencial | null> {
        const query = `
            SELECT id, email_institucional, senha_email, servico_smtp
            FROM CREDENCIAIS_PROCURADORIA
            ORDER BY id
            LIMIT 1
        `;
        
        try {
            const result = await this.pool.query(query);
            
            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];
            return new Credencial(
                row.email_institucional,
                row.senha_email,
                row.servico_smtp,
                row.id
            );
        } catch (error) {
            console.error('Erro ao buscar credenciais:', error);
            throw error;
        }
    }

    async atualizarCredenciais(credencial: Credencial): Promise<void> {
        const valores = [credencial.email, credencial.senha, credencial.servico];
        try {
            const existentes = await this.obterCredenciais();

            if (existentes && typeof existentes.id === 'number') {
                const queryUpdate = `
                    UPDATE CREDENCIAIS_PROCURADORIA
                    SET email_institucional = $1,
                        senha_email = $2,
                        servico_smtp = $3
                    WHERE id = $4
                `;
                await this.pool.query(queryUpdate, [...valores, existentes.id]);
                return;
            }

            const queryInsert = `
                INSERT INTO CREDENCIAIS_PROCURADORIA (email_institucional, senha_email, servico_smtp)
                VALUES ($1, $2, $3)
            `;
            await this.pool.query(queryInsert, valores);
        } catch (error) {
            console.error('Erro ao atualizar credenciais:', error);
            throw error;
        }
    }
}