
// Import de modelos:
import { OrgaoRedeApoio } from "../models/Rede-Apoio/OrgaoRedeApoio";
import { Encaminhamento } from "../models/Rede-Apoio/Encaminhamento";
import { Caso } from "../models/Caso/Caso";
import { AssistenteSocial } from "../models/AssistenteSocial";
import { Alteracao } from "../models/Caso/Alteracao";

// Import de serviços:
import { ServicoDeEmail } from "../services/ServicoDeEmail";
//falta serviço de gerarPDF

export class ControladorEncaminhamento {
    private servicoDeEmail: ServicoDeEmail;


    constructor(servicoDeEmail: ServicoDeEmail) {
        this.servicoDeEmail = servicoDeEmail;

    }

    public async registrarEncaminhamento(caso: Caso, orgao: OrgaoRedeApoio, motivo: string, observacoes: string, assistenteSocial: AssistenteSocial) {
        try {

            // ADICIONAR LOGICA PARA GERAR PDF DO ENCAMINHAMENTO


            const encaminhamento = new Encaminhamento(new Date(), motivo, observacoes, orgao, assistenteSocial, caso);
            const infoEmail = await this.servicoDeEmail.enviarEmailAutomatico(encaminhamento);

            const tipo = "Encaminhamento";
            //ATUALIZAR A DESCRIÇÃO QUANDO TIVER O PDF
            const descricao = `Encaminhamento para o órgão ${orgao.getNome()} realizado com sucesso. Email enviado com ID: ${infoEmail.messageId}`;
            const data = new Date();
            const responsavel = assistenteSocial.getName();

            const novoRegistroHistorico = new Alteracao(tipo, descricao, data, responsavel);

            caso.getHistorico().adicionarAlteracao(novoRegistroHistorico);
            caso.adicionarEncaminhamento(encaminhamento);

            //Adicionar logica para salvar no banco de dados na próxima etapa NÃO ESQUECER DISSO
            return encaminhamento;
            } catch(error){
                console.error("Controlador: Falha ao enviar email automático: ", error);

                throw new Error("Falha ao enviar o e-mail. O encaminhamento não foi salvo.");
            }
    }
}