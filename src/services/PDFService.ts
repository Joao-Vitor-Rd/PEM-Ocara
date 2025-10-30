import * as pdfMake from 'pdfmake/build/pdfmake';
import type { TDocumentDefinitions } from 'pdfmake/interfaces'; 
import { Assistida } from '../models/assistida/Assistida';

export class PdfService {
  criarPdf(assistida: Assistida) {
    const { getNome, getIdade, getIdentidadeGenero, getNomeSocial, getEndereco, getEscolaridade, 
            getReligiao, getNacionalidade, getZonaHabitacao, getProfissao, getLimitacaoFisica, 
            getNumeroCadastroSocial, getTemDependentes } = assistida;

    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Formulário de Atendimento', style: 'header' },
        { text: `Nome da Assistida: ${getNome()}`, style: 'subheader' },
        { text: `Idade: ${getIdade()}`, style: 'subheader' },
        { text: `Identidade de Gênero: ${getIdentidadeGenero()}`, style: 'subheader' },
        { text: `Nome Social: ${getNomeSocial()}`, style: 'subheader' },
        { text: `Endereço: ${getEndereco()}`, style: 'subheader' },
        { text: `Escolaridade: ${getEscolaridade()}`, style: 'subheader' },
        { text: `Religião: ${getReligiao()}`, style: 'subheader' },
        { text: `Nacionalidade: ${getNacionalidade()}`, style: 'subheader' },
        { text: `Zona de Habitação: ${getZonaHabitacao()}`, style: 'subheader' },
        { text: `Profissão: ${getProfissao()}`, style: 'subheader' },
        { text: `Limitação Física: ${getLimitacaoFisica()}`, style: 'subheader' },
        { text: `Número de Cadastro Social: ${getNumeroCadastroSocial()}`, style: 'subheader' },
        { text: `Tem Dependentes: ${getTemDependentes() ? 'Sim' : 'Não'}`, style: 'subheader' },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          margin: [0, 5],
        },
        sectionHeader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10],
        },
        bodyText: {
          fontSize: 12,
          margin: [0, 5],
        },
      },
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
    };

    pdfMake.createPdf(docDefinition).download(`${getNome()}_atendimento.pdf`);
  }
}