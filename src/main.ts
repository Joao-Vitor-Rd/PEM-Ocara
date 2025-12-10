import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { WindowManager } from './utils/WindowManeger';
import { Logger } from './utils/Logger';
// Imports Unificados (Core)
import { UserController } from './controllers/userController';
import { AssistidaController } from './controllers/AssistidaController';
import { CasoController } from './controllers/CasoController';

// --- Módulo Rede de Apoio (Seus Imports) ---
import { ControladorOrgao } from './controllers/ControladorOrgao';
import { PostgresOrgaoRepository } from './repository/PostgresOrgaoRepository';

// --- Módulos da Branch backend-dev ---
import { PdfService } from './services/PDFService';
import { PostgresInitializer } from './db/PostgresInitializer';
import { IDataBase } from './db/IDataBase';
import { CasoService } from './services/CasoService';

// Repositórios do Core
import { CasoRepositoryPostgres } from './repository/CasoRepositoryPostgres';
import { AnexoRepositorioPostgres } from './repository/AnexoRepositorioPostgres';

// Módulo de Funcionários
import { FuncionarioRepositoryPostgres } from './repository/FuncionarioRepositoryPostgres';
import { FuncionarioService } from './services/FuncionarioService';
import { ControladorFuncionario } from './controllers/FuncionarioController';

// Módulo de Credenciais
import { CredencialRepositoryPostgres } from './repository/CredencialRepositoryPostgres';
import { CredencialService } from './services/CredencialService';
import { ControladorCredencial } from './controllers/ControladorCredencial';

// Módulo de Histórico
import { HistoricoController } from './controllers/HistoricoController';
import { HistoricoRepositoryPostgres } from './repository/HistoricoRepositoryPostgres';
import { Pool } from 'pg';

const windowManager = new WindowManager();
const userController = new UserController();

// Repository será inicializado na função bootstrap
let casoRepository: CasoRepositoryPostgres;
let anexoRepository: AnexoRepositorioPostgres;
let assistidaController: AssistidaController;
let casoController: CasoController;
let funcionarioController: ControladorFuncionario;
let credencialController: ControladorCredencial;
let historicoController: HistoricoController;
let orgaoController: ControladorOrgao;

// Repository para salvar casos no BD

// ==========================================
// INITIALIZATION & BOOTSTRAP
// ==========================================

function createMainWindow(): void {
  Logger.info('Criando janela principal...');
  
  windowManager.createWindow('main', {
    width: 900,
    height: 700,
    htmlFile: 'tela-login/index.html',
    preloadFile: 'preload.js'
  });
}

async function bootstrap(): Promise<void> {
  Logger.info('Iniciando aplicação...');
  
  // 1. Inicializar banco de dados
  const dbInitializer: IDataBase = new PostgresInitializer();
  await dbInitializer.initialize();
  
  // 2. Preparar o Pool de Conexão
  const postgresInitializer = dbInitializer as PostgresInitializer;
  const dbPool = postgresInitializer.pool(); // Pegamos o pool uma vez para usar em todos

  // 3. Inicializar Repositórios (Injeção de Dependência)
  casoRepository = new CasoRepositoryPostgres(dbPool);
  anexoRepository = new AnexoRepositorioPostgres(dbPool);
  
  const funcionarioRepository = new FuncionarioRepositoryPostgres(dbPool);
  const credencialRepository = new CredencialRepositoryPostgres(dbPool);
  const historicoPosgres = new HistoricoRepositoryPostgres(dbPool);
  
  // --- AQUI ESTÁ A CORREÇÃO ---
  // Criamos o repositório de Órgão passando o pool, igual aos outros
  const orgaoRepository = new PostgresOrgaoRepository(dbPool); 
  Logger.info('Repositories inicializados com sucesso!');
  
  // 4. Inicializar Controllers
  assistidaController = new AssistidaController(casoRepository);
  const funcionarioService = new FuncionarioService(funcionarioRepository);
  const credencialService = new CredencialService(credencialRepository);

  casoController = new CasoController(assistidaController.getAssistidaService(), casoRepository, anexoRepository);
  funcionarioController = new ControladorFuncionario(funcionarioService);
  credencialController = new ControladorCredencial(credencialService);
  historicoController = new HistoricoController(historicoPosgres);

  // Instanciamos o Controlador de Órgão passando o repositório criado acima
  orgaoController = new ControladorOrgao(orgaoRepository);

  createMainWindow();
  Logger.info('Aplicação iniciada com sucesso!');
}

app.whenReady().then(() => {
  Logger.info('App pronto!');
  bootstrap();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// ==========================================
// IPC HANDLERS - Backend Logic
// ==========================================

// Criar usuário
ipcMain.handle('user:create', async (_event, data: { name: string; email: string }) => {
  try {
    Logger.info('Requisição para criar usuário:', data);
    
    const result = userController.handleCreateUser(data.name, data.email);
    
    if (result.success && result.user) {
      BrowserWindow.getAllWindows().forEach(window => {
        window.webContents.send('user:created', result.user!.toJSON());
      });
    }
    
    return result;
  } catch (error) {
    Logger.error('Erro ao criar usuário:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
});

ipcMain.handle('assistida:getEnderecos', async () => {
  Logger.info("requisicao: obter enderecos das Assistidas")
  try {
    const enderecos = await assistidaController.handlergetEnderecosAssistidas();
    return {
      success: true,
      enderecos: enderecos
    };
  } catch (error) {
    Logger.error('Erro ao buscar assistidas:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
});

ipcMain.handle('caso:getTotalCasos', async() => { 
  try {
    const total = await casoController.getTotalCasos();
    return {
      success: true,
      totalCasos: total
    };
  } catch (error) {
    Logger.error('Erro ao obter total de casos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
});

ipcMain.handle('caso:getTotalCasosMes', async(_event, args: { mes: number; ano: number }) => {
  try {
    const total = await casoController.getTotalCasosMes(args.mes, args.ano);
    return {
      success: true,
      totalCasosMes: total
    };
  } catch (error) {
    Logger.error('Erro ao obter total de casos do mês:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
});

ipcMain.handle('caso:criar', async(
  _event,
  data: {
    nomeAssistida: string,
    idadeAssistida: number,
    identidadeGenero: string,
    nomeSocial: string,
    endereco: string,
    escolaridade: string,
    religiao: string,
    nacionalidade: string,
    zonaHabitacao: string,
    profissao: string,
    limitacaoFisica: string,
    numeroCadastroSocial: string,
    quantidadeDependentes: number,
    temDependentes: boolean,

        //Agressor
    nomeAgressor: string,
    idadeAgresssor: number,
    vinculoAssistida: string,
    dataOcorrida: Date,

        //SobreAgressor
    usoDrogasAlcool: string[],
    doencaMental: string,
    agressorCumpriuMedidaProtetiva: boolean,
    agressorTentativaSuicidio: boolean,
    agressorDesempregado: string,
    agressorPossuiArmaFogo: string,
    agressorAmeacouAlguem: string[],

    //Historico Violencia
    ameacaFamiliar: string[],
    agressaoFisica: string[],
    outrasFormasViolencia: string[],
    abusoSexual: boolean,
    comportamentosAgressor: string[],
    ocorrenciaPolicialMedidaProtetivaAgressor: boolean,
    agressoesMaisFrequentesUltimamente: boolean,

        //Outras Infor
    anotacoesLivres: string, 

        //PreenchimentoProfissional
    assistidaRespondeuSemAjuda: boolean,
    assistidaRespondeuComAuxilio: boolean,
    assistidaSemCondicoes: boolean,
    assistidaRecusou: boolean,
    terceiroComunicante: boolean,
    tipoViolencia: string,

    //Outras Infor Importantes
    moraEmAreaRisco: string,
    dependenteFinanceiroAgressor: boolean,
    aceitaAbrigamentoTemporario: boolean,

        //Sobre voce
    separacaoRecente: string,
    temFilhosComAgressor: boolean,
    qntFilhosComAgressor: number,
    temFilhosOutroRelacionamento: boolean,
    qntFilhosOutroRelacionamento: number,
    faixaFilhos: string[],
    filhosComDeficiencia: number,
    conflitoAgressor: string,
    filhosPresenciaramViolencia: boolean,
    violenciaDuranteGravidez: boolean,
    novoRelacionamentoAumentouAgressao: boolean,
    possuiDeficienciaDoenca: string,
    corRaca: string,

    data: Date, 
    profissionalResponsavel: string, 
    descricao: string 

  }) => {
  try {
    Logger.info('Criando novo caso...');
    const result = casoController.handlerCriarCaso(data);
    
    Logger.info('Caso criado com sucesso:', result.getProtocoloCaso());
    return {
      success: true,
      caso: result.toJSON()
    };
  } catch (error) {
    Logger.error('Erro ao criar Caso:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao criar caso';
    return {
      success: false,
      error: errorMessage
    };
  }
    
});

ipcMain.handle('caso:getByProtocolo', async(_event, protocolo: number) => {
  try {
    Logger.info('Requisição para buscar caso pelo protocolo:', protocolo);
    const caso = casoController.getCaso(protocolo);
    if (!caso) {
      return {
        success: false,
        error: 'Caso não encontrado'
      };
    }
    return {
      success: true,
      caso: caso.toJSON()
    };
  } catch (error) {
    Logger.error('Erro ao buscar caso:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
});

ipcMain.handle('historico:salvar', async(_event, dados: any) => {  
  try {
    Logger.info('Requisição para salvar histórico do caso:', dados);
    
    const historicoId = await historicoController.handlerSalvarHistorico(dados.caso);
    
    return {
      success: true,
      historicoId
    };
  } catch (error) {
    Logger.error('Erro ao salvar histórico do caso:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao salvar histórico do caso'
    };
  }
});

ipcMain.handle('historico:registrarDelecao', async(_event, dados: any) => {
  try {
    Logger.info('Requisição para registrar deleção de anexo no histórico:', dados);
    
    const historicoId = await historicoController.handlerRegistrarDelecaoAnexo(
      dados.idCaso,
      dados.idAssistida,
      dados.nomeArquivoComExtensao,
      dados.nomeFuncionario,
      dados.emailFuncionario
    );
    
    return {
      success: true,
      historicoId
    };
  } catch (error) {
    Logger.error('Erro ao registrar deleção de anexo no histórico:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao registrar deleção'
    };
  }
});

ipcMain.handle('historico:listar', async(_event, pagina: number = 1, itensPorPagina: number = 10) => {
  try {
    Logger.info(`Requisição para listar histórico - Página: ${pagina}, Itens por página: ${itensPorPagina}`);
    
    const resultado = await historicoController.handlerListarHistorico(pagina, itensPorPagina);
    
    return {
      success: true,
      data: resultado
    };
  } catch (error) {
    Logger.error('Erro ao listar histórico:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao listar histórico'
    };
  }
});

ipcMain.handle('caso:obterPorProtocoloAssistida', async(_event, protocoloAssistida: number) => {
  try {
    Logger.info('Requisição para buscar casos por protocolo da assistida:', protocoloAssistida);
    
    const casos = casoController.getCasosPorProtocoloAssistida(protocoloAssistida);
    
    return {
      success: true,
      casos: casos.map((caso: any) => caso.toJSON())
    };
  } catch (error) {
    Logger.error('Erro ao buscar casos por protocolo da assistida:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      casos: []
    };
  }
});

ipcMain.handle('caso:gerarPdf', async(_event, protocoloCaso: number) => {
  try {
    Logger.info('Requisição para gerar PDF do caso:', protocoloCaso);

    const caminhoDoPdf = await casoController.handlerCriarPdfCaso(protocoloCaso);

    return {
      sucess: true,
      patch: caminhoDoPdf
      };
  } catch (error) {
      Logger.error('Erro gerar PDF caso:', error);
      return {
        sucess: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
});
// Novo handler para buscar casos do banco
ipcMain.handle('caso:listarPorAssistida', async(_event, idAssistida: number) => {
  try {
    Logger.info('Requisição para buscar casos da assistida do BD:', idAssistida);
    
    const casos = await casoRepository.getAllCasosAssistida(idAssistida);
    
    return {
      success: true,
      casos: casos
    };
  } catch (error) {
    Logger.error('Erro ao buscar casos da assistida do BD:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      casos: []
    };
  }
});

ipcMain.handle('caso:obterInformacoesGerais', async(_event, idCaso: number) => {
  try {
    Logger.info('Requisição para obter informações gerais do caso:', idCaso);
    const infosCaso = await casoController.getInformacoesGeraisDoCaso(idCaso);
    return {
      success: true,
      informacoes: infosCaso
    };
  } catch (error) {
    Logger.error('Erro ao obter informações gerais do caso:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao obter informações gerais do caso'
    };
  }
});

ipcMain.handle('caso:deletarAnexo', async(_event, dados: any) => {
  try {
    const { idAnexo, nomeArquivo } = dados;
    Logger.info('Requisição para deletar anexo:', idAnexo, 'Nome:', nomeArquivo);
    const sucesso = await casoController.handlerExcluirAnexo(idAnexo);
    return {
      success: sucesso,
      nomeArquivo: nomeArquivo
    };
  } catch (error) {
    Logger.error('Erro ao deletar anexo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao deletar anexo'
    };
  }
});

ipcMain.handle('caso:getTotalCasosNoAno', async() => {
  try {
    Logger.info('Requisição para obter total de casos no ano');
    const totalCasos = await casoController.getTotalCasosNoAno();
    return {
      success: true,
      totalCasos
    };
  } catch (error) {
    Logger.error('Erro ao obter total de casos no ano:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao obter total de casos no ano'
    };
  }
});

ipcMain.handle('caso:getTotalCasosNoAnoFiltrado', async(_event, args: { regioes: string[], dataInicio?: string, dataFim?: string }) => {
  try {
    Logger.info('Requisição para obter total de casos no ano filtrado', args.regioes);
    const totalCasos = await casoController.getTotalCasosNoAnoFiltrado(args.regioes, args.dataInicio, args.dataFim);
    return {
      success: true,
      totalCasos
    };
  } catch (error) {
    Logger.error('Erro ao obter total de casos no ano filtrado:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
});

ipcMain.handle('caso:getEnderecosAssistidasFiltrado', async(_event, args?: { dataInicio?: string; dataFim?: string }) => {
  try {
    Logger.info('Requisição para obter endereços filtrados', args);
    const enderecos = await casoController.getEnderecosAssistidasFiltrado(args?.dataInicio, args?.dataFim);
    return {
      success: true,
      enderecos
    };
  } catch (error) {
    Logger.error('Erro ao obter endereços filtrados:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
});

ipcMain.handle('caso:getTotalCasosFiltrado', async(_event, args: { regioes: string[]; dataInicio?: string; dataFim?: string }) => {
  try {
    Logger.info('Requisição para obter total de casos filtrado', args);
    const total = await casoController.getTotalCasosFiltrado(args.regioes, args.dataInicio, args.dataFim);
    return {
      success: true,
      totalCasos: total
    };
  } catch (error) {
    Logger.error('Erro ao obter total de casos filtrado:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
});

ipcMain.handle('caso:salvarBD', async(_event, dados: {
  assistida: any;
  caso: any;
  profissionalResponsavel: string;
  data: Date;
  modoEdicao?: string;
  idAssistidaExistente?: number | null;
}) => {
  try {
    Logger.info('Requisição para salvar caso no banco de dados via Repository');
    Logger.info('modoEdicao:', dados.modoEdicao);
    Logger.info('idAssistidaExistente:', dados.idAssistidaExistente);
    
    // 1. Processar anexos - converter caminhos para Buffer
    let anexosProcessados: any[] = [];
    
    if (dados.caso.anexos && Array.isArray(dados.caso.anexos)) {
      for (const caminhoArquivo of dados.caso.anexos) {
        try {
          if (typeof caminhoArquivo === 'string' && fs.existsSync(caminhoArquivo)) {
            const buffer = fs.readFileSync(caminhoArquivo);
            const nomeArquivo = path.basename(caminhoArquivo);
            const tipoArquivo = getTipoMIME(nomeArquivo);
            const tamanhoArquivo = buffer.length;
            
            anexosProcessados.push({
              nome: nomeArquivo,
              tipo: tipoArquivo,
              tamanho: tamanhoArquivo,
              dados: buffer
            });
            
            Logger.info(`Anexo processado: ${nomeArquivo} (${tamanhoArquivo} bytes)`);
          }
        } catch (erro) {
          Logger.error(`Erro ao processar anexo ${caminhoArquivo}:`, erro);
        }
      }
    }
    
    // 2. Criar o objeto Caso usando o controller
    const casoCriado = casoController.handlerCriarCaso({
      nomeAssistida: dados.assistida.nome,
      idadeAssistida: dados.assistida.idade,
      identidadeGenero: dados.assistida.identidadeGenero || '',
      nomeSocial: dados.assistida.nomeSocial || '',
      endereco: dados.assistida.endereco,
      escolaridade: dados.assistida.escolaridade || '',
      religiao: dados.assistida.religiao || '',
      nacionalidade: dados.assistida.nacionalidade,
      zonaHabitacao: dados.assistida.zonaHabitacao || '',
      profissao: dados.assistida.profissao,
      limitacaoFisica: dados.assistida.limitacaoFisica || '',
      numeroCadastroSocial: dados.assistida.numeroCadastroSocial || '',
      quantidadeDependentes: dados.assistida.quantidadeDependentes || 0,
      temDependentes: dados.assistida.temDependentes || false,
      
      // Dados do caso com anexos processados
      ...dados.caso,
      anexos: anexosProcessados,
      
      data: dados.data,
      profissionalResponsavel: dados.profissionalResponsavel,
      descricao: ''
    });
    
    // 3. Salvar no BD usando o repository
    // Se houver uma assistida existente, passar o ID para que o repository use-a em vez de criar uma nova
    let resultado;
    if (dados.idAssistidaExistente) {
      Logger.info(`Salvando novo caso para assistida existente ID: ${dados.idAssistidaExistente}`);
      resultado = await casoRepository.salvarComAssistidaExistente(casoCriado, dados.idAssistidaExistente);
    } else {
      Logger.info('Salvando novo caso com nova assistida');
      resultado = await casoRepository.salvar(casoCriado);
    }
    
    Logger.info('Caso salvo com sucesso no BD com ID:', resultado.idCaso);
    Logger.info('Assistida com ID:', resultado.idAssistida);
    return {
      success: true,
      idCaso: resultado.idCaso,
      idAssistida: resultado.idAssistida
    };
  } catch (error) {
    Logger.error('Erro ao salvar caso no BD:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao salvar caso'
    };
  }
});

// ==========================================
// HANDLERS PARA ANEXOS
// ==========================================

ipcMain.handle('caso:recuperarAnexos', async(_event, { idCaso }: { idCaso: number }) => {
  try {
    Logger.info(`Requisição para recuperar anexos do caso ${idCaso}`);
    
    const anexos = await casoController.handlerRecuperarAnexosDoCaso(idCaso);
    
    // Converter objetos Anexo para objetos plain SEM os dados (dados não podem ser serializados)
    const anexosConvertidos = anexos.map((anexo: any) => {
      // Retornar objeto plain com as propriedades necessárias (SEM dados)
      return {
        idAnexo: anexo.getIdAnexo?.(),
        nomeAnexo: anexo.getNomeAnexo?.(),
        tamanho: anexo.getTamanho?.(),
        tipo: anexo.getTipo?.(),
        relatorio: (anexo as any).relatorio || false  // ✅ Incluir campo relatorio
        // NÃO enviar dados aqui - serão baixados quando clicado
      };
    });
    
    Logger.info(`${anexosConvertidos.length} anexo(s) recuperado(s) do caso ${idCaso}`);
    
    return {
      success: true,
      anexos: anexosConvertidos
    };
  } catch (error) {
    Logger.error('Erro ao recuperar anexos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao recuperar anexos'
    };
  }
});

ipcMain.handle('caso:salvarAnexo', async(_event, { anexo, idCaso, idAssistida }: { anexo: any; idCaso: number; idAssistida: number }) => {
  try {
    Logger.info(`Requisição para salvar anexo do caso ${idCaso}`);
    
    // Converter dados para Buffer (pode vir como Uint8Array do renderer)
    let anexoParaSalvar = { ...anexo };
    
    if (anexoParaSalvar.dados) {
      let buffer: Buffer;
      
      if (Buffer.isBuffer(anexoParaSalvar.dados)) {
        buffer = anexoParaSalvar.dados;
      } else if (anexoParaSalvar.dados instanceof Uint8Array) {
        buffer = Buffer.from(anexoParaSalvar.dados);
      } else if (typeof anexoParaSalvar.dados === 'string') {
        buffer = Buffer.from(anexoParaSalvar.dados, 'utf-8');
      } else if (Array.isArray(anexoParaSalvar.dados)) {
        buffer = Buffer.from(anexoParaSalvar.dados);
      } else if (anexoParaSalvar.dados && typeof anexoParaSalvar.dados === 'object') {
        buffer = Buffer.from(Object.values(anexoParaSalvar.dados));
      } else {
        buffer = Buffer.from(anexoParaSalvar.dados);
      }
      
      // Converter Buffer para bytea (hexadecimal)
      anexoParaSalvar.dados = '\\x' + buffer.toString('hex');
    } else {
      anexoParaSalvar.dados = null;
    }
    
    const success = await casoController.handlerSalvarAnexo(anexoParaSalvar, idCaso, idAssistida);
    
    if (success) {
      Logger.info(`Anexo '${anexo.nome}' salvo no caso ${idCaso}`);
    }
    
    return {
      success: success,
      message: success ? 'Anexo salvo com sucesso' : 'Falha ao salvar anexo'
    };
  } catch (error) {
    Logger.error('Erro ao salvar anexo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao salvar anexo'
    };
  }
});

ipcMain.handle('anexo:download', async(_event, { idAnexo, nomeArquivo }: { idAnexo: string; nomeArquivo: string }) => {
  try {
    Logger.info(`Requisição para baixar anexo: ${idAnexo} - ${nomeArquivo}`);
    
    // Recuperar anexo do banco de dados
    const anexo = await anexoRepository.getAnexoById(parseInt(idAnexo));
    
    if (!anexo) {
      return {
        success: false,
        error: 'Anexo não encontrado'
      };
    }
    
    // Converter bytea para Buffer
    const dadosAnexo = anexo.getDados();
    let buffer: Buffer;
    
    if (!dadosAnexo) {
      return {
        success: false,
        error: 'Anexo sem dados no banco de dados'
      };
    }
    
    if (typeof dadosAnexo === 'string' && dadosAnexo.startsWith('\\x')) {
      const hexPart = dadosAnexo.slice(2);
      buffer = Buffer.from(hexPart, 'hex');
    } else if (Buffer.isBuffer(dadosAnexo)) {
      buffer = dadosAnexo;
    } else if (dadosAnexo instanceof Uint8Array) {
      buffer = Buffer.from(dadosAnexo);
    } else if (Array.isArray(dadosAnexo)) {
      buffer = Buffer.from(dadosAnexo);
    } else if (typeof dadosAnexo === 'string') {
      buffer = Buffer.from(dadosAnexo, 'utf-8');
    } else {
      buffer = Buffer.from(dadosAnexo);
    }
    
    if (!buffer || buffer.length === 0) {
      throw new Error('Buffer vazio após conversão');
    }
    
    // Definir caminho de download na pasta Downloads do usuário
    const downloadsPath = path.join(require('os').homedir(), 'Downloads', nomeArquivo);
    
    // Criar diretório se não existir
    const downloadsDir = path.dirname(downloadsPath);
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }
    
    // Escrever arquivo no disco
    fs.writeFileSync(downloadsPath, buffer);
    
    Logger.info(`Arquivo '${nomeArquivo}' baixado com sucesso`);
    
    return {
      success: true,
      message: `Arquivo baixado com sucesso em: ${downloadsPath}`,
      path: downloadsPath
    };
  } catch (error) {
    Logger.error('Erro ao baixar anexo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao baixar anexo'
    };
  }
});

ipcMain.handle('assistida:criar', async(
  _event,
  data: {
    nome: string,
        idade: number,
        identidadeGenero: string,
        nomeSocial: string,
        endereco: string,
        escolaridade: string,
        religiao: string,
        nacionalidade: string,
        zonaHabitacao: string,
        profissao: string,
        limitacaoFisica: string,
        numeroCadastroSocial: string,
        quantidadeDependentes: number,
        temDependentes: boolean
  }
) => {
  try {
    const result = assistidaController.handlerCriarAssistida(
      data.nome,
      data.idade,
      data.identidadeGenero,
      data.nomeSocial,
      data.endereco,
      data.escolaridade,
      data.religiao,
      data.nacionalidade,
      data.zonaHabitacao,
      data.profissao,
      data.limitacaoFisica,
      data.numeroCadastroSocial,
      data.quantidadeDependentes,
      data.temDependentes,
    )

    if (result.success && result.assistida) {
      BrowserWindow.getAllWindows().forEach(window => {
        window.webContents.send('user:created', result.assistida!.toJSON());
      });
    }

    return result;
  } catch (error) {
    Logger.error('Erro ao criar Assistida:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
});

ipcMain.handle('caso:preview', async (_event, dados) => {
  try {
    Logger.info('Gerando preview do caso...');
    const pdfPath = await casoController.handlerPreviewCaso(dados);
    return { success: true, path: pdfPath };
  } catch (error) {
    Logger.error('Erro ao gerar preview:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
});

// Buscar todos os usuários
ipcMain.handle('user:getAll', async () => {
  try {
    Logger.info('Requisição para buscar todos os usuários');
    const users = userController.handleGetUsers();
    return {
      success: true,
      users: users.map(u => u.toJSON())
    };
  } catch (error) {
    Logger.error('Erro ao buscar usuários:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
});

// Buscar usuário por ID
ipcMain.handle('user:getById', async (_event, id: string) => {
  try {
    Logger.info('Requisição para buscar usuário:', id);
    const user = userController.handleGetUsers().find(u => u.getId() === id);
    
    if (!user) {
      return {
        success: false,
        error: 'Usuário não encontrado'
      };
    }
    
    return {
      success: true,
      user: user.toJSON()
    };
  } catch (error) {
    Logger.error('Erro ao buscar usuário:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
});

ipcMain.handle('orgao:create', async (_event, data: { nome: string; email: string }) => {
  try {
    Logger.info('Requisição para criar órgão da rede de apoio:', data);
    const result = await orgaoController.cadastrarOrgao(data.nome, data.email);

    if (!result.success || !result.orgao) {
      return {
        success: false,
        error: result.error ?? 'Erro ao cadastrar órgão da rede de apoio',
      };
    }
    
    const orgao = result.orgao;
    return {
      success: true,
      orgao: {
        id: orgao.getId(),
        nome: orgao.getNome(),
        email: orgao.getEmail(),
      },
    };
  } catch (error) {
    Logger.error('Erro ao criar órgão da rede de apoio:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
});

ipcMain.handle('orgao:listarTodos', async () => {
  try {
    Logger.info('Requisição para listar órgãos da rede de apoio');
    const orgaos = await orgaoController.listarOrgaos();

    return {
      success: true,
      orgaos: orgaos.map(orgao => ({
          id: orgao.getId(),
          nome: orgao.getNome(),
          email: orgao.getEmail(),
        })
      ),
    };
  } catch (error) {
    Logger.error('Erro ao listar órgãos da rede de apoio:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      orgaos: [],
    };
  }
});

ipcMain.handle('orgao:update', async (_event, data: { id: number; nome?: string; email?: string }) => {
  try {
    Logger.info('Requisição para atualizar órgão da rede de apoio:', data);
    const result = await orgaoController.atualizarOrgao(data.id, data.nome, data.email);

    if (!result.success || !result.orgao) {
      return {
        success: false,
        error: result.error ?? 'Erro ao atualizar órgão da rede de apoio',
      };
    }

    const orgao = result.orgao;
    return {
      success: true,
      orgao: {
        id: orgao.getId(),
        nome: orgao.getNome(),
        email: orgao.getEmail(),
      },
    };
  } catch (error) {
    Logger.error('Erro ao atualizar órgão da rede de apoio:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
});

ipcMain.handle('orgao:delete', async (_event, id: number) => {
  try {
    Logger.info('Requisição para remover órgão da rede de apoio:', id);
    const result = await orgaoController.removerOrgao(id);
    if (!result.success) {
      return result;
    }

    return { success: true };
  } catch (error) {
    Logger.error('Erro ao remover órgão da rede de apoio:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
});

// --- HANDLER DA OUTRA BRANCH (Assistida) ---

ipcMain.handle('assistida:listarTodas', async () => {
  try {
    Logger.info('Requisição para listar todas as assistidas');
    const assistidas = await assistidaController.handlerListarTodasAssistidas();
    
    return {
      success: true,
      assistidas
    };
  } catch (error) {
    Logger.error('Erro ao listar assistidas:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
});

// Buscar assistida por ID
ipcMain.handle('assistida:buscarPorId', async (_event, id: number) => {
  try {
    Logger.info(`Requisição para buscar assistida com ID: ${id}`);
    const assistida = await assistidaController.handlerBuscarAssistidaPorId(id);
    
    if (!assistida) {
      return {
        success: false,
        error: 'Assistida não encontrada'
      };
    }
    
    return {
      success: true,
      assistida
    };
  } catch (error) {
    Logger.error('Erro ao buscar assistida:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
});

// Atualizar assistida
ipcMain.handle('assistida:atualizar', async (_event, data: any) => {
  try {
    Logger.info(`Requisição para atualizar assistida com ID: ${data.id}`);
    
    const resultado = await assistidaController.handlerAtualizarAssistida(
      data.id,
      data.nome || '',
      data.idade || 0,
      data.identidadeGenero || '',
      data.nomeSocial || '',
      data.endereco || '',
      data.escolaridade || '',
      data.religiao || '',
      data.nacionalidade || '',
      data.zonaHabitacao || '',
      data.profissao || '',
      data.limitacaoFisica || '',
      data.numeroCadastroSocial || '',
      data.quantidadeDependentes || 0,
      data.temDependentes || false
    );
    
    return resultado;
  } catch (error) {
    Logger.error('Erro ao atualizar assistida:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
});


// ==========================================
// IPC HANDLERS - MÓDULO FUNCIONÁRIO
// ==========================================

// 1. Criar Funcionário
ipcMain.handle('create-funcionario', async (_event, data) => {
  try {
    Logger.info('Requisição para criar funcionário:', data.email);
    return await funcionarioController.cadastrarFuncionario(data);
  } catch (error) {
    Logger.error('Erro no handler create-funcionario:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
});

// 2. Listar Todos
ipcMain.handle('get-funcionarios', async () => {
  try {
    Logger.info('Requisição para listar funcionários');
    const resultado = await funcionarioController.listarFuncionarios();
    if (resultado.success) return resultado.lista;
    throw new Error(resultado.error);
  } catch (error) {
    Logger.error('Erro no handler get-funcionarios:', error);
    throw error;
  }
});

// 3. Buscar por Email
ipcMain.handle('get-funcionario-email', async (_event, email: string) => {
  try {
    Logger.info('Requisição para buscar funcionário por email:', email);
    return await funcionarioController.buscarPorEmail(email);
  } catch (error) {
    Logger.error('Erro no handler get-funcionario-email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
});

// 4. Atualizar
ipcMain.handle('update-funcionario', async (_event, { email, dados }) => {
  try {
    Logger.info('Requisição para atualizar funcionário:', email);
    return await funcionarioController.atualizarFuncionario(email, dados);
  } catch (error) {
    Logger.error('Erro no handler update-funcionario:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
});

// 5. Deletar
ipcMain.handle('delete-funcionario', async (_event, email: string) => {
  try {
    Logger.info('Requisição para deletar funcionário:', email);
    return await funcionarioController.deletarFuncionario(email);
  } catch (error) {
    Logger.error('Erro no handler delete-funcionario:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
});

// 6. Atualizar Perfil (Autoatendimento / Minha Conta)
ipcMain.handle('user:update-profile', async (_event, data) => {
  try {
    Logger.info('Requisição de atualização de perfil para:', data.email);
    // O front deve enviar: { email, nome, senhaAtual, novaSenha }
    return await funcionarioController.atualizarMinhaConta(data.email, data);
  } catch (error) {
    Logger.error('Erro no handler user:update-profile:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
});

ipcMain.handle('auth:login', async (_event, credenciais: { email: string; senha: string }) => {
  try {
    Logger.info('Tentativa de login para:', credenciais.email);
    return await funcionarioController.autenticarFuncionario(credenciais.email, credenciais.senha);
  } catch (error) {
    Logger.error('Erro no handler auth:login:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
});

// ==========================================
// IPC HANDLERS - MÓDULO CREDENCIAIS
// ==========================================

// 1. Salvar/Atualizar Credenciais
ipcMain.handle('credencial:salvar', async (_event, data) => {
  try {
    Logger.info('Requisição para salvar credenciais de e-mail...');
    return await credencialController.salvarCredenciais(data);
  } catch (error) {
    Logger.error('Erro no handler credencial:salvar:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
});

// 2. Obter Credenciais (para exibir na tela)
ipcMain.handle('credencial:obter', async () => {
  try {
    Logger.info('Requisição para obter credenciais atuais...');
    return await credencialController.obterCredenciais();
  } catch (error) {
    Logger.error('Erro no handler credencial:obter:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
});
// ==========================================
// WINDOW MANAGEMENT
// ==========================================

ipcMain.on('window:open', (_event, windowName: string) => {
  switch (windowName) {
    case 'register':
      windowManager.createWindow('register', {
        width: 600,
        height: 700,
        htmlFile: 'register.html',
        preloadFile: 'preload.js'
      });
      break;
    case 'telaListarAssistidas':
      windowManager.loadContent('main', 'tela-assistidas/index.html');
      break;
    case 'telaInicial':
      windowManager.loadContent('main', 'tela-inicial/index.html');
      break;
    case 'telaCadastroAssistida':
      windowManager.loadContent('main', 'tela-cadastro-1/index.html');
      break;
    case 'telaCadastro2':
      windowManager.loadContent('main', 'tela-cadastro-2/index.html');
      break;
    case 'telaCadastro3':
      windowManager.loadContent('main', 'tela-cadastro-3/index.html');
      break;
    case 'telaCadastro4':
      windowManager.loadContent('main', 'tela-cadastro-4/index.html');
      break;
    case 'telaCadastro5':
      windowManager.loadContent('main', 'tela-cadastro-5/index.html');
      break;
    case 'telaCadastro6':
      windowManager.loadContent('main', 'tela-cadastro-6/index.html');
      break;
    case 'telaCasosRegistrados':
      windowManager.loadContent('main', 'tela-casos-registrados/index.html');
      break;
    case 'telaRedeApoio':
      windowManager.loadContent('main', 'tela-rede-apoio/index.html');
      break;

    case 'telaVisualizarCasosBD':
      windowManager.loadContent('main', 'tela-visualizar-casos-bd/index.html');
      break;
    case 'testeForm':
      windowManager.loadContent('main', 'telaAssistidas.html');
      break;
    case 'telaInformacoesCaso':
      windowManager.loadContent('main', 'tela-informacoes-caso/index.html');
      break;
    case 'telaEstatisticas':
      windowManager.loadContent('main', 'tela-estatisticas/index.html');
      break;
    case 'telaConfiguracoesConta':
      windowManager.loadContent('main', 'tela-configuracoes-conta/index.html');
      break;
    case 'telaLogin':
      windowManager.loadContent('main', 'tela-login/index.html');
      break;
    case 'historicoMudancas':
      windowManager.loadContent('main', 'tela-historico/index.html');
      break;
    case 'telaInicialAdm':
      windowManager.loadContent('main', 'tela-inicial-adm/index.html');
      break;
    case 'telaContaAdm':
      windowManager.loadContent('main', 'tela-configuracoes-conta-adm/index.html');
      break;
    case 'telaEstatisticasAdm':
      windowManager.loadContent('main', 'tela-estatisticas-adm/index.html');
      break;
    case 'telaRedeApoioAdm':
      windowManager.loadContent('main', 'tela-rede-apoio-adm/index.html');
      break;
    default:
      console.log('tela desconhecida:', windowName);
  }
});

ipcMain.on('window:close', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.close();
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function getTipoMIME(nomeArquivo: string): string {
  const extensao = path.extname(nomeArquivo).toLowerCase();
  const tiposMIME: { [key: string]: string } = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.txt': 'text/plain',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };
  return tiposMIME[extensao] || 'application/octet-stream';
}

// ==========================================
// APP LIFECYCLE
// ==========================================

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});