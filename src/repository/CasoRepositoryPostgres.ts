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
     * Salva um novo caso no banco de dados com uma assistida existente.
     * Utiliza transação para garantir consistência dos dados.
     * 
     * @param caso - Objeto Caso a ser salvo
     * @param idAssistidaExistente - ID da assistida que já existe no banco
     * @returns Promise<{idCaso: number, idAssistida: number}> - IDs do caso salvo e da assistida existente
     */
    async salvarComAssistidaExistente(caso: Caso, idAssistidaExistente: number): Promise<{ idCaso: number; idAssistida: number }> {
        const client = await this.pool.connect();
        
        try {
            await client.query('BEGIN');

            // Verificar se a assistida existente realmente existe
            const checkQuery = `SELECT id FROM ASSISTIDA WHERE id = $1`;
            const checkResult = await client.query(checkQuery, [idAssistidaExistente]);
            
            if (checkResult.rows.length === 0) {
                throw new Error(`Assistida com ID ${idAssistidaExistente} não encontrada no banco de dados`);
            }

            const idAssistida = idAssistidaExistente;
            console.log(`✓ Usando assistida existente com ID: ${idAssistida}`);

            // Salvar Caso base (usando a assistida existente)
            const sobreVoce = caso.getSobreVoce();
            const outrasInfo = caso.getOutrasInformacoesImportantes();
            
            const queryCase = `
                INSERT INTO CASO (
                    Data, separacao, novo_relac, abrigo, depen_finc, 
                    mora_risco, medida, frequencia, id_assistida, outras_informacoes
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
                ) RETURNING id_caso
            `;

            const dataOcorrida = caso.getAgressor()?.getDataOcorrida() || caso.getData();
            
            const valuesCaso = [
                dataOcorrida,
                sobreVoce?.getSeparacaoRecente() || 'Não',
                sobreVoce?.getNovoRelacionamentoAumentouAgressao() || false,
                outrasInfo?.getAceitaAbrigamentoTemporario() || false,
                outrasInfo?.getDependenteFinanceiroAgressor() || false,
                outrasInfo?.getMoraEmAreaRisco() || 'Não',
                caso.getSobreAgressor()?.getAgressorCumpriuMedidaProtetiva() || false,
                caso.getHistoricoViolencia()?.getAgressoesMaisFrequentesUltimamente() || false,
                idAssistida,
                caso.getOutrasInformacoesEncaminhamento()?.anotacoesLivres || ''
            ];

            const resultCaso = await client.query(queryCase, valuesCaso);
            const idCaso = resultCaso.rows[0].id_caso;
            console.log(`✓ Caso criado com ID: ${idCaso}`);

            // Resto da lógica de salvamento (igual ao método salvar normal)
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

            // 8. Salvar PreenchimentoProfissional
            const preenchimentoProfissional = caso.getPreenchimentoProfissional();
            if (preenchimentoProfissional) {
                await this.salvarPreenchimentoProfissional(client, idCaso, idAssistida, preenchimentoProfissional);
            }

            // 9. Salvar Anexos
            const anexos = caso.getAnexos();
            console.log(`\n=== SALVANDO ANEXOS ===`);
            console.log(`Total de anexos no caso: ${anexos.length}`);
            if (anexos && anexos.length > 0) {
                for (const anexo of anexos) {
                    console.log(`Salvando anexo: ${anexo.getNomeAnexo?.()}`);
                    await this.salvarAnexo(client, idCaso, idAssistida, anexo);
                }
                console.log(`✓ Todos os ${anexos.length} anexo(s) foram salvos`);
            } else {
                console.log(`⚠ Nenhum anexo para salvar`);
            }

            // 10. Salvar Funcionário que acompanha o caso
            if (caso.getProfissionalResponsavel()) {
                await this.salvarFuncionarioCaso(client, idCaso, caso.getProfissionalResponsavel());
            }

            await client.query('COMMIT');
            console.log(`✓ Caso salvo com sucesso com assistida existente. idCaso=${idCaso}, idAssistida=${idAssistida}`);
            return { idCaso, idAssistida };

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Erro ao salvar caso com assistida existente:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Salva um novo caso no banco de dados com todas suas relações.
     * Utiliza transação para garantir consistência dos dados.
     * 
     * @param caso - Objeto Caso a ser salvo
     * @returns Promise<number> - ID do caso salvo (id_caso)
     */
    async salvar(caso: Caso): Promise<{ idCaso: number; idAssistida: number }> {
        const client = await this.pool.connect();
        
        try {
            await client.query('BEGIN');

            // 1. Salvar Assistida
            const assistida = caso.getAssistida();
            if (!assistida) {
                throw new Error('Caso deve ter uma assistida associada');
            }

            const idAssistida = await this.salvarAssistida(client, assistida, caso.getSobreVoce());

            // 2. Salvar Caso base
            const sobreVoce = caso.getSobreVoce();
            const outrasInfo = caso.getOutrasInformacoesImportantes();
            
            const queryCase = `
                INSERT INTO CASO (
                    Data, separacao, novo_relac, abrigo, depen_finc, 
                    mora_risco, medida, frequencia, id_assistida, outras_informacoes
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
                ) RETURNING id_caso
            `;

            const dataOcorrida = caso.getAgressor()?.getDataOcorrida() || caso.getData();
            
            const valuesCaso = [
                dataOcorrida,
                sobreVoce?.getSeparacaoRecente() || 'Não',
                sobreVoce?.getNovoRelacionamentoAumentouAgressao() || false,
                outrasInfo?.getAceitaAbrigamentoTemporario() || false,
                outrasInfo?.getDependenteFinanceiroAgressor() || false,
                outrasInfo?.getMoraEmAreaRisco() || 'Não',
                caso.getSobreAgressor()?.getAgressorCumpriuMedidaProtetiva() || false,
                caso.getHistoricoViolencia()?.getAgressoesMaisFrequentesUltimamente() || false,
                idAssistida,
                caso.getOutrasInformacoesEncaminhamento()?.anotacoesLivres || ''
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

            // 8. Salvar PreenchimentoProfissional
            const preenchimentoProfissional = caso.getPreenchimentoProfissional();
            if (preenchimentoProfissional) {
                await this.salvarPreenchimentoProfissional(client, idCaso, idAssistida, preenchimentoProfissional);
            }

            // 9. Salvar Anexos
            const anexos = caso.getAnexos();
            console.log(`\n=== SALVANDO ANEXOS ===`);
            console.log(`Total de anexos no caso: ${anexos.length}`);
            if (anexos && anexos.length > 0) {
                for (const anexo of anexos) {
                    console.log(`Salvando anexo: ${anexo.getNomeAnexo?.()}`);
                    await this.salvarAnexo(client, idCaso, idAssistida, anexo);
                }
                console.log(`✓ Todos os ${anexos.length} anexo(s) foram salvos`);
            } else {
                console.log(`⚠ Nenhum anexo para salvar`);
            }

            // 10. Salvar Funcionário que acompanha o caso
            if (caso.getProfissionalResponsavel()) {
                await this.salvarFuncionarioCaso(client, idCaso, caso.getProfissionalResponsavel());
            }

            await client.query('COMMIT');
            return { idCaso, idAssistida };

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
    private async salvarAssistida(client: PoolClient, assistida: any, sobreVoce: any): Promise<number> {
        const queryAssistida = `
            INSERT INTO ASSISTIDA (
                Nome, Idade, endereco, identidadeGenero, n_social, Escolaridade,
                Religiao, Nacionalidade, zona, ocupacao, cad_social,
                Dependentes, Cor_Raca, deficiencia
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
            ) RETURNING id
        `;

        const valuesAssistida = [
            assistida.getNome() || '',
            assistida.getIdade() || 0,
            assistida.getEndereco()?.toUpperCase() || '',
            assistida.getIdentidadeGenero() || '',
            assistida.getNomeSocial() || '',
            assistida.getEscolaridade() || '',
            assistida.getReligiao() || '',
            assistida.getNacionalidade() || '',
            assistida.getZonaHabitacao() || '',
            assistida.getProfissao() || '',
            assistida.getNumeroCadastroSocial() || '',
            assistida.getQuantidadeDependentes() || 0,
            sobreVoce.getCorRaca() ? sobreVoce.getCorRaca() : 'Não informado',
            sobreVoce.getPossuiDeficienciaDoenca() ? sobreVoce.getPossuiDeficienciaDoenca() : 'Não informado'
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
        // Salvar ameaças familiares
        const tipos = historicoViolencia.getAmeacaFamiliar() || [];
        const tiposUnicos = new Set(tipos); // Remove duplicatas no client
        
        for (const tipo of tiposUnicos) {
            const query = `
                INSERT INTO TIPO_VIOLENCIA (
                    id_violencia, id_caso, id_assistida, tipo_violencia
                ) VALUES ($1, $2, $3, $4)
                ON CONFLICT DO NOTHING
            `;
            await client.query(query, [idViolencia, idCaso, idAssistida, tipo]);
        }

        // Salvar outras formas de violência
        const outrasFormas = historicoViolencia.getOutrasFormasViolencia() || [];
        const outrasFormasUnicas = new Set(outrasFormas); // Remove duplicatas no client
        
        for (const forma of outrasFormasUnicas) {
            const query = `
                INSERT INTO TIPO_VIOLENCIA (
                    id_violencia, id_caso, id_assistida, tipo_violencia
                ) VALUES ($1, $2, $3, $4)
                ON CONFLICT DO NOTHING
            `;
            await client.query(query, [idViolencia, idCaso, idAssistida, forma]);
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

        // Obter dados - pode ser Buffer ou null
        let dadosAnexo: Buffer | null = null;
        const dados = anexo.getDados?.();
        
        console.log(`  → Processando anexo: ${anexo.getNomeAnexo?.()}`);
        console.log(`    Tipo de dados: ${typeof dados}, é Buffer: ${Buffer.isBuffer(dados)}`);
        
        if (dados) {
            // Se já é Buffer, usar direto
            if (Buffer.isBuffer(dados)) {
                dadosAnexo = dados;
                console.log(`    ✓ Dados já são Buffer: ${dadosAnexo.length} bytes`);
            } 
            // Se é string (pode ser path ou base64), tenta converter
            else if (typeof dados === 'string') {
                try {
                    dadosAnexo = Buffer.from(dados, 'utf-8');
                    console.log(`    ✓ Convertido de string para Buffer: ${dadosAnexo.length} bytes`);
                } catch (e) {
                    console.warn(`    ✗ Erro ao converter dados do anexo: ${e}`);
                    dadosAnexo = null;
                }
            }
        } else {
            console.log(`    ⚠ Dados vazios ou null`);
        }

        const values = [
            idCaso,
            idAssistida,
            anexo.getNomeAnexo?.() || '',
            anexo.getTipo?.() || '',
            dadosAnexo
        ];

        console.log(`  → INSERT ANEXO: id_caso=${values[0]}, id_assistida=${values[1]}, nome=${values[2]}, tipo=${values[3]}, dados_size=${dadosAnexo?.length || 0}`);
        
        try {
            await client.query(query, values);
            console.log(`  ✓ Anexo salvo com sucesso: ${values[2]}`);
        } catch (erro) {
            console.error(`  ✗ Erro ao salvar anexo: ${erro}`);
            throw erro;
        }
    }

    /**
     * Salva dados de PreenchimentoProfissional
     */
    private async salvarPreenchimentoProfissional(
        client: PoolClient,
        idCaso: number,
        idAssistida: number,
        preenchimentoProfissional: any
    ): Promise<void> {
        const queryPreenchimento = `
            INSERT INTO PREENCHIMENTO_PROFISSIONAL (
                id_caso, id_assistida,
                assistida_respondeu_sem_ajuda,
                assistida_respondeu_com_auxilio,
                assistida_sem_condicoes,
                assistida_recusou,
                terceiro_comunicante
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7
            ) RETURNING id_preenchimento
        `;

        const valuesPreenchimento = [
            idCaso,
            idAssistida,
            preenchimentoProfissional.getAssistidaRespondeuSemAjuda() || false,
            preenchimentoProfissional.getAssistidaRespondeuComAuxilio() || false,
            preenchimentoProfissional.getAssistidaSemCondicoes() || false,
            preenchimentoProfissional.getAssistidaRecusou() || false,
            preenchimentoProfissional.getTerceiroComunicante() || false
        ];

        const resultPreenchimento = await client.query(queryPreenchimento, valuesPreenchimento);
        const idPreenchimento = resultPreenchimento.rows[0].id_preenchimento;

        // Salvar tipos de violência multivalorados
        const tiposViolencia = preenchimentoProfissional.getTipoViolencia() || [];
        for (const tipo of tiposViolencia) {
            const queryTipo = `
                INSERT INTO TIPO_VIOLENCIA_PREENCHIMENTO (
                    id_preenchimento, tipo_violencia
                ) VALUES ($1, $2)
            `;
            await client.query(queryTipo, [idPreenchimento, tipo]);
        }
    }

    /**
     * Salva associação de funcionário ao caso
     */
    private async salvarFuncionarioCaso(
        client: PoolClient,
        idCaso: number,
        emailFuncionario: string
    ): Promise<void> {
        if (!emailFuncionario || !emailFuncionario.includes('@')) {
            console.warn(`Email de funcionário inválido: "${emailFuncionario}". Pulando inserção.`);
            return;
        }

        const checkQuery = `SELECT email FROM FUNCIONARIO WHERE email = $1`;
        const checkResult = await client.query(checkQuery, [emailFuncionario]);

        if (checkResult.rows.length === 0) {
            console.warn(`Funcionário com email "${emailFuncionario}" não encontrado na tabela FUNCIONARIO. Pulando inserção.`);
            return;
        }

        const query = `
            INSERT INTO FUNCIONARIO_ACOMPANHA_CASO (
                email_funcionario, id_caso
            ) VALUES ($1, $2)
            ON CONFLICT DO NOTHING
        `;

        await client.query(query, [emailFuncionario, idCaso]);
    }

    async getAllAssistidas(): Promise<any[]> {
        const query = `
            SELECT * FROM ASSISTIDA
            ORDER BY id DESC
        `;
        
        const result = await this.pool.query(query);
        return result.rows;
    }

    async getInformacoesGeraisDoCaso(idCaso: number): Promise<any> {
        const query = `
            SELECT
                c.id_caso,
                a.id as id_assistida,
                a.nome as nomeAssistida,
                ag.nome as nomeAgressor,
                c.data,
                pp.assistida_respondeu_sem_ajuda,
                pp.assistida_respondeu_com_auxilio,
                pp.assistida_sem_condicoes,
                pp.assistida_recusou,
                pp.terceiro_comunicante,
                array_agg(DISTINCT tv.tipo_violencia) as tipoViolencia
            FROM
                caso c
            LEFT JOIN assistida a ON c.id_assistida = a.id
            LEFT JOIN agressor ag ON c.id_caso = ag.id_caso
            LEFT JOIN preenchimento_profissional pp ON pp.id_caso = c.id_caso
            LEFT JOIN tipo_violencia_preenchimento tv ON tv.id_preenchimento = pp.id_preenchimento
            WHERE 
                c.id_caso = $1
            GROUP BY c.id_caso, a.id, a.nome, ag.nome, c.data, pp.assistida_respondeu_sem_ajuda, pp.assistida_respondeu_com_auxilio, pp.assistida_sem_condicoes, pp.assistida_recusou, pp.terceiro_comunicante
        `;
        
        const result = await this.pool.query(query, [idCaso]);
        return result.rows[0] || null;
    }



    async getAllCasosAssistida(idAssistida: number): Promise<any[]> {
        const query = `
            SELECT 
                c.id_caso,
                c.id_assistida,
                'Sem rede' as nome_rede,
                'Ativo' as status
            FROM CASO c
            WHERE c.id_assistida = $1
            ORDER BY c.id_caso DESC
        `;
        
        console.log('Executando query para idAssistida:', idAssistida);
        const result = await this.pool.query(query, [idAssistida]);
        console.log('Resultado da query:', result.rows);
        return result.rows;
    }


    async getCaso(idCaso: number): Promise<any> {
        const query = `
            SELECT
                c.id_caso, c.data, c.separacao, c.novo_relac, c.abrigo, c.depen_finc, 
                c.mora_risco, c.medida, c.frequencia, c.id_assistida,

                a.id as assistida_id, a.nome as assistida_nome, a.idade as assistida_idade, 
                a.identidadegenero as assistida_identidadegenero, a.n_social as assistida_n_social, 
                a.escolaridade as assistida_escolaridade, a.religiao as assistida_religiao, 
                a.nacionalidade as assistida_nacionalidade, a.zona as assistida_zona, 
                a.ocupacao as assistida_ocupacao, a.cad_social as assistida_cad_social, 
                a.dependentes as assistida_dependentes, a.cor_raca as assistida_cor_raca, 
                a.endereco as assistida_endereco,

                ag.id_agressor, ag.nome as agressor_nome, ag.idade as agressor_idade, 
                ag.vinculo as agressor_vinculo, ag.doenca as agressor_doenca, 
                ag.medida_protetiva as agressor_medida_protetiva, ag.suicidio as agressor_suicidio, 
                ag.financeiro as agressor_financeiro, ag.arma_de_fogo as agressor_arma_de_fogo,

                f.seq_filho, f.qtd_filhos_deficiencia, f.viu_violencia, f.violencia_gravidez,
                f.qtd_filho_agressor, f.qtd_filho_outro_relacionamento,
                ff.faixa_etaria,

                v.id_violencia, v.estupro, v.data_ocorrencia,
                
                tv.tipo_violencia,
                av.tipo_ameaca,
                agv.tipo_agressao,
                cv.descricao_comportamento,
                sa.tipo_substancia,
                aa.alvo_ameaca,

                an.id_anexo, an.nome as anexo_nome, an.tipo as anexo_tipo, an.dados,

                fac.email_funcionario

            FROM CASO c

            LEFT JOIN ASSISTIDA a ON a.id = c.id_assistida
            LEFT JOIN AGRESSOR ag ON ag.id_caso = c.id_caso
            LEFT JOIN FILHO f ON f.id_assistida = c.id_assistida
            LEFT JOIN FAIXA_FILHO ff ON ff.id_assistida = f.id_assistida AND ff.id_filhos = f.seq_filho
            LEFT JOIN VIOLENCIA v ON v.id_caso = c.id_caso
            LEFT JOIN TIPO_VIOLENCIA tv ON tv.id_caso = c.id_caso
            LEFT JOIN AMEACAS_VIOLENCIA av ON av.id_caso = c.id_caso
            LEFT JOIN AGRESSAO_VIOLENCIA agv ON agv.id_caso = c.id_caso
            LEFT JOIN COMPORTAMENTO_VIOLENCIA cv ON cv.id_caso = c.id_caso
            LEFT JOIN SUBSTANCIAS_AGRESSOR sa ON sa.id_caso = c.id_caso
            LEFT JOIN AMEACA_AGRESSOR aa ON aa.id_caso = c.id_caso
            LEFT JOIN ANEXO an ON an.id_caso = c.id_caso
            LEFT JOIN FUNCIONARIO_ACOMPANHA_CASO fac ON fac.id_caso = c.id_caso

            WHERE c.id_caso = $1
        `;

        try {
            const result = await this.pool.query(query, [idCaso]);
            
            if (result.rows.length === 0) {
                return null;
            }

            const primeiraLinha = result.rows[0];
            
            return {
                caso: {
                    id_caso: primeiraLinha.id_caso,
                    data: primeiraLinha.data,
                    separacao: primeiraLinha.separacao,
                    novo_relac: primeiraLinha.novo_relac,
                    abrigo: primeiraLinha.abrigo,
                    depen_finc: primeiraLinha.depen_finc,
                    mora_risco: primeiraLinha.mora_risco,
                    medida: primeiraLinha.medida,
                    frequencia: primeiraLinha.frequencia,
                    id_assistida: primeiraLinha.id_assistida
                },
                assistida: primeiraLinha.assistida_id ? {
                    id: primeiraLinha.assistida_id,
                    nome: primeiraLinha.assistida_nome,
                    idade: primeiraLinha.assistida_idade,
                    identidadegenero: primeiraLinha.assistida_identidadegenero,
                    n_social: primeiraLinha.assistida_n_social,
                    escolaridade: primeiraLinha.assistida_escolaridade,
                    religiao: primeiraLinha.assistida_religiao,
                    nacionalidade: primeiraLinha.assistida_nacionalidade,
                    zona: primeiraLinha.assistida_zona,
                    ocupacao: primeiraLinha.assistida_ocupacao,
                    cad_social: primeiraLinha.assistida_cad_social,
                    dependentes: primeiraLinha.assistida_dependentes,
                    cor_raca: primeiraLinha.assistida_cor_raca,
                    endereco: primeiraLinha.assistida_endereco
                } : null,
                agressor: primeiraLinha.id_agressor ? {
                    id_agressor: primeiraLinha.id_agressor,
                    nome: primeiraLinha.agressor_nome,
                    idade: primeiraLinha.agressor_idade,
                    vinculo: primeiraLinha.agressor_vinculo,
                    doenca: primeiraLinha.agressor_doenca,
                    medida_protetiva: primeiraLinha.agressor_medida_protetiva,
                    suicidio: primeiraLinha.agressor_suicidio,
                    financeiro: primeiraLinha.agressor_financeiro,
                    arma_de_fogo: primeiraLinha.agressor_arma_de_fogo
                } : null,
                filhos: [...new Set(result.rows
                    .filter((r: any) => r.seq_filho)
                    .map((r: any) => JSON.stringify({
                        seq_filho: r.seq_filho,
                        qtd_filhos_deficiencia: r.qtd_filhos_deficiencia,
                        viu_violencia: r.viu_violencia,
                        violencia_gravidez: r.violencia_gravidez,
                        qtd_filho_agressor: r.qtd_filho_agressor,
                        qtd_filho_outro_relacionamento: r.qtd_filho_outro_relacionamento,
                        faixa_etaria: r.faixa_etaria
                    })))
                ].map((str: string) => JSON.parse(str)),
                violencia: primeiraLinha.id_violencia ? {
                    id_violencia: primeiraLinha.id_violencia,
                    estupro: primeiraLinha.estupro,
                    data_ocorrencia: primeiraLinha.data_ocorrencia
                } : null,
                tiposViolencia: [...new Set(result.rows
                    .filter((r: any) => r.tipo_violencia)
                    .map((r: any) => r.tipo_violencia))],
                ameacasViolencia: [...new Set(result.rows
                    .filter((r: any) => r.tipo_ameaca)
                    .map((r: any) => r.tipo_ameaca))],
                agressoesViolencia: [...new Set(result.rows
                    .filter((r: any) => r.tipo_agressao)
                    .map((r: any) => r.tipo_agressao))],
                comportamentosViolencia: [...new Set(result.rows
                    .filter((r: any) => r.descricao_comportamento)
                    .map((r: any) => r.descricao_comportamento))],
                substanciasAgressor: [...new Set(result.rows
                    .filter((r: any) => r.tipo_substancia)
                    .map((r: any) => r.tipo_substancia))],
                ameacasAgressor: [...new Set(result.rows
                    .filter((r: any) => r.alvo_ameaca)
                    .map((r: any) => r.alvo_ameaca))],
                anexos: [...new Set(result.rows
                    .filter((r: any) => r.id_anexo)
                    .map((r: any) => JSON.stringify({
                        id_anexo: r.id_anexo,
                        nome: r.anexo_nome,
                        tipo: r.anexo_tipo,
                        dados: r.dados
                    })))
                ].map((str: string) => JSON.parse(str)),
                funcionario: primeiraLinha.email_funcionario || null
            };
        } catch (error) {
            console.error('Erro ao recuperar caso:', error);
            return null;
        }
    }

    async getTotalCasosNoAno(): Promise<any[]> {
        const query = `
            WITH meses_serie AS (
                SELECT 
                    DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')::date + (INTERVAL '1 month' * generate_subscripts(ARRAY[0,1,2,3,4,5,6,7,8,9,10,11], 1)) as mes_inicio
            ),
            casos_agrupados AS (
                SELECT
                    DATE_TRUNC('month', c.data)::date as mes,
                    COUNT(*) as quantidade
                FROM CASO c
                WHERE c.data >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
                  AND c.data <= DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month - 1 day'
                GROUP BY DATE_TRUNC('month', c.data)
            )
            SELECT
                EXTRACT(MONTH FROM ms.mes_inicio)::int as mes_numero,
                COALESCE(ca.quantidade, 0) as quantidade,
                ms.mes_inicio
            FROM meses_serie ms
            LEFT JOIN casos_agrupados ca ON DATE_TRUNC('month', ca.mes) = ms.mes_inicio
            ORDER BY ms.mes_inicio ASC
        `;

        try {
            const result = await this.pool.query(query);
            const mesesPT = [
                '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];

            return result.rows.map((row: any) => ({
                mes: mesesPT[parseInt(row.mes_numero, 10)],
                quantidade: parseInt(row.quantidade, 10),
            }));
        } catch (error) {
            console.error('Erro ao recuperar casos por mês:', error);
            return [];
        }
    }

    async getEnderecosAssistidas(): Promise<any[]> {
        const query = `
            select endereco, count(*)
            from assistida
            where endereco IS NOT NULL
            group by endereco
        `;

        try {
            const result = await this.pool.query(query);
            return result.rows.map((row: any) => ({
                endereco: row.endereco,
                quantidade: parseInt(row.count, 10),
            }));
        } catch (error) {
            console.error('Erro ao recuperar endereços das assistidas:', error);
            return [];
        }
    }

    async getTotalCasos(): Promise<number> {
        const query = `SELECT COUNT(*) AS total FROM CASO`;
        
        try {
            const result = await this.pool.query(query);
            return parseInt(result.rows[0].total, 10);
        } catch (error) {
            console.error('Erro ao recuperar total de casos:', error);
            return 0;
        }
    }

    async getTotalCasosMes(mes: number, ano: number): Promise<number> {
        const query = `
            SELECT COUNT(*) AS total
            FROM CASO
            WHERE EXTRACT(MONTH FROM data) = $1 AND EXTRACT(YEAR FROM data) = $2
        `;

        try {
            const result = await this.pool.query(query, [mes, ano]);
            return parseInt(result.rows[0].total, 10);
        } catch (error) {
            console.error('Erro ao recuperar total de casos do mês:', error);
            return 0;
        }
    }

    async getTotalCasosNoAnoFiltrado(regioes: string[], dataInicio?: string, dataFim?: string): Promise<any[]> {
        console.log('========== getTotalCasosNoAnoFiltrado ==========');
        console.log('Regiões:', regioes);
        console.log('Data Início:', dataInicio);
        console.log('Data Fim:', dataFim);

        // Se "todas" está selecionado, ignora o filtro de regiões
        const temFiltroRegiao = !regioes.includes('todas') && regioes.length > 0;
        const whereClauseRegiao = temFiltroRegiao
            ? `AND a.endereco IN (${regioes.map((_, i) => `$${i + 1}`).join(',')})`
            : '';

        // Montar parâmetros - só adiciona regiões se houver filtro
        const params: any[] = [];
        if (temFiltroRegiao) {
            params.push(...regioes);
        }

        let dataInicioBD: string = dataInicio || '';
        let dataFimBD: string = dataFim || '';
        let paramIndexData = params.length + 1;

        // Se não houver intervalo de datas, usar últimos 12 meses
        if (!dataInicio && !dataFim) {
            const dataObj = new Date();
            dataObj.setMonth(dataObj.getMonth() - 12);
            dataInicioBD = dataObj.toISOString().split('T')[0];
            dataFimBD = new Date().toISOString().split('T')[0];
        }

        // Adicionar datas aos parâmetros
        params.push(dataInicioBD);
        const paramDataInicio = paramIndexData;
        paramIndexData++;
        
        params.push(dataFimBD);
        const paramDataFim = paramIndexData;

        const query = `
            WITH data_series AS (
                SELECT DATE_TRUNC('month', d)::date as mes_data
                FROM generate_series($${paramDataInicio}::date, $${paramDataFim}::date, interval '1 month') d
            ),
            casos_agrupados AS (
                SELECT
                    DATE_TRUNC('month', c.data)::date as mes_data,
                    COUNT(*) as quantidade
                FROM CASO c
                JOIN ASSISTIDA a ON c.id_assistida = a.id
                WHERE c.data >= $${paramDataInicio}::date 
                  AND c.data <= $${paramDataFim}::date
                  ${whereClauseRegiao}
                GROUP BY DATE_TRUNC('month', c.data)
            )
            SELECT
                ds.mes_data,
                EXTRACT(MONTH FROM ds.mes_data)::int as mes_numero,
                EXTRACT(YEAR FROM ds.mes_data)::int as ano,
                COALESCE(ca.quantidade, 0) as quantidade
            FROM data_series ds
            LEFT JOIN casos_agrupados ca ON ds.mes_data = ca.mes_data
            ORDER BY ds.mes_data ASC
        `;

        try {
            console.log('Query SQL:', query);
            console.log('Parâmetros:', params);
            
            const result = await this.pool.query(query, params);
            console.log('Resultado bruto da query:', result.rows);
            
            const mesesPT = [
                '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];

            // Mapear resultado
            const resultado = result.rows.map((row: any) => ({
                mes: mesesPT[parseInt(row.mes_numero, 10)],
                quantidade: parseInt(row.quantidade, 10),
                ano: row.ano
            }));
            
            console.log('Resultado final mapeado:', resultado);
            return resultado;
        } catch (error) {
            console.error('Erro ao recuperar casos filtrados por mês:', error);
            return [];
        }
    }

    async getEnderecosAssistidasFiltrado(dataInicio?: string, dataFim?: string): Promise<any[]> {
        let whereClause = '';
        const params: any[] = [];

        if (dataInicio && dataFim) {
            whereClause = ` WHERE c.data >= $1 AND c.data <= $2`;
            params.push(dataInicio, dataFim);
        } else if (dataInicio) {
            whereClause = ` WHERE c.data >= $1`;
            params.push(dataInicio);
        } else if (dataFim) {
            whereClause = ` WHERE c.data <= $1`;
            params.push(dataFim);
        }

        const query = `
            SELECT a.endereco, COUNT(*) as quantidade
            FROM ASSISTIDA a
            JOIN CASO c ON a.id = c.id_assistida
            ${whereClause}
            AND a.endereco IS NOT NULL
            GROUP BY a.endereco
            ORDER BY quantidade DESC
        `;

        try {
            const result = await this.pool.query(query, params);
            return result.rows.map((row: any) => ({
                endereco: row.endereco,
                quantidade: parseInt(row.quantidade, 10),
            }));
        } catch (error) {
            console.error('Erro ao recuperar endereços filtrados:', error);
            return [];
        }
    }

    async getTotalCasosFiltrado(regioes: string[], dataInicio?: string, dataFim?: string): Promise<number> {
        let whereClause = '';
        const params: any[] = [];
        let paramIndex = 1;

        // Filtro de regiões
        if (!regioes.includes('todas') && regioes.length > 0) {
            whereClause += ` AND a.endereco IN (${regioes.map(() => `$${paramIndex++}`).join(',')})`;
            params.push(...regioes);
        }

        // Filtro de datas
        if (dataInicio) {
            whereClause += ` AND c.data >= $${paramIndex++}`;
            params.push(dataInicio);
        }

        if (dataFim) {
            whereClause += ` AND c.data <= $${paramIndex++}`;
            params.push(dataFim);
        }

        const query = `
            SELECT COUNT(*) AS total
            FROM CASO c
            JOIN ASSISTIDA a ON c.id_assistida = a.id
            WHERE 1=1 ${whereClause}
        `;

        try {
            const result = await this.pool.query(query, params);
            return parseInt(result.rows[0].total, 10);
        } catch (error) {
            console.error('Erro ao recuperar total de casos filtrado:', error);
            return 0;
        }
    }

    async getAssistidaById(id: number): Promise<any> {
        const query = `
            SELECT 
                id,
                nome,
                idade,
                endereco,
                identidadegenero as "identidadeGenero",
                n_social as "nomeSocial",
                escolaridade,
                religiao,
                nacionalidade,
                zona as "zonaHabitacao",
                ocupacao as "profissao",
                cad_social as "numeroCadastroSocial",
                dependentes as "quantidadeDependentes",
                cor_raca as "corRaca",
                deficiencia as "limitacaoFisica"
            FROM ASSISTIDA
            WHERE id = $1
        `;

        try {
            const result = await this.pool.query(query, [id]);
            if (result.rows[0]) {
                // Garantir que os nomes estejam em camelCase para JavaScript/formulário
                const assistida = result.rows[0];
                return {
                    id: assistida.id,
                    nome: assistida.nome,
                    idade: assistida.idade,
                    endereco: assistida.endereco,
                    identidadeGenero: assistida.identidadeGenero,
                    nomeSocial: assistida.nomeSocial,
                    escolaridade: assistida.escolaridade,
                    religiao: assistida.religiao,
                    nacionalidade: assistida.nacionalidade,
                    zonaHabitacao: assistida.zonaHabitacao,
                    profissao: assistida.profissao,
                    numeroCadastroSocial: assistida.numeroCadastroSocial,
                    quantidadeDependentes: assistida.quantidadeDependentes,
                    corRaca: assistida.corRaca,
                    limitacaoFisica: assistida.limitacaoFisica
                };
            }
            return null;
        } catch (error) {
            console.error('Erro ao recuperar assistida por ID:', error);
            return null;
        }
    }

    async updateAssistida(id: number, data: any): Promise<any> {
        const query = `
            UPDATE ASSISTIDA
            SET 
                Nome = $1,
                Idade = $2,
                endereco = $3,
                identidadeGenero = $4,
                n_social = $5,
                Escolaridade = $6,
                Religiao = $7,
                Nacionalidade = $8,
                zona = $9,
                ocupacao = $10,
                cad_social = $11,
                Dependentes = $12
            WHERE id = $13
            RETURNING *
        `;

        const values = [
            data.nome || '',
            data.idade || 0,
            data.endereco?.toUpperCase() || '',
            data.identidadeGenero || '',
            data.nomeSocial || '',
            data.escolaridade || '',
            data.religiao || '',
            data.nacionalidade || '',
            data.zonaHabitacao || '',
            data.profissao || '',
            data.numeroCadastroSocial || '',
            data.quantidadeDependentes || 0,
            id
        ];

        try {
            const result = await this.pool.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Erro ao atualizar assistida:', error);
            throw error;
        }
    }

}