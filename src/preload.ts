import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  createUser: (name: string, email: string) =>
    ipcRenderer.invoke('user:create', { name, email }),

  getUsers: () => ipcRenderer.invoke('user:getAll'),

  getUserById: (id: string) => ipcRenderer.invoke('user:getById', id),

  openWindow: (windowName: string) =>
    ipcRenderer.send('window:open', windowName),

  listarAssistidas: () => ipcRenderer.invoke('assistida:listarTodas'),
  
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
      temDependentes,
    }),


  closeWindow: () => ipcRenderer.send('window:close'),

  onUserCreated: (callback: (user: any) => void) => {
    ipcRenderer.on('user:created', (_event, user) => callback(user));
  },

  removeUserCreatedListener: () => {
    ipcRenderer.removeAllListeners('user:created');
  },
});
