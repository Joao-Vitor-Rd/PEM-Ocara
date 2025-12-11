import { contextBridge, ipcRenderer, webUtils } from 'electron';
import { get } from 'http';

contextBridge.exposeInMainWorld('api', {
  createUser: (name: string, email: string) =>  
    ipcRenderer.invoke('user:create', { name, email }),
  getUsers: () => ipcRenderer.invoke('user:getAll'),
  getUserById: (id: string) => ipcRenderer.invoke('user:getById', id),

  getPathForFile: (file: File) => {
    if(webUtils && webUtils.getPathForFile) {
      return webUtils.getPathForFile(file);
    }
    return (file as any).path;
  },

  gerarPreviewCaso: (dados:any) => ipcRenderer.invoke('caso:preview', dados),


  openWindow: (windowName: string) =>
    ipcRenderer.send('window:open', windowName),

  listarAssistidas: () => ipcRenderer.invoke('assistida:listarTodas'),
  
  buscarAssistidaPorId: (id: number) => ipcRenderer.invoke('assistida:buscarPorId', id),
  
  atualizarAssistida: (data: any) => ipcRenderer.invoke('assistida:atualizar', data),
  
  listarCasosPorAssistida: (idAssistida: number) =>
    ipcRenderer.invoke('caso:listarPorAssistida', idAssistida),
  
  criarCaso: (data: any) =>
    ipcRenderer.invoke('caso:criar', data),

  getTotalCasosNoAno: () => ipcRenderer.invoke('caso:getTotalCasosNoAno'),

  getEnderecosAssistidas: () => ipcRenderer.invoke('assistida:getEnderecos'),

  salvarCasoBD: (dados: {
    assistida: any;
    caso: any;
    profissionalResponsavel: string;
    data: Date;
  }) =>
    ipcRenderer.invoke('caso:salvarBD', dados),

  salvarHistoricoBD: (dados: {
    caso: any;
    assistida: any;
    profissionalResponsavel: string;
    data: Date;
  }) =>
    ipcRenderer.invoke('historico:salvar', dados),

  registrarDelecaoAnexo: (idCaso: number, idAssistida: number, nomeArquivoComExtensao: string, nomeFuncionario: string, emailFuncionario: string) =>
    ipcRenderer.invoke('historico:registrarDelecao', { idCaso, idAssistida, nomeArquivoComExtensao, nomeFuncionario, emailFuncionario }),

  listarHistorico: (pagina: number = 1, itensPorPagina: number = 10) =>
    ipcRenderer.invoke('historico:listar', pagina, itensPorPagina),

  casosPorProtocolo: (protocolo: number) =>
    ipcRenderer.invoke('caso:getByProtocolo', protocolo),

  getTotalCasos: () => ipcRenderer.invoke('caso:getTotalCasos'),

  getTotalCasosMes: (mes: number, ano: number) =>
    ipcRenderer.invoke('caso:getTotalCasosMes', { mes, ano }),

  obterCasosPorProtocoloAssistida: (protocoloAssistida: number) =>
    ipcRenderer.invoke('caso:obterPorProtocoloAssistida', protocoloAssistida),

  getTotalCasosNoAnoFiltrado: (regioes: string[], dataInicio?: string, dataFim?: string) =>
    ipcRenderer.invoke('caso:getTotalCasosNoAnoFiltrado', { regioes, dataInicio, dataFim }),

  getEnderecosAssistidasFiltrado: (dataInicio?: string, dataFim?: string) =>
    ipcRenderer.invoke('caso:getEnderecosAssistidasFiltrado', { dataInicio, dataFim }),

  getTotalCasosFiltrado: (regioes: string[], dataInicio?: string, dataFim?: string) =>
    ipcRenderer.invoke('caso:getTotalCasosFiltrado', { regioes, dataInicio, dataFim }),

  gerarPdf: (protocoloCaso: number) =>
    ipcRenderer.invoke('caso:gerarPdf', protocoloCaso),
  
  getInformacoesGeraisDoCaso: (idCaso: number) =>
    ipcRenderer.invoke('caso:obterInformacoesGerais', idCaso),

  criarAssistida: (
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
  ) =>
    ipcRenderer.invoke('assistida:criar', {
      nome,
      idade,
      identidadeGenero,
      nomeSocial,
      endereco,
      escolaridade,
      religiao,
      nacionalidade,
      zonaHabitacao,
      profissao,
      limitacaoFisica,
      numeroCadastroSocial,
      quantidadeDependentes,
      temDependentes,
    }),


  criarOrgaoRedeApoio: (nome: string, email: string) =>
    ipcRenderer.invoke('orgao:create', { nome, email }),

  listarOrgaosRedeApoio: () =>
    ipcRenderer.invoke('orgao:listarTodos'),

  atualizarOrgaoRedeApoio: (id: number, nome?: string, email?: string) =>
    ipcRenderer.invoke('orgao:update', { id, nome, email }),

  deletarOrgaoRedeApoio: (id: number) =>
    ipcRenderer.invoke('orgao:delete', id),

  recuperarAnexosDoCaso: (idCaso: number) =>
    ipcRenderer.invoke('caso:recuperarAnexos', { idCaso }),

  salvarAnexo: (anexo: { nome: string; tipo: string; tamanho: number; dados: Buffer; relatorio?: boolean }, idCaso: number, idAssistida: number) =>
    ipcRenderer.invoke('caso:salvarAnexo', { anexo, idCaso, idAssistida }),

  downloadAnexo: (idAnexo: string, nomeArquivo: string) =>
    ipcRenderer.invoke('anexo:download', { idAnexo, nomeArquivo }),

  closeWindow: () => ipcRenderer.send('window:close'),

  onCasoCriado: (callback: (caso: any) => void) => {
    ipcRenderer.on('caso:criado', (_event, caso) => callback(caso));
  },

  excluirAnexo: (idAnexo: number, nomeArquivo?: string) => ipcRenderer.invoke('caso:deletarAnexo', { idAnexo, nomeArquivo }),

  removeUserCreatedListener: () => {
    ipcRenderer.removeAllListeners('user:created');
  },

  cadastrarFuncionario: (dados: { nome: string; email: string; cargo: string; senha: string }) =>
    ipcRenderer.invoke('create-funcionario', dados),

  listarFuncionarios: () => ipcRenderer.invoke('funcionario:listar'),

  buscarFuncionarioPorEmail: (email: string) =>
    ipcRenderer.invoke('get-funcionario-email', email),

  atualizarFuncionario: (email: string, dados: { nome?: string; cargo?: string; email?: string; senha?: string }) =>
    ipcRenderer.invoke('update-funcionario', { email, dados }),

  deletarFuncionario: (email: string) => ipcRenderer.invoke('delete-funcionario', email),

  logout: () => ipcRenderer.invoke('auth:logout'),

  autenticar: (email: string, senha: string) =>
    ipcRenderer.invoke('auth:login', { email, senha }),

  atualizarPerfil: (dados: { email: string; nome: string; senhaAtual: string; novaSenha?: string; novoEmail?: string }) =>
    ipcRenderer.invoke('user:update-profile', dados),

  salvarCredenciais: (dados: { email?: string; senha?: string; servico?: string }) =>
    ipcRenderer.invoke('credencial:salvar', dados),

  obterCredenciais: () => ipcRenderer.invoke('credencial:obter'),

  definirOrigemSobreAplicacao: (origem: 'telaConfiguracoesConta' | 'telaContaAdm') =>
    ipcRenderer.invoke('sobre:setOrigem', origem),

  obterOrigemSobreAplicacao: () => ipcRenderer.invoke('sobre:getOrigem'),
});

