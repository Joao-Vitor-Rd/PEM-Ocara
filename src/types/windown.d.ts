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
    agressorAmeacouAlguem: string;
    // Historico Violencia
    ameacaFamiliar: boolean;
    agressaoFisica: boolean;
    outrasFormasViolencia: string;
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
    moraEmAreaRisco: boolean;
    dependenteFinanceiroAgressor: boolean;
    aceitaAbrigamentoTemporario: boolean;
    // Sobre voce
    separacaoRecente: string;
    temFilhosComAgressor: boolean;
    qntFilhosComAgressor: number;
    temFilhosOutroRelacionamento: boolean;
    qntFilhosOutroRelacionamento: number;
    faixaFilhos: string[];
    filhosComDeficiencia: boolean;
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
    
  criarAssistida:(
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
  }>
  
  listarAssistidas: () => Promise<{
    success: boolean;
    assistidas?: any[];
    error?: string;
  }>;

  casosPorProtocolo: (protocolo: number) => Promise<{
    success: boolean;
    caso?: any[];
    error?: string;
  }>;

  obterCasosPorProtocoloAssistida: (protocoloAssistida: number) => Promise<{
    success: boolean;
    casos?: any[];
    error?: string;
  }>;

  openWindow: (windowName: string) => void;
  closeWindow: () => void;
  onUserCreated: (callback: (user: any) => void) => void;
  removeUserCreatedListener: () => void;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
