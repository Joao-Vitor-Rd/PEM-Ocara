import { Caso } from "../models/Caso/Caso";
import { Pool, PoolClient } from "pg";
import { IHistoricoRepository } from "./IHistoricoRepository";

/**
 * CasoRepositoryPostgres
 * 
 * Implementação da interface ICasoRepository para PostgreSQL.
 * Responsável pela persistência de casos e todas suas relações no banco.
 */
export class HistoricoRepositoryPostgres implements IHistoricoRepository {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    /**
     * Salva o histórico de criação de um novo caso
     * Registra cada campo do formulário em uma linha HISTORICO com tipo='CRIOU'
     * Os dados vêm completos no objeto Caso (passado do renderer)
     * 
     * @param caso - Objeto Caso com IDs e dados completos do formulário
     * @returns Promise<number> - ID do primeiro registro de histórico salvo
     */
    async salvar(caso: Caso): Promise<number> {
        // Extrair dados necessários do objeto Caso
        const idCaso = (caso as any).idCaso || (caso as any).id_caso || 0;
        const idAssistida = (caso as any).idAssistida || (caso as any).id_assistida || 0;
        const emailFuncionario = (caso as any).emailFuncionario || (caso as any).email_funcionario || 'sistema@sistema.com';
        const nomeFuncionario = (caso as any).nomeFuncionario || (caso as any).nome_funcionario || 'Sistema';

        // Validação crítica: ID do caso é obrigatório
        if (!idCaso || idCaso === 0) {
            console.error('❌ ERRO: ID do caso não foi fornecido ou é zero!');
            console.error('   objeto caso recebido:', caso);
            throw new Error('ID do caso (idCaso) é obrigatório e não pode ser 0');
        }

        const client: PoolClient = await this.pool.connect();

        try {
            await client.query('BEGIN');

            const historicoIds: number[] = [];
            
            console.log('📋 Iniciando registro de histórico para caso ID:', idCaso);

            // ========== REGISTRAR DADOS DO CASO ==========
            // Os dados já vêm completos no objeto caso (enviados do renderer)
            // Mapear todos os campos do caso que devem ser registrados no histórico
            
            const camposParaRegistrar = [
                // Dados da Assistida
                { campo: 'nome_assistida', valor: (caso as any).nomeAssistida },
                { campo: 'idade_assistida', valor: (caso as any).idadeAssistida },
                { campo: 'identidade_genero', valor: (caso as any).identidadeGenero },
                { campo: 'nome_social', valor: (caso as any).nomeSocial },
                { campo: 'endereco', valor: (caso as any).endereco },
                { campo: 'escolaridade', valor: (caso as any).escolaridade },
                { campo: 'religiao', valor: (caso as any).religiao },
                { campo: 'nacionalidade', valor: (caso as any).nacionalidade },
                { campo: 'zona_habitacao', valor: (caso as any).zonaHabitacao },
                { campo: 'profissao', valor: (caso as any).profissao },
                { campo: 'limitacao_fisica', valor: (caso as any).limitacaoFisica },
                { campo: 'numero_cadastro_social', valor: (caso as any).numeroCadastroSocial },
                { campo: 'quantidade_dependentes', valor: (caso as any).quantidadeDependentes },
                { campo: 'tem_dependentes', valor: (caso as any).temDependentes },

                // Dados do Agressor
                { campo: 'nome_agressor', valor: (caso as any).nomeAgressor },
                { campo: 'idade_agressor', valor: (caso as any).idadeAgresssor },
                { campo: 'vinculo_assistida', valor: (caso as any).vinculoAssistida },
                { campo: 'data_ocorrida', valor: (caso as any).dataOcorrida },

                // Questões do formulário (Bloco I, II, III)
                { campo: 'q01_ameacas', valor: (caso as any).ameacaFamiliar, ehArray: true },
                { campo: 'q02_agressoes_graves', valor: (caso as any).agressaoFisica, ehArray: true },
                { campo: 'q03_outras_agressoes', valor: (caso as any).outrasFormasViolencia, ehArray: true },
                { campo: 'q04_estupro', valor: (caso as any).abusoSexual },
                { campo: 'q05_comportamentos', valor: (caso as any).comportamentosAgressor, ehArray: true },
                { campo: 'q06_bo_medida', valor: (caso as any).ocorrenciaPolicialMedidaProtetivaAgressor },
                { campo: 'q07_frequencia_aumento', valor: (caso as any).agressoesMaisFrequentesUltimamente },

                { campo: 'q08_uso_drogas', valor: (caso as any).usoDrogasAlcool, ehArray: true },
                { campo: 'q09_doenca_mental', valor: (caso as any).doencaMental },
                { campo: 'q10_descumpriu_medida', valor: (caso as any).agressorCumpriuMedidaProtetiva },
                { campo: 'q11_tentativa_suicidio', valor: (caso as any).agressorTentativaSuicidio },
                { campo: 'q12_desempregado_dificuldades', valor: (caso as any).agressorDesempregado },
                { campo: 'q13_acesso_armas', valor: (caso as any).agressorPossuiArmaFogo },
                { campo: 'q14_ameacou_agrediu', valor: (caso as any).agressorAmeacouAlguem, ehArray: true },

                { campo: 'q15_separacao_recente', valor: (caso as any).separacaoRecente },
                { campo: 'q17_novo_relacionamento', valor: (caso as any).novoRelacionamentoAumentouAgressao },
                { campo: 'q16_tem_filhos', valor: (caso as any).temFilhosComAgressor },
                { campo: 'q16_quantos_agressor', valor: (caso as any).qntFilhosComAgressor },
                { campo: 'q16_quantos_outro', valor: (caso as any).qntFilhosOutroRelacionamento },
                { campo: 'q16_presenciaram_violencia', valor: (caso as any).filhosPresenciaramViolencia },
                { campo: 'q18_deficiencia_doenca', valor: (caso as any).possuiDeficienciaDoenca },
                { campo: 'q20_mora_area_risco', valor: (caso as any).moraEmAreaRisco },
                { campo: 'q21_dependente_financeira', valor: (caso as any)._dependenteFinanceira },
                { campo: 'cor_raca', valor: (caso as any).corRaca },
            ];

            // Registrar todos os campos
            for (const campo of camposParaRegistrar as Array<{ campo: string; valor: any; ehArray?: boolean }>) {
                if (campo.valor !== undefined && campo.valor !== null && campo.valor !== '') {
                    // Campos com múltiplas escolhas (arrays) são JSON.stringify()
                    const valorString = campo.ehArray ? JSON.stringify(campo.valor) : String(campo.valor);
                    
                    const idHistorico = await this.registrarHistoricoInterno(
                        client,
                        idCaso,
                        idAssistida,
                        'CRIOU',
                        campo.campo,
                        valorString,
                        emailFuncionario,
                        nomeFuncionario
                    );
                    historicoIds.push(idHistorico);
                }
            }

            await client.query('COMMIT');
            console.log(`✅ ${historicoIds.length} registro(s) de histórico salvos com sucesso`);
            
            return historicoIds.length > 0 ? historicoIds[0] : 0;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('❌ Erro ao salvar histórico no banco:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Registra uma mudança no histórico (método privado para uso interno com transação)
     * @param client - Cliente do pool de conexões
     * @param idCaso - ID do caso
     * @param idAssistida - ID da assistida
     * @param tipo - Tipo de operação: 'CRIOU', 'ALTEROU', 'DELETOU'
     * @param campo - Nome do campo alterado
     * @param mudanca - Descrição da mudança realizada
     * @param emailFuncionario - Email do funcionário
     * @param nomeFuncionario - Nome do funcionário
     */
    private async registrarHistoricoInterno(
        client: PoolClient,
        idCaso: number,
        idAssistida: number,
        tipo: string,
        campo: string,
        mudanca: string,
        emailFuncionario: string,
        nomeFuncionario: string
    ): Promise<number> {
        // Schema da tabela HISTORICO:
        // - id (PK, auto-increment)
        // - id_caso (FK para CASO)
        // - id_assistida (FK para ASSISTIDA)
        // - id_func (FK para FUNCIONARIO, pode ser NULL)
        // - tipo (VARCHAR: 'CRIOU', 'ALTEROU', 'DELETOU')
        // - campo (VARCHAR: nome do campo)
        // - mudanca (TEXT: valor da mudança)
        
        // Estratégia: se o email do funcionário não existe na tabela FUNCIONARIO,
        // usar NULL para não violar a foreign key constraint
        
        const query = `
            INSERT INTO HISTORICO (
                id_caso, id_assistida, id_func, tipo, campo, mudanca
            ) VALUES ($1, $2, NULL, $3, $4, $5)
            RETURNING id
        `;

        try {
            const result = await client.query(query, [
                idCaso,
                idAssistida,
                tipo,
                campo,
                mudanca
            ]);
            const idHistorico = result.rows[0].id;
            console.log(`  ✓ ${tipo} - ${campo}`);
            return idHistorico;
        } catch (erro) {
            console.error(`  ✗ Erro ao registrar histórico: ${erro}`);
            throw erro;
        }
    }

    async atualizar(caso: Caso): Promise<number> {
        // Implementação futura para atualizar um histórico existente
        throw new Error("Método não implementado.");
    }

}