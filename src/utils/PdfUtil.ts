import PdfPrinter from 'pdfmake';
import fs from 'fs'
import path from 'path';
import { Assistida } from '../models/assistida/Assistida'
import { app } from 'electron';

export class PdfUtil {
  
  private printer: PdfPrinter;

  constructor() {
    const fontsPath = path.resolve(app.getAppPath(), 'assets', 'fonts');
    const fonts = {
      Roboto: {
        normal: path.join(fontsPath, 'Roboto-Regular.ttf'),
        bold: path.join(fontsPath, 'Roboto-Medium.ttf'),
        italics: path.join(fontsPath, 'Roboto-Italic.ttf'),
        bolditalics: path.join(fontsPath, 'Roboto-MediumItalic.ttf')
      },
    };
    this.printer = new PdfPrinter(fonts);
  }

  private renderCampo(label: string, value: any, options = {}) {
    const BORDAS_LABEL = [true, true, false, true];
    const BORDAS_VALUE = [false, true, true, true];

    return [
      {text: label, style: 'label', border: BORDAS_LABEL},
      {text: value || '', style: 'value', border: BORDAS_VALUE, ...options},
    ];
}
  private renderCheckbox(label: string, checked: boolean) {
    return {
      columns: [
        { text: checked ? '(X)' : '()', width: '20' },
        { text: label }
      ],
      margin: [0, 2],
    };
}

  public async gerarPDFFormulario(assistida: Assistida): Promise<string> {
    const tabelaIndentificacao = {
      table: {
        widths: ['auto', '*'],
        body: [
          [
            {
              stack: [ this.renderCampo('NOME:', assistida.getNome()) ],
              border: [true, true, false, true],
            },
            {
              stack: [ this.renderCampo('IDADE:', assistida.getIdade()) ],
              border: [false, true, true, true],
            }
          ],
          this.renderCampo('ENDEREÇO:', assistida.getEndereco()),
          [
            {
              stack: [ this.renderCampo('IDENTIDADE DE GÊNERO:', assistida.getIdentidadeGenero()[0]) ],
              border: [true, true, false, true],
            },
            {
              stack: [ this.renderCampo('NOME SOCIAL:', assistida.getNomeSocial()[1]) ],
              border: [false, true, true, true],
            },
            {
              stack: [ this.renderCampo('ESCOLARIDADE:', assistida.getEscolaridade()[1]) ],
              border: [true, true, false, true],
            },
            {
              stack: [ this.renderCampo('RELIGIÃO:', assistida.getReligiao()[0]) ],
              border: [false, true, true, true],
            },
            {
              stack: [ this.renderCampo('NACIONALIDADE:', assistida.getNacionalidade()[1]) ],
              border: [true, true, false, true],
              padding: [5, 5, 5, 5],
            },
            {
              stack: [
                {text: 'ZONA DE HABITAÇÃO:', style: 'label' },
                this.renderCheckbox('RURAL', assistida.getZonaHabitacao() === 'RURAL'),
                this.renderCheckbox('URBANA', assistida.getZonaHabitacao() === 'URBANA'),
              ],
              border: [false, true, true, true],
              padding: [5, 5, 5, 5],
            },
          ],
          [
            this.renderCampo('PROFISSÃO/OCUPAÇÃO:', assistida.getProfissao()),
          ],
          [
            {
              stack: [
                {text: 'POSSUI ALGUMA LIMITAÇÃO FÍSICA:', style: 'label' },
                this.renderCheckbox('SIM', assistida.getLimitacaoFisica() != ''),
                this.renderCheckbox('NÃO', assistida.getLimitacaoFisica() == ''),
              ],
              border: [true, true, false, true],
              padding: [5, 5, 5, 5],
            },
            {
              stack: [
                {text: 'SE SIM, QUAL?:', style: 'label' },
                { text: assistida.getLimitacaoFisica(), style: 'value' }
              ],
              border: [false, true, true, true],
              padding: [5, 5, 5, 5],
            },
          ],
          [
            this.renderCampo('NÚMERO DE CADASTRO EM PROGRAMA SOCIAL:', assistida.getNumeroCadastroSocial()),
          ],
          [
            {
              stack: [
                {text: 'POSSUI DEPENDENTES:', style: 'label' },
                this.renderCheckbox('SIM', assistida.getTemDependentes()),
                this.renderCheckbox('NÃO', !assistida.getTemDependentes()),
              ],
              border: [true, true, false, true],
              padding: [5, 5, 5, 5],
            },
            {
              stack: [
                {text: 'SE SIM, QUANTOS?:', style: 'label' },
                { text: assistida.getQuantidadeDependentes(), style: 'value' }
              ],
              border: [false, true, true, true],
              padding: [5, 5, 5, 5],
            },
          ]
        ]
    },
    layout: {
      hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? 1 : 0.5,
        vLineWidth: (i: number, node: any) => (i === 0 || i === node.table.widths.length) ? 1 : 0.5,
        hLineColor: (i: number) => '#b0b0b0',
        vLineColor: (i: number) => '#b0b0b0',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        paddingRight: 4,
    }
  };
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'FORMULÁRIO DE ATENDIMENTO PROCURADORIA ESPECIAL DA MULHER DE OCARA', style: 'title' },
        { text: 'IDENTIFICAÇÃO DA ASSISTIDA', style: 'selectionHeader' },
        tabelaIndentificacao,
      ],
      styles: {/*estilos do pdf*/},
      defaultStyle: {font: 'Roboto'},
    };
    const filePath = path.resolve(__dirname, `../../temp/formulario_assistida_${assistida.getNome().replace(/ /g, '_')}.pdf`);
    const pdfDoc = this.printer.createPdfKitDocument(docDefinition);

    return new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(filePath);
      pdfDoc.pipe(stream);
      pdfDoc.end();
      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    });
  }
}