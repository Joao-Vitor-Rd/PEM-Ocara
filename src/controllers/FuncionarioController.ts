import { FuncionarioService } from "../services/FuncionarioService";
import { Funcionario, PerfilUsuario } from "../models/Funcionario";
import { IFuncionarioRepository } from "../repository/IFuncionarioRepository";

interface ResultadoOperacao {
    success: boolean;
    funcionario?: any;
    error?: string;
}

export class ControladorFuncionario {
    
    constructor(private readonly funcionarioService: FuncionarioService) {}
  
    public async autenticarFuncionario(email: string, senha: string): Promise<ResultadoOperacao> {
        if (!email || !senha) {
            return { success: false, error: "E-mail e senha são obrigatórios." };
        }

        try {
            const funcionarioLogado = await this.funcionarioService.autenticar(email, senha);
            
            return { 
                success: true, 
                funcionario: funcionarioLogado 
            };

        } catch (err: any) {
            return { 
                success: false, 
                error: err.message || "Falha na autenticação." 
            };
        }
    }

    public async cadastrarFuncionario(dados: any): Promise<ResultadoOperacao> {
        const nomeTrim = (dados.nome ?? "").trim();
        const emailTrim = (dados.email ?? "").trim();
        const senhaTrim = (dados.senha ?? "").trim();
        const cargo = dados.cargo;

        if (!nomeTrim) return { success: false, error: "Nome é obrigatório." };
        if (!emailTrim) return { success: false, error: "E-mail é obrigatório." };
        if (!senhaTrim) return { success: false, error: "Senha é obrigatória." };
        if (!cargo) return { success: false, error: "Cargo é obrigatório." };

        try {
            const novoFuncionario = new Funcionario(
                emailTrim,
                nomeTrim,
                cargo as PerfilUsuario,
                senhaTrim
            );

            const criado = await this.funcionarioService.criarFuncionario(novoFuncionario);

            return { 
                success: true, 
                funcionario: criado 
            };

        } catch (err: any) {
            return { 
                success: false, 
                error: err.message || "Erro ao criar funcionário." 
            };
        }
    }

    public async atualizarMinhaConta(emailSessao: string, dados: any): Promise<ResultadoOperacao> {
        const nome = dados.nome;
        const senhaAtual = dados.senhaAtual;
        const novaSenha = dados.novaSenha;
        const novoEmail = dados.novoEmail;

        if (!emailSessao) return { success: false, error: "Sessão inválida (email ausente)." };
        if (!nome) return { success: false, error: "O nome não pode ficar vazio." };
        if (!senhaAtual) return { success: false, error: "É necessário informar a senha atual para salvar alterações." };

        try {
            const atualizado = await this.funcionarioService.atualizarPerfil(
                emailSessao,
                nome,
                senhaAtual,
                novaSenha,
                novoEmail
            );
            
            return { 
                success: true, 
                funcionario: atualizado 
            };

        } catch (err: any) {
            return { 
                success: false, 
                error: err.message || "Erro ao atualizar perfil." 
            };
        }
    }

    public async atualizarFuncionario(email: string, dados: any): Promise<ResultadoOperacao> {
        if (!email) return { success: false, error: "Email é obrigatório para atualização." };

        try {
            const atualizado = await this.funcionarioService.update(email, dados);
            return { success: true, funcionario: atualizado };
        } catch (err: any) {
            return { success: false, error: err.message || "Erro ao atualizar funcionário." };
        }
    }

    public async buscarPorEmail(email: string): Promise<ResultadoOperacao> {
        if (!email) return { success: false, error: "Email não informado." };

        try {
            const func = await this.funcionarioService.buscarPorEmail(email); 
            
            if (!func) {
                return { success: false, error: "Funcionário não encontrado." };
            }
            return { success: true, funcionario: func };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }
    
    public async listarFuncionarios() {
        try {
            const lista = await this.funcionarioService.findAll();
            return { success: true, lista };
        } catch (err: any) {
            return { success: false, error: "Erro ao listar funcionários." };
        }
    }
    
    public async deletarFuncionario(email: string): Promise<ResultadoOperacao> {
         if (!email) return { success: false, error: "Email obrigatório." };
         try {
             await this.funcionarioService.delete(email);
             return { success: true };
         } catch (err: any) {
             return { success: false, error: err.message };
         }
    }
}