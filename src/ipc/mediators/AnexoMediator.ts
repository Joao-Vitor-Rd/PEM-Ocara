import { Logger } from '../../utils/Logger';
import { AnexoRepositorioPostgres } from '../../repository/AnexoRepositorioPostgres';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export class AnexoMediator {
  constructor(private anexoRepository: AnexoRepositorioPostgres) {}

  async download(idAnexo: string, nomeArquivo: string) {
    try {
      Logger.info(`Requisição para baixar anexo: ${idAnexo} - ${nomeArquivo}`);
      
      const anexo = await this.anexoRepository.getAnexoById(parseInt(idAnexo));
      
      if (!anexo) {
        return {
          success: false,
          error: 'Anexo não encontrado'
        };
      }
      
      const dadosAnexo = anexo.getDados();
      let buffer: Buffer;
      
      if (!dadosAnexo) {
        return {
          success: false,
          error: 'Anexo sem dados no banco de dados'
        };
      }
      
      if (typeof dadosAnexo === 'string' && dadosAnexo.startsWith('\\x')) {
        const hexPart = dadosAnexo.slice(2);
        buffer = Buffer.from(hexPart, 'hex');
      } else if (Buffer.isBuffer(dadosAnexo)) {
        buffer = dadosAnexo;
      } else if (dadosAnexo instanceof Uint8Array) {
        buffer = Buffer.from(dadosAnexo);
      } else if (Array.isArray(dadosAnexo)) {
        buffer = Buffer.from(dadosAnexo);
      } else if (typeof dadosAnexo === 'string') {
        buffer = Buffer.from(dadosAnexo, 'utf-8');
      } else {
        buffer = Buffer.from(dadosAnexo);
      }
      
      if (!buffer || buffer.length === 0) {
        throw new Error('Buffer vazio após conversão');
      }
      
      const downloadsPath = path.join(os.homedir(), 'Downloads', nomeArquivo);
      
      const downloadsDir = path.dirname(downloadsPath);
      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }
      
      fs.writeFileSync(downloadsPath, buffer);
      
      Logger.info(`Arquivo '${nomeArquivo}' baixado com sucesso`);
      
      return {
        success: true,
        message: `Arquivo baixado com sucesso em: ${downloadsPath}`,
        path: downloadsPath
      };
    } catch (error) {
      Logger.error('Erro ao baixar anexo:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao baixar anexo'
      };
    }
  }
}
