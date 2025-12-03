import { Pool } from "pg";
import { IFuncionarioRepository } from "./IFuncionarioRepository";
import { Funcionario, PerfilUsuario } from "../models/Funcionario";

export class FuncionarioRepositoryPostgres implements IFuncionarioRepository {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async create(funcionario: Funcionario): Promise<Funcionario> {
        const query = `
            INSERT INTO FUNCIONARIO (email, nome, cargo, senha)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        const values = [
            funcionario.email, 
            funcionario.nome, 
            funcionario.cargo, 
            funcionario.senha
        ];

        try {
            const result = await this.pool.query(query, values);
            return this.mapRowToModel(result.rows[0]);
        } catch (error) {
            console.error('Erro ao criar funcionário:', error);
            throw error;
        }
    }

    async findByEmail(email: string): Promise<Funcionario | null> {
        const query = `SELECT * FROM FUNCIONARIO WHERE email = $1`;

        try {
            const result = await this.pool.query(query, [email]);
            
            if (result.rows.length === 0) {
                return null;
            }

            return this.mapRowToModel(result.rows[0]);
        } catch (error) {
            console.error('Erro ao buscar funcionário por email:', error);
            throw error;
        }
    }

    async update(email: string, dados: Partial<Funcionario>): Promise<Funcionario> {
        const query = `
            UPDATE FUNCIONARIO 
            SET nome = COALESCE($2, nome),
                cargo = COALESCE($3, cargo),
                senha = COALESCE($4, senha),
                email = COALESCE($5, email)
            WHERE email = $1
            RETURNING *
        `;

        const values = [
            email,
            dados.nome,
            dados.cargo,
            dados.senha,
            dados.email
        ];

        try {
            const result = await this.pool.query(query, values);

            if (result.rows.length === 0) {
                throw new Error(`Funcionário com email ${email} não encontrado para atualização.`);
            }

            return this.mapRowToModel(result.rows[0]);
        } catch (error) {
            console.error('Erro ao atualizar funcionário:', error);
            throw error;
        }
    }

    async findAll(): Promise<Funcionario[]> {
        const query = `SELECT * FROM FUNCIONARIO ORDER BY nome ASC`;

        try {
            const result = await this.pool.query(query);
            return result.rows.map(row => this.mapRowToModel(row));
        } catch (error) {
            console.error('Erro ao listar funcionários:', error);
            throw error;
        }
    }

    async delete(email: string): Promise<void> {
        const query = `DELETE FROM FUNCIONARIO WHERE email = $1`;

        try {
            await this.pool.query(query, [email]);
        } catch (error) {
            console.error('Erro ao deletar funcionário:', error);
            throw error;
        }
    }

    private mapRowToModel(row: any): Funcionario {
        return new Funcionario(
            row.email,
            row.nome,
            row.cargo as PerfilUsuario,
            row.senha
        );
    }
}