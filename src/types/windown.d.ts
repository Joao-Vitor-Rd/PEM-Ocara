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
