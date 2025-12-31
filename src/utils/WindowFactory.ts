import { WindowManager } from './WindowManeger';

export class WindowFactory {
  static getWindowPath(windowName: string): string | null {
    // ============ AUTENTICAÇÃO ============
    if (windowName === 'register') {
      return 'register.html';
    } else if (windowName === 'telaLogin') {
      return 'tela-login/index.html';
    }
    
    // ============ ASSISTIDAS ============
    else if (windowName === 'telaListarAssistidas') {
      return 'tela-assistidas/index.html';
    } else if (windowName === 'telaCadastroAssistida') {
      return 'tela-cadastro-1/index.html';
    } else if (windowName === 'telaCadastro2') {
      return 'tela-cadastro-2/index.html';
    } else if (windowName === 'telaCadastro3') {
      return 'tela-cadastro-3/index.html';
    } else if (windowName === 'telaCadastro4') {
      return 'tela-cadastro-4/index.html';
    } else if (windowName === 'telaCadastro5') {
      return 'tela-cadastro-5/index.html';
    } else if (windowName === 'telaCadastro6') {
      return 'tela-cadastro-6/index.html';
    } else if (windowName === 'telaVisualizacao1') {
      return 'tela-cadastro-1-visualizacao/index.html';
    } else if (windowName === 'telaVisualizacao2') {
      return 'tela-cadastro-2-visualizacao/index.html';
    } else if (windowName === 'telaVisualizacao3') {
      return 'tela-cadastro-3-visualizacao/index.html';
    }
    
    // ============ CASOS ============
    else if (windowName === 'telaInicial') {
      return 'tela-inicial/index.html';
    } else if (windowName === 'telaCasosRegistrados') {
      return 'tela-casos-registrados/index.html';
    } else if (windowName === 'telaVisualizarCasosBD') {
      return 'tela-visualizar-casos-bd/index.html';
    } else if (windowName === 'telaInformacoesCaso') {
      return 'tela-informacoes-caso/index.html';
    }
    
    // ============ REDE APOIO ============
    else if (windowName === 'telaRedeApoio') {
      return 'tela-rede-apoio/index.html';
    }
    
    // ============ ESTATÍSTICAS ============
    else if (windowName === 'telaEstatisticas') {
      return 'tela-estatisticas/index.html';
    }
    
    // ============ CONFIGURAÇÕES ============
    else if (windowName === 'telaConfiguracoesConta') {
      return 'tela-configuracoes-conta/index.html';
    } else if (windowName === 'historicoMudancas') {
      return 'tela-historico/index.html';
    } else if (windowName === 'telaSobreAplicacao') {
      return 'tela-sobre-a-aplicacao/index.html';
    }
    
    // ============ ADMIN ============
    else if (windowName === 'telaInicialAdm') {
      return 'tela-inicial-adm/index.html';
    } else if (windowName === 'telaContaAdm') {
      return 'tela-configuracoes-conta-funcionario/index.html';
    } else if (windowName === 'telaEstatisticasAdm') {
      return 'tela-estatisticas-adm/index.html';
    } else if (windowName === 'telaRedeApoioAdm') {
      return 'tela-rede-apoio-adm/index.html';
    }
    
    // ============ FUNCIONÁRIOS ============
    else if (windowName === 'telaListarFuncionarios') {
      return 'tela-funcionario-cadastrado/index.html';
    } else if (windowName === 'telaCadastrarFuncionario') {
      return 'tela-cadastrar-funcionario/index.html';
    } else if (windowName === 'telaDadosFuncionario') {
      return 'tela-dados-funcionario/index.html';
    }
    
    // ============ TESTES ============
    else if (windowName === 'testeForm') {
      return 'telaAssistidas.html';
    }
    
    // ============ DESCONHECIDA ============
    else {
      return null;
    }
  }
}
