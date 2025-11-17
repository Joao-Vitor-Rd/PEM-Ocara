import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { WindowManager } from './utils/WindowManeger';
import { Logger } from './utils/Logger';
import { UserController } from './controllers/UserController';
import { AssistidaController } from './controllers/AssistidaController';
import { CasoController } from './controllers/CasoController';

const windowManager = new WindowManager();
const userController = new UserController();
const assistidaController = new AssistidaController();
const casoController = new CasoController(assistidaController.getAssistidaService());

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

ipcMain.handle('assistida:listarTodas', async () => {
  Logger.info("requisicao: listar Assistidas")
  try {
    const assistidas = assistidaController.handlerListarTodasAssistidas();
    return {
      success: true,
      assistidas: assistidas.map(u => u.toJSON())
    };
  } catch (error) {
    Logger.error('Erro ao buscar assistidas:', error);
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
    agressorAmeacouAlguem: string,

    //Historico Violencia
    ameacaFamiliar: boolean,
    agressaoFisica: boolean,
    outrasFormasViolencia: string,
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
    const result = casoController.handlerCriarCaso(data);
    
    return {
      success: true,
      caso: result.toJSON()
    };
  } catch (error) {
    Logger.error('Erro ao criar Caso:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
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
    default:
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

function createMainWindow() {
  Logger.info('Criando janela principal...');
  
  windowManager.createWindow('main', {
    width: 900,
    height: 700,
    htmlFile: 'tela-login/index.html',
    preloadFile: 'preload.js'
  });
}

app.whenReady().then(() => {
  Logger.info('App inicializado!');
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});