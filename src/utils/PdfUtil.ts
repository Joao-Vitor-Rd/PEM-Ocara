import { PdfService } from '../services/PDFService';
import { Assistida } from '../models/assistida/Assistida';

const assistida = new Assistida(
  'Maria Silva',
  34,
  'Feminino',
  'Maria',
  'Rua X, 123',
  'Ensino Superior',
  'Católica',
  'Brasileira',
  'Urbana',
  'Advogada',
  'Nenhuma',
  '123456',
  2,
  true,
);

const pdfService = new PdfService();
pdfService.criarPdf(assistida);
