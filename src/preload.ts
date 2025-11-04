import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  createUser: (name: string, email: string) =>
    ipcRenderer.invoke('user:create', { name, email }),

  getUsers: () => ipcRenderer.invoke('user:getAll'),

  getUserById: (id: string) => ipcRenderer.invoke('user:getById', id),

  openWindow: (windowName: string) =>
    ipcRenderer.send('window:open', windowName),

  listarAssistidas: () => ipcRenderer.invoke('assistida:listarTodas'),
  
  criarCaso: (
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
    idadeAgressor: number,
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
    moraEmAreaRisco: boolean,
    dependenteFinanceiroAgressor: boolean,
    aceitaAbrigamentoTemporario: boolean,

        //Sobre voce
    separacaoRecente: string,
    temFilhosComAgressor: boolean,
    qntFilhosComAgressor: number,
    temFilhosOutroRelacionamento: boolean,
    qntFilhosOutroRelacionamento: number,
    faixaFilhos: string[],
    filhosComDeficiencia: boolean,
    conflitoAgressor: string,
    filhosPresenciaramViolencia: boolean,
    violenciaDuranteGravidez: boolean,
    novoRelacionamentoAumentouAgressao: boolean,
    possuiDeficienciaDoenca: string,
    corRaca: string,

    data: Date, 
    profissionalResponsavel: string, 
    descricao: string 
  ) =>
    ipcRenderer.invoke('caso:criar', {
      nomeAssistida,
      idadeAssistida,
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

      //Agressor
      nomeAgressor,
      idadeAgressor,
      vinculoAssistida,
      dataOcorrida,

      //SobreAgressor
      usoDrogasAlcool,
      doencaMental,
      agressorCumpriuMedidaProtetiva,
      agressorTentativaSuicidio,
      agressorDesempregado,
      agressorPossuiArmaFogo,
      agressorAmeacouAlguem,

      //Historico Violencia
      ameacaFamiliar,
      agressaoFisica,
      outrasFormasViolencia,
      abusoSexual,
      comportamentosAgressor,
      ocorrenciaPolicialMedidaProtetivaAgressor,
      agressoesMaisFrequentesUltimamente,

      //Outras Infor
      anotacoesLivres,

      //Outras Infor Importantes
      moraEmAreaRisco,
      dependenteFinanceiroAgressor,
      aceitaAbrigamentoTemporario,

      //PreenchimentoProfissional
      assistidaRespondeuSemAjuda,
      assistidaRespondeuComAuxilio,
      assistidaSemCondicoes,
      assistidaRecusou,
      terceiroComunicante,
      tipoViolencia,

      //Sobre voce
      separacaoRecente,
      temFilhosComAgressor,
      qntFilhosComAgressor,
      temFilhosOutroRelacionamento,
      qntFilhosOutroRelacionamento,
      faixaFilhos,
      filhosComDeficiencia,
      conflitoAgressor,
      filhosPresenciaramViolencia,
      violenciaDuranteGravidez,
      novoRelacionamentoAumentouAgressao,
      possuiDeficienciaDoenca,
      corRaca,
      
      //Caso
      data, 
      profissionalResponsavel, 
      descricao 
    }),

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
