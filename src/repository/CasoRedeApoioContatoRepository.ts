import { Pool } from "pg";
import { ICasoRedeApoioContatoRepository } from "./ICasoRedeApoioContatoRepository";

interface RegistrarContatoParams {
    idCaso: number;
    emailRede: string;
    assunto?: string | null;
    mensagem?: string | null;
    dataEnvio?: Date;
}

export class CasoRedeApoioContatoRepository implements ICasoRedeApoioContatoRepository {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async registrarContato({ idCaso, emailRede, assunto, mensagem, dataEnvio }: RegistrarContatoParams): Promise<void> {
        const query = `
            INSERT INTO caso_rede_apoio_contato (
                id_caso,
                email_rede,
                assunto,
                mensagem,
                data_envio
            ) VALUES ($1, $2, $3, $4, $5)
        `;

        await this.pool.query(query, [
            idCaso,
            emailRede,
            assunto ?? null,
            mensagem ?? null,
            dataEnvio ?? new Date()
        ]);
    }

    async obterNomesRedesContatadas(idCaso: number): Promise<string[]> {
        const query = `
            SELECT
                COALESCE(r.nome, contato.email_rede) AS nome_exibicao,
                MIN(contato.data_envio) AS primeira_data
            FROM caso_rede_apoio_contato contato
            LEFT JOIN rede_de_apoio r ON r.email = contato.email_rede
            WHERE contato.id_caso = $1
            GROUP BY nome_exibicao
            ORDER BY primeira_data ASC
        `;

        const resultado = await this.pool.query(query, [idCaso]);
        return resultado.rows.map((row) => row.nome_exibicao as string);
    }
}
