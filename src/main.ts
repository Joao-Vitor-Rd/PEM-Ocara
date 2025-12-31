import { app, BrowserWindow, ipcMain } from 'electron';
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

// Imports - Services
import { FuncionarioService } from './services/FuncionarioService';
import { CredencialService } from './services/CredencialService';

// Imports - IPC Orchestrator & Mediators
import { IpcOrchestrator } from './ipc/IpcOrchestrator';
import { CasoMediator } from './ipc/mediators/CasoMediator';
import { AssistidaMediator } from './ipc/mediators/AssistidaMediator';
import { OrgaoMediator } from './ipc/mediators/OrgaoMediator';
import { FuncionarioMediator } from './ipc/mediators/FuncionarioMediator';
import { CredencialMediator } from './ipc/mediators/CredencialMediator';
import { HistoricoMediator } from './ipc/mediators/HistoricoMediator';
import { AnexoMediator } from './ipc/mediators/AnexoMediator';
import { EncaminhamentoMediator } from './ipc/mediators/EncaminhamentoMediator';
import { UserMediator } from './ipc/mediators/UserMediator';

// Imports - Window Factory
import { WindowFactory } from './utils/WindowFactory';

const windowManager = new WindowManager();

// Variáveis globais
let ipcOrchestrator: IpcOrchestrator;

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
  const htmlPath = WindowFactory.getWindowPath(windowName);
  
  if (windowName === 'register') {
    windowManager.createWindow('register', {
      width: 600,
      height: 700,
      htmlFile: htmlPath || 'register.html',
      preloadFile: 'preload.js'
    });
  } else if (htmlPath) {
    windowManager.loadContent('main', htmlPath);
  } else {
    console.log('tela desconhecida:', windowName);
  }
});

ipcMain.on('window:close', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.close();
});


// ==========================================
// APP LIFECYCLE
// ==========================================

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});