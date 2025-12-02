import { IOrgaoRepository } from "./IOrgaoRepository";
import { OrgaoRedeApoio } from "../models/Rede-Apoio/OrgaoRedeApoio";
import { Pool } from "pg"; // Importe o tipo Pool

export class PostgresOrgaoRepository implements IOrgaoRepository {
    
    private db: Pool; // Agora guardamos o pool aqui

    // Recebemos o pool no construtor
    constructor(pool: Pool) {
        this.db = pool;
    }

    async criar(orgao: OrgaoRedeApoio): Promise<OrgaoRedeApoio> {
        const sql = `
            INSERT INTO REDE_DE_APOIO (Email, Nome) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
        const values = [orgao.getEmail(), orgao.getNome()];

        try {
            // Usamos this.db.query em vez de db.query
            await this.db.query(sql, values);
            console.log("Salvo no Postgres:", orgao.getNome());
            return orgao;
        } catch (error: any) {
            console.error("Erro no banco:", error);
            throw error;
        }
    }

    async listarTodos(): Promise<OrgaoRedeApoio[]> {
        const sql = `SELECT * FROM REDE_DE_APOIO`;
        try {
            const result = await this.db.query(sql); // Usamos this.db
            return result.rows.map((row: any) => 
                new OrgaoRedeApoio(row.nome || row.Nome, row.email || row.Email) 
            );
        } catch (error) {
            console.error("Erro ao listar:", error);
            return [];
        }
    }
    
    // ... (outros métodos: buscarPorEmail, etc. usando this.db)
    async buscarPorEmail(email: string): Promise<OrgaoRedeApoio | null> {
        const sql = `SELECT * FROM REDE_DE_APOIO WHERE Email = $1`;
        const result = await this.db.query(sql, [email]);
        if (result.rows.length === 0) return null;
        const row = result.rows[0];
        return new OrgaoRedeApoio(row.nome || row.Nome, row.email || row.Email);
    }

    async atualizar(orgao: OrgaoRedeApoio): Promise<OrgaoRedeApoio> { throw new Error("Não implementado"); }
    async remover(email: string): Promise<void> { throw new Error("Não implementado"); }
}