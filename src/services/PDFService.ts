import { CasoService } from "../services/CasoService";
import { app } from 'electron';
import { Caso } from "../models/Caso/Caso";
import { Assistida } from "../models/assistida/Assistida";
import { 
  PdfUtil, 
  IFormularioCompleto, 
  IBlocoIData, 
  IBlocoIIData, 
  IBlocoIIIData, 
  IBlocoIVData, 
  IPreenchimentoProfissional 
} from "../utils/PdfUtil";

export class PdfService {
  
  private pdfUtil: PdfUtil;
  private casoService: CasoService;

  constructor(casoService: CasoService) {
    this.casoService = casoService;
    this.pdfUtil = new PdfUtil();
  }

  public async gerarPdfPreview(caso: Caso): Promise<string> {
    const assistida = caso.getAssistida();
    if (!assistida) throw new Error("Caso não possui uma assistida vinculada para o preview.");
    
    const dadosFormulario: IFormularioCompleto = this.mapFormularioCompleto(caso, assistida);
    return this.pdfUtil.gerarPdfFormulario(assistida, dadosFormulario, app.getPath('temp'));
  }

  public async criarPdfDeFormulario(protocoloCaso: number): Promise<string> {
    const caso = this.casoService.getCaso(protocoloCaso);
    if (!caso) throw new Error(`Caso com protocolo ${protocoloCaso} não encontrado.`);
    
    const assistida = caso.getAssistida();
    if (!assistida) throw new Error("Caso não possui uma assistida vinculada.");
    
    const dadosFormulario: IFormularioCompleto = this.mapFormularioCompleto(caso, assistida);
    const desktopPath = app.getPath('desktop');
    console.log('Tentando salvar em:', desktopPath);
    
    return this.pdfUtil.gerarPdfFormulario(assistida, dadosFormulario, desktopPath);
  };

  private mapFormularioCompleto(caso: Caso, assistida: Assistida): IFormularioCompleto {
    
    const agressor = caso.getAgressor();
    const historicoViolencia = caso.getHistoricoViolencia();
    const sobreAgressor = caso.getSobreAgressor();
    const sobreVoce = caso.getSobreVoce();
    const outrasInformacoes = caso.getOutrasInformacoesImportantes();
    const outrasInformacoesEncaminhamentos = caso.getOutrasInformacoesEncaminhamento();
    const preenchimentoProfissional = caso.getPreenchimentoProfissional();
    const normalize = (s: string) => s ? s.toUpperCase().trim().replace(/\s+/g, '_') : '';
    
    const checkIncludes = (arr: string[], val: string) => arr.some(item => normalize(item).includes(val));

    const ameacasRaw = historicoViolencia?.getAmeacaFamiliar() || [];
    const ameacas = ameacasRaw.map(normalize);

    const agressoesGravesRaw = historicoViolencia?.getAgressaoFisica() || [];
    const agressoesGraves = agressoesGravesRaw.map(normalize);

    const outrasAgressoesRaw = historicoViolencia?.getOutrasFormasViolencia() || [];
    const outrasAgressoes = outrasAgressoesRaw.map(normalize);
    
    const comportamentosRaw = historicoViolencia?.getComportamentosAgressor() || [];
    const comportamentos = comportamentosRaw.map(normalize);

    const blocoI: IBlocoIData = {
     p_ameaca: ameacas.length === 0
        ? 'NAO'
        : checkIncludes(ameacas, 'ARMA')
        ? 'ARMA_FOGO'
        : checkIncludes(ameacas, 'FACA')
        ? 'FACA'
        : 'OUTRA',
     p_agressoes: {
        queimadura: checkIncludes(agressoesGraves, 'QUEIMADURA'),
        enforcamento: checkIncludes(agressoesGraves, 'ENFORCAMENTO'),
        sufocamento: checkIncludes(agressoesGraves, 'SUFOCAMENTO'),
        tiro: checkIncludes(agressoesGraves, 'TIRO'),
        afogamento: checkIncludes(agressoesGraves, 'AFOGAMENTO'),
        facada: checkIncludes(agressoesGraves, 'FACA'), 
        paulada: checkIncludes(agressoesGraves, 'PAULADA'),
        nenhuma: agressoesGraves.length === 0
     },
     p2_agressoes: {
        socos: checkIncludes(outrasAgressoes, 'SOCOS'),
        chutes: checkIncludes(outrasAgressoes, 'CHUTES'),
        tapas: checkIncludes(outrasAgressoes, 'TAPAS'),
        empurroes: checkIncludes(outrasAgressoes, 'EMPURR'),
        puxoesCabelo: checkIncludes(outrasAgressoes, 'PUX'),
        nenhuma: outrasAgressoes.length === 0
     },
     p_sexoForcado: historicoViolencia?.getAbusoSexual() || false,
     p_comportamentos: {
      frase_ameaca: checkIncludes(comportamentos, 'FRASE') || checkIncludes(comportamentos, 'NINGUEM'),
      perseguiu_vigiou: checkIncludes(comportamentos, 'PERSEGUIU') || checkIncludes(comportamentos, 'VIGIOU'),
      proibiu_visitas: checkIncludes(comportamentos, 'VISITAS'),
      proibiu_trabalhar: checkIncludes(comportamentos, 'TRABALHAR') || checkIncludes(comportamentos, 'ESTUDAR'),
      telefonemas_insistentes: checkIncludes(comportamentos, 'TELEFONEMA') || checkIncludes(comportamentos, 'MENSAGEM'),
      impediu_dinheiro: checkIncludes(comportamentos, 'DINHEIRO') || checkIncludes(comportamentos, 'BENS'),
      ciume_excessivo: checkIncludes(comportamentos, 'CIUME') || checkIncludes(comportamentos, 'CONTROLE'),
      nenhum: comportamentos.length === 0,
     },
     p_ocorrencia: historicoViolencia?.getOcorrenciaPolicialMedidaProtetivaAgressor() || false,
     p_agressoes_recentes: historicoViolencia?.getAgressoesMaisFrequentesUltimamente() || false,
  };

  const usoDrogasRaw = sobreAgressor?.getUsoDrogasAlcool() || [];
  const usoDrogas = usoDrogasRaw.map(normalize);
  
  const doencaMental = normalize(sobreAgressor?.getDoencaMental() || 'NAO_SEI');
  const desempregado = normalize(sobreAgressor?.getAgressorDesempregado() || 'NAO_SEI');
  const arma_fogo = normalize(sobreAgressor?.getAgressorPossuiArmaFogo() || 'NAO_SEI');
  
  const agrediuOutrosRaw = sobreAgressor?.getAgressorAmeacouAlguem() || [];
  const agrediu_outros = agrediuOutrosRaw.map(normalize);

  const blocoII: IBlocoIIData = {
     p_uso_drogas: {
      alcool: checkIncludes(usoDrogas, 'ALCOOL'),
      drogas: checkIncludes(usoDrogas, 'DROGAS'),
      nao: !checkIncludes(usoDrogas, 'ALCOOL') && !checkIncludes(usoDrogas, 'DROGAS'),
      nao_sei: checkIncludes(usoDrogas, 'NAO_SEI'),
     },

     p_doenca_mental: doencaMental.includes('SIM') && doencaMental.includes('SEM')
     ? 'SIM_SEM_MEDICACAO'
     : doencaMental.includes('SIM')
     ? 'SIM_MEDICACAO'
     : doencaMental.includes('NAO_SEI')
     ? 'NAO_SEI'
     : 'NAO',

     p_descumpriu_medida: sobreAgressor?.getAgressorCumpriuMedidaProtetiva() || false,
     p_tentou_suicidio: sobreAgressor?.getAgressorTentativaSuicidio() || false,

     p_desempregado: desempregado.includes('SIM') ? 'SIM' : desempregado.includes('NAO') && !desempregado.includes('SEI') ? 'NAO' : 'NAO_SEI',
     p_acesso_arma: arma_fogo.includes('SIM') ? 'SIM' : arma_fogo.includes('NAO') && !arma_fogo.includes('SEI') ? 'NAO' : 'NAO_SEI',

     p_agrediu_outros: {
      sim: agrediu_outros.some(x => x.includes('SIM')),
      filhos: checkIncludes(agrediu_outros, 'FILHOS'),
      familiares: checkIncludes(agrediu_outros, 'FAMILIAR'),
      outras_pessoas: checkIncludes(agrediu_outros, 'OUTRAS') || checkIncludes(agrediu_outros, 'DESCONHECIDA'),
      animais: checkIncludes(agrediu_outros, 'ANIMAIS'),
      nao: checkIncludes(agrediu_outros, 'NAO') && !checkIncludes(agrediu_outros, 'SEI'),
      nao_sei: checkIncludes(agrediu_outros, 'NAO_SEI')
     }
  };

  const separacao = normalize(sobreVoce?.getSeparacaoRecente() || 'NAO');

  // Lógica Questão 21 (Deficiência)
  const deficienciaTexto = normalize(sobreVoce?.getPossuiDeficienciaDoenca() || '');
  const possuiDeficienciaSim = deficienciaTexto.length > 0 && !deficienciaTexto.includes('NAO');
  const possuiDeficienciaNao = deficienciaTexto.includes('NAO') || deficienciaTexto.length === 0;
  
  const blocoIII: IBlocoIIIData = {
    p_separacao_recente: separacao.includes('SIM') && separacao.includes('SEPAREI')
    ? 'SIM_SEPAREI'
    : separacao.includes('SIM') && separacao.includes('TENTEI')
    ? 'SIM_TENTEI'
    : 'NAO',

    p_tem_filhos: {
      com_agressor: sobreVoce?.getTemFilhosComAgressor() || false,
      qtd_agressor: sobreVoce?.getQntFilhosComAgressor() || 0,
      outro_relacionamen: sobreVoce?.getTemFilhosOutroRelacionamento() || false,
      qtd_relacionamen: sobreVoce?.getQntFilhosOutroRelacionamento() || 0,
      nao: !sobreVoce?.getTemFilhosComAgressor() && !sobreVoce?.getTemFilhosOutroRelacionamento(),
    },
    p_faixa_etaria: {
      anos_0_11: (sobreVoce?.getFaixaFilhos() || []).some(f => f.includes('0') || f.includes('11')),
      anos_12_17: (sobreVoce?.getFaixaFilhos() || []).some(f => f.includes('12') || f.includes('17')),
      anos_18_mais: (sobreVoce?.getFaixaFilhos() || []).some(f => f.includes('18')),
    },
    p_filhos_deficiencia: {
      sim: (sobreVoce?.getFilhosComDeficiencia() || 0) > 0,
      qtd: sobreVoce?.getFilhosComDeficiencia() || 0,
      nao: (sobreVoce?.getFilhosComDeficiencia() || 0) === 0,
    },
    p_conflito_filhos: {
      guarda: normalize(sobreVoce?.getConflitoAgressor() || '').includes('GUARDA'),
      visitas: normalize(sobreVoce?.getConflitoAgressor() || '').includes('VISITA'),
      pensao: normalize(sobreVoce?.getConflitoAgressor() || '').includes('PENSAO'),
      nao: normalize(sobreVoce?.getConflitoAgressor() || '').includes('NAO'),
      nao_tem_filhos_com_agressor: !sobreVoce?.getTemFilhosComAgressor(),
    },
    p_presenciaram: sobreVoce?.getFilhosPresenciaramViolencia() || false,
    p_violencia_gravidez: sobreVoce?.getViolenciaDuranteGravidez() || false,
    p_novo_relacionamento: sobreVoce?.getNovoRelacionamentoAumentouAgressao() || false,
    p_possui_deficiencia: {
      sim: possuiDeficienciaSim,
      qual: sobreVoce?.getPossuiDeficienciaDoenca() || '',
      nao: possuiDeficienciaNao
    },
    p_cor_raca: normalize(sobreVoce?.getCorRaca() || '').includes('INDIGENA') ? 'INDIGENA' : 
                normalize(sobreVoce?.getCorRaca() || '').includes('PRETA') ? 'PRETA' :
                normalize(sobreVoce?.getCorRaca() || '').includes('PARDA') ? 'PARDA' :
                normalize(sobreVoce?.getCorRaca() || '').includes('AMARELA') ? 'AMARELA/ORIENTAL' : 'BRANCA'
  };

  const mora_risco = normalize(String(outrasInformacoes?.getMoraEmAreaRisco() || 'NAO'));
  
  const blocoIV: IBlocoIVData = {
     p_mora_risco: mora_risco.includes('SIM') || mora_risco == 'TRUE' ? 'SIM' : 'NAO',
     p_dependente: outrasInformacoes?.getDependenteFinanceiroAgressor() || false,
     p_aceita_abrigamento: outrasInformacoes?.getAceitaAbrigamentoTemporario() || false,
  };

  const outrasInformacoesTexto = outrasInformacoesEncaminhamentos?.getAnotacoesLivres() || '';
  
  // Lógica Tipos de Violência (ignora acentos)
  const tiposViolenciaArray = preenchimentoProfissional?.getTipoViolencia() || [];
  
  const hasViolencia = (tipo: string) => {
      const cleanString = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
      const tipoClean = cleanString(tipo);
      return tiposViolenciaArray.some(t => cleanString(t).includes(tipoClean));
  };

  const preenchimento: IPreenchimentoProfissional = {
      assistida_respondeu: preenchimentoProfissional?.getAssistidaRespondeuSemAjuda()
          ? 'SEM_AJUDA'
          : preenchimentoProfissional?.getAssistidaRespondeuComAuxilio()
          ? 'COM_AUXILIO'
          : preenchimentoProfissional?.getAssistidaSemCondicoes()
          ? 'SEM_CONDICOES'
          : 'RECUSOU',
      terceiro_comunicante: preenchimentoProfissional?.getTerceiroComunicante() || false,
      tipos_violencia: {
          fisica: hasViolencia('FISICA'),
          psicologica: hasViolencia('PSICOLOGICA'),
          moral: hasViolencia('MORAL'),
          sexual: hasViolencia('SEXUAL'),
          patrimonial: hasViolencia('PATRIMONIAL'),
      }
    };

    return {
        atendimento: {
            codigo: assistida.getProtocolo(),
            data: caso.getData().toLocaleDateString('pt-BR'),
            nucleo: 'PSICOSSOCIAL',
            responsavel: caso.getProfissionalResponsavel(),
        },
        agressor: {
            nome: agressor?.getNome() || '',
            idade: agressor?.getIdade() || 0,
            vinculo: agressor?.getVinculoAssistida() || '',
            dataFato: agressor?.getDataOcorrida()?.toLocaleDateString('pt-BR') || '',
        },
        blocoI,
        blocoII,
        blocoIII,
        blocoIV,
        outrasInformacoes: outrasInformacoesTexto,
        preenchimentoProfissional: preenchimento
    };
  }
}