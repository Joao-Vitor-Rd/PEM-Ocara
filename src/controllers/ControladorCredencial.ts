import { CredencialService } from "../services/CredencialService";

interface ResultadoOperacao {
    success: boolean;
    dados?: any;
    error?: string;
}

export class ControladorCredencial {
    constructor(private readonly service: CredencialService) {}

    /**
     * Salva as novas credenciais de e-mail.
     * O Service vai testar a conexão SMTP antes de permitir salvar.
     */
    public async salvarCredenciais(dados: any): Promise<ResultadoOperacao> {
        const emailInput = (dados.email ?? "").trim();
        const senhaInput = (dados.senha ?? "").trim();
        const servicoInput = (dados.servico ?? "").trim();

        try {
            const credencialAtual = await this.service.obterCredenciais();

            if (!credencialAtual && !emailInput) {
                return { success: false, error: "Cadastre o e-mail institucional antes de prosseguir." };
            }

            if (!credencialAtual && !senhaInput) {
                return { success: false, error: "Cadastre a senha institucional antes de prosseguir." };
            }

            const emailFinal = emailInput || credencialAtual?.email || "";
            const senhaFinal = senhaInput || credencialAtual?.senha || "";
            const servicoFinal = servicoInput || credencialAtual?.servico || "gmail";

            if (!emailFinal) {
                return { success: false, error: "O e-mail é obrigatório." };
            }

            if (!senhaFinal) {
                return { success: false, error: "A senha (ou App Password) é obrigatória." };
            }

            const credencialSalva = await this.service.atualizarCredenciais(emailFinal, senhaFinal, servicoFinal);
            
            return { 
                success: true, 
                dados: {
                    email: credencialSalva.email,
                    servico: credencialSalva.servico,
                    senhaConfigurada: true
                } 
            };
        } catch (err: any) {
            return { success: false, error: err.message || "Erro ao salvar credenciais." };
        }
    }

    /**
     * Busca as credenciais atuais para exibir na tela de configuração.
     */
    public async obterCredenciais(): Promise<ResultadoOperacao> {
        try {
            const credencial = await this.service.obterCredenciais();
            
            if (!credencial) {
                return { success: true, dados: null }; // Ainda não configurado
            }

            return { 
                success: true, 
                dados: {
                    email: credencial.email,
                    servico: credencial.servico,
                    // Enviamos uma flag dizendo que a senha está configurada, sem enviar a senha em si
                    senhaConfigurada: !!credencial.senha 
                } 
            };
        } catch (err: any) {
            return { success: false, error: "Erro ao buscar configurações." };
        }
    }

    /**
     * Envia um e-mail utilizando as credenciais institucionais já configuradas.
     */
    public async enviarEmailInstitucional(dados: {
        destinatario: string;
        assunto?: string;
        corpoHtml: string;
        anexos?: any[];
    }): Promise<ResultadoOperacao> {
        const destinatario = (dados.destinatario ?? '').trim();
        const corpo = (dados.corpoHtml ?? '').trim();
        const assunto = (dados.assunto ?? '').trim() || 'Encaminhamento - Procuradoria da Mulher';

        if (!destinatario) {
            return { success: false, error: 'Destinatário é obrigatório.' };
        }

        if (!corpo) {
            return { success: false, error: 'Corpo do e-mail é obrigatório.' };
        }

        try {
            await this.service.enviarEmail(destinatario, assunto, corpo, dados.anexos || []);
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Erro ao enviar o e-mail institucional.' };
        }
    }
}