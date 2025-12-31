import { Logger } from '../../utils/Logger';
import { HtmlFormatter } from '../../utils/HtmlFormatter';
import { ControladorCredencial } from '../../controllers/ControladorCredencial';
import { ControladorOrgao } from '../../controllers/ControladorOrgao';
import { AnexoRepositorioPostgres } from '../../repository/AnexoRepositorioPostgres';
import { ICasoRedeApoioContatoRepository } from '../../repository/ICasoRedeApoioContatoRepository';

export class EncaminhamentoMediator {
  constructor(
    private credencialController: ControladorCredencial,
    private orgaoController: ControladorOrgao,
    private anexoRepository: AnexoRepositorioPostgres,
    private casoRedeApoioContatoRepository: ICasoRedeApoioContatoRepository
  ) {}

  async enviarEmail(dados: any) {
    try {
      Logger.info('Requisição para enviar e-mail de encaminhamento:', dados?.idCaso);

      const idCaso = Number(dados?.idCaso);
      const idRedeDestino = Number(dados?.idRedeDestino);

      if (!Number.isInteger(idCaso) || idCaso <= 0) {
        return { success: false, error: 'Caso inválido para envio de encaminhamento.' };
      }

      if (!Number.isInteger(idRedeDestino) || idRedeDestino <= 0) {
        return { success: false, error: 'Selecione uma rede de apoio válida.' };
      }

      const orgaos = await this.orgaoController.listarOrgaos();
      const redeDestino = orgaos.find(orgao => (orgao.getId?.() ?? 0) === idRedeDestino);

      if (!redeDestino) {
        return { success: false, error: 'Rede de apoio não encontrada.' };
      }

      const emailDestino = redeDestino.getEmail?.();
      if (!emailDestino) {
        return { success: false, error: 'O órgão selecionado não possui e-mail cadastrado.' };
      }

      const anexosIds = Array.isArray(dados?.anexosIds) ? dados.anexosIds : [];
      const anexosEmail: any[] = [];

      for (const anexoIdRaw of anexosIds) {
        const anexoId = Number(anexoIdRaw);
        if (!Number.isInteger(anexoId) || anexoId <= 0) {
          continue;
        }

        const anexo = await this.anexoRepository.getAnexoById(anexoId);
        if (!anexo) {
          Logger.warn(`Anexo ${anexoId} não encontrado para envio.`);
          continue;
        }

        const buffer = this.converterDadosAnexoParaBuffer(anexo.getDados?.());
        if (!buffer) {
          Logger.warn(`Não foi possível converter os dados do anexo ${anexoId} para envio.`);
          continue;
        }

        anexosEmail.push({
          filename: anexo.getNomeAnexo?.() || `anexo-${anexoId}`,
          content: buffer,
          contentType: anexo.getTipo?.() || undefined
        });
      }

      const anexosTemporarios = Array.isArray(dados?.arquivosTemporarios) ? dados.arquivosTemporarios : [];
      for (const [indexTemporario, arquivoTemporario] of anexosTemporarios.entries()) {
        try {
          const bufferTemporario = this.converterDadosAnexoParaBuffer(arquivoTemporario?.dados);
          if (!bufferTemporario || bufferTemporario.length === 0) {
            Logger.warn('Anexo temporário vazio ignorado.');
            continue;
          }

          anexosEmail.push({
            filename: arquivoTemporario?.nome || `anexo-temporario-${indexTemporario + 1}`,
            content: bufferTemporario,
            contentType: arquivoTemporario?.tipo || undefined
          });
        } catch (erroTemp) {
          Logger.warn('Falha ao preparar anexo temporário para envio:', erroTemp);
        }
      }

      const assunto = (dados?.assunto ?? '').trim() || `Encaminhamento do Caso #${idCaso}`;
      const corpoHtml = HtmlFormatter.formatarCorpoEmailHTML(dados?.mensagem ?? '');

      const resultadoEnvio = await this.credencialController.enviarEmailInstitucional({
        destinatario: emailDestino,
        assunto,
        corpoHtml,
        anexos: anexosEmail
      });

      if (!resultadoEnvio.success) {
        return { success: false, error: resultadoEnvio.error ?? 'Falha ao enviar o e-mail.' };
      }

      if (this.casoRedeApoioContatoRepository) {
        try {
          await this.casoRedeApoioContatoRepository.registrarContato({
            idCaso,
            emailRede: emailDestino,
            assunto,
            mensagem: dados?.mensagem ?? '',
            dataEnvio: new Date()
          });
        } catch (erroRegistro) {
          Logger.warn('Falha ao registrar a rede de apoio contatada:', erroRegistro);
        }
      }

      Logger.info(`E-mail de encaminhamento enviado com sucesso para ${emailDestino} (caso ${idCaso}).`);
      return {
        success: true,
        dados: {
          destinatario: emailDestino,
          orgaoDestino: redeDestino.getNome?.(),
          anexosEnviados: anexosEmail.length
        }
      };
    } catch (error) {
      Logger.error('Erro ao enviar e-mail de encaminhamento:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao enviar o e-mail.'
      };
    }
  }

  async listarRedesContatadas(payload: any) {
    try {
      if (!this.casoRedeApoioContatoRepository) {
        return { success: false, error: 'Repositório de contatos não está disponível.' };
      }

      let idCaso: number;
      if (typeof payload === 'number') {
        idCaso = payload;
      } else {
        idCaso = Number(payload?.idCaso);
      }

      if (!Number.isInteger(idCaso) || idCaso <= 0) {
        return { success: false, error: 'Caso inválido para consulta.' };
      }

      const redes = await this.casoRedeApoioContatoRepository.obterNomesRedesContatadas(idCaso);
      return {
        success: true,
        redes
      };
    } catch (error) {
      Logger.error('Erro ao listar redes contatadas:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao listar redes contatadas.'
      };
    }
  }

  private converterDadosAnexoParaBuffer(dados: any): Buffer | null {
    if (!dados) {
      return null;
    }

    if (Buffer.isBuffer(dados)) {
      return dados;
    }

    if (dados instanceof Uint8Array) {
      return Buffer.from(dados);
    }

    if (Array.isArray(dados)) {
      return Buffer.from(dados);
    }

    if (typeof dados === 'string') {
      if (dados.startsWith('\\x')) {
        return Buffer.from(dados.slice(2), 'hex');
      }
      return Buffer.from(dados, 'utf-8');
    }

    if (typeof dados === 'object') {
      return Buffer.from(Object.values(dados));
    }

    return null;
  }
}
