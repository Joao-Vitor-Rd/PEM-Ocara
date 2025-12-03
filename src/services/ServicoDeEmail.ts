import { Encaminhamento } from "../models/Rede-Apoio/Encaminhamento";
import * as nodemailer from 'nodemailer';
import { Transporter } from "nodemailer";
import { Buffer } from "buffer";
import type { MailOptions } from "nodemailer/lib/json-transport";

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

    public async enviarEmailAutomatico(encaminhamento: Encaminhamento, pdfAnexo?: Buffer): Promise<any> {
        const orgaoDestino = encaminhamento.getOrgaoDestino();
        const emailDestinatario = orgaoDestino.getEmail();
        const assunto = `Encaminhamento: ${encaminhamento.getMotivoEncaminhamento()}`;
        const corpoEmail = encaminhamento.getObservacoes();

        const mailOptions: MailOptions = {
            from: `"nomeRemetente" <${process.env.EMAIL_USER}>`,
            to: emailDestinatario,
            subject: assunto,
            text: corpoEmail
        };

        if (pdfAnexo) {
            console.log("ServicoDeEmail: Anexo PDF detectado, adicionando...");
            mailOptions.attachments = [
                {
                    filename: `encaminhamento_${encaminhamento.getCasoRelacionado().getProtocoloCaso()}.pdf`,
                    content: pdfAnexo,
                    contentType: 'application/pdf'
                }
            ];
        }

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Email enviado com sucesso para " + info.messageId);
            return info;
        } catch (error) {
            console.error("Erro ao enviar email: ", error);
            throw error; 
        }
    }
}