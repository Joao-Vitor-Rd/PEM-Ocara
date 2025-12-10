// src/types/windown.d.ts

export interface IElectronAPI {
  createUser: (name: string, email: string) => Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }>;

  getUsers: () => Promise<{
    success: boolean;
    users?: any[];
    error?: string;
  }>;

  getUserById: (id: string) => Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }>;

  criarCaso: (dados: {
    anexo: string[]
    // Assistida
    nomeAssistida: string;
    idadeAssistida: number;
    identidadeGenero: string;
    nomeSocial: string;
    endereco: string;
    escolaridade: string;
    religiao: string;
    nacionalidade: string;
    zonaHabitacao: string;
    profissao: string;
    limitacaoFisica: string;
    numeroCadastroSocial: string;
    quantidadeDependentes: number;
    temDependentes: boolean;
    // Agressor
    nomeAgressor: string;
    idadeAgresssor: number;
    vinculoAssistida: string;
    dataOcorrida: Date;
    // SobreAgressor
    usoDrogasAlcool: string[];
    doencaMental: string;
    agressorCumpriuMedidaProtetiva: boolean;
    agressorTentativaSuicidio: boolean;
    agressorDesempregado: string;
    agressorPossuiArmaFogo: string;
    agressorAmeacouAlguem: string[];
    // Historico Violencia
    ameacaFamiliar: string[];
    agressaoFisica: string[];
    outrasFormasViolencia: string[];
    abusoSexual: boolean;
    comportamentosAgressor: string[];
    ocorrenciaPolicialMedidaProtetivaAgressor: boolean;
    agressoesMaisFrequentesUltimamente: boolean;
    // Outras Infor
    anotacoesLivres: string;
    // PreenchimentoProfissional
    assistidaRespondeuSemAjuda: boolean;
    assistidaRespondeuComAuxilio: boolean;
    assistidaSemCondicoes: boolean;
    assistidaRecusou: boolean;
    terceiroComunicante: boolean;
    tipoViolencia: string;
    // Outras Infor Importantes
    moraEmAreaRisco: string; //arrumar
    dependenteFinanceiroAgressor: boolean;
    aceitaAbrigamentoTemporario: boolean;
    // Sobre voce
    separacaoRecente: string;
    temFilhosComAgressor: boolean;
    qntFilhosComAgressor: number;
    temFilhosOutroRelacionamento: boolean;
    qntFilhosOutroRelacionamento: number;
    faixaFilhos: string[];
    filhosComDeficiencia: number;
    conflitoAgressor: string;
    filhosPresenciaramViolencia: boolean;
    violenciaDuranteGravidez: boolean;
    novoRelacionamentoAumentouAgressao: boolean;
    possuiDeficienciaDoenca: string;
    corRaca: string;
    // Caso
    data: Date;
    profissionalResponsavel: string;
    descricao: string;
  }) => Promise<{
    success: boolean;
    caso?: any;
    error?: string;
  }>;

  obterAssistidaCriada: () => Promise<{
    success: boolean;
    assistida?: any;
    error?: string;
  }>;

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
  ) => Promise<{
    success: boolean;
    assistida?: any;
    error?: string;
  }>;

  listarAssistidas: () => Promise<{
    success: boolean;
    assistidas?: any[];
    error?: string;
  }>;

  buscarAssistidaPorId: (id: number) => Promise<{
    success: boolean;
    assistida?: any;
    error?: string;
  }>;

  atualizarAssistida: (data: any) => Promise<{
    success: boolean;
    assistida?: any;
    error?: string;
  }>;

  getEnderecosAssistidas: () => Promise<{
    success: boolean;
    enderecos?: any[];
    error?: string;
  }>;

  getTotalCasos: () => Promise<{
    success: boolean;
    totalCasos?: number;
    error?: string;
  }>;

  getTotalCasosMes: (mes: number, ano: number) => Promise<{
    success: boolean;
    totalCasosMes?: number;
    error?: string;
  }>;

  getTotalCasosNoAnoFiltrado: (regioes: string[], dataInicio?: string, dataFim?: string) => Promise<{
    success: boolean;
    totalCasos?: any[];
    error?: string;
  }>;

  excluirAnexo: (idAnexo: number, nomeArquivo?: string) => Promise<{
    success: boolean;
    nomeArquivo?: string;
    error?: string;
  }>;

  recuperarAnexosDoCaso: (idCaso: number) => Promise<{
    success: boolean;
    anexos?: any[];
    error?: string;
  }>;

  salvarAnexo: (anexo: any, idCaso: number, idAssistida: number) => Promise<{
    success: boolean;
    idAnexo?: number;
    error?: string;
  }>;

  downloadAnexo: (idAnexo: string, nomeArquivo: string) => Promise<{
    success: boolean;
    message?: string;
    path?: string;
    error?: string;
  }>;

  getEnderecosAssistidasFiltrado: (dataInicio?: string, dataFim?: string) => Promise<{
    success: boolean;
    enderecos?: any[];
    error?: string;
  }>;

  getTotalCasosFiltrado: (regioes: string[], dataInicio?: string, dataFim?: string) => Promise<{
    success: boolean;
    totalCasos?: number;
    error?: string;
  }>;

  getInformacoesGeraisDoCaso: (idCaso: number) => Promise<{
    success: boolean;
    informacoes?: any;
    error?: string;
  }>;

  getTotalCasosNoAno: () => Promise<{
    success: boolean;
    totalCasos?: any[];
    error?: string;
  }>;

  listarCasosPorAssistida: (idAssistida: number) => Promise<{
    success: boolean;
    casos?: any[];
    error?: string;
  }>;

  casosPorProtocolo: (protocolo: number) => Promise<{
    success: boolean;
    caso?: any[];
    error?: string;
  }>;

  gerarPdf: (protocloCaso: number) => Promise<{
    sucess: boolean;
    path?: string;
    error?: string;
  }>;

  obterCasosPorProtocoloAssistida: (protocoloAssistida: number) => Promise<{
    success: boolean;
    casos?: any[];
    error?: string;
  }>;

  salvarCasoBD: (dados: {
    assistida: any;
    caso: any;
    profissionalResponsavel: string;
    data: Date;
    modoEdicao?: string;
    idAssistidaExistente?: number | null;
  }) => Promise<{
    success: boolean;
    idCaso?: number;
    idAssistida?: number;
    error?: string;
  }>;

  openWindow: (windowName: string) => void;
  closeWindow: () => void;
  onUserCreated: (callback: (user: any) => void) => void;
  removeUserCreatedListener: () => void;
  // ============================
  // REDE DE APOIO 
  // ============================
  criarOrgaoRedeApoio: (
    nome: string,
    email: string
  ) => Promise<{
    success: boolean;
    orgao?: any;
    error?: string;
  }>;

  listarOrgaosRedeApoio: () => Promise<{
    success: boolean;
    orgaos?: any[];
    error?: string;
  }>;

  atualizarOrgaoRedeApoio: (
    id: number,
    nome?: string,
    email?: string
  ) => Promise<{
    success: boolean;
    orgao?: any;
    error?: string;
  }>;

  deletarOrgaoRedeApoio: (id: number) => Promise<{
    success: boolean;
    error?: string;
  }>;

  getPathForFile: (file: File) => string;
  
  gerarPreviewCaso: (dados: any) => Promise<{
      success: boolean;
      path?: string;
      error?: string;
    }>;

  salvarHistoricoBD: (dados: {
    caso: any;
    assistida: any;
    profissionalResponsavel: string;
    data: Date;
  }) => Promise<{
    success: boolean;
    historicoId?: number;
    error?: string;
  }>;

  registrarDelecaoAnexo: (idCaso: number, idAssistida: number, nomeArquivoComExtensao: string, nomeFuncionario: string, emailFuncionario: string) => Promise<{
    success: boolean;
    historicoId?: number;
    error?: string;
  }>;

  listarHistorico: (pagina?: number, itensPorPagina?: number) => Promise<{
    success: boolean;
    data?: {
      registros: any[];
      totalRegistros: number;
      totalPaginas: number;
      paginaAtual: number;
    };
    error?: string;
  }>;

  autenticar: (email: string, senha: string) => Promise<{
    success: boolean;
    funcionario?: any;
    error?: string;
  }>;

  atualizarPerfil: (dados: {
    email: string;
    nome: string;
    senhaAtual: string;
    novaSenha?: string;
    novoEmail?: string;
  }) => Promise<{
    success: boolean;
    funcionario?: any;
    error?: string;
  }>;

}
declare global {
  interface Window {
    api: IElectronAPI;
  }
}

export {};
