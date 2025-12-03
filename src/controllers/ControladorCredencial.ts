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
        const email = (dados.email ?? "").trim();
        const senha = (dados.senha ?? "").trim();
        const servico = (dados.servico ?? "gmail").trim();

        // 1. Validação Básica
        if (!email) return { success: false, error: "O e-mail é obrigatório." };
        if (!senha) return { success: false, error: "A senha (ou App Password) é obrigatória." };

        try {
            // 2. Chama o service (que faz o teste de conexão verify())
            const credencialSalva = await this.service.atualizarCredenciais(email, senha, servico);
            
            return { 
                success: true, 
                dados: {
                    email: credencialSalva.email,
                    servico: credencialSalva.servico
                    // Não retornamos a senha por segurança, apenas confirmamos o sucesso
                } 
            };
        } catch (err: any) {
            // Retorna o erro amigável (ex: "Falha na autenticação SMTP")
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
}