import { IOrgaoRepository } from "./IOrgaoRepository";
import { OrgaoRedeApoio } from "../models/Rede-Apoio/OrgaoRedeApoio";
import { Pool } from "pg";

export class PostgresOrgaoRepository implements IOrgaoRepository {
    private db: Pool;
    private schemaReady: Promise<void>;

    constructor(pool: Pool) {
        this.db = pool;
        this.schemaReady = this.ensureSchema();
    }

    private async ensureSchema(): Promise<void> {
        try {
            await this.db.query(`
                ALTER TABLE REDE_DE_APOIO
                ADD COLUMN IF NOT EXISTS Id SERIAL
            `);
            await this.db.query(`
                CREATE UNIQUE INDEX IF NOT EXISTS rede_de_apoio_id_idx
                ON REDE_DE_APOIO(Id)
            `);
        } catch (error) {
            console.error("Erro ao garantir estrutura da tabela REDE_DE_APOIO:", error);
        }
    }

    private async waitSchemaReady(): Promise<void> {
        await this.schemaReady;
    }

    private mapRowToOrgao(row: any): OrgaoRedeApoio {
        return new OrgaoRedeApoio(
            row.nome ?? row.Nome,
            row.email ?? row.Email,
            row.id ?? row.Id
        );
    }

    async criar(orgao: OrgaoRedeApoio): Promise<OrgaoRedeApoio> {
        await this.waitSchemaReady();
        const sql = `
            INSERT INTO REDE_DE_APOIO (Email, Nome)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const values = [orgao.getEmail(), orgao.getNome()];

        try {
            const result = await this.db.query(sql, values);
            return this.mapRowToOrgao(result.rows[0]);
        } catch (error: any) {
            console.error("Erro ao criar órgão da rede de apoio:", error);
            throw error;
        }
    }

    async listarTodos(): Promise<OrgaoRedeApoio[]> {
        await this.waitSchemaReady();
        const sql = `SELECT * FROM REDE_DE_APOIO ORDER BY Nome ASC`;
        try {
            const result = await this.db.query(sql);
            return result.rows.map(row => this.mapRowToOrgao(row));
        } catch (error) {
            console.error("Erro ao listar órgãos da rede de apoio:", error);
            return [];
        }
    }

    async buscarPorEmail(email: string): Promise<OrgaoRedeApoio | null> {
        await this.waitSchemaReady();
        const sql = `SELECT * FROM REDE_DE_APOIO WHERE Email = $1`;
        const result = await this.db.query(sql, [email]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToOrgao(result.rows[0]);
    }

    async buscarPorId(id: number): Promise<OrgaoRedeApoio | null> {
        await this.waitSchemaReady();
        const sql = `SELECT * FROM REDE_DE_APOIO WHERE Id = $1`;
        const result = await this.db.query(sql, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToOrgao(result.rows[0]);
    }

    async atualizar(orgao: OrgaoRedeApoio): Promise<OrgaoRedeApoio> {
        await this.waitSchemaReady();
        const id = orgao.getId();
        if (!id) {
            throw new Error("Id do órgão é obrigatório para atualizar.");
        }

        const sql = `
            UPDATE REDE_DE_APOIO
            SET Nome = $1, Email = $2
            WHERE Id = $3
            RETURNING *;
        `;
        const values = [orgao.getNome(), orgao.getEmail(), id];

        const result = await this.db.query(sql, values);
        if (result.rows.length === 0) {
            throw new Error("Órgão da rede de apoio não encontrado para atualização.");
        }
        return this.mapRowToOrgao(result.rows[0]);
    }

    async remover(id: number): Promise<void> {
        await this.waitSchemaReady();
        await this.db.query(`DELETE FROM REDE_DE_APOIO WHERE Id = $1`, [id]);
    }
}