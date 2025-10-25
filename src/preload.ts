import { contextBridge, ipcRenderer } from 'electron';
import * as path from 'path';
import * as fs from 'fs';


contextBridge.exposeInMainWorld('api', {
  createUser: (name: string, email: string) => 
    ipcRenderer.invoke('user:create', { name, email }),
  
  getUsers: () => 
    ipcRenderer.invoke('user:getAll'),
  
  getUserById: (id: string) => 
    ipcRenderer.invoke('user:getById', id),

  openWindow: (windowName: string) => 
    ipcRenderer.send('window:open', windowName),

  //IPC ASSISTIDA

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
    ) => ipcRenderer.invoke('assistida:criar',
      {
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
      }
    ),
  
  closeWindow: () => 
    ipcRenderer.send('window:close'),

  onUserCreated: (callback: (user: any) => void) => {
    ipcRenderer.on('user:created', (_event, user) => callback(user));
  },

  removeUserCreatedListener: () => {
    ipcRenderer.removeAllListeners('user:created');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  
  try {
    const rendererPath = path.join(__dirname, 'renderers', 'renderer.js');
    
    
    if (fs.existsSync(rendererPath)) {
      
      let rendererCode = fs.readFileSync(rendererPath, 'utf-8');
      
      rendererCode = `
        (function() {
          // Criar objeto exports vazio para evitar erro
          var exports = {};
          var module = { exports: exports };
          
          ${rendererCode}
          
          // Se o renderer exportou algo, disponibilizar globalmente
          if (typeof module.exports === 'function') {
            module.exports();
          }
        })();
      `;
      
      const script = document.createElement('script');
      script.textContent = rendererCode;
      document.head.appendChild(script);
      
    } else {
      console.error('Preload: Arquivo não encontrado:', rendererPath);
    }
  } catch (error) {
    console.error('Preload: Erro ao carregar renderer:', error);
  }
});
