import { IAnexoRepository } from "./IAnexoRepository";
import { Anexo } from "../models/assistida/Anexo";
import { Pool, PoolClient } from "pg";

export class AnexoRepositorioPostgres implements IAnexoRepository {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    /**
     * Salva um anexo no banco de dados
     */
    async salvar(anexo: Anexo, idCaso: number, idAssistida: number): Promise<number> {
        const client = await this.pool.connect();
        
        try {
            const query = `
                INSERT INTO ANEXO (
                    id_caso, id_assistida, nome, tipo, dados
                ) VALUES ($1, $2, $3, $4, $5)
                RETURNING id_anexo
            `;

            // Obter dados - pode ser Buffer, bytea (string hex), ou null
            let dadosAnexo: any = null;
            const dados = anexo.getDados?.();
            
            if (dados) {
                if (Buffer.isBuffer(dados)) {
                    // Se for Buffer, converter para bytea hex
                    dadosAnexo = '\\x' + dados.toString('hex');
                } else if (typeof dados === 'string' && dados.startsWith('\\x')) {
                    // Se já for bytea hex, usar direto
                    dadosAnexo = dados;
                } else if (typeof dados === 'string') {
                    // Se for string comum, converter para bytea
                    const buffer = Buffer.from(dados, 'utf-8');
                    dadosAnexo = '\\x' + buffer.toString('hex');
                } else if (dados instanceof Uint8Array) {
                    // Se for Uint8Array, converter para bytea
                    const buffer = Buffer.from(dados);
                    dadosAnexo = '\\x' + buffer.toString('hex');
                } else {
                    dadosAnexo = null;
                }
            }

            const values = [
                idCaso,
                idAssistida,
                anexo.getNomeAnexo?.() || '',
                anexo.getTipo?.() || '',
                dadosAnexo
            ];

            const result = await client.query(query, values);
            return result.rows[0].id_anexo;
        } finally {
            client.release();
        }
    }

    /**
     * Obtém todos os anexos de um caso
     */
    async getAnexosCaso(idCaso: number): Promise<Anexo[]> {
        const query = `
            SELECT id_anexo, nome, tipo, dados, (octet_length(dados)) as tamanho
            FROM ANEXO
            WHERE id_caso = $1
            ORDER BY id_anexo DESC
        `;

        try {
            const result = await this.pool.query(query, [idCaso]);
            
            return result.rows.map((row: any) => {
                const anexo = new Anexo(
                    row.nome,
                    row.tamanho || 0,
                    row.tipo,
                    row.dados
                );
                anexo.setIdAnexo(row.id_anexo);
                return anexo;
            });
        } catch (error) {
            console.error('Erro ao recuperar anexos do caso:', error);
            return [];
        }
    }

    /**
     * Obtém um anexo específico pelo ID
     */
    async getAnexoById(idAnexo: number): Promise<Anexo | null> {
        const query = `
            SELECT id_anexo, nome, tipo, dados, (octet_length(dados)) as tamanho
            FROM ANEXO
            WHERE id_anexo = $1
        `;

        try {
            const result = await this.pool.query(query, [idAnexo]);
            
            if (result.rows.length === 0) return null;
            
            const row = result.rows[0];
            const anexo = new Anexo(
                row.nome,
                row.tamanho || 0,
                row.tipo,
                row.dados
            );
            anexo.setIdAnexo(row.id_anexo);
            return anexo;
        } catch (error) {
            console.error('Erro ao recuperar anexo:', error);
            return null;
        }
    }

    /**
     * Deleta um anexo
     */
    async deletarAnexo(idAnexo: number): Promise<boolean> {
        const query = `DELETE FROM ANEXO WHERE id_anexo = $1`;

        try {
            const result = await this.pool.query(query, [idAnexo]);
            return result.rowCount! > 0;
        } catch (error) {
            console.error('Erro ao deletar anexo:', error);
            return false;
        }
    }
}