import { Encaminhamento } from "../models/Rede-Apoio/Encaminhamento";
import * as nodemailer from 'nodemailer';
import { Transporter } from "nodemailer";

export class ServicoDeEmail {
    private transporter: Transporter;


    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.SENHA_EMAIL_ORIGEM
            }
        });
    }

    public async enviarEmailAutomatico(encaminhamento: Encaminhamento): Promise<any> {
        const orgaoDestino = encaminhamento.getOrgaoDestino();
        const emailDestinatario = orgaoDestino.getEmail();
        const assunto = `Encaminhamento: ${encaminhamento.getMotivoEncaminhamento()}`;
        const corpoEmail = encaminhamento.getObservacoes();
        
        try {

        const info = await this.transporter.sendMail({
            from: `"nomeRemetente" <${process.env.EMAIL_USER}>`,
            to: emailDestinatario,
            subject: assunto,
            text: corpoEmail
        });
            console.log("Email enviado com sucesso para " + info.messageId);
            return info;
        } catch (err) {
            console.error("Erro ao enviar email: ", err);
            throw err;
        }
    }
}