import * as nodemailer from 'nodemailer';
import { ICredencialRepository } from '../repository/ICredencialRepository';
import { Credencial } from '../models/Credencial';

export class CredencialService {
    private repository: ICredencialRepository;

    constructor(repository: ICredencialRepository) {
        this.repository = repository;
    }

    /**
     * Retorna as credenciais salvas no banco.
     */
    async obterCredenciais(): Promise<Credencial | null> {
        return await this.repository.obterCredenciais();
    }

    /**
     * Atualiza o e-mail e senha do sistema.
     * ANTES de salvar, testa se a conexão SMTP funciona.
     */
    async atualizarCredenciais(email: string, senha: string, servico: string = 'gmail'): Promise<Credencial> {
        // 1. Validar inputs básicos
        if (!email || !senha) {
            throw new Error('E-mail e Senha são obrigatórios.');
        }

        // 2. Testar conexão com o provedor de e-mail (Validar Senha)
        // Isso impede salvar uma senha errada e quebrar o sistema.
        await this.testarConexaoSMTP(email, senha, servico);

        // 3. Se o teste passou, salva no banco
        const novaCredencial = new Credencial(email, senha, servico);
        await this.repository.atualizarCredenciais(novaCredencial);

        return novaCredencial;
    }

    /**
     * Método auxiliar para verificar se as credenciais são válidas no SMTP.
     * Usa o 'verify' do Nodemailer.
     */
    private async testarConexaoSMTP(user: string, pass: string, service: string): Promise<void> {
        try {
            const transporter = nodemailer.createTransport({
                service: service, // 'gmail', 'outlook', etc.
                auth: {
                    user: user,
                    pass: pass
                }
            });

            // Tenta logar no servidor de email
            await transporter.verify();
            console.log('Conexão SMTP verificada com sucesso!');
        } catch (error) {
            console.error('Falha na autenticação SMTP:', error);
            throw new Error('Falha ao conectar com o servidor de e-mail. Verifique se o e-mail e a senha (ou App Password) estão corretos.');
        }
    }

    /**
     * Método público para disparar e-mails (Será usado no futuro pelos Casos).
     */
    async enviarEmail(destinatario: string, assunto: string, corpoHtml: string, anexos: any[] = []): Promise<void> {
        // 1. Busca as credenciais no banco
        const credencial = await this.repository.obterCredenciais();

        if (!credencial || !credencial.email || credencial.email.includes('nao_configurado')) {
            throw new Error('E-mail institucional não configurado. Contate o administrador.');
        }

        // 2. Configura o transporte
        const transporter = nodemailer.createTransport({
            service: credencial.servico,
            auth: {
                user: credencial.email,
                pass: credencial.senha
            }
        });

        // 3. Envia
        await transporter.sendMail({
            from: `"Procuradoria da Mulher" <${credencial.email}>`,
            to: destinatario,
            subject: assunto,
            html: corpoHtml,
            attachments: anexos
        });
    }
}