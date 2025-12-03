import PdfPrinter from 'pdfmake';
import fs from 'fs';
import path from 'path';
import { Assistida } from '../models/assistida/Assistida'
import { app } from 'electron';



//indentificação da assistida
export interface IAtendimentoData {
  codigo: number;
  data: string;
  nucleo: 'JURIDICO' | 'PSICOSSOCIAL';
  responsavel: string;
}

//indentificação do agressor
export interface IAgressorData {
  nome: string;
  idade?: number;
  vinculo: string;
  dataFato: string;
}

//sobre o histórico de violência
export interface IBlocoIData {
  p_ameaca: 'ARMA_FOGO' | 'FACA' | 'OUTRA' | 'NAO';
  p_agressoes: {
    queimadura: boolean;
    enforcamento: boolean;
    sufocamento: boolean;
    tiro: boolean;
    afogamento: boolean;
    facada: boolean;
    paulada: boolean;
    nenhuma: boolean;
  };
  p2_agressoes: {
    socos: boolean;
    chutes: boolean;
    tapas: boolean;
    empurroes: boolean;
    puxoesCabelo: boolean;
    nenhuma: boolean;
  };
  p_sexoForcado: boolean;
  p_comportamentos: {
    frase_ameaca: boolean;
    perseguiu_vigiou: boolean;
    proibiu_visitas: boolean;
    proibiu_trabalhar: boolean;
    telefonemas_insistentes: boolean;
    impediu_dinheiro: boolean;
    ciume_excessivo: boolean;
    nenhum: boolean;
  };
  p_ocorrencia: boolean;
  p_agressoes_recentes: boolean;
}
//sobre o (a) agressor (a)
export interface IBlocoIIData {
  p_uso_drogas: {
    alcool: boolean;
    drogas: boolean;
    nao: boolean;
    nao_sei: boolean;
  };
  p_doenca_mental: 'SIM_MEDICACAO' | 'SIM_SEM_MEDICACAO' | 'NAO' | 'NAO_SEI';
  p_descumpriu_medida: boolean;
  p_tentou_suicidio: boolean;
  p_desempregado: 'SIM' | 'NAO' | 'NAO_SEI';
  p_acesso_arma: 'SIM' | 'NAO' | 'NAO_SEI';
  p_agrediu_outros: {
    sim: boolean;
    filhos: boolean;
    familiares: boolean;
    outras_pessoas: boolean;
    animais: boolean;
    nao: boolean;
    nao_sei: boolean;
  };
}

//sobre voce
export interface IBlocoIIIData {
  p_separacao_recente: 'SIM_SEPAREI' | 'SIM_TENTEI' | 'NAO';
  p_tem_filhos: {
    com_agressor: boolean;
    qtd_agressor: number;
    outro_relacionamen: boolean;
    qtd_relacionamen: number;
    nao: boolean;
  };
  p_faixa_etaria: {
    anos_0_11: boolean;
    anos_12_17: boolean;
    anos_18_mais: boolean;
  };
  p_filhos_deficiencia: {
    sim: boolean;
    qtd: number;
    nao: boolean;
  };
  p_conflito_filhos: {
    guarda: boolean;
    visitas: boolean;
    pensao: boolean;
    nao: boolean;
    nao_tem_filhos_com_agressor: boolean;
  };
  p_presenciaram: boolean;
  p_violencia_gravidez: boolean;
  p_novo_relacionamento: boolean;
  p_possui_deficiencia: {
    sim: boolean;
    qual: string;
    nao: boolean;
  };
  p_cor_raca: 'BRANCA' | 'PRETA' | 'PARDA' | 'AMARELA/ORIENTAL' | 'INDIGENA';
}

//Outras informações importantes
export interface IBlocoIVData {
  p_mora_risco: 'SIM' | 'NAO' | 'NAO_SEI';
  p_dependente: boolean;
  p_aceita_abrigamento: boolean;
}

//ultima pagina
export interface IPreenchimentoProfissional {
  assistida_respondeu: 'SEM_AJUDA' | 'COM_AUXILIO' | 'SEM_CONDICOES' | 'RECUSOU';
  terceiro_comunicante: boolean;
  tipos_violencia: {
    fisica: boolean;
    psicologica: boolean;
    moral: boolean;
    sexual: boolean;
    patrimonial: boolean;
  };
}

// Interface Mestre
export interface IFormularioCompleto {
  atendimento: IAtendimentoData;
  agressor: IAgressorData;
  blocoI: IBlocoIData;
  blocoII: IBlocoIIData;
  blocoIII: IBlocoIIIData;
  blocoIV: IBlocoIVData;
  outrasInformacoes: string;
  preenchimentoProfissional: IPreenchimentoProfissional;
}

export class PdfUtil {
  
  private printer: PdfPrinter;

  private layoutTabelaPadrao = {
    hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? 1 : 0.5,
    vLineWidth: (i: number, node: any) => (i === 0 || i === node.table.widths.length) ? 1 : 0.5,
    hLineColor: (i: number) => '#b0b0b0',
    vLineColor: (i: number) => '#b0b0b0',
    paddingTop: (i: number, node: any) => 4,
    paddingBottom: (i: number, node: any) => 4,
    paddingLeft: (i: number, node: any) => 4,
    paddingRight: (i: number, node: any) => 4,
  };

  constructor() {
    const fontsPath = app.isPackaged ? path.join(process.resourcesPath, 'assets', 'fonts') : path.resolve(app.getAppPath(), 'assets', 'fonts');
    const fonts = {
      Roboto: {
        normal: path.join(fontsPath, 'Roboto-Regular.ttf'),
        bold: path.join(fontsPath, 'Roboto-Medium.ttf'),
        italics: path.join(fontsPath, 'Roboto-Italic.ttf'),
        bolditalics: path.join(fontsPath, 'Roboto-MediumItalic.ttf'),
      },
    };
    this.printer = new PdfPrinter(fonts);
  }

  private renderCampo(label: string, value: any, options = {}) {
    const BORDAS_LABEL = [true, true, false, true]; // [L, T, R, B]
    const BORDAS_VALOR = [false, true, true, true];
    
    return [
      { text: label, style: 'label', border: BORDAS_LABEL, padding: 4 },
      { text: value || '', style: 'value', border: BORDAS_VALOR, ...options, padding: 4 },
    ];
  }

  private renderCheckbox(label: string, checked: boolean) {
    return {
      columns: [
        { text: checked ? '(X)' : '( )', width: 20 },
        { text: label, style: 'labelSmall' },
      ],
      margin: [0, 2],
    };
  }

  private renderPergunta(texto: string, style = 'pergunta') {
    return { text: texto, style: style, margin: [0, 5, 0, 5] };
  }

  public async gerarPdfFormulario(
    assistida: Assistida,
    data: IFormularioCompleto,
    customDirectory?: string
  ): Promise<string> {
    
    const { atendimento, agressor, blocoI, blocoII, blocoIII, blocoIV, outrasInformacoes, preenchimentoProfissional } = data;

    const blocoAtendimento = {
      table: {
        widths: ['*', '*'],
        body: [
          [
            { text: `CODIGO DA ASSISTIDA: ${assistida.getProtocolo()}`, style: 'label', border: [true, true, false, true], padding: 4 },
            { text: `DATA: ${atendimento.data}`, style: 'label', border: [false, true, true, true], padding: 4 }
          ],
          [
            { 
              stack: [
                { text: 'NÚCLEO DE ATENDIMENTO:', style: 'label' },
                this.renderCheckbox('JURÍDICO', atendimento.nucleo === 'JURIDICO'),
                this.renderCheckbox('PSICOSSOCIAL', atendimento.nucleo === 'PSICOSSOCIAL'),
              ],
              border: [true, true, true, true],
              colSpan: 2,
              padding: 4
            }
          ],
          [
            { text: `RESPONSÁVEL TÉCNICO: ${atendimento.responsavel}`, style: 'label', border: [true, false, true, true], colSpan: 2, padding: 4 }
          ]
        ]
      },
      layout: {
        hLineWidth: (i: number) => 1,
        vLineWidth: (i: number) => 1,
        hLineColor: () => '#000000',
        vLineColor: () => '#000000',
      }
    };

//IDENTIFICAÇÃO VÍTIMA
    const tabelaIdentificacao = {
      table: {
        widths: ['auto', '*'],
        body: [
          this.renderCampo('NOME:', assistida.getNome()),
          this.renderCampo('IDADE:', assistida.getIdade()),
          this.renderCampo('ENDEREÇO:', assistida.getEndereco()),
          [
            { 
              stack: [ this.renderCampo('IDENTIDADE DE GÊNERO:', assistida.getIdentidadeGenero())[0] ], 
              border: [true, true, false, true] 
            },
            { 
              stack: [ this.renderCampo('NOME SOCIAL:', assistida.getNomeSocial())[1] ],
              border: [false, true, true, true] 
            }
          ],
          [
            { 
              stack: [ this.renderCampo('ESCOLARIDADE:', assistida.getEscolaridade())[1] ],
              border: [true, true, false, true] 
            },
            { 
              stack: [ this.renderCampo('RELIGIÃO:', assistida.getReligiao())[0] ], 
              border: [false, true, true, true] 
            }
          ],
          [
            {
              stack: [ this.renderCampo('NACIONALIDADE:', assistida.getNacionalidade())[1] ],
              border: [true, true, false, true],
              padding: 5
            },
            {
              stack: [
                { text: 'ZONA DE HABITAÇÃO:', style: 'label' },
                this.renderCheckbox('RURAL', assistida.getZonaHabitacao().toUpperCase() === 'RURAL'),
                this.renderCheckbox('URBANA', assistida.getZonaHabitacao().toUpperCase() === 'URBANA'),
              ],
              border: [false, true, true, true],
              padding: 5
            },
          ],
          this.renderCampo('PROFISSÃO/OCUPAÇÃO:', assistida.getProfissao()),
          [
            {
              stack: [
                { text: 'POSSUI ALGUMA LIMITAÇÃO FÍSICA:', style: 'label' },
                this.renderCheckbox('SIM', assistida.getLimitacaoFisica() !== ''),
                this.renderCheckbox('NÃO', assistida.getLimitacaoFisica() === ''),
              ],
              border: [true, true, false, true],
              padding: 5
            },
            { 
              stack: [
                { text: 'SE SIM, QUAL?', style: 'label' },
                { text: assistida.getLimitacaoFisica(), style: 'value' } 
              ],
              border: [false, true, true, true],
              padding: 5
            }
          ],
          this.renderCampo('NÚMERO DE CADASTRO EM PROGRAMA SOCIAL:', assistida.getNumeroCadastroSocial()),
          [
            {
              stack: [
                { text: 'POSSUI DEPENDENTES:', style: 'label' },
                this.renderCheckbox('SIM', assistida.getTemDependentes()),
                this.renderCheckbox('NÃO', !assistida.getTemDependentes()),
              ],
              border: [true, true, false, true],
              padding: 5
            },
            {
              stack: [ this.renderCampo('SE SIM, QUANTOS?', assistida.getTemDependentes() ? assistida.getQuantidadeDependentes() : '')[1] ],
              border: [false, true, true, true],
              padding: 5
            }
          ]
        ]
      },
      layout: this.layoutTabelaPadrao
    };

//IDENTIFICAÇÃO AGRESSOR
    const tabelaAgressor = {
      table: {
        widths: ['auto', '*'],
        body: [
          [ 
            { 
              stack: [ this.renderCampo('NOME DO AGRESSOR:', agressor.nome)[0] ], 
              border: [true, true, false, true] 
            },
            { 
              stack: [ this.renderCampo('IDADE:', agressor.idade)[1] ], 
              border: [false, true, true, true] 
            }
          ],
          this.renderCampo('VÍNCULO ENTRE A ASSISTIDA E O AGRESSOR:', agressor.vinculo),
          this.renderCampo('DATA DO FATO OCORRIDO:', agressor.dataFato)
        ]
      },
      layout: this.layoutTabelaPadrao
    };

//SOBRE HISTÓRICO DE VIOLÊNCIA
    const blocoI_Conteudo = {
      table: {
        widths: ['*', 220], 
        body: [
          [
            this.renderPergunta('01 - O (A) AGRESSOR (A) JÁ AMEAÇOU VOCÊ OU ALGUM FAMILIAR COM A FINALIDADE DE ATINGI-LA?'),
            {
              stack: [
                this.renderCheckbox('SIM, UTILIZANDO ARMA DE FOGO', blocoI.p_ameaca === 'ARMA_FOGO'),
                this.renderCheckbox('SIM, UTILIZANDO FACA', blocoI.p_ameaca === 'FACA'),
                this.renderCheckbox('SIM, DE OUTRA FORMA', blocoI.p_ameaca === 'OUTRA'),
                this.renderCheckbox('NÃO', blocoI.p_ameaca === 'NAO'),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('02 - O (A) AGRESSOR (A) JÁ PRATICOU ALGUMA (S) DESTAS AGRESSÕES FÍSICAS COM VOCÊ?'),
            {
              stack: [
                this.renderCheckbox('QUEIMADURA', blocoI.p_agressoes.queimadura),
                this.renderCheckbox('ENFORCAMENTO', blocoI.p_agressoes.enforcamento),
                this.renderCheckbox('SUFOCAMENTO', blocoI.p_agressoes.sufocamento),
                this.renderCheckbox('TIRO', blocoI.p_agressoes.tiro),
                this.renderCheckbox('AFOGAMENTO', blocoI.p_agressoes.afogamento),
                this.renderCheckbox('FACADA', blocoI.p_agressoes.facada),
                this.renderCheckbox('PAULADA', blocoI.p_agressoes.paulada),
                this.renderCheckbox('NENHUMA DAS AGRESSÕES ACIMA', blocoI.p_agressoes.nenhuma),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('03 - O (A) AGRESSOR (A) JÁ PRATICOU ALGUMA (S) DESTAS OUTRAS AGRESSÕES FÍSICAS CONTRA VOCÊ?'),
            {
              stack: [
                this.renderCheckbox('SOCOS', blocoI.p2_agressoes.socos),
                this.renderCheckbox('CHUTES', blocoI.p2_agressoes.chutes),
                this.renderCheckbox('TAPAS', blocoI.p2_agressoes.tapas),
                this.renderCheckbox('EMPURRÕES', blocoI.p2_agressoes.empurroes),
                this.renderCheckbox('PUXÕES DE CABELO', blocoI.p2_agressoes.puxoesCabelo),
                this.renderCheckbox('NENHUMA DAS AGRESSÕES ACIMA', blocoI.p2_agressoes.nenhuma),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('04 - O (A) AGRESSOS (A) JA OBRIGOU VOCÊ A FAZER SEXO OU A PRATICAR ATOS SEXUAIS CONTRA A SUA VONTADE:'),
            {
              stack: [
                this.renderCheckbox('SIM', blocoI.p_sexoForcado === true),
                this.renderCheckbox('NÃO', blocoI.p_sexoForcado === false),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('05 - O (A) AGRESSOR (A) JÁ TEVE ALGUM DESTES COMPORTAMENTOS?'),
            {
              stack: [
                this.renderCheckbox('DISSE ALGO PARECIDO COM A FRASE "SE NÃO FOR MINHA, NÃO SERÁ DE MAIS NINGUÉM"', blocoI.p_comportamentos.ciume_excessivo),
                this.renderCheckbox('PERTURBOU, PERSEGUIU OU VIGIOU VOCÊ NOS LOCAIS EM QUE FREQUENTA', blocoI.p_comportamentos.perseguiu_vigiou),
                this.renderCheckbox('PROIBIU VOCÊ DE VISITAR FAMILIARES OU AMIGOS', blocoI.p_comportamentos.proibiu_visitas),
                this.renderCheckbox('PROIBIU VOCÊ DE TRABALHAR OU ESTUDAR', blocoI.p_comportamentos.proibiu_trabalhar),
                this.renderCheckbox('FEZ TELEFONEMAS, ENVIOU MENSAGENS PELO CELULAR, OU E-MAILS DE FORMA INSISTENTE', blocoI.p_comportamentos.telefonemas_insistentes),
//QUEBRA DE PÁGINA
                this.renderCheckbox('IMPEDIU VOCÊ DE TER ACESSO A DINHEIRO, CONTA BANCÁRIA OU OUTROS BENS (COMO DOCUMENTOS PESSOAIS, CARRO)', blocoI.p_comportamentos.impediu_dinheiro),
                this.renderCheckbox('TEVE OUTROS COMPORTAMENTOS DE CIÚME EXCESSIVO E DE CONTROLE SOBRE VOCÊ', blocoI.p_comportamentos.ciume_excessivo),
                this.renderCheckbox('NENHUM DOS COMPORTAMENTOS ACIMA CITADOS', blocoI.p_comportamentos.nenhum),
              ],
              padding: 4
            }
          ],
          
          [
            this.renderPergunta('06 - VOCÊ JÁ REGISTROU OCORRÊNCIA POLICIAL OU FORMULOU PEDIDO DE MEDIDA PROTETIVA DE URGÊNCIA ENVOLVENDO A MESMA PESSOA?'),
            {
              stack: [
                this.renderCheckbox('SIM', blocoI.p_ocorrencia === true),
                this.renderCheckbox('NÃO', blocoI.p_ocorrencia === false),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('07 - AS AMEAÇAS OU AGRESSÕES DO (A) AGRESSOR (A) CONTRA VOCÊ, SE TORNARAM MAIS FREQUENTES OU MAIS GRAVES NOS ÚLTIMOS MESES?'),
            {
              stack: [
                this.renderCheckbox('SIM', blocoI.p_agressoes_recentes === true),
                this.renderCheckbox('NÃO', blocoI.p_agressoes_recentes === false),
              ],
              padding: 4
            }
          ],
        ]
      },
      layout: this.layoutTabelaPadrao
    };
    
//SOBRE O (A) AGRESSOR (A)
    const blocoII_Conteudo = {
      table: {
        widths: ['*', 220], 
        body: [
          [
            this.renderPergunta('08 - O (A) AGRESSOR (A) JÁ FEZ USO ABUSIVO DE ÁLCOOL OU DE DROGAS?'),
            {
              stack: [
                this.renderCheckbox('SIM, DE ÁLCOOL', blocoII.p_uso_drogas.alcool),
                this.renderCheckbox('SIM, DE DROGAS', blocoII.p_uso_drogas.drogas),
                this.renderCheckbox('NÃO', blocoII.p_uso_drogas.nao),
                this.renderCheckbox('NÃO SEI', blocoII.p_uso_drogas.nao_sei),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('09 - O (A) AGRESSOR (A) TEM ALGUMA DOENÇA MENTAL COMPROVADA POR AVALIAÇÃO MÉDICA?'),
            {
              stack: [
                this.renderCheckbox('SIM, E FAZ USO DE MEDICAÇÃO', blocoII.p_doenca_mental === 'SIM_MEDICACAO'),
                this.renderCheckbox('SIM, E NÃO FAZ USO DE MEDICAÇÃO', blocoII.p_doenca_mental === 'SIM_SEM_MEDICACAO'),
                this.renderCheckbox('NÃO', blocoII.p_doenca_mental === 'NAO'),
                this.renderCheckbox('NÃO SEI', blocoII.p_doenca_mental === 'NAO_SEI'),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('10 - O (A) AGRESSOR (A) JÁ DESCUMPRIU MEDIDA PROTETIVA ANTERIORMENTE?'),
            {
              stack: [
                this.renderCheckbox('SIM', blocoII.p_descumpriu_medida === true),
                this.renderCheckbox('NÃO', blocoII.p_descumpriu_medida === false),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('11 - O (A) AGRESSOR (A) JA TENTOU SUICÍDIO OU FALOU EM SUICIDAR-SE?'),
            {
              stack: [
                this.renderCheckbox('SIM', blocoII.p_tentou_suicidio === true),
                this.renderCheckbox('NÃO', blocoII.p_tentou_suicidio === false),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('12 - O (A) AGRESSOR (A) ESTÁ DESEMPREGADO OU TEM DIFICULDADES FINANCEIRAS?'),
            {
              stack: [
                this.renderCheckbox('SIM', blocoII.p_desempregado === 'SIM'),
                this.renderCheckbox('NÃO', blocoII.p_desempregado === 'NAO'),
                this.renderCheckbox('NÃO SEI', blocoII.p_desempregado === 'NAO_SEI'),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('13 - O (A) AGRESSOR (A) TEM ACESSO A ARMAS DE FOGO?'),
            {
              stack: [
                this.renderCheckbox('SIM', blocoII.p_acesso_arma === 'SIM'),
                this.renderCheckbox('NÃO', blocoII.p_acesso_arma === 'NAO'),
                this.renderCheckbox('NÃO SEI', blocoII.p_acesso_arma === 'NAO_SEI'),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('14 - O (A) AGRESSOR (A) JÁ AMEAÇOU E/OU AGREDIU SEUS FILHOS, OUTROS FAMILIARES, AMIGOS, COLEGAS DE TRABALHO, PESSOAS DESCONHECIDAS OU ANIMAIS DE ESTIMAÇÃO?'),
            {
              stack: [
                this.renderCheckbox('SIM', blocoII.p_agrediu_outros.sim),
                { text: 'SE SIM, ESPECIFIQUE:', style: 'labelSmall', margin: [10, 0] },
                this.renderCheckbox('FILHOS', blocoII.p_agrediu_outros.filhos),
                this.renderCheckbox('OUTROS FAMILIARES', blocoII.p_agrediu_outros.familiares),
                this.renderCheckbox('OUTRAS PESSOAS', blocoII.p_agrediu_outros.outras_pessoas),
                this.renderCheckbox('ANIMAIS', blocoII.p_agrediu_outros.animais),
                this.renderCheckbox('NÃO', blocoII.p_agrediu_outros.nao),
                this.renderCheckbox('NÃO SEI', blocoII.p_agrediu_outros.nao_sei),
              ],
              padding: 4
            }
          ],
        ]
      },
      layout: this.layoutTabelaPadrao
    };

    const blocoIII_Conteudo = {
      table: {
        widths: ['*', 220],
        body: [
          [
            this.renderPergunta('15 - VOCÊ SE SEPAROU RECENTEMENTE DO (A) AGRESSOR (A), OU TENTOU SE SEPARAR?'),
            {
              stack: [
                this.renderCheckbox('SIM, ME SEPAREI', blocoIII.p_separacao_recente === 'SIM_SEPAREI'),
                this.renderCheckbox('SIM, TENTEI ME SEPARAR', blocoIII.p_separacao_recente === 'SIM_TENTEI'),
                this.renderCheckbox('NÃO', blocoIII.p_separacao_recente === 'NAO'),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('16 - VOCÊ TEM FILHO (S)?'),
            {
              stack: [
                this.renderCheckbox(`SIM, COM O AGRESSOR. QUANTOS? ${blocoIII.p_tem_filhos.qtd_agressor}`, blocoIII.p_tem_filhos.com_agressor),
                this.renderCheckbox(`SIM, DE OUTRO RELACIONAMENTO. QUANTOS? ${blocoIII.p_tem_filhos.qtd_relacionamen}`, blocoIII.p_tem_filhos.outro_relacionamen),
                this.renderCheckbox('NÃO', blocoIII.p_tem_filhos.nao),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('16.01 - SE SIM, ASSINALE A FAIXA ETÁRIA DE SEUS FILHOS. SE TIVER MAIS DE UM FILHO, PODE ASSINALAR MAIS DE UMA OPÇÃO:'),
            {
              stack: [
                this.renderCheckbox('0 A 11 ANOS', blocoIII.p_faixa_etaria.anos_0_11),
                this.renderCheckbox('12 A 17 ANOS', blocoIII.p_faixa_etaria.anos_12_17),
                this.renderCheckbox('A PARTIR DE 18 ANOS', blocoIII.p_faixa_etaria.anos_18_mais),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('16.02 - ALGUM DE SEUS FILHOS POSSUI ALGUMA DEFICIÊNCIA?'),
            {
              stack: [
                this.renderCheckbox(`SIM. QUANTOS? ${blocoIII.p_filhos_deficiencia.qtd}`, blocoIII.p_filhos_deficiencia.sim),
                this.renderCheckbox('NÃO', blocoIII.p_filhos_deficiencia.nao),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('17 - VOCÊ ESTÁ VIVENDO ALGUM CONFLITO COM O (A) AGRESSOR (A) EM RELAÇÃO A GUARDA DO (S) FILHO (S), VISITAS OU PAGAMENTO DE PENSÃO?'),
            {
              stack: [
                { text: 'SE SIM, ESPECIFIQUE:', style: 'labelSmall', margin: [10, 0] },
                this.renderCheckbox('GUARDA DO(S) FILHO (S)', blocoIII.p_conflito_filhos.guarda),
                this.renderCheckbox('VISITAS', blocoIII.p_conflito_filhos.visitas),
                this.renderCheckbox('PAGAMENTO DE PENSÃO', blocoIII.p_conflito_filhos.pensao),
                this.renderCheckbox('NÃO', blocoIII.p_conflito_filhos.nao),
                this.renderCheckbox('NÃO TENHO FILHO (S) COM O (A) AGRESSOR (A)', blocoIII.p_conflito_filhos.nao_tem_filhos_com_agressor),
              ],
              padding: 4
            }
          ],
//QUEBRA DE PÁGINA
          [
            this.renderPergunta('18 - SEU (S) FILHO (S) JÁ PRESENCIARAM ATO (S) DE VIOLÊNCIA DO (A) AGRESSOR (A) CONTRA VOCÊ?'),
            {
              stack: [
                this.renderCheckbox('SIM', blocoIII.p_presenciaram === true),
                this.renderCheckbox('NÃO', blocoIII.p_presenciaram === false),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('19 - VOCÊ SOFREU ALGUM TIPO DE VIOLÊNCIA DURANTE A GRAVIDEZ OU NOS TRÊS MESES POSTERIORES AO PARTO?'),
            {
              stack: [
                this.renderCheckbox('SIM', blocoIII.p_violencia_gravidez === true),
                this.renderCheckbox('NÃO', blocoIII.p_violencia_gravidez === false),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('20 - SE VOCÊ ESTÁ EM UM NOVO RELACIONAMENTO, PERCEBEU QUE AS AMEAÇAS OU AGRESSÕES FÍSICAS AUMENTARAM EM RAZÃO DISSO?'),
            {
              stack: [
                this.renderCheckbox('SIM', blocoIII.p_novo_relacionamento === true),
                this.renderCheckbox('NÃO', blocoIII.p_novo_relacionamento === false),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('21 - VOCÊ POSSUI ALGUMA DEFICIÊNCIA OU DOENÇAS DEGENERATIVA QUE ACARRETAM EM CONDIÇÕES LIMITANTES OU DE VULNERABILIDADE FÍSICA OU MENTAL?'),
            {
              stack: [
                this.renderCheckbox(`SIM. QUAL (IS): ${blocoIII.p_possui_deficiencia.qual}`, blocoIII.p_possui_deficiencia.sim),
                this.renderCheckbox('NÃO', blocoIII.p_possui_deficiencia.nao),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('22 - COM QUAL COR/RAÇA VOCÊ SE IDENTIFICA:'),
            {
              stack: [
                this.renderCheckbox('BRANCA', blocoIII.p_cor_raca === 'BRANCA'),
                this.renderCheckbox('PRETA', blocoIII.p_cor_raca === 'PRETA'),
                this.renderCheckbox('PARDA', blocoIII.p_cor_raca === 'PARDA'),
                this.renderCheckbox('AMARELA/ORIENTAL', blocoIII.p_cor_raca === 'AMARELA/ORIENTAL'),
                this.renderCheckbox('INDÍGENA', blocoIII.p_cor_raca === 'INDIGENA'),
              ],
              padding: 4
            }
          ],
        ]
      },
      layout: this.layoutTabelaPadrao
    };
    
//OUTRAS INFORMAÇÕES IMPORTANTES
    const blocoIV_Conteudo = {
      table: {
        widths: ['*', 220],
        body: [
          [
            this.renderPergunta('23 - VOCÊ CONSIDERA QUE MORA EM BAIRRO, COMUNIDADE, ÁREA RURAL OU LOCAL DE RISCO DE VIOLÊNCIA?'),
            {
              stack: [
                this.renderCheckbox('SIM', blocoIV.p_mora_risco === 'SIM'),
                this.renderCheckbox('NÃO', blocoIV.p_mora_risco === 'NAO'),
                this.renderCheckbox('NÃO SEI', blocoIV.p_mora_risco === 'NAO_SEI'),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('24 - VOCÊ SE CONSIDERA DEPENDENTE FINANCEIRA DO (A) AGRESSOR (A)?'),
            {
              stack: [
                this.renderCheckbox('SIM', blocoIV.p_dependente === true),
                this.renderCheckbox('NÃO', blocoIV.p_dependente === false),
              ],
              padding: 4
            }
          ],
          [
            this.renderPergunta('25 - VOCÊ QUER E ACEITA ABRIGAMENTO TEMPORÁRIO?'),
            {
              stack: [
                this.renderCheckbox('SIM', blocoIV.p_aceita_abrigamento === true),
                this.renderCheckbox('NÃO', blocoIV.p_aceita_abrigamento === false),
              ],
              padding: 4
            }
          ],
        ]
      },
      layout: this.layoutTabelaPadrao
    };

//OUTRAS INFORMAÇÕES E ENCAMINHAMENTOS
    const outrasInformacoesEncaminhamentos = {
      text: outrasInformacoes,
      style: 'anotacoes',
      margin: [0, 5],
      background: '#FAFAFA',
      borderColor: ['#B0B0B0', '#B0B0B0', '#B0B0B0', '#B0B0B0'],
      border: [0.5, 0.5, 0.5, 0.5],
      minHeight: 150,
    };

//TERMO DE DECLARAÇÃO DE ATENDIMENTO
    const termoDeclaracao = {
      stack: [
        { text: 'Declaro para os devidos fins que, as informações supra são verídicas e foram prestadas por mim,', style: 'label', alignment: 'justify' },
        { text: ' ', margin: 40 },
        { text: '_________________________________________________', alignment: 'center' },
        { text: assistida.getNome(), alignment: 'center', style: 'label' },
        { text: 'Assistida / terceiro comunicante', alignment: 'center', style: 'labelSmall' },
      ],
      margin: [20, 40]
    };
//PREENCHIMENTO PROGISSIONAL
    const preenchimentoProfissionalConteudo = {
      stack: [
        this.renderCheckbox('ASSISTIDA RESPONDEU A ESTE FORMULÁRIO SEM AJUDA PROFISSIONAL', preenchimentoProfissional.assistida_respondeu === 'SEM_AJUDA'),
        this.renderCheckbox('ASSISTIDA RESPONDEU A ESTE FORMULÁRIO COM O AUXÍLIO PROFISSIONAL', preenchimentoProfissional.assistida_respondeu === 'COM_AUXILIO'),
        this.renderCheckbox('ASSISTIDA NÃO TEVE CONDIÇÕES DE RESPONDER A ESTE FORMULÁRIO', preenchimentoProfissional.assistida_respondeu === 'SEM_CONDICOES'),
        this.renderCheckbox('ASSISTIDA RECUSOU-SE A PREENCHER O FORMULÁRIO', preenchimentoProfissional.assistida_respondeu === 'RECUSOU'),
        this.renderCheckbox('TERCEIRO COMUNICANTE RESPONDEU A ESTE FORMULÁRIO', preenchimentoProfissional.terceiro_comunicante),

        { text: 'TIPO (S) DE VIOLÊNCIA IDENTIFICADA (S)', style: 'label', margin: [0, 15, 0, 5] },
        this.renderCheckbox('FÍSICA', preenchimentoProfissional.tipos_violencia.fisica),
        this.renderCheckbox('PSICOLÓGICA', preenchimentoProfissional.tipos_violencia.psicologica),
        this.renderCheckbox('MORAL', preenchimentoProfissional.tipos_violencia.moral),
        this.renderCheckbox('SEXUAL', preenchimentoProfissional.tipos_violencia.sexual),
        this.renderCheckbox('PATRIMONIAL', preenchimentoProfissional.tipos_violencia.patrimonial),
      ]
    };
    //INFORMAÇÕES IMPORTANTES AO ACOLHER
    const infoAcolher = {
      stack: [
        { text: 'Toda a equipe deve preservar a escuta privilegiada/qualificada, evitando julgamentos, preconceitos e comentários desrespeitosos, com abordagem que respeite a autonomia das mulheres e de seu poder de decisão, procurando estabelecer relação de confiança.', style: 'anotacoes' },
        { text: 'Encaminhar os problemas apresentados pelas mulheres, oferecendo soluções possíveis e priorizando o seu bem-estar e comodidade.', style: 'anotacoes', margin: [0, 5] },
        { text: 'Garantir a privacidade no atendimento e a confidencialidade das informações de modo a prestar apoio emocional e encaminhar, quando necessário, para o atendimento continuado em médio prazo.', style: 'anotacoes', margin: [0, 5] },
        { text: 'Utilizar linguagem simples, aproximativa, inteligível e apropriada ao universo da assistida.', style: 'anotacoes', margin: [0, 5] },
      ],
      style: 'anotacoesBox'
    };
    
    //REDE DE ACOLHIMENTO À MULHER
    const redeAcolhimento = {
      table: {
        widths: ['*', 10, '*'], // Coluna 1, Espaço, Coluna 2
        body: [
          [
            {
              stack: [
                { text: 'CENTRAL DE ATENDIMENTO À MULHER 180', style: 'redeHeader' },
                { text: 'POLÍCIA MILITAR 190', style: 'redeHeader' },
                { text: 'ZAP DELAS 85 99814 0754', style: 'redeHeader' },
                
                { text: 'CASA DA MULHER BRASILEIRA FORTALEZA', style: 'redeHeader', margin: [0, 10, 0, 0] },
                { text: 'R. Tabuleiro do Norte, s/n - Couto Fernandes, Fortaleza-CE\n(85) 3108-2998/3108-2999/3108-2992/3108-2931\ncasamulherbrasileira@gmail.com', style: 'redeBody' },
                
                { text: 'NÚCLEO ESTADUAL DE ENFRENTAMENTO À VIOLÊNCIA CONTRA A MULHER (DEFENSORIA PÚBLICA DO ESTADO DO CEARÁ)', style: 'redeHeader', margin: [0, 10, 0, 0] },
                { text: 'R. Tabuleiro do Norte, s/n - Couto Fernandes, Fortaleza-CE\n(85) 3108-2986/3108-2985 | E-mail: nudem@defensoria.ce.def.br', style: 'redeBody' },
                
                { text: 'CENTRO DE REFERÊNCIA DA MULHER FRANCISCA CLOTILDE (CRM)', style: 'redeHeader', margin: [0, 10, 0, 0] },
                { text: 'R. Tabuleiro do Norte, s/n - Couto Fernandes, Fortaleza-CE\n(85) 3108-2965/3108-2968 | crmulherfranciscaclotilde@gmail.com', style: 'redeBody' },
                
                { text: '2º JUIZADO DE VIOLÊNCIA DOMÉSTICA E FAMILIAR CONTRA A MULHER DE FORTALEZA', style: 'redeHeader', margin: [0, 10, 0, 0] },
                { text: 'Av. da Universidade, 3281, Fortaleza-CE\nWhatsApp: (85) 98732-6160 | for.2violenciamulher@tjce.jus.br', style: 'redeBody' },
                
                { text: 'COORDENADORIA ESPECIAL DE POLÍTICAS PÚBLICAS PARA AS MULHERES DA PREFEITURA MUNICIPAL DE FORTALEZA (CEPPM)', style: 'redeHeader', margin: [0, 10, 0, 0] },
                { text: 'Rua Padre Pedro de Alencar, 2230, Fortaleza-CE.\n(85) 3101-7679 | coordenadoria.mulher@sdhds.fortaleza.ce.gov.br', style: 'redeBody' },
              ],
              border: [false, false, false, false]
            },
            { text: '', border: [false, false, false, false] },
            {
              stack: [
                { text: 'DELEGACIA DE DEFESA DA MULHER - DDM', style: 'redeHeader', margin: [0, 10, 0, 0] },
                { text: 'R. Tabuleiro do Norte, s/n - Couto Fernandes, Fortaleza-CE\n(85) 3108-2950 | ddmfortaleza@policiacivil.ce.gov.br', style: 'redeBody' },
                
                { text: 'CENTRO ESTADUAL DE REFERÊNCIA E APOIO À MULHER (CERAM)', style: 'redeHeader', margin: [0, 10, 0, 0] },
                { text: 'R. Tabuleiro do Norte, s/n - Couto Fernandes, Fortaleza-CE\n(85) 3108-2966', style: 'redeBody' },
                
                { text: '1º JUIZADO DE VIOLÊNCIA DOMÉSTICA E FAMILIAR CONTRA A MULHER DE FORTALEZA', style: 'redeHeader', margin: [0, 10, 0, 0] },
                { text: 'Av. da Universidade, 3281, Fortaleza-CE\nWhatsApp: (85) 3108-2978/(85)3492-8241\njuizadomulherfortaleza@tjce.jus.br / cajfortaleza@tjce.jus.br', style: 'redeBody' },
                
                { text: 'SECRETARIA DAS MULHERES DO GOVERNO DO ESTADO DO CEARÁ', style: 'redeHeader', margin: [0, 10, 0, 0] },
                { text: 'Av. Barão de Studart, 598, Meireles / Fortaleza - CE,\n60120-000\n(85) 3459-6122/3459-6107 | jade@mulheres.ce.gov.br', style: 'redeBody' },
                
                { text: 'OAB/CE - COMISSÃO DA MULHER ADVOGADA', style: 'redeHeader', margin: [0, 10, 0, 0] },
                { text: 'Av. Washington Soares, 800-B. Guararapes, Fortaleza-CE\n(85) 3216.1604/(85) 98170-5180 (WPP) | comissoes@oabce.org.br', style: 'redeBody' },
              ],
              border: [false, false, false, false]
            }
          ]
        ]
      }
    };

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 90, 40, 60],

      header: {
        columns: [
          {
            // image: 'IMAGEM DO BRASÃO DO APLICATIVO'
            text: '[LOGO 1]',
            width: 60,
            alignment: 'left',
          },
          {
            stack: [
              { text: 'Câmara Municipal de Ocara', style: 'header' },
              { text: 'Procuradoria Especial da Mulher de Ocara', style: 'header' },
              { text: ' ', margin: 5 },
              { text: 'FORMULÁRIO DE ATENDIMENTO PROCURADORIA ESPECIAL DA MULHER DE OCARA', style: 'title' },
            ],
            alignment: 'center'
          },
          {
            // image: 'IMAGEM DO BRASÃO DE OCARA',
            text: '[LOGO 2]',
            width: 60,
            alignment: 'right',
          }
        ],
        margin: [40, 20, 40, 0]
      },

      footer: (currentPage: number, pageCount: number) => ({
        text: [
          { text: 'Avenida Coronel João Felipe, Centro, CEP: 62755-000, Ocara - CE | pemocara@gmail.com | Instagran: @pemocara\n' },
          { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', italics: true }
        ],
        style: 'footer',
        alignment: 'center',
        margin: [40, 10, 40, 10]
      }),

      content: [
        blocoAtendimento,
        { text: 'IDENTIFICAÇÃO DA ASSISTIDA', style: 'sectionHeader' },
        tabelaIdentificacao,
        { text: 'IDENTIFICAÇÃO DO AGRESSOR (A)', style: 'sectionHeader' },
        tabelaAgressor,
        { text: 'BLOCO I - SOBRE O HISTÓRICO DE VIOLÊNCIA', style: 'sectionHeader' },
        blocoI_Conteudo,
        { text: '', pageBreak: 'after' },

        { text: 'BLOCO II - SOBRE O (A) AGRESSOR (A)', style: 'sectionHeader', margin: [0, 0, 0, 5] },
        blocoII_Conteudo,
        { text: 'BLOCO III - SOBRE VOCÊ', style: 'sectionHeader' },
        blocoIII_Conteudo,

        { text: 'BLOCO IV - OUTRAS INFORMAÇÕES IMPORTANTES', style: 'sectionHeader', pageBreak: 'before' },
        blocoIV_Conteudo,
        { text: 'OUTRAS INFORMAÇÕES E ENCAMINHAMENTOS', style: 'sectionHeader' },
        outrasInformacoesEncaminhamentos,
        { text: '', pageBreak: 'after' },
        
        { text: 'TERMO DE DECLARAÇÃO DE ATENDIMENTO', style: 'sectionHeader', margin: [0, 0, 0, 5] },
        termoDeclaracao,
        { text: '', pageBreak: 'after' },

        { text: 'PARA PREENCHIMENTO PELO PROFISSIONAL', style: 'sectionHeader', margin: [0, 0, 0, 5] },
        preenchimentoProfissionalConteudo,
        { text: 'INFORMAÇÕES IMPORTANTES AO ACOLHER:', style: 'sectionHeader', margin: [0, 20, 0, 5] },
        infoAcolher,
        { text: '', pageBreak: 'after' },
        
        { text: 'REDE DE ACOLHIMENTO À MULHER', style: 'sectionHeader', alignment: 'center', margin: [0, 0, 0, 10] },
        redeAcolhimento,
      ],

      styles: {
        header: { fontSize: 12, bold: true },
        footer: { fontSize: 9, italics: true },
        title: { fontSize: 11, bold: true, alignment: 'center' },
        sectionHeader: { fontSize: 12, bold: true, background: '#EEEEEE', margin: [0, 10, 0, 5], padding: 2, alignment: 'center' },
        label: { fontSize: 9, bold: true },
        labelSmall: { fontSize: 9, bold: false },
        value: { fontSize: 9 },
        pergunta: { fontSize: 9, bold: true },
        anotacoes: { fontSize: 9, italics: true, alignment: 'justify' },
        anotacoesBox: { fontSize: 9, italics: true, alignment: 'justify', background: '#FAFAFA', borderColor: ['#B0B0B0', '#B0B0B0', '#B0B0B0', '#B0B0B0'], border: [0.5, 0.5, 0.5, 0.5], padding: 5 },
        redeHeader: { fontSize: 9, bold: true },
        redeBody: { fontSize: 8.5 },
      },
      
      defaultStyle: { font: 'Roboto' }
    };

    const pdfDoc = this.printer.createPdfKitDocument(docDefinition);

    const directory = customDirectory || app.getPath('desktop')
    const desktopPath = app.getPath('desktop');
    const fileName = `formulario-assistida-${assistida.getProtocolo()}-${Date.now()}.pdf`;
    const filePath = path.join(directory, fileName);

    return new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(filePath);
      pdfDoc.pipe(stream);
      pdfDoc.end();
      stream.on('finish', () => {
        console.log(`PDF gerado em: ${filePath}`);
        resolve(filePath);
      });
      stream.on('error', (err) => {
        console.error("Erro ao gerar PDF:", err);
        reject(err);
      });
    });
  }
}