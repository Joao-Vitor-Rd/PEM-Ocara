import { Logger } from '../../utils/Logger';
import { CasoController } from '../../controllers/CasoController';
import { CasoRepositoryPostgres } from '../../repository/CasoRepositoryPostgres';
import { AnexoRepositorioPostgres } from '../../repository/AnexoRepositorioPostgres';
import * as path from 'path';
import * as fs from 'fs';

export class CasoMediator {
  constructor(
    private casoController: CasoController,
    private casoRepository: CasoRepositoryPostgres,
    private anexoRepository: AnexoRepositorioPostgres
  ) {}

  async criar(data: any) {
    Logger.info('Criando novo caso...');
    const result = this.casoController.handlerCriarCaso(data);
    Logger.info('Caso criado com sucesso:', result.getProtocoloCaso());
    return {
      success: true,
      caso: result.toJSON()
    };
  }

  async getTotalCasos() {
    const total = await this.casoController.getTotalCasos();
    return {
      success: true,
      totalCasos: total
    };
  }

  async getTotalCasosMes(mes: number, ano: number) {
    const total = await this.casoController.getTotalCasosMes(mes, ano);
    return {
      success: true,
      totalCasosMes: total
    };
  }

  async getByProtocolo(protocolo: number) {
    Logger.info('Requisição para buscar caso pelo protocolo:', protocolo);
    const caso = this.casoController.getCaso(protocolo);
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
  }

  async obterPorProtocoloAssistida(protocoloAssistida: number) {
    Logger.info('Requisição para buscar casos por protocolo da assistida:', protocoloAssistida);
    const casos = this.casoController.getCasosPorProtocoloAssistida(protocoloAssistida);
    return {
      success: true,
      casos: casos.map((caso: any) => caso.toJSON())
    };
  }

  async gerarPdf(protocoloCaso: number) {
    Logger.info('Requisição para gerar PDF do caso:', protocoloCaso);
    const caminhoDoPdf = await this.casoController.handlerCriarPdfCaso(protocoloCaso);
    return {
      success: true,
      path: caminhoDoPdf
    };
  }

  async listarPorAssistida(idAssistida: number) {
    Logger.info('Requisição para buscar casos da assistida do BD:', idAssistida);
    const casos = await this.casoRepository.getAllCasosAssistida(idAssistida);
    return {
      success: true,
      casos: casos
    };
  }

  async obterInformacoesGerais(idCaso: number) {
    const infosCaso = await this.casoController.getInformacoesGeraisDoCaso(idCaso);
    return {
      success: true,
      informacoes: infosCaso
    };
  }

  async getCasoCompletoVisualizacao(idCaso: number) {
    Logger.info('🔍 Requisição para obter caso completo para visualização:', idCaso);
    const casoCompleto = await this.casoController.getCasoCompletoParaVisualizacao(idCaso);
    Logger.info('✅ Caso completo obtido');
    return {
      success: true,
      caso: casoCompleto
    };
  }

  async salvarPrivacidade(idCaso: number, privacidade: string) {
    Logger.info('🔒 Salvando privacidade para caso:', idCaso, 'valor:', privacidade);

    if (!idCaso || typeof idCaso !== 'number') {
      throw new Error(`ID do caso inválido: ${idCaso}`);
    }

    if (typeof privacidade !== 'string') {
      throw new Error(`Valor de privacidade inválido: ${privacidade}`);
    }

    const success = await this.casoController.salvarPrivacidade(idCaso, privacidade);
    Logger.info('✅ Privacidade salva com sucesso para caso:', idCaso);

    return {
      success: true,
      message: 'Privacidade salva com sucesso'
    };
  }

  async obterPrivacidade(idCaso: number) {
    const privacidade = await this.casoController.obterPrivacidade(idCaso);
    return {
      success: true,
      privacidade: privacidade
    };
  }

  async deletarAnexo(dados: any) {
    const { idAnexo, nomeArquivo } = dados;
    Logger.info('Requisição para deletar anexo:', idAnexo, 'Nome:', nomeArquivo);
    const sucesso = await this.casoController.handlerExcluirAnexo(idAnexo);
    return {
      success: sucesso,
      nomeArquivo: nomeArquivo
    };
  }

  async getTotalCasosNoAno() {
    Logger.info('Requisição para obter total de casos no ano');
    const totalCasos = await this.casoController.getTotalCasosNoAno();
    return {
      success: true,
      totalCasos
    };
  }

  async getTotalCasosNoAnoFiltrado(regioes: string[], dataInicio?: string, dataFim?: string) {
    Logger.info('Requisição para obter total de casos no ano filtrado', regioes);
    const totalCasos = await this.casoController.getTotalCasosNoAnoFiltrado(regioes, dataInicio, dataFim);
    return {
      success: true,
      totalCasos
    };
  }

  async getEnderecosAssistidasFiltrado(dataInicio?: string, dataFim?: string) {
    Logger.info('Requisição para obter endereços filtrados');
    const enderecos = await this.casoController.getEnderecosAssistidasFiltrado(dataInicio, dataFim);
    return {
      success: true,
      enderecos
    };
  }

  async getTotalCasosFiltrado(regioes: string[], dataInicio?: string, dataFim?: string) {
    Logger.info('Requisição para obter total de casos filtrado');
    const total = await this.casoController.getTotalCasosFiltrado(regioes, dataInicio, dataFim);
    return {
      success: true,
      totalCasos: total
    };
  }

  async salvarBD(dados: any) {
    Logger.info('Requisição para salvar caso no banco de dados via Repository');
    
    // 1. Processar anexos - converter caminhos para Buffer
    let anexosProcessados: any[] = [];
    
    if (dados.caso.anexos && Array.isArray(dados.caso.anexos)) {
      for (const caminhoArquivo of dados.caso.anexos) {
        try {
          if (typeof caminhoArquivo === 'string' && fs.existsSync(caminhoArquivo)) {
            const buffer = fs.readFileSync(caminhoArquivo);
            const nomeArquivo = path.basename(caminhoArquivo);
            const tipoArquivo = this.getTipoMIME(nomeArquivo);
            const tamanhoArquivo = buffer.length;
            
            anexosProcessados.push({
              nome: nomeArquivo,
              tipo: tipoArquivo,
              tamanho: tamanhoArquivo,
              dados: buffer
            });
            
            Logger.info(`Anexo processado: ${nomeArquivo} (${tamanhoArquivo} bytes)`);
          }
        } catch (erro) {
          Logger.error(`Erro ao processar anexo ${caminhoArquivo}:`, erro);
        }
      }
    }
    
    // 2. Criar o objeto Caso
    const casoCriado = this.casoController.handlerCriarCaso({
      nomeAssistida: dados.assistida.nome,
      idadeAssistida: dados.assistida.idade,
      identidadeGenero: dados.assistida.identidadeGenero || '',
      nomeSocial: dados.assistida.nomeSocial || '',
      endereco: dados.assistida.endereco,
      escolaridade: dados.assistida.escolaridade || '',
      religiao: dados.assistida.religiao || '',
      nacionalidade: dados.assistida.nacionalidade,
      zonaHabitacao: dados.assistida.zonaHabitacao || '',
      profissao: dados.assistida.profissao,
      limitacaoFisica: dados.assistida.limitacaoFisica || '',
      numeroCadastroSocial: dados.assistida.numeroCadastroSocial || '',
      quantidadeDependentes: dados.assistida.quantidadeDependentes || 0,
      temDependentes: dados.assistida.temDependentes || false,
      ...dados.caso,
      anexos: anexosProcessados,
      data: dados.data,
      profissionalResponsavel: dados.profissionalResponsavel,
      descricao: ''
    });
    
    // 3. Salvar no BD
    let resultado;
    if (dados.idAssistidaExistente) {
      Logger.info(`Salvando novo caso para assistida existente ID: ${dados.idAssistidaExistente}`);
      resultado = await this.casoRepository.salvarComAssistidaExistente(casoCriado, dados.idAssistidaExistente, dados.caso);
    } else {
      Logger.info('Salvando novo caso com nova assistida');
      resultado = await this.casoRepository.salvar(casoCriado, dados.caso);
    }
    
    Logger.info('Caso salvo com sucesso no BD com ID:', resultado.idCaso);
    return {
      success: true,
      idCaso: resultado.idCaso,
      idAssistida: resultado.idAssistida
    };
  }

  async recuperarAnexos(idCaso: number) {
    const anexos = await this.casoController.handlerRecuperarAnexosDoCaso(idCaso);
    
    const anexosConvertidos = anexos.map((anexo: any) => {
      return {
        idAnexo: anexo.getIdAnexo?.(),
        nomeAnexo: anexo.getNomeAnexo?.(),
        tamanho: anexo.getTamanho?.(),
        tipo: anexo.getTipo?.(),
        relatorio: (anexo as any).relatorio || false
      };
    });

    return {
      success: true,
      anexos: anexosConvertidos
    };
  }

  async salvarAnexo(anexo: any, idCaso: number, idAssistida: number) {
    Logger.info(`Requisição para salvar anexo do caso ${idCaso}`);
    
    let anexoParaSalvar = { ...anexo };
    
    if (anexoParaSalvar.dados) {
      let buffer: Buffer;
      
      if (Buffer.isBuffer(anexoParaSalvar.dados)) {
        buffer = anexoParaSalvar.dados;
      } else if (anexoParaSalvar.dados instanceof Uint8Array) {
        buffer = Buffer.from(anexoParaSalvar.dados);
      } else if (typeof anexoParaSalvar.dados === 'string') {
        buffer = Buffer.from(anexoParaSalvar.dados, 'utf-8');
      } else if (Array.isArray(anexoParaSalvar.dados)) {
        buffer = Buffer.from(anexoParaSalvar.dados);
      } else {
        buffer = Buffer.from(Object.values(anexoParaSalvar.dados));
      }
      
      anexoParaSalvar.dados = '\\x' + buffer.toString('hex');
    } else {
      anexoParaSalvar.dados = null;
    }
    
    const { success, idAnexo } = await this.casoController.handlerSalvarAnexo(anexoParaSalvar, idCaso, idAssistida);
    
    if (success) {
      Logger.info(`Anexo '${anexo.nome}' salvo no caso ${idCaso} (ID ${idAnexo})`);
    }
    
    return {
      success,
      idAnexo: idAnexo ?? undefined,
      message: success ? 'Anexo salvo com sucesso' : 'Falha ao salvar anexo'
    };
  }

  async preview(dados: any) {
    Logger.info('Gerando preview do caso...');
    const pdfPath = await this.casoController.handlerPreviewCaso(dados);
    return { success: true, path: pdfPath };
  }

  private getTipoMIME(nomeArquivo: string): string {
    const extensao = path.extname(nomeArquivo).toLowerCase();
    const tiposMIME: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.txt': 'text/plain',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    return tiposMIME[extensao] || 'application/octet-stream';
  }
}
