import { ipcMain, IpcMain, BrowserWindow } from 'electron';
import { Logger } from '../utils/Logger';
import { CasoMediator } from './mediators/CasoMediator';
import { AssistidaMediator } from './mediators/AssistidaMediator';
import { OrgaoMediator } from './mediators/OrgaoMediator';
import { FuncionarioMediator } from './mediators/FuncionarioMediator';
import { CredencialMediator } from './mediators/CredencialMediator';
import { HistoricoMediator } from './mediators/HistoricoMediator';
import { AnexoMediator } from './mediators/AnexoMediator';
import { EncaminhamentoMediator } from './mediators/EncaminhamentoMediator';
import { UserMediator } from './mediators/UserMediator';

export class IpcOrchestrator {
  constructor(
    private caso: CasoMediator,
    private assistida: AssistidaMediator,
    private orgao: OrgaoMediator,
    private funcionario: FuncionarioMediator,
    private credencial: CredencialMediator,
    private historico: HistoricoMediator,
    private anexo: AnexoMediator,
    private encaminhamento: EncaminhamentoMediator,
    private user: UserMediator
  ) {}

  registerHandlers() {
    // Mensagens IPC para Mediator de caso
    ipcMain.handle('caso:criar', (_event, data) => this.handleWithError(() => this.caso.criar(data)));
    ipcMain.handle('caso:getTotalCasos', () => this.handleWithError(() => this.caso.getTotalCasos()));
    ipcMain.handle('caso:getTotalCasosMes', (_event, args) => this.handleWithError(() => this.caso.getTotalCasosMes(args.mes, args.ano)));
    ipcMain.handle('caso:getByProtocolo', (_event, protocolo) => this.handleWithError(() => this.caso.getByProtocolo(protocolo)));
    ipcMain.handle('caso:obterPorProtocoloAssistida', (_event, protocolo) => this.handleWithError(() => this.caso.obterPorProtocoloAssistida(protocolo)));
    ipcMain.handle('caso:gerarPdf', (_event, protocolo) => this.handleWithError(() => this.caso.gerarPdf(protocolo)));
    ipcMain.handle('caso:listarPorAssistida', (_event, idAssistida) => this.handleWithError(() => this.caso.listarPorAssistida(idAssistida)));
    ipcMain.handle('caso:obterInformacoesGerais', (_event, idCaso) => this.handleWithError(() => this.caso.obterInformacoesGerais(idCaso)));
    ipcMain.handle('caso:getCasoCompletoVisualizacao', (_event, idCaso) => this.handleWithError(() => this.caso.getCasoCompletoVisualizacao(idCaso)));
    ipcMain.handle('caso:salvarPrivacidade', (_event, dados) => this.handleWithError(() => this.caso.salvarPrivacidade(dados.idCaso, dados.privacidade)));
    ipcMain.handle('caso:obterPrivacidade', (_event, idCaso) => this.handleWithError(() => this.caso.obterPrivacidade(idCaso)));
    ipcMain.handle('caso:deletarAnexo', (_event, dados) => this.handleWithError(() => this.caso.deletarAnexo(dados)));
    ipcMain.handle('caso:getTotalCasosNoAno', () => this.handleWithError(() => this.caso.getTotalCasosNoAno()));
    ipcMain.handle('caso:getTotalCasosNoAnoFiltrado', (_event, args) => this.handleWithError(() => this.caso.getTotalCasosNoAnoFiltrado(args.regioes, args.dataInicio, args.dataFim)));
    ipcMain.handle('caso:getEnderecosAssistidasFiltrado', (_event, args) => this.handleWithError(() => this.caso.getEnderecosAssistidasFiltrado(args?.dataInicio, args?.dataFim)));
    ipcMain.handle('caso:getTotalCasosFiltrado', (_event, args) => this.handleWithError(() => this.caso.getTotalCasosFiltrado(args.regioes, args.dataInicio, args.dataFim)));
    ipcMain.handle('caso:salvarBD', (_event, dados) => this.handleWithError(() => this.caso.salvarBD(dados)));
    ipcMain.handle('caso:recuperarAnexos', (_event, data) => this.handleWithError(() => this.caso.recuperarAnexos(data.idCaso)));
    ipcMain.handle('caso:salvarAnexo', (_event, data) => this.handleWithError(() => this.caso.salvarAnexo(data.anexo, data.idCaso, data.idAssistida)));
    ipcMain.handle('caso:preview', (_event, dados) => this.handleWithError(() => this.caso.preview(dados)));

    // ============ ASSISTIDA ============
    ipcMain.handle('assistida:getEnderecos', () => this.handleWithError(() => this.assistida.getEnderecos()));
    ipcMain.handle('assistida:criar', (_event, data) => this.handleWithError(() => this.assistida.criar(data)));
    ipcMain.handle('assistida:listarTodas', () => this.handleWithError(() => this.assistida.listarTodas()));
    ipcMain.handle('assistida:buscarPorId', (_event, id) => this.handleWithError(() => this.assistida.buscarPorId(id)));
    ipcMain.handle('assistida:atualizar', (_event, data) => this.handleWithError(() => this.assistida.atualizar(data)));

    // ============ HISTÓRICO ============
    ipcMain.handle('historico:salvar', (_event, dados) => this.handleWithError(() => this.historico.salvar(dados)));
    ipcMain.handle('historico:registrarDelecao', (_event, dados) => this.handleWithError(() => this.historico.registrarDelecao(dados)));
    ipcMain.handle('historico:listar', (_event, pagina, itensPorPagina) => this.handleWithError(() => this.historico.listar(pagina, itensPorPagina)));

    // ============ ÓRGÃO ============
    ipcMain.handle('orgao:create', (_event, data) => this.handleWithError(() => this.orgao.criar(data)));
    ipcMain.handle('orgao:listarTodos', () => this.handleWithError(() => this.orgao.listarTodos()));
    ipcMain.handle('orgao:update', (_event, data) => this.handleWithError(() => this.orgao.atualizar(data)));
    ipcMain.handle('orgao:delete', (_event, id) => this.handleWithError(() => this.orgao.deletar(id)));

    // ============ ANEXO ============
    ipcMain.handle('anexo:download', (_event, data) => this.handleWithError(() => this.anexo.download(data.idAnexo, data.nomeArquivo)));

    // ============ ENCAMINHAMENTO ============
    ipcMain.handle('encaminhamento:enviarEmail', (_event, dados) => this.handleWithError(() => this.encaminhamento.enviarEmail(dados)));
    ipcMain.handle('caso:listarRedesContatadas', (_event, payload) => this.handleWithError(() => this.encaminhamento.listarRedesContatadas(payload)));

    // ============ FUNCIONÁRIO ============
    ipcMain.handle('create-funcionario', (_event, data) => this.handleWithError(() => this.funcionario.criar(data)));
    ipcMain.handle('get-funcionarios', () => this.handleWithError(async () => {
      const resultado = await this.funcionario.listar();
      if (resultado.success) return resultado.funcionarios;
      throw new Error(resultado.error);
    }));
    ipcMain.handle('funcionario:listar', () => this.handleWithError(() => this.funcionario.listar()));
    ipcMain.handle('get-funcionario-email', (_event, email) => this.handleWithError(() => this.funcionario.buscarPorEmail(email)));
    ipcMain.handle('update-funcionario', (_event, data) => this.handleWithError(() => this.funcionario.atualizar(data.email, data.dados)));
    ipcMain.handle('delete-funcionario', (_event, email) => this.handleWithError(() => this.funcionario.deletar(email)));
    ipcMain.handle('auth:login', (_event, credenciais) => this.handleWithError(() => this.funcionario.autenticar(credenciais.email, credenciais.senha)));
    ipcMain.handle('auth:logout', () => this.handleWithError(() => this.funcionario.logout()));
    ipcMain.handle('user:update-profile', (_event, data) => this.handleWithError(() => this.funcionario.atualizarPerfil(data.email, data)));

    // ============ CREDENCIAL ============
    ipcMain.handle('credencial:salvar', (_event, data) => this.handleWithError(() => this.credencial.salvar(data)));
    ipcMain.handle('credencial:obter', () => this.handleWithError(() => this.credencial.obter()));

    // ============ USUÁRIO ============
    ipcMain.handle('user:create', (_event, data) => this.handleWithError(() => {
      const result = this.user.criar(data);
      if ((result as any).success && (result as any).user) {
        BrowserWindow.getAllWindows().forEach(window => {
          window.webContents.send('user:created', (result as any).user.toJSON());
        });
      }
      return result;
    }));
    ipcMain.handle('user:getAll', () => this.handleWithError(() => this.user.getAll()));
    ipcMain.handle('user:getById', (_event, id) => this.handleWithError(() => this.user.getById(id)));

    Logger.info('✅ IPC handlers registrados com sucesso!');
  }

  private async handleWithError(handler: () => any): Promise<any> {
    try {
      return await handler();
    } catch (error) {
      Logger.error('Erro no handler IPC:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  setUsuarioLogado(usuario: { email: string; nome: string; cargo: string } | null) {
    this.funcionario.setUsuarioLogado(usuario);
  }

  getUsuarioLogado() {
    return this.funcionario.getUsuarioLogado();
  }
}
