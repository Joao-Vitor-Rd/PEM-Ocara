import { CasoService } from "../services/CasoService";
import { Caso } from "../models/Caso/Caso";
import { HistoricoViolencia } from "../models/Caso/HistoricoViolencia";
import { Assistida } from "../models/assistida/Assistida";
import { PdfUtil, IFormularioCompleto, IAtendimentoData, IAgressorData, IBlocoIData, IBlocoIIData, IBlocoIIIData, IBlocoIVData, IPreenchimentoProfissional } from "../utils/PdfUtil";

export class PdfService {
  
  private pdfUtil: PdfUtil;
  private casoService: CasoService;

  constructor(casoService: CasoService) {
    this.casoService = casoService;
    this.pdfUtil = new PdfUtil();
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
}

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

    const formasViolencia = historicoViolencia?.getOutrasFormasViolencia().toUpperCase() || '';
    const comportamentos = historicoViolencia?.getComportamentosAgressor() || [];

    const blocoI: IBlocoIData = {
     p_ameaca: !historicoViolencia?.getAmeacaFamiliar()
        ? 'NAO'
        : formasViolencia.includes('ARMA_FOGO')
        ? 'ARMA_FOGO'
        : formasViolencia.includes('FACA')
        ? 'FACA'
        : 'OUTRA',
     p_agressoes: {
        queimadura: formasViolencia.includes('QUEIMADURA'),
        enforcamento: formasViolencia.includes('ENFORCAMENTO'),
        sufocamento: formasViolencia.includes('SUFOCAMENTO'),
        tiro: formasViolencia.includes('TIRO'),
        afogamento: formasViolencia.includes('AFOGAMENTO'),
        facada: formasViolencia.includes('FACADA'),
        paulada: formasViolencia.includes('PAULADA'),
        nenhuma: !historicoViolencia?.getAgressaoFisica()
     },
     p2_agressoes: {
        socos: formasViolencia.includes('SOCOS'),
        chutes: formasViolencia.includes('CHUTES'),
        tapas: formasViolencia.includes('TAPAS'),
        empurroes: formasViolencia.includes('EMPURROES'),
        puxoesCabelo: formasViolencia.includes('PUXOESCABELO'),
        nenhuma: !historicoViolencia?.getAgressaoFisica()
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
  }

  const usoDrogas = sobreAgressor?.getUsoDrogasAlcool() || [];
  const doencaMental = sobreAgressor?.getDoencaMental().toUpperCase() || [];
  const desempregado = sobreAgressor?.getDesempregado() || false;
  const p_tentativa_suicidio = sobreAgressor?.getAgressorTentativaSuicidio() || false;

  const blocoII: IBlocoIIData = {
     p_uso_drogas: {
      alcool: this.usoDrogas.includes('ALCOOL'),
      drogas: this.usoDrogas.includes('DROGAS'),
      nao: !this.usoDrogas.includes('ALCOOL') && !this.usoDrogas.includes('DROGAS'),
      nao_sei: this.usoDrogas.includes('NAO_SEI') || false,
     },
     p_agressoes: {
        queimadura: formasViolencia.includes('QUEIMADURA'),
        enforcamento: formasViolencia.includes('ENFORCAMENTO'),
        sufocamento: formasViolencia.includes('SUFOCAMENTO'),
        tiro: formasViolencia.includes('TIRO'),
        afogamento: formasViolencia.includes('AFOGAMENTO'),
        facada: formasViolencia.includes('FACADA'),
        paulada: formasViolencia.includes('PAULADA'),
        nenhuma: !historicoViolencia?.getAgressaoFisica()
     },
     p2_agressoes: {
        socos: formasViolencia.includes('SOCOS'),
        chutes: formasViolencia.includes('CHUTES'),
        tapas: formasViolencia.includes('TAPAS'),
        empurroes: formasViolencia.includes('EMPURROES'),
        puxoesCabelo: formasViolencia.includes('PUXOESCABELO'),
        nenhuma: !historicoViolencia?.getAgressaoFisica()
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
  }


  private mapBlocoI(historico?: HistoricoViolencia): IBlocoIData {
    if (!historico) {
      throw new Error("Dados do Histórico de Violência não encontrados.");
    }

    let p_ameaca = 'NAO';
    if ((historico as any).getAmeacaFamiliar()) {
      if (formasViolencia.includes('ARMA_FOGO')) p_ameaca = 'ARMA_FOGO';
      else if (formasViolencia.includes('FACA')) p_ameaca = 'FACA';
      else p_ameaca = 'OUTRA'; 
      
    const p_agressoes = {
      queimadura: formasViolencia.includes('QUEIMADURA'),
      enforcamento: formasViolencia.includes('ENFORCAMENTO'),
      sufocamento: formasViolencia.includes('SUFOCAMENTO'),
      tiro: formasViolencia.includes('TIRO'),
      afogamento: formasViolencia.includes('AFOGAMENTO'),
      facada: formasViolencia.includes('FACADA'),
      paulada: formasViolencia.includes('PAULADA'),
      nenhuma: false,
    };
    
    const p2_agressoes = {
      socos: formasViolencia.includes('SOCOS'),
      chutes: formasViolencia.includes('CHUTES'),
      tapas: formasViolencia.includes('TAPAS'),
      empurroes: formasViolencia.includes('EMPURROES'),
      puxoesCabelo: formasViolencia.includes('PUXOESCABELO'),
      nenhuma: false,
    };

    const p_sexo_forcado = (historico as any).getAbusoSexual() || false;

    const p_comportamentos = {
      frase_ninguem: comportamentos.includes('FRASE_NINGUEM'),
      perseguiu_vigiu: comportamentos.includes('PERSEGUIU'),
      proibiu_visitas: comportamentos.includes('PROIBIU_VISITAS'),
      proibiu_trabalhar: comportamentos.includes('PROIBIU_TRABALHAR'),
      telefonemas_insistentes: comportamentos.includes('TELEFONEMAS'),
      impediu_dinheiro: comportamentos.includes('IMPEDIU_DINHEIRO'),
      ciume_excessivo: comportamentos.includes('CIUME_EXCESSIVO'),
      nenhum: comportamentos.length === 0,
    };
    
    }
  }
    return formularioCompleto;
}