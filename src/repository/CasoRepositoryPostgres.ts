import { ICasoRepository } from "./ICasoRepository";
import { Caso } from "../models/Caso/Caso";
import { Pool, PoolClient } from "pg";

/**
 * CasoRepositoryPostgres
 * 
 * Implementação da interface ICasoRepository para PostgreSQL.
 * Responsável pela persistência de casos e todas suas relações no banco.
 */
export class CasoRepositoryPostgres implements ICasoRepository {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    /**
     * Salva um novo caso no banco de dados com todas suas relações.
     * Utiliza transação para garantir consistência dos dados.
     * 
     * @param caso - Objeto Caso a ser salvo
     * @returns Promise<number> - ID do caso salvo (id_caso)
     */
    async salvar(caso: Caso): Promise<number> {
        const client = await this.pool.connect();
        
        try {
            await client.query('BEGIN');

            // 1. Salvar Assistida
            const assistida = caso.getAssistida();
            if (!assistida) {
                throw new Error('Caso deve ter uma assistida associada');
            }

            const idAssistida = await this.salvarAssistida(client, assistida);

            // 2. Salvar Caso base
            const sobreVoce = caso.getSobreVoce();
            const outrasInfo = caso.getOutrasInformacoesImportantes();
            
            const queryCase = `
                INSERT INTO CASO (
                    Data, separacao, novo_relac, abrigo, depen_finc, 
                    mora_risco, medida, frequencia, id_assistida
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9
                ) RETURNING id_caso
            `;

            const valuesCaso = [
                caso.getData(),
                sobreVoce?.getSeparacaoRecente() || 'Não',
                sobreVoce?.getNovoRelacionamentoAumentouAgressao() || false,
                outrasInfo?.getAceitaAbrigamentoTemporario() || false,
                outrasInfo?.getDependenteFinanceiroAgressor() || false,
                outrasInfo?.getMoraEmAreaRisco() || 'Não',
                caso.getSobreAgressor()?.getAgressorCumpriuMedidaProtetiva() || false,
                caso.getHistoricoViolencia()?.getAgressoesMaisFrequentesUltimamente() || false,
                idAssistida
            ];

            const resultCaso = await client.query(queryCase, valuesCaso);
            const idCaso = resultCaso.rows[0].id_caso;

            // 3. Salvar Filhos (da SobreVoce)
            const faixaFilhos = sobreVoce?.getFaixaFilhos() || [];
            if (faixaFilhos.length > 0 || sobreVoce?.getTemFilhosComAgressor() || sobreVoce?.getTemFilhosOutroRelacionamento()) {
                await this.salvarFilhos(client, idAssistida, sobreVoce!);
            }

            // 4. Salvar Agressor
            const agressor = caso.getAgressor();
            if (agressor) {
                const idAgressor = await this.salvarAgressor(client, idCaso, idAssistida, agressor);
                
                // 5. Salvar multivalorados do Agressor
                const sobreAgressor = caso.getSobreAgressor();
                if (sobreAgressor) {
                    await this.salvarSubstanciasAgressor(client, idCaso, idAssistida, idAgressor, sobreAgressor);
                    await this.salvarAmeacasAgressor(client, idCaso, idAssistida, idAgressor, sobreAgressor);
                }
            }

            // 6. Salvar Violência
            const historicoViolencia = caso.getHistoricoViolencia();
            if (historicoViolencia) {
                const idViolencia = await this.salvarViolencia(client, idCaso, idAssistida, historicoViolencia);
                
                // 7. Salvar multivalorados da Violência
                await this.salvarTiposViolencia(client, idViolencia, idCaso, idAssistida, historicoViolencia);
                await this.salvarAmeacasViolencia(client, idViolencia, idCaso, idAssistida, historicoViolencia);
                await this.salvarAgressoesViolencia(client, idViolencia, idCaso, idAssistida, historicoViolencia);
                await this.salvarComportamentosViolencia(client, idViolencia, idCaso, idAssistida, historicoViolencia);
            }

            // 8. Salvar Anexos
            const anexos = caso.getAnexos();
            if (anexos && anexos.length > 0) {
                for (const anexo of anexos) {
                    await this.salvarAnexo(client, idCaso, idAssistida, anexo);
                }
            }

            // 9. Salvar Funcionário que acompanha o caso
            if (caso.getProfissionalResponsavel()) {
                await this.salvarFuncionarioCaso(client, idCaso, caso.getProfissionalResponsavel());
            }

            await client.query('COMMIT');
            return idCaso;

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Erro ao salvar caso:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Salva os dados da Assistida
     */
    private async salvarAssistida(client: PoolClient, assistida: any): Promise<number> {
        const queryAssistida = `
            INSERT INTO ASSISTIDA (
                Nome, Idade, endereco, identidadeGenero, n_social, Escolaridade,
                Religiao, Nacionalidade, zona, ocupacao, cad_social,
                Dependentes, Cor_Raca
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            ) RETURNING id
        `;

        const valuesAssistida = [
            assistida.getNome() || '',
            assistida.getIdade() || 0,
            assistida.getEndereco() || '',
            assistida.getIdentidadeGenero() || '',
            assistida.getNomeSocial() || '',
            assistida.getEscolaridade() || '',
            assistida.getReligiao() || '',
            assistida.getNacionalidade() || '',
            assistida.getZonaHabitacao() || '',
            assistida.getProfissao() || '',
            assistida.getNumeroCadastroSocial() || '',
            assistida.getQuantidadeDependentes() || 0,
            assistida.getCorRaca ? assistida.getCorRaca() : 'Não informado'
        ];

        const result = await client.query(queryAssistida, valuesAssistida);
        return result.rows[0].id;
    }

    /**
     * Salva os filhos da assistida e suas faixas etárias
     */
    private async salvarFilhos(client: PoolClient, idAssistida: number, sobreVoce: any): Promise<void> {
        const faixaFilhos = sobreVoce.getFaixaFilhos() || [];

        if (faixaFilhos.length === 0) return;

        // Inserir em FILHO SEM seq_filho (deixa o DB auto-gerar)
        const queryFilho = `
            INSERT INTO FILHO (
                qtd_filhos_deficiencia, viu_violencia,
                violencia_gravidez, id_assistida, qtd_filho_agressor,
                qtd_filho_outro_relacionamento
            ) VALUES (
                $1, $2, $3, $4, $5, $6
            ) RETURNING seq_filho
        `;

        const valuesFilho = [
            sobreVoce.getFilhosComDeficiencia?.() ? `${sobreVoce.getFilhosComDeficiencia()}` : '0',
            sobreVoce.getFilhosPresenciaramViolencia() || false,
            sobreVoce.getViolenciaDuranteGravidez() || false,
            idAssistida,
            sobreVoce.getTemFilhosComAgressor() ? sobreVoce.getQntFilhosComAgressor() : 0,
            sobreVoce.getTemFilhosOutroRelacionamento() ? sobreVoce.getQntFilhosOutroRelacionamento() : 0
        ];

        const resultFilho = await client.query(queryFilho, valuesFilho);
        const seqFilhoInserido = resultFilho.rows[0].seq_filho;

        for (const faixa of faixaFilhos) {
            const queryFaixaFilho = `
                INSERT INTO FAIXA_FILHO (
                    id_assistida, id_filhos, faixa_etaria
                ) VALUES ($1, $2, $3)
            `;

            await client.query(queryFaixaFilho, [idAssistida, seqFilhoInserido, faixa || '']);
        }

        const conflito = sobreVoce.getConflitoAgressor();
        if (conflito) {
            const tiposConflito = conflito.split(';').map((c: string) => c.trim());
            for (const tipo of tiposConflito) {
                if (tipo) {
                    const queryConflito = `
                        INSERT INTO CONFLITO_FILHO (
                            tipo_conflito, id_assistida, seq_filho
                        ) VALUES ($1, $2, $3)
                    `;
                    await client.query(queryConflito, [tipo, idAssistida, seqFilhoInserido]);
                }
            }
        }
    }

    /**
     * Salva os dados do Agressor
     */
    private async salvarAgressor(client: PoolClient, idCaso: number, idAssistida: number, agressor: any): Promise<number> {
        const queryAgressor = `
            INSERT INTO AGRESSOR (
                id_caso, id_assistida, Nome, Idade, Vinculo,
                doenca, medida_protetiva, suicidio, financeiro, arma_de_fogo
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
            ) RETURNING id_agressor
        `;

        const sobreAgressor = agressor._sobreAgressor || {};
        
        const valuesAgressor = [
            idCaso,
            idAssistida,
            agressor.getNome() || '',
            agressor.getIdade() || 0,
            agressor.getVinculoAssistida() || '',
            sobreAgressor.getDoencaMental?.() || '',
            sobreAgressor.getAgressorCumpriuMedidaProtetiva?.() || false,
            sobreAgressor.getAgressorTentativaSuicidio?.() || false,
            sobreAgressor.getAgressorDesempregado?.() || false,
            sobreAgressor.getAgressorPossuiArmaFogo?.() || false
        ];

        const result = await client.query(queryAgressor, valuesAgressor);
        return result.rows[0].id_agressor;
    }

    /**
     * Salva substâncias que o agressor consome
     */
    private async salvarSubstanciasAgressor(
        client: PoolClient,
        idCaso: number,
        idAssistida: number,
        idAgressor: number,
        sobreAgressor: any
    ): Promise<void> {
        const substancias = sobreAgressor.getUsoDrogasAlcool() || [];
        
        for (const substancia of substancias) {
            const querySubstancia = `
                INSERT INTO SUBSTANCIAS_AGRESSOR (
                    id_caso, id_assistida, id_agressor, tipo_substancia
                ) VALUES ($1, $2, $3, $4)
            `;
            await client.query(querySubstancia, [idCaso, idAssistida, idAgressor, substancia]);
        }
    }

    /**
     * Salva ameaças feitas pelo agressor
     */
    private async salvarAmeacasAgressor(
        client: PoolClient,
        idCaso: number,
        idAssistida: number,
        idAgressor: number,
        sobreAgressor: any
    ): Promise<void> {
        const ameacas = sobreAgressor.getAgressorAmeacouAlguem() || [];
        
        for (const ameaca of ameacas) {
            const queryAmeaca = `
                INSERT INTO AMEACA_AGRESSOR (
                    id_caso, id_assistida, id_agressor, alvo_ameaca
                ) VALUES ($1, $2, $3, $4)
            `;
            await client.query(queryAmeaca, [idCaso, idAssistida, idAgressor, ameaca]);
        }
    }

    /**
     * Salva os dados de violência
     */
    private async salvarViolencia(
        client: PoolClient,
        idCaso: number,
        idAssistida: number,
        historicoViolencia: any
    ): Promise<number> {
        const queryViolencia = `
            INSERT INTO VIOLENCIA (
                id_caso, id_assistida, estupro, data_ocorrencia
            ) VALUES (
                $1, $2, $3, $4
            ) RETURNING id_violencia
        `;

        const valuesViolencia = [
            idCaso,
            idAssistida,
            historicoViolencia.getAbusoSexual() || false,
            new Date()
        ];

        const result = await client.query(queryViolencia, valuesViolencia);
        return result.rows[0].id_violencia;
    }

    /**
     * Salva tipos de violência
     */
    private async salvarTiposViolencia(
        client: PoolClient,
        idViolencia: number,
        idCaso: number,
        idAssistida: number,
        historicoViolencia: any
    ): Promise<void> {
        const tipos = historicoViolencia.getAmeacaFamiliar() || [];
        
        for (const tipo of tipos) {
            const query = `
                INSERT INTO TIPO_VIOLENCIA (
                    id_violencia, id_caso, id_assistida, tipo_violencia
                ) VALUES ($1, $2, $3, $4)
            `;
            await client.query(query, [idViolencia, idCaso, idAssistida, tipo]);
        }
    }

    /**
     * Salva ameaças da violência
     */
    private async salvarAmeacasViolencia(
        client: PoolClient,
        idViolencia: number,
        idCaso: number,
        idAssistida: number,
        historicoViolencia: any
    ): Promise<void> {
        const ameacas = historicoViolencia.getAmeacaFamiliar() || [];
        
        for (const ameaca of ameacas) {
            const query = `
                INSERT INTO AMEACAS_VIOLENCIA (
                    id_violencia, id_caso, id_assistida, tipo_ameaca
                ) VALUES ($1, $2, $3, $4)
            `;
            await client.query(query, [idViolencia, idCaso, idAssistida, ameaca]);
        }
    }

    /**
     * Salva agressões da violência
     */
    private async salvarAgressoesViolencia(
        client: PoolClient,
        idViolencia: number,
        idCaso: number,
        idAssistida: number,
        historicoViolencia: any
    ): Promise<void> {
        const agressoes = historicoViolencia.getAgressaoFisica() || [];
        
        for (const agressao of agressoes) {
            const query = `
                INSERT INTO AGRESSAO_VIOLENCIA (
                    id_violencia, id_caso, id_assistida, tipo_agressao
                ) VALUES ($1, $2, $3, $4)
            `;
            await client.query(query, [idViolencia, idCaso, idAssistida, agressao]);
        }
    }

    /**
     * Salva comportamentos da violência
     */
    private async salvarComportamentosViolencia(
        client: PoolClient,
        idViolencia: number,
        idCaso: number,
        idAssistida: number,
        historicoViolencia: any
    ): Promise<void> {
        const comportamentos = historicoViolencia.getComportamentosAgressor() || [];
        
        for (const comportamento of comportamentos) {
            const query = `
                INSERT INTO COMPORTAMENTO_VIOLENCIA (
                    id_violencia, id_caso, id_assistida, descricao_comportamento
                ) VALUES ($1, $2, $3, $4)
            `;
            await client.query(query, [idViolencia, idCaso, idAssistida, comportamento]);
        }
    }

    /**
     * Salva anexos do caso
     */
    private async salvarAnexo(client: PoolClient, idCaso: number, idAssistida: number, anexo: any): Promise<void> {
        const query = `
            INSERT INTO ANEXO (
                id_caso, id_assistida, nome, tipo, dados
            ) VALUES ($1, $2, $3, $4, $5)
        `;

        const values = [
            idCaso,
            idAssistida,
            anexo.getNomeAnexo?.() || '',
            anexo.getTipo?.() || '',
            anexo.getDados?.() || null
        ];

        await client.query(query, values);
    }

    /**
     * Salva associação de funcionário ao caso
     */
    private async salvarFuncionarioCaso(
        client: PoolClient,
        idCaso: number,
        emailFuncionario: string
    ): Promise<void> {
        // Validar se o email é válido (contém @)
        if (!emailFuncionario || !emailFuncionario.includes('@')) {
            console.warn(`Email de funcionário inválido: "${emailFuncionario}". Pulando inserção.`);
            return;
        }

        // Verificar se o funcionário existe na tabela FUNCIONARIO
        const checkQuery = `SELECT email FROM FUNCIONARIO WHERE email = $1`;
        const checkResult = await client.query(checkQuery, [emailFuncionario]);

        // Se o funcionário não existe, não inserir a relação
        if (checkResult.rows.length === 0) {
            console.warn(`Funcionário com email "${emailFuncionario}" não encontrado na tabela FUNCIONARIO. Pulando inserção.`);
            return;
        }

        // Se existe, inserir a relação
        const query = `
            INSERT INTO FUNCIONARIO_ACOMPANHA_CASO (
                email_funcionario, id_caso
            ) VALUES ($1, $2)
            ON CONFLICT DO NOTHING
        `;

        await client.query(query, [emailFuncionario, idCaso]);
    }
}
