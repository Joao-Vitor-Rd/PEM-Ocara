import { CasoService } from "../services/CasoService";
import { app } from 'electron';
import { Caso } from "../models/Caso/Caso";
import { Assistida } from "../models/assistida/Assistida";
import { PdfUtil, IFormularioCompleto, IAtendimentoData, IAgressorData, IBlocoIData, IBlocoIIData, IBlocoIIIData, IBlocoIVData, IPreenchimentoProfissional } from "../utils/PdfUtil";

export class PdfService {
  
  private pdfUtil: PdfUtil;
  private casoService: CasoService;

  constructor(casoService: CasoService) {
    this.casoService = casoService;
    this.pdfUtil = new PdfUtil();
  }

  public async gerarPdfPreview(caso: Caso): Promise<string> {
    const assistida = caso.getAssistida();
    
    if (!assistida) {
      throw new Error("Caso não possui uma assistida vinculada para o preview.");
    }

    const dadosFormulario: IFormularioCompleto = this.mapFormularioCompleto(caso, assistida);

    return this.pdfUtil.gerarPdfFormulario(assistida, dadosFormulario, app.getPath('temp'));
  }

  public async criarPdfDeFormulario(protocoloCaso: number): Promise<string> {
    
    const caso = this.casoService.getCaso(protocoloCaso);
    if (!caso) {
      throw new Error(`Caso com protocolo ${protocoloCaso} não encontrado.`);
    }

    const assistida = caso.getAssistida();
    if (!assistida) {
      throw new Error("Caso não possui uma assistida vinculada.");
    }
  
  const dadosFormulario: IFormularioCompleto = this.mapFormularioCompleto(caso, assistida);

  return this.pdfUtil.gerarPdfFormulario(assistida, dadosFormulario);
};

  private mapFormularioCompleto(caso: Caso, assistida: Assistida): IFormularioCompleto {
    
    const agressor = caso.getAgressor();
    const historicoViolencia = caso.getHistoricoViolencia();
    const sobreAgressor = caso.getSobreAgressor();
    const sobreVoce = caso.getSobreVoce();
    const outrasInformacoes = caso.getOutrasInformacoesImportantes();
    const outrasInformacoesEncaminhamentos = caso.getOutrasInformacoesEncaminhamento();
    const preenchimentoProfissional = caso.getPreenchimentoProfissional();

    const atendimento: IAtendimentoData = {
      codigo: assistida.getProtocolo(),
      data: caso.getData().toLocaleDateString('pt-BR'),
      nucleo: 'PSICOSSOCIAL',
      responsavel: caso.getProfissionalResponsavel(),
    };

    const agressorData: IAgressorData = {
      nome: agressor?.getNome() || '',
      idade: agressor?.getIdade() || 0,
      vinculo: agressor?.getVinculoAssistida() || '',
      dataFato: agressor?.getDataOcorrida()?.toLocaleDateString('pt-BR') || '',
    };
    
    const ameacas = (historicoViolencia?.getAmeacaFamiliar() || []).map(a => a.toUpperCase());
    const agressoesGraves = (historicoViolencia?.getAgressaoFisica() || []).map(a => a.toUpperCase());
    const outrasAgressoes = (historicoViolencia?.getOutrasFormasViolencia() || []).map(f => f.toUpperCase());
    const comportamentos = historicoViolencia?.getComportamentosAgressor() || [];

    const blocoI: IBlocoIData = {
     p_ameaca: ameacas.length === 0
        ? 'NAO'
        : ameacas.includes('ARMA_FOGO')
        ? 'ARMA_FOGO'
        : ameacas.includes('FACA')
        ? 'FACA'
        : 'OUTRA',
     p_agressoes: {
        queimadura: agressoesGraves.includes('QUEIMADURA'),
        enforcamento: agressoesGraves.includes('ENFORCAMENTO'),
        sufocamento: agressoesGraves.includes('SUFOCAMENTO'),
        tiro: agressoesGraves.includes('TIRO'),
        afogamento: agressoesGraves.includes('AFOGAMENTO'),
        facada: agressoesGraves.includes('FACADA'),
        paulada: agressoesGraves.includes('PAULADA'),
        nenhuma: agressoesGraves.length === 0
     },
     p2_agressoes: {
        socos: outrasAgressoes.includes('SOCOS'),
        chutes: outrasAgressoes.includes('CHUTES'),
        tapas: outrasAgressoes.includes('TAPAS'),
        empurroes: outrasAgressoes.includes('EMPURROES'),
        puxoesCabelo: outrasAgressoes.includes('PUXOESCABELO'),
        nenhuma: outrasAgressoes.length === 0
     },
     p_sexoForcado: historicoViolencia?.getAbusoSexual() || false,
     p_comportamentos: {
      frase_ameaca: comportamentos.includes('FRASE_NINGUEM'),
      perseguiu_vigiou: comportamentos.includes('PERSEGUIU'),
      proibiu_visitas: comportamentos.includes('PROIBIU_VISITAS'),
      proibiu_trabalhar: comportamentos.includes('PROIBIU_TRABALHAR'),
      telefonemas_insistentes: comportamentos.includes('TELEFONEMAS'),
      impediu_dinheiro: comportamentos.includes('IMPEDIU_DINHEIRO'),
      ciume_excessivo: comportamentos.includes('CIUME_EXCESSIVO'),
      nenhum: comportamentos.length === 0,
     },
     p_ocorrencia: historicoViolencia?.getOcorrenciaPolicialMedidaProtetivaAgressor() || false,
     p_agressoes_recentes: historicoViolencia?.getAgressoesMaisFrequentesUltimamente() || false,
  };

  const usoDrogas = sobreAgressor?.getUsoDrogasAlcool() || [];
  const doencaMental = sobreAgressor?.getDoencaMental().toUpperCase() || 'NAO_SEI';
  const medida_protetiva = sobreAgressor?.getAgressorCumpriuMedidaProtetiva() || false;
  const desempregado = sobreAgressor?.getAgressorDesempregado() || 'NAO_SEI';
  const tentativa_suicidio = sobreAgressor?.getAgressorTentativaSuicidio() || false;
  const arma_fogo = sobreAgressor?.getAgressorPossuiArmaFogo() || 'NAO_SEI';
  const agrediu_outros = sobreAgressor?.getAgressorAmeacouAlguem() || [];

  const blocoII: IBlocoIIData = {
     p_uso_drogas: {
      alcool: usoDrogas.includes('ALCOOL'),
      drogas: usoDrogas.includes('DROGAS'),
      nao: !usoDrogas.includes('ALCOOL') && !usoDrogas.includes('DROGAS'),
      nao_sei: usoDrogas.includes('NAO_SEI') || false,
     },

     p_doenca_mental: doencaMental.includes('SIM_MEDICACAO')
     ? 'SIM_MEDICACAO'
    : doencaMental.includes('SIM_SEM_MEDICACAO')
     ? 'SIM_SEM_MEDICACAO'
     : doencaMental.includes('NAO')
     ? 'NAO'
     : 'NAO_SEI',

     p_descumpriu_medida: medida_protetiva,
     p_tentou_suicidio: tentativa_suicidio,

     p_desempregado: desempregado.includes('SIM')
     ? 'SIM'
     : desempregado.includes('NAO')
     ? 'NAO'
     : 'NAO_SEI',

     p_acesso_arma: arma_fogo.includes('SIM')
     ? 'SIM'
     : arma_fogo.includes('NAO')
     ? 'NAO'
     : 'NAO_SEI',

     p_agrediu_outros: {
      sim: agrediu_outros.includes('SIM'),
      filhos: agrediu_outros.includes('FILHOS'),
      familiares: agrediu_outros.includes('FAMILIARES'),
      outras_pessoas: agrediu_outros.includes('OUTRAS_PESSOAS'),
      animais: agrediu_outros.includes('ANIMAIS'),
      nao: agrediu_outros.includes('NAO'),
      nao_sei: agrediu_outros.includes('NAO_SEI')
     }
  };

  const separacao = sobreVoce?.getSeparacaoRecente() || 'NAO';
  const filhos_agressor = sobreVoce?.getTemFilhosComAgressor() || false;
  const qnt_filhos_agressor = sobreVoce?.getQntFilhosComAgressor() || 0;
  const filhos_outro_relacionamento = sobreVoce?.getTemFilhosOutroRelacionamento() || false;
  const qnt_filhos_outro_relacionamento = sobreVoce?.getQntFilhosOutroRelacionamento() || 0;
  const faixa_filhos = sobreVoce?.getFaixaFilhos() || [];
  const qnt_deficiencia = sobreVoce?.getFilhosComDeficiencia() || 0;
  const conflito_filhos = sobreVoce?.getConflitoAgressor() || 'NAO';
  const presenciaram = sobreVoce?.getFilhosPresenciaramViolencia() || false;
  const violencia_gravidez = sobreVoce?.getViolenciaDuranteGravidez() || false;
  const novo_relacionamento = sobreVoce?.getNovoRelacionamentoAumentouAgressao() || false;
  const possui_deficiencia = sobreVoce?.getPossuiDeficienciaDoenca() || 'NAO';
  const cor = sobreVoce?.getCorRaca();

  const blocoIII: IBlocoIIIData = {
    p_separacao_recente: separacao.includes('SIM_SEPAREI')
    ? 'SIM_SEPAREI'
    : separacao.includes('SIM_TENTEI')
    ? 'SIM_TENTEI'
    : 'NAO',

    p_tem_filhos: {
      com_agressor: filhos_agressor,
      qtd_agressor: qnt_filhos_agressor,
      outro_relacionamen: filhos_outro_relacionamento,
      qtd_relacionamen: qnt_filhos_outro_relacionamento,
      nao: !filhos_agressor && !filhos_outro_relacionamento,
    },

    p_faixa_etaria: {
      anos_0_11: faixa_filhos.includes('0 a 11 ANOS'),
      anos_12_17: faixa_filhos.includes('12 a 17 ANOS'),
      anos_18_mais: faixa_filhos.includes('A PARTIR DE 18 ANOS'),
    },

    p_filhos_deficiencia: {
      sim: qnt_deficiencia > 0,
      nao: qnt_deficiencia === 0,
      qtd: qnt_deficiencia,
    },
    
    p_conflito_filhos: {
      guarda: conflito_filhos.includes('GUARDA'),
      visitas: conflito_filhos.includes('VISITAS'),
      pensao: conflito_filhos.includes('PENSAO'),
      nao: conflito_filhos.includes('NAO'),
      nao_tem_filhos_com_agressor: !qnt_filhos_agressor,
    },

    p_presenciaram: presenciaram,
    p_violencia_gravidez: violencia_gravidez,
    p_novo_relacionamento: novo_relacionamento,

    p_possui_deficiencia: {
      sim: possui_deficiencia.includes('SIM'),
      qual: possui_deficiencia.includes('SIM') ? possui_deficiencia : '',
      nao: possui_deficiencia.includes('NAO'),
    },

    p_cor_raca: cor?.includes('INDIGENA')
      ? 'INDIGENA'
      : cor?.includes('PRETA')
      ? 'PRETA'
      : cor?.includes('PARDA')
      ? 'PARDA'
      : cor?.includes('AMARELA/ORIENTAL')
      ? 'AMARELA/ORIENTAL'
      : 'BRANCA'
  };

  const mora_risco = String(outrasInformacoes?.getMoraEmAreaRisco() || 'NAO').toUpperCase();
  const dependente_financeiro = outrasInformacoes?.getDependenteFinanceiroAgressor() || false;
  const aceita_abrigamento = outrasInformacoes?.getAceitaAbrigamentoTemporario() || false;

  const blocoIV: IBlocoIVData = {
     p_mora_risco: mora_risco.includes('SIM') || mora_risco == 'TRUE'
     ? 'SIM'
     : 'NAO',

     p_dependente: dependente_financeiro,
     p_aceita_abrigamento: aceita_abrigamento,
    };

 const outrasInformacoesTexto = outrasInformacoesEncaminhamentos?.getAnotacoesLivres() || '';

  const tiposViolenciaArray = preenchimentoProfissional?.getTipoViolencia() || [];
  const tipoViolencia = tiposViolenciaArray.map(t => t.toUpperCase()).join(', ') || '';

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
          fisica: tipoViolencia.includes('FISICA'),
          psicologica: tipoViolencia.includes('PSICOLOGICA'),
          moral: tipoViolencia.includes('MORAL'),
          sexual: tipoViolencia.includes('SEXUAL'),
          patrimonial: tipoViolencia.includes('PATRIMONIAL'),
      }
    };

    const formularioCompleto: IFormularioCompleto = {
          atendimento: atendimento,
          agressor: agressorData,
          blocoI: blocoI,
          blocoII: blocoII,
          blocoIII: blocoIII,
          blocoIV: blocoIV,
          outrasInformacoes: outrasInformacoesTexto,
          preenchimentoProfissional: preenchimento
    };
  return formularioCompleto;
  }
}