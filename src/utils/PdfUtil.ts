import PdfPrinter from 'pdfmake';
import fs from 'fs';
import path from 'path';
import { Assistida } from '../models/assistida/Assistida';
import { app } from 'electron';

export interface IAtendimentoData {
  codigo: number;
  data: string;
  nucleo: 'JURIDICO' | 'PSICOSSOCIAL';
  responsavel: string;
}
export interface IAgressorData {
  nome: string;
  idade?: number;
  vinculo: string;
  dataFato: string;
}
export interface IBlocoIData {
  p_ameaca: 'ARMA_FOGO' | 'FACA' | 'OUTRA' | 'NAO';
  p_agressoes: { queimadura: boolean; enforcamento: boolean; sufocamento: boolean; tiro: boolean; afogamento: boolean; facada: boolean; paulada: boolean; nenhuma: boolean; };
  p2_agressoes: { socos: boolean; chutes: boolean; tapas: boolean; empurroes: boolean; puxoesCabelo: boolean; nenhuma: boolean; };
  p_sexoForcado: boolean;
  p_comportamentos: { frase_ameaca: boolean; perseguiu_vigiou: boolean; proibiu_visitas: boolean; proibiu_trabalhar: boolean; telefonemas_insistentes: boolean; impediu_dinheiro: boolean; ciume_excessivo: boolean; nenhum: boolean; };
  p_ocorrencia: boolean;
  p_agressoes_recentes: boolean;
}
export interface IBlocoIIData {
  p_uso_drogas: { alcool: boolean; drogas: boolean; nao: boolean; nao_sei: boolean; };
  p_doenca_mental: 'SIM_MEDICACAO' | 'SIM_SEM_MEDICACAO' | 'NAO' | 'NAO_SEI';
  p_descumpriu_medida: boolean;
  p_tentou_suicidio: boolean;
  p_desempregado: 'SIM' | 'NAO' | 'NAO_SEI';
  p_acesso_arma: 'SIM' | 'NAO' | 'NAO_SEI';
  p_agrediu_outros: { sim: boolean; filhos: boolean; familiares: boolean; outras_pessoas: boolean; animais: boolean; nao: boolean; nao_sei: boolean; };
}
export interface IBlocoIIIData {
  p_separacao_recente: 'SIM_SEPAREI' | 'SIM_TENTEI' | 'NAO';
  p_tem_filhos: { com_agressor: boolean; qtd_agressor: number; outro_relacionamen: boolean; qtd_relacionamen: number; nao: boolean; };
  p_faixa_etaria: { anos_0_11: boolean; anos_12_17: boolean; anos_18_mais: boolean; };
  p_filhos_deficiencia: { sim: boolean; qtd: number; nao: boolean; };
  p_conflito_filhos: { guarda: boolean; visitas: boolean; pensao: boolean; nao: boolean; nao_tem_filhos_com_agressor: boolean; };
  p_presenciaram: boolean;
  p_violencia_gravidez: boolean;
  p_novo_relacionamento: boolean;
  p_possui_deficiencia: { sim: boolean; qual: string; nao: boolean; };
  p_cor_raca: 'BRANCA' | 'PRETA' | 'PARDA' | 'AMARELA/ORIENTAL' | 'INDIGENA';
}
export interface IBlocoIVData {
  p_mora_risco: 'SIM' | 'NAO' | 'NAO_SEI';
  p_dependente: boolean;
  p_aceita_abrigamento: boolean;
}
export interface IPreenchimentoProfissional {
  assistida_respondeu: 'SEM_AJUDA' | 'COM_AUXILIO' | 'SEM_CONDICOES' | 'RECUSOU';
  terceiro_comunicante: boolean;
  tipos_violencia: { fisica: boolean; psicologica: boolean; moral: boolean; sexual: boolean; patrimonial: boolean; };
}
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
  private readonly HEADER_BG = '#E6E6FA'; 

  constructor() {
    const fontsPath = app.isPackaged 
      ? path.join(process.resourcesPath, 'assets', 'fonts') 
      : path.resolve(app.getAppPath(), 'assets', 'fonts');
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

  // --- HELPERS ---

  private renderCampo(label: string, value: any, colSpan = 1) {
    return {
      stack: [
        { text: label, style: 'label' },
        { text: value ? String(value).toUpperCase() : ' ', style: 'value', margin: [0, 2, 0, 0] }
      ],
      colSpan: colSpan,
      border: [true, true, true, true],
      borderColor: ['#000000', '#000000', '#000000', '#000000']
    };
  }

  private renderCheckbox(label: string, checked: boolean) {
    return {
      columns: [
        { text: checked ? '( X )' : '(   )', width: 25, bold: true, style: 'checkboxInfo' },
        { text: label, style: 'checkboxLabel' }
      ],
      margin: [0, 2],
      columnGap: 5
    };
  }

  private renderSectionHeader(text: string) {
    return {
      table: {
        widths: ['*'],
        body: [[{ 
            text: text, 
            style: 'sectionHeader', 
            fillColor: this.HEADER_BG, 
            border: [true, true, true, true],
            borderColor: ['#000000', '#000000', '#000000', '#000000']
        }]]
      },
      layout: 'noBorders',
      margin: [0, 10, 0, 0] // Margem inferior zero para colar no bloco
    };
  }

  private renderPergunta(numero: string, texto: string) {
    return {
      text: [
        { text: numero, bold: true, fontSize: 10 },
        { text: ` - ${texto}`, fontSize: 9, bold: true }
      ],
      margin: [0, 8, 0, 3]
    };
  }

  // NOVO: Método que cria a caixa (borda) ao redor de todo o conteúdo do bloco
  private renderBlockContainer(content: any[]) {
    return {
        table: {
            widths: ['*'],
            body: [[
                {
                    stack: content,
                    border: [true, true, true, true], // A Borda Grande
                    borderColor: ['#000000', '#000000', '#000000', '#000000'],
                    padding: 5
                }
            ]]
        },
        layout: { defaultBorder: false },
        margin: [0, 0, 0, 10]
    };
  }

  // --- GERAÇÃO DO PDF ---

  public async gerarPdfFormulario(
    assistida: Assistida,
    data: IFormularioCompleto,
    customDirectory?: string
  ): Promise<string> {

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [30, 100, 30, 60],
      header: {
        margin: [30, 20, 30, 0],
        table: {
          widths: [60, '*', 60],
          body: [[
              { text: '[Brasão]', alignment: 'left', fontSize: 8, border: [false, false, false, false] }, 
              {
                stack: [
                  { text: 'CÂMARA MUNICIPAL DE OCARA', style: 'headerTitle' },
                  { text: 'PROCURADORIA ESPECIAL DA MULHER DE OCARA', style: 'headerSubtitle' },
                  { text: 'FORMULÁRIO DE ATENDIMENTO PROCURADORIA ESPECIAL DA MULHER DE OCARA', style: 'headerFormTitle', margin: [0, 10, 0, 0] }
                ],
                alignment: 'center',
                border: [false, false, false, false]
              },
              { text: '[Logo PEM]', alignment: 'right', fontSize: 8, border: [false, false, false, false] } 
            ]]
        },
        layout: 'noBorders'
      },
      footer: (currentPage: number, pageCount: number) => ({
        stack: [
           { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 535, y2: 0, lineWidth: 0.5, lineColor: '#999' }] },
           { text: 'Avenida Coronel João Felipe, Centro, CEP: 62755-000, Ocara - CE', style: 'footer', margin: [0, 5, 0, 0] },
           { text: 'pemocara@gmail.com | Instagram: @pemocara', style: 'footer' },
           { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', style: 'footerSmall', margin: [0, 5, 30, 0] }
        ],
        alignment: 'center',
        margin: [30, 10, 30, 10]
      }),
      content: [
        this.gerarCabecalhoAtendimento(data.atendimento),
        
        this.renderSectionHeader('IDENTIFICAÇÃO DA ASSISTIDA'),
        this.gerarIdentificacaoAssistida(assistida),
        
        this.renderSectionHeader('IDENTIFICAÇÃO DO AGRESSOR (A)'),
        this.gerarIdentificacaoAgressor(data.agressor),
        
        { text: '', pageBreak: 'after' },
        this.renderSectionHeader('BLOCO I - SOBRE O HISTÓRICO DE VIOLÊNCIA'),
        this.gerarBlocoI(data.blocoI), // Agora com borda

        { text: '', pageBreak: 'after' },
        this.renderSectionHeader('BLOCO II - SOBRE O (A) AGRESSOR (A)'),
        this.gerarBlocoII(data.blocoII), // Agora com borda
        this.renderSectionHeader('BLOCO III - SOBRE VOCÊ'),
        this.gerarBlocoIII(data.blocoIII), // Agora com borda

        { text: '', pageBreak: 'after' },
        this.renderSectionHeader('BLOCO IV - OUTRAS INFORMAÇÕES IMPORTANTES'),
        this.gerarBlocoIV(data.blocoIV), // Agora com borda
        this.renderSectionHeader('OUTRAS INFORMAÇÕES E ENCAMINHAMENTOS'),
        this.gerarOutrasInformacoes(data.outrasInformacoes),
        
        { text: ' ', margin: [0, 20] },
        this.renderSectionHeader('TERMO DE DECLARAÇÃO DE ATENDIMENTO'),
        this.gerarTermoDeclaracao(assistida),

        { text: '', pageBreak: 'after' },
        this.renderSectionHeader('PARA PREENCHIMENTO PELO PROFISSIONAL'),
        this.gerarPreenchimentoProfissional(data.preenchimentoProfissional), // Agora com borda
        this.renderSectionHeader('INFORMAÇÕES IMPORTANTES AO ACOLHER:'),
        this.gerarInfoAcolhimento(),

        { text: '', pageBreak: 'after' },
        this.renderSectionHeader('REDE DE ACOLHIMENTO À MULHER'),
        this.gerarRedeAcolhimento()
      ],
      styles: {
        headerTitle: { fontSize: 12, bold: true },
        headerSubtitle: { fontSize: 10, bold: true },
        headerFormTitle: { fontSize: 9, bold: true, decoration: 'underline' },
        sectionHeader: { fontSize: 10, bold: true, alignment: 'center', color: '#000000' },
        label: { fontSize: 8, bold: true, color: '#333333' },
        value: { fontSize: 9, color: '#000000' },
        checkboxInfo: { fontSize: 9 },
        checkboxLabel: { fontSize: 9 },
        footer: { fontSize: 8, color: '#555555' },
        footerSmall: { fontSize: 7, italics: true, color: '#777777' },
        anotacoes: { fontSize: 9, lineHeight: 1.2 },
        redeTitle: { fontSize: 9, bold: true, color: '#000000' },
        redeText: { fontSize: 8.5, color: '#333333' }
      },
      defaultStyle: { font: 'Roboto' }
    };

    const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
    
    // FORÇAR USO DO DESKTOP SE NENHUM DIRETÓRIO FOR PASSADO
    const desktopPath = app.getPath('desktop');
    const finalDir = customDirectory ? customDirectory : desktopPath;
    
    // Log para você debugar onde está salvando
    console.log(`[PdfUtil] Salvando PDF em: ${finalDir}`);

    const fileName = `formulario-${assistida.getNome().replace(/\s+/g, '_')}-${Date.now()}.pdf`;
    const filePath = path.join(finalDir, fileName);

    return new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(filePath);
      pdfDoc.pipe(stream);
      pdfDoc.end();
      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    });
  }

  // --- GERADORES DE BLOCOS COM BORDAS CORRIGIDAS ---

  private gerarCabecalhoAtendimento(data: IAtendimentoData) {
    // Cabeçalho mantém layout de tabela individual
    return {
      table: {
        widths: ['*', 100],
        body: [
          [this.renderCampo('CÓDIGO DA ASSISTIDA:', data.codigo), this.renderCampo('DATA:', data.data)],
          [{
              colSpan: 2,
              stack: [
                { text: 'NÚCLEO DE ATENDIMENTO:', style: 'label' },
                { columns: [this.renderCheckbox('JURÍDICO', data.nucleo === 'JURIDICO'), this.renderCheckbox('PSICOSSOCIAL', data.nucleo === 'PSICOSSOCIAL')] }
              ],
              border: [true, true, true, true],
              borderColor: ['#000000', '#000000', '#000000', '#000000']
            }, {}
          ],
          [this.renderCampo('RESPONSÁVEL TÉCNICO:', data.responsavel, 2), {}]
        ]
      },
      layout: { defaultBorder: false },
      margin: [0, 0, 0, 10]
    };
  }

  private gerarIdentificacaoAssistida(assistida: Assistida) {
    const limitacao = assistida.getLimitacaoFisica() || '';
    const temLimitacao = limitacao.length > 2 && !limitacao.match(/n[ãa]o/i);
    return {
      table: {
        widths: ['*', 80],
        body: [
          [this.renderCampo('NOME:', assistida.getNome(), 2), {}],
          [this.renderCampo('ENDEREÇO:', assistida.getEndereco(), 2), {}],
          [this.renderCampo('IDENTIDADE DE GÊNERO:', assistida.getIdentidadeGenero()), this.renderCampo('IDADE:', assistida.getIdade())],
          [this.renderCampo('NOME SOCIAL:', assistida.getNomeSocial()), this.renderCampo('ESCOLARIDADE:', assistida.getEscolaridade())],
          [this.renderCampo('RELIGIÃO:', assistida.getReligiao()), this.renderCampo('NACIONALIDADE:', assistida.getNacionalidade())],
          [{
                stack: [
                    { text: 'ZONA DE HABITAÇÃO:', style: 'label' },
                    { columns: [this.renderCheckbox('RURAL', assistida.getZonaHabitacao().toUpperCase() === 'RURAL'), this.renderCheckbox('URBANA', assistida.getZonaHabitacao().toUpperCase() === 'URBANA')] }
                ],
                border: [true, true, true, true], borderColor: ['#000000', '#000000', '#000000', '#000000']
            },
            this.renderCampo('PROFISSÃO/OCUPAÇÃO:', assistida.getProfissao())
          ],
          [{
                colSpan: 2,
                stack: [
                    { text: 'POSSUI LIMITAÇÃO FÍSICA?', style: 'label' },
                    { columns: [
                        this.renderCheckbox('SIM', temLimitacao),
                        this.renderCheckbox('NÃO', !temLimitacao),
                        { text: `QUAL? ${limitacao}`, style: 'value', margin: [10, 2, 0, 0] }
                    ]}
                ],
                border: [true, true, true, true], borderColor: ['#000000', '#000000', '#000000', '#000000']
            }, {}
          ],
          [this.renderCampo('NÚMERO CADASTRO PROGRAMA SOCIAL:', assistida.getNumeroCadastroSocial(), 2), {}],
          [{
                colSpan: 2,
                stack: [
                    { text: 'POSSUI DEPENDENTES?', style: 'label' },
                    { columns: [
                        this.renderCheckbox('SIM', assistida.getTemDependentes()),
                        this.renderCheckbox('NÃO', !assistida.getTemDependentes()),
                        { text: `QUANTOS? ${assistida.getTemDependentes() ? assistida.getQuantidadeDependentes() : ''}`, style: 'value', margin: [10, 2, 0, 0] }
                    ]}
                ],
                border: [true, true, true, true], borderColor: ['#000000', '#000000', '#000000', '#000000']
            }, {}
          ]
        ]
      },
      layout: { defaultBorder: false }
    };
  }

  private gerarIdentificacaoAgressor(data: IAgressorData) {
    return {
      table: {
        widths: ['*', 60],
        body: [[this.renderCampo('NOME DO AGRESSOR:', data.nome), this.renderCampo('IDADE:', data.idade)],
          [this.renderCampo('VÍNCULO ENTRE A ASSISTIDA E O AGRESSOR:', data.vinculo), this.renderCampo('DATA DO FATO OCORRIDO:', data.dataFato)]]
      },
      layout: { defaultBorder: false }
    };
  }

  // --- BLOCOS CAPSULADOS COM RENDERBLOCKCONTAINER ---

  private gerarBlocoI(data: IBlocoIData) {
    const conteudo = [
        this.renderPergunta('01', 'O (A) AGRESSOR (A) JÁ AMEAÇOU VOCÊ OU ALGUM FAMILIAR COM A FINALIDADE DE ATINGI-LA?'),
        { columns: [
            this.renderCheckbox('SIM, UTILIZANDO ARMA DE FOGO', data.p_ameaca === 'ARMA_FOGO'),
            this.renderCheckbox('SIM, UTILIZANDO FACA', data.p_ameaca === 'FACA')
        ]},
        { columns: [this.renderCheckbox('SIM, DE OUTRA FORMA', data.p_ameaca === 'OUTRA'), this.renderCheckbox('NÃO', data.p_ameaca === 'NAO')] },
        
        this.renderPergunta('02', 'O (A) AGRESSOR (A) JÁ PRATICOU ALGUMA (S) DESTAS AGRESSÕES FÍSICAS COM VOCÊ?'),
        { columns: [
            { stack: [
                this.renderCheckbox('QUEIMADURA', data.p_agressoes.queimadura),
                this.renderCheckbox('ENFORCAMENTO', data.p_agressoes.enforcamento),
                this.renderCheckbox('SUFOCAMENTO', data.p_agressoes.sufocamento),
                this.renderCheckbox('TIRO', data.p_agressoes.tiro)
            ]},
            { stack: [
                this.renderCheckbox('AFOGAMENTO', data.p_agressoes.afogamento),
                this.renderCheckbox('FACADA', data.p_agressoes.facada),
                this.renderCheckbox('PAULADA', data.p_agressoes.paulada),
                this.renderCheckbox('NENHUMA', data.p_agressoes.nenhuma)
            ]}
        ]},

        this.renderPergunta('03', 'O (A) AGRESSOR (A) JÁ PRATICOU ALGUMA (S) DESTAS OUTRAS AGRESSÕES FÍSICAS CONTRA VOCÊ?'),
        { columns: [
            { stack: [
                this.renderCheckbox('SOCOS', data.p2_agressoes.socos),
                this.renderCheckbox('CHUTES', data.p2_agressoes.chutes),
                this.renderCheckbox('TAPAS', data.p2_agressoes.tapas)
            ]},
            { stack: [
                this.renderCheckbox('EMPURRÕES', data.p2_agressoes.empurroes),
                this.renderCheckbox('PUXÕES DE CABELO', data.p2_agressoes.puxoesCabelo),
                this.renderCheckbox('NENHUMA', data.p2_agressoes.nenhuma)
            ]}
        ]},

        this.renderPergunta('04', 'O (A) AGRESSOR (A) JA OBRIGOU VOCÊ A FAZER SEXO OU A PRATICAR ATOS SEXUAIS CONTRA A SUA VONTADE:'),
        { columns: [this.renderCheckbox('SIM', data.p_sexoForcado), this.renderCheckbox('NÃO', !data.p_sexoForcado)] },

        this.renderPergunta('05', 'O (A) AGRESSOR (A) JÁ TEVE ALGUM DESTES COMPORTAMENTOS?'),
        { stack: [
            this.renderCheckbox('DISSE ALGO PARECIDO COM A FRASE "SE NÃO FOR MINHA, NÃO SERÁ DE MAIS NINGUÉM"', data.p_comportamentos.frase_ameaca),
            this.renderCheckbox('PERTURBOU, PERSEGUIU OU VIGIOU VOCÊ NOS LOCAIS EM QUE FREQUENTA', data.p_comportamentos.perseguiu_vigiou),
            this.renderCheckbox('PROIBIU VOCÊ DE VISITAR FAMILIARES OU AMIGOS', data.p_comportamentos.proibiu_visitas),
            this.renderCheckbox('PROIBIU VOCÊ DE TRABALHAR OU ESTUDAR', data.p_comportamentos.proibiu_trabalhar),
            this.renderCheckbox('FEZ TELEFONEMAS, ENVIOU MENSAGENS PELO CELULAR, OU E-MAILS DE FORMA INSISTENTE', data.p_comportamentos.telefonemas_insistentes),
            this.renderCheckbox('IMPEDIU VOCÊ DE TER ACESSO A DINHEIRO, CONTA BANCÁRIA OU OUTROS BENS', data.p_comportamentos.impediu_dinheiro),
            this.renderCheckbox('TEVE OUTROS COMPORTAMENTOS DE CIÚME EXCESSIVO E DE CONTROLE SOBRE VOCÊ', data.p_comportamentos.ciume_excessivo),
            this.renderCheckbox('NENHUM DOS COMPORTAMENTOS ACIMA CITADOS', data.p_comportamentos.nenhum),
        ]},

        this.renderPergunta('06', 'VOCÊ JÁ REGISTROU OCORRÊNCIA POLICIAL OU FORMULOU PEDIDO DE MEDIDA PROTETIVA DE URGÊNCIA ENVOLVENDO A MESMA PESSOA?'),
        { columns: [this.renderCheckbox('SIM', data.p_ocorrencia), this.renderCheckbox('NÃO', !data.p_ocorrencia)] },

        this.renderPergunta('07', 'AS AMEAÇAS OU AGRESSÕES DO (A) AGRESSOR (A) CONTRA VOCÊ, SE TORNARAM MAIS FREQUENTES OU MAIS GRAVES NOS ÚLTIMOS MESES?'),
        { columns: [this.renderCheckbox('SIM', data.p_agressoes_recentes), this.renderCheckbox('NÃO', !data.p_agressoes_recentes)] },
    ];
    return this.renderBlockContainer(conteudo);
  }

  private gerarBlocoII(data: IBlocoIIData) {
    const conteudo = [
        this.renderPergunta('08', 'O (A) AGRESSOR (A) JÁ FEZ USO ABUSIVO DE ÁLCOOL OU DE DROGAS?'),
        { columns: [
            this.renderCheckbox('SIM, DE ÁLCOOL', data.p_uso_drogas.alcool),
            this.renderCheckbox('SIM, DE DROGAS', data.p_uso_drogas.drogas),
            this.renderCheckbox('NÃO', data.p_uso_drogas.nao),
            this.renderCheckbox('NÃO SEI', data.p_uso_drogas.nao_sei),
        ]},
        this.renderPergunta('09', 'O (A) AGRESSOR (A) TEM ALGUMA DOENÇA MENTAL COMPROVADA POR AVALIAÇÃO MÉDICA?'),
        { columns: [this.renderCheckbox('SIM, E FAZ USO DE MEDICAÇÃO', data.p_doenca_mental === 'SIM_MEDICACAO'), this.renderCheckbox('SIM, E NÃO FAZ USO DE MEDICAÇÃO', data.p_doenca_mental === 'SIM_SEM_MEDICACAO')]},
        { columns: [this.renderCheckbox('NÃO', data.p_doenca_mental === 'NAO'), this.renderCheckbox('NÃO SEI', data.p_doenca_mental === 'NAO_SEI')]},

        this.renderPergunta('10', 'O (A) AGRESSOR (A) JÁ DESCUMPRIU MEDIDA PROTETIVA ANTERIORMENTE?'),
        { columns: [this.renderCheckbox('SIM', data.p_descumpriu_medida), this.renderCheckbox('NÃO', !data.p_descumpriu_medida)] },

        this.renderPergunta('11', 'O (A) AGRESSOR (A) JA TENTOU SUICÍDIO OU FALOU EM SUICIDAR-SE?'),
        { columns: [this.renderCheckbox('SIM', data.p_tentou_suicidio), this.renderCheckbox('NÃO', !data.p_tentou_suicidio)] },

        this.renderPergunta('12', 'O (A) AGRESSOR (A) ESTÁ DESEMPREGADO OU TEM DIFICULDADES FINANCEIRAS?'),
        { columns: [this.renderCheckbox('SIM', data.p_desempregado === 'SIM'), this.renderCheckbox('NÃO', data.p_desempregado === 'NAO'), this.renderCheckbox('NÃO SEI', data.p_desempregado === 'NAO_SEI')] },

        this.renderPergunta('13', 'O (A) AGRESSOR (A) TEM ACESSO A ARMAS DE FOGO?'),
        { columns: [this.renderCheckbox('SIM', data.p_acesso_arma === 'SIM'), this.renderCheckbox('NÃO', data.p_acesso_arma === 'NAO'), this.renderCheckbox('NÃO SEI', data.p_acesso_arma === 'NAO_SEI')] },

        this.renderPergunta('14', 'O (A) AGRESSOR (A) JÁ AMEAÇOU E/OU AGREDIU SEUS FILHOS, OUTROS FAMILIARES, AMIGOS, COLEGAS DE TRABALHO, PESSOAS DESCONHECIDAS OU ANIMAIS DE ESTIMAÇÃO?'),
        { columns: [this.renderCheckbox('SIM', data.p_agrediu_outros.sim), this.renderCheckbox('NÃO', data.p_agrediu_outros.nao), this.renderCheckbox('NÃO SEI', data.p_agrediu_outros.nao_sei)]},
        { text: 'SE SIM, ESPECIFIQUE:', fontSize: 8, margin: [10, 0] },
        { columns: [this.renderCheckbox('FILHOS', data.p_agrediu_outros.filhos), this.renderCheckbox('OUTROS FAMILIARES', data.p_agrediu_outros.familiares), this.renderCheckbox('OUTRAS PESSOAS', data.p_agrediu_outros.outras_pessoas), this.renderCheckbox('ANIMAIS', data.p_agrediu_outros.animais)]}
    ];
    return this.renderBlockContainer(conteudo);
  }

  private gerarBlocoIII(data: IBlocoIIIData) {
    const conteudo = [
        this.renderPergunta('15', 'VOCÊ SE SEPAROU RECENTEMENTE DO (A) AGRESSOR (A), OU TENTOU SE SEPARAR?'),
        { columns: [this.renderCheckbox('SIM, ME SEPAREI', data.p_separacao_recente === 'SIM_SEPAREI'), this.renderCheckbox('SIM, TENTEI ME SEPARAR', data.p_separacao_recente === 'SIM_TENTEI'), this.renderCheckbox('NÃO', data.p_separacao_recente === 'NAO')] },
        
        this.renderPergunta('16', 'VOCÊ TEM FILHO (S)?'),
        { columns: [this.renderCheckbox(`SIM, COM O AGRESSOR. QUANTOS? ${data.p_tem_filhos.qtd_agressor}`, data.p_tem_filhos.com_agressor), this.renderCheckbox(`SIM, DE OUTRO RELACIONAMENTO. QUANTOS? ${data.p_tem_filhos.qtd_relacionamen}`, data.p_tem_filhos.outro_relacionamen)]},
        { columns: [this.renderCheckbox('NÃO', data.p_tem_filhos.nao)] },

        { text: '16.01 - SE SIM, ASSINALE A FAIXA ETÁRIA DE SEUS FILHOS.', fontSize: 9, bold: true, margin: [10, 2, 0, 0] },
        { columns: [this.renderCheckbox('0 A 11 ANOS', data.p_faixa_etaria.anos_0_11), this.renderCheckbox('12 A 17 ANOS', data.p_faixa_etaria.anos_12_17), this.renderCheckbox('A PARTIR DE 18 ANOS', data.p_faixa_etaria.anos_18_mais)], margin: [10, 0] },

        { text: '16.02 - ALGUM DE SEUS FILHOS POSSUI ALGUMA DEFICIÊNCIA?', fontSize: 9, bold: true, margin: [10, 2, 0, 0] },
        { columns: [this.renderCheckbox(`SIM. QUANTOS? ${data.p_filhos_deficiencia.qtd}`, data.p_filhos_deficiencia.sim), this.renderCheckbox('NÃO', data.p_filhos_deficiencia.nao)], margin: [10, 0] },

        this.renderPergunta('17', 'VOCÊ ESTÁ VIVENDO ALGUM CONFLITO COM O (A) AGRESSOR (A) EM RELAÇÃO A GUARDA DO (S) FILHO (S), VISITAS OU PAGAMENTO DE PENSÃO?'),
        { columns: [this.renderCheckbox('SIM', !data.p_conflito_filhos.nao && !data.p_conflito_filhos.nao_tem_filhos_com_agressor), this.renderCheckbox('NÃO', data.p_conflito_filhos.nao), this.renderCheckbox('NÃO TENHO FILHO (S) COM O (A) AGRESSOR (A)', data.p_conflito_filhos.nao_tem_filhos_com_agressor)] },
        { text: 'SE SIM, ESPECIFIQUE:', fontSize: 8, margin: [10, 0] },
        { columns: [this.renderCheckbox('GUARDA DO(S) FILHO (S)', data.p_conflito_filhos.guarda), this.renderCheckbox('VISITAS', data.p_conflito_filhos.visitas), this.renderCheckbox('PAGAMENTO DE PENSÃO', data.p_conflito_filhos.pensao)]},

        this.renderPergunta('18', 'SEU (S) FILHO (S) JÁ PRESENCIARAM ATO (S) DE VIOLÊNCIA DO (A) AGRESSOR (A) CONTRA VOCÊ?'),
        { columns: [this.renderCheckbox('SIM', data.p_presenciaram), this.renderCheckbox('NÃO', !data.p_presenciaram)] },

        this.renderPergunta('19', 'VOCÊ SOFREU ALGUM TIPO DE VIOLÊNCIA DURANTE A GRAVIDEZ OU NOS TRÊS MESES POSTERIORES AO PARTO?'),
        { columns: [this.renderCheckbox('SIM', data.p_violencia_gravidez), this.renderCheckbox('NÃO', !data.p_violencia_gravidez)] },

        this.renderPergunta('20', 'SE VOCÊ ESTÁ EM UM NOVO RELACIONAMENTO, PERCEBEU QUE AS AMEAÇAS OU AGRESSÕES FÍSICAS AUMENTARAM EM RAZÃO DISSO?'),
        { columns: [this.renderCheckbox('SIM', data.p_novo_relacionamento), this.renderCheckbox('NÃO', !data.p_novo_relacionamento)] },

        this.renderPergunta('21', 'VOCÊ POSSUI ALGUMA DEFICIÊNCIA OU DOENÇAS DEGENERATIVA QUE ACARRETAM EM CONDIÇÕES LIMITANTES OU DE VULNERABILIDADE FÍSICA OU MENTAL?'),
        { columns: [
            this.renderCheckbox('SIM', data.p_possui_deficiencia.sim),
            { text: data.p_possui_deficiencia.qual ? `QUAL (IS): ${data.p_possui_deficiencia.qual}` : 'QUAL (IS):', fontSize: 9 },
            this.renderCheckbox('NÃO', data.p_possui_deficiencia.nao)
        ]},

        this.renderPergunta('22', 'COM QUAL COR/RAÇA VOCÊ SE IDENTIFICA:'),
        { columns: [
            this.renderCheckbox('BRANCA', data.p_cor_raca === 'BRANCA'),
            this.renderCheckbox('PRETA', data.p_cor_raca === 'PRETA'),
            this.renderCheckbox('PARDA', data.p_cor_raca === 'PARDA'),
            this.renderCheckbox('AMARELA/ORIENTAL', data.p_cor_raca === 'AMARELA/ORIENTAL'),
            this.renderCheckbox('INDÍGENA', data.p_cor_raca === 'INDIGENA')
        ]}
    ];
    return this.renderBlockContainer(conteudo);
  }

  private gerarBlocoIV(data: IBlocoIVData) {
    const conteudo = [
        this.renderPergunta('23', 'VOCÊ CONSIDERA QUE MORA EM BAIRRO, COMUNIDADE, ÁREA RURAL OU LOCAL DE RISCO DE VIOLÊNCIA?'),
        { columns: [this.renderCheckbox('SIM', data.p_mora_risco === 'SIM'), this.renderCheckbox('NÃO', data.p_mora_risco === 'NAO'), this.renderCheckbox('NÃO SEI', data.p_mora_risco === 'NAO_SEI')] },

        this.renderPergunta('24', 'VOCÊ SE CONSIDERA DEPENDENTE FINANCEIRA DO (A) AGRESSOR (A)?'),
        { columns: [this.renderCheckbox('SIM', data.p_dependente), this.renderCheckbox('NÃO', !data.p_dependente)] },

        this.renderPergunta('25', 'VOCÊ QUER E ACEITA ABRIGAMENTO TEMPORÁRIO?'),
        { columns: [this.renderCheckbox('SIM', data.p_aceita_abrigamento), this.renderCheckbox('NÃO', !data.p_aceita_abrigamento)] },
    ];
    return this.renderBlockContainer(conteudo);
  }

  private gerarOutrasInformacoes(texto: string) {
    return {
      table: {
        widths: ['*'],
        body: [[
            { text: texto || '\n\n\n\n', style: 'anotacoes', border: [true, true, true, true], borderColor: ['#000000', '#000000', '#000000', '#000000'], padding: 5, minHeight: 100 }
        ]]
      }, layout: { defaultBorder: false }
    };
  }

  private gerarTermoDeclaracao(assistida: Assistida) {
    return {
      stack: [
        { text: 'Declaro para os devidos fins que, as informações supra são verídicas e foram prestadas por mim,', fontSize: 10, alignment: 'justify', margin: [0, 0, 0, 30] },
        { text: '_______________________________________________________', alignment: 'center' },
        { text: assistida.getNome().toUpperCase(), alignment: 'center', bold: true, fontSize: 10 },
        { text: 'Assistida / terceiro comunicante', alignment: 'center', fontSize: 9 }
      ], margin: [20, 10]
    };
  }

  private gerarPreenchimentoProfissional(data: IPreenchimentoProfissional) {
    const conteudo = [
        this.renderCheckbox('ASSISTIDA RESPONDEU A ESTE FORMULÁRIO SEM AJUDA PROFISSIONAL', data.assistida_respondeu === 'SEM_AJUDA'),
        this.renderCheckbox('ASSISTIDA RESPONDEU A ESTE FORMULÁRIO COM O AUXÍLIO PROFISSIONAL', data.assistida_respondeu === 'COM_AUXILIO'),
        this.renderCheckbox('ASSISTIDA NÃO TEVE CONDIÇÕES DE RESPONDER A ESTE FORMULÁRIO', data.assistida_respondeu === 'SEM_CONDICOES'),
        this.renderCheckbox('ASSISTIDA RECUSOU-SE A PREENCHER O FORMULÁRIO', data.assistida_respondeu === 'RECUSOU'),
        this.renderCheckbox('TERCEIRO COMUNICANTE RESPONDEU A ESTE FORMULÁRIO', data.terceiro_comunicante),
        { text: ' ', margin: [0, 5] },
        { text: 'TIPO (S) DE VIOLÊNCIA IDENTIFICADA (S)', bold: true, fontSize: 9 },
        { columns: [
            this.renderCheckbox('FÍSICA', data.tipos_violencia.fisica),
            this.renderCheckbox('PSICOLÓGICA', data.tipos_violencia.psicologica),
            this.renderCheckbox('MORAL', data.tipos_violencia.moral),
            this.renderCheckbox('SEXUAL', data.tipos_violencia.sexual),
            this.renderCheckbox('PATRIMONIAL', data.tipos_violencia.patrimonial),
        ]}
    ];
    return this.renderBlockContainer(conteudo);
  }

  private gerarInfoAcolhimento() {
    return {
      ul: [
        'Toda a equipe deve preservar a escuta privilegiada/qualificada, evitando julgamentos, preconceitos e comentários desrespeitosos...',
        'Encaminhar os problemas apresentados pelas mulheres, oferecendo soluções possíveis...',
        'Garantir a privacidade no atendimento e a confidencialidade...',
        'Utilizar linguagem simples, aproximativa, inteligível e apropriada...'
      ], style: 'anotacoes', margin: [0, 5]
    };
  }

  private gerarRedeAcolhimento() {
    const criarContato = (titulo: string, texto: string) => {
        return { stack: [{ text: titulo, style: 'redeTitle' }, { text: texto, style: 'redeText', margin: [0, 2, 0, 10] }] };
    };
    return {
        columns: [
            { width: '*', stack: [
                    criarContato('CENTRAL DE ATENDIMENTO À MULHER 180', ''),
                    criarContato('POLÍCIA MILITAR 190', ''),
                    criarContato('ZAP DELAS 85 99814 0754', ''),
                    criarContato('CASA DA MULHER BRASILEIRA FORTALEZA', 'R. Tabuleiro do Norte, s/n - Couto Fernandes\n(85) 3108-2998'),
                    criarContato('NÚCLEO ESTADUAL DE ENFRENTAMENTO (DEFENSORIA)', 'R. Tabuleiro do Norte, s/n\n(85) 3108-2986 | nudem@defensoria.ce.def.br'),
                    criarContato('CENTRO DE REFERÊNCIA DA MULHER (CRM)', '(85) 3108-2965')
            ]},
            { width: '*', stack: [
                    criarContato('DELEGACIA DE DEFESA DA MULHER - DDM', '(85) 3108-2950 | ddmfortaleza@policiacivil.ce.gov.br'),
                    criarContato('CENTRO ESTADUAL DE REFERÊNCIA (CERAM)', '(85) 3108-2966'),
                    criarContato('1º JUIZADO VIOLÊNCIA DOMÉSTICA', '(85) 3108-2978'),
                    criarContato('2º JUIZADO VIOLÊNCIA DOMÉSTICA', '(85) 98732-6160'),
                    criarContato('CEPPM FORTALEZA', '(85) 3101-7679'),
                    criarContato('SECRETARIA DAS MULHERES', '(85) 3459-6122'),
                    criarContato('OAB/CE - COMISSÃO DA MULHER', '(85) 3216.1604')
            ]}
        ]
    };
  }
}