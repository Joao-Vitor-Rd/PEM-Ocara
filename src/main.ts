import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { Pool } from 'pg';
import { WindowManager } from './utils/WindowManeger';
import { Logger } from './utils/Logger';

// Imports - Controllers
import { UserController } from './controllers/userController';
import { AssistidaController } from './controllers/AssistidaController';
import { CasoController } from './controllers/CasoController';
import { ControladorOrgao } from './controllers/ControladorOrgao';
import { ControladorFuncionario } from './controllers/FuncionarioController';
import { ControladorCredencial } from './controllers/ControladorCredencial';
import { HistoricoController } from './controllers/HistoricoController';

// Imports - Repositories
import { PostgresInitializer } from './db/PostgresInitializer';
import { IDataBase } from './db/IDataBase';
import { CasoRepositoryPostgres } from './repository/CasoRepositoryPostgres';
import { AnexoRepositorioPostgres } from './repository/AnexoRepositorioPostgres';
import { FuncionarioRepositoryPostgres } from './repository/FuncionarioRepositoryPostgres';
import { CredencialRepositoryPostgres } from './repository/CredencialRepositoryPostgres';
import { HistoricoRepositoryPostgres } from './repository/HistoricoRepositoryPostgres';
import { PostgresOrgaoRepository } from './repository/PostgresOrgaoRepository';
import { CasoRedeApoioContatoRepository } from './repository/CasoRedeApoioContatoRepository';
import { ICasoRedeApoioContatoRepository } from './repository/ICasoRedeApoioContatoRepository';

// Imports - Services
import { FuncionarioService } from './services/FuncionarioService';
import { CredencialService } from './services/CredencialService';

// Imports - IPC Orchestrator & Mediators
import { IpcOrchestrator } from './ipc/IpcOrchestrator';
import { HtmlFormatter } from './utils/HtmlFormatter';
import { CasoMediator } from './ipc/mediators/CasoMediator';
import { AssistidaMediator } from './ipc/mediators/AssistidaMediator';
import { OrgaoMediator } from './ipc/mediators/OrgaoMediator';
import { FuncionarioMediator } from './ipc/mediators/FuncionarioMediator';
import { CredencialMediator } from './ipc/mediators/CredencialMediator';
import { HistoricoMediator } from './ipc/mediators/HistoricoMediator';
import { AnexoMediator } from './ipc/mediators/AnexoMediator';
import { EncaminhamentoMediator } from './ipc/mediators/EncaminhamentoMediator';
import { UserMediator } from './ipc/mediators/UserMediator';

const windowManager = new WindowManager();

// Variáveis globais
let ipcOrchestrator: IpcOrchestrator;
let ultimaOrigemTelaSobreAplicacao: 'telaConfiguracoesConta' | 'telaContaAdm' = 'telaConfiguracoesConta';

function converterDadosAnexoParaBuffer(dados: any): Buffer | null {
  if (!dados) {
    return null;
  }

  if (Buffer.isBuffer(dados)) {
    return dados;
  }

  if (dados instanceof Uint8Array) {
    return Buffer.from(dados);
  }

  if (Array.isArray(dados)) {
    return Buffer.from(dados);
  }

  if (typeof dados === 'string') {
    if (dados.startsWith('\\x')) {
      return Buffer.from(dados.slice(2), 'hex');
    }
    return Buffer.from(dados, 'utf-8');
  }

  if (typeof dados === 'object') {
    return Buffer.from(Object.values(dados));
  }

  return null;
}

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
  const dbPool = postgresInitializer.pool();

  // 3. Inicializar Repositórios
  const casoRepository = new CasoRepositoryPostgres(dbPool);
  const anexoRepository = new AnexoRepositorioPostgres(dbPool);
  const casoRedeApoioContatoRepository = new CasoRedeApoioContatoRepository(dbPool);
  const funcionarioRepository = new FuncionarioRepositoryPostgres(dbPool);
  const credencialRepository = new CredencialRepositoryPostgres(dbPool);
  const historicoRepository = new HistoricoRepositoryPostgres(dbPool);
  const orgaoRepository = new PostgresOrgaoRepository(dbPool);

  Logger.info('Repositories inicializados com sucesso!');
  
  // 4. Inicializar Services
  const funcionarioService = new FuncionarioService(funcionarioRepository);
  const credencialService = new CredencialService(credencialRepository);

  // 5. Inicializar Controllers
  const userController = new UserController();
  const assistidaController = new AssistidaController(casoRepository);
  const casoController = new CasoController(assistidaController.getAssistidaService(), casoRepository, anexoRepository);
  const funcionarioController = new ControladorFuncionario(funcionarioService);
  const credencialController = new ControladorCredencial(credencialService);
  const historicoController = new HistoricoController(historicoRepository);
  const orgaoController = new ControladorOrgao(orgaoRepository);

  Logger.info('Controllers inicializados com sucesso!');

  // 6. Criar Mediators
  const casoMediator = new CasoMediator(casoController, casoRepository, anexoRepository);
  const assistidaMediator = new AssistidaMediator(assistidaController);
  const orgaoMediator = new OrgaoMediator(orgaoController);
  const funcionarioMediator = new FuncionarioMediator(funcionarioController);
  const credencialMediator = new CredencialMediator(credencialController);
  const historicoMediator = new HistoricoMediator(historicoController);
  const anexoMediator = new AnexoMediator(anexoRepository);
  const encaminhamentoMediator = new EncaminhamentoMediator(credencialController, orgaoController, anexoRepository, casoRedeApoioContatoRepository);
  const userMediator = new UserMediator(userController);

  Logger.info('Mediators inicializados com sucesso!');

  // 7. Criar Orchestrator e registrar handlers
  ipcOrchestrator = new IpcOrchestrator(
    casoMediator,
    assistidaMediator,
    orgaoMediator,
    funcionarioMediator,
    credencialMediator,
    historicoMediator,
    anexoMediator,
    encaminhamentoMediator,
    userMediator
  );

  ipcOrchestrator.registerHandlers();

  createMainWindow();
  Logger.info('✅ Aplicação iniciada com sucesso!');
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
      windowManager.loadContent('main', 'tela-configuracoes-conta-funcionario/index.html');
      break;
    case 'telaEstatisticasAdm':
      windowManager.loadContent('main', 'tela-estatisticas-adm/index.html');
      break;
    case 'telaRedeApoioAdm':
      windowManager.loadContent('main', 'tela-rede-apoio-adm/index.html');
      break;
    case 'telaListarFuncionarios':
      windowManager.loadContent('main', 'tela-funcionario-cadastrado/index.html');
      break;
    case 'telaCadastrarFuncionario':
      windowManager.loadContent('main', 'tela-cadastrar-funcionario/index.html');
      break;
    case 'telaDadosFuncionario':
      windowManager.loadContent('main', 'tela-dados-funcionario/index.html');
      break;
    case 'telaSobreAplicacao':
      windowManager.loadContent('main', 'tela-sobre-a-aplicacao/index.html');
      break;
    case 'telaVisualizacao1':
      windowManager.loadContent('main', 'tela-cadastro-1-visualizacao/index.html');
      break;
    case 'telaVisualizacao2':
      windowManager.loadContent('main', 'tela-cadastro-2-visualizacao/index.html');
      break;
    case 'telaVisualizacao3':
      windowManager.loadContent('main', 'tela-cadastro-3-visualizacao/index.html');
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