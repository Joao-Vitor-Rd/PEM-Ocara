import { Funcionario, PerfilUsuario } from "../models/Funcionario";
import { FuncionarioService } from "../services/FuncionarioService";

// Interface para padronizar as respostas (sucesso ou erro)
interface ResultadoOperacao {
  success: boolean;
  funcionario?: any; // Usamos any ou um tipo 'FuncionarioSemSenha' se tiver
  error?: string;
}

export class ControladorFuncionario {
  // Injetamos o Service ao invés do Repository, pois o Service cuida da senha/segurança
  constructor(private readonly funcionarioService: FuncionarioService) {}

  // 1. CADASTRAR (Create)
  public async cadastrarFuncionario(dados: any): Promise<ResultadoOperacao> {
    const nomeTrim = (dados.nome ?? "").trim();
    const emailTrim = (dados.email ?? "").trim();
    const senhaTrim = (dados.senha ?? "").trim();
    const cargo = dados.cargo;

    // Validações básicas da entrada
    if (!nomeTrim) return { success: false, error: "Nome é obrigatório." };
    if (!emailTrim) return { success: false, error: "E-mail é obrigatório." };
    if (!senhaTrim) return { success: false, error: "Senha é obrigatória." };
    if (!cargo) return { success: false, error: "Cargo é obrigatório." };

    try {
      // Instancia o objeto (O Service vai validar duplicidade e criptografar a senha)
      const novoFuncionario = new Funcionario(
        emailTrim,
        nomeTrim,
        cargo as PerfilUsuario,
        senhaTrim
      );

      const criado = await this.funcionarioService.create(novoFuncionario);

      return { success: true, funcionario: criado };
    } catch (err: any) {
      // Captura erros do Service (ex: "Email já cadastrado")
      return { success: false, error: err.message || "Erro ao criar funcionário." };
    }
  }

  // 2. LISTAR TODOS (Read)
  
  public async listarFuncionarios() {
    try {
      const lista = await this.funcionarioService.findAll();
      return { success: true, lista };
    } catch (err: any) {
      return { success: false, error: "Erro ao listar funcionários." };
    }
  }

  
  // 3. BUSCAR POR EMAIL
 
  public async buscarPorEmail(email: string): Promise<ResultadoOperacao> {
    if (!email) return { success: false, error: "Email não informado." };

    try {
      const func = await this.funcionarioService.findByEmail(email);
      if (!func) {
        return { success: false, error: "Funcionário não encontrado." };
      }
      return { success: true, funcionario: func };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public async autenticarFuncionario(email: string, senha: string): Promise<ResultadoOperacao> {
    if (!email) return { success: false, error: "E-mail é obrigatório." };
    if (!senha) return { success: false, error: "Senha é obrigatória." };

    try {
      const funcionario = await this.funcionarioService.autenticar(email, senha);
      return { success: true, funcionario };
    } catch (err: any) {
      return { success: false, error: err.message || "Falha na autenticação." };
    }
  }

  // 4. ATUALIZAR (Update)
  public async atualizarFuncionario(email: string, dados: any): Promise<ResultadoOperacao> {
    if (!email) return { success: false, error: "Email é obrigatório para atualização." };

    try {
      const atualizado = await this.funcionarioService.update(email, dados);
      return { success: true, funcionario: atualizado };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // 5. DELETAR (Delete)
  public async deletarFuncionario(email: string): Promise<ResultadoOperacao> {
    if (!email) return { success: false, error: "Email é obrigatório para exclusão." };

    try {
      await this.funcionarioService.delete(email);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // ==========================================================
  // 6. ATUALIZAR MEU PERFIL (Conta)
  // ==========================================================
  public async atualizarMinhaConta(email: string, dados: any): Promise<ResultadoOperacao> {
    const nome = dados.nome;
    const senhaAtual = dados.senhaAtual;
    const novaSenha = dados.novaSenha; // Pode ser vazio se ele só quiser mudar o nome
    const novoEmail = dados.novoEmail;

    // Validação
    if (!email) return { success: false, error: "Sessão inválida (email ausente)." };
    if (!nome) return { success: false, error: "O nome não pode ficar vazio." };
    if (!senhaAtual) return { success: false, error: "É necessário informar a senha atual para salvar alterações." };

    if (novoEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(novoEmail)) {
        return { success: false, error: "Informe um e-mail válido." };
      }
    }

    try {
      const atualizado = await this.funcionarioService.atualizarPerfil(
        email,
        nome,
        senhaAtual,
        novaSenha,
        novoEmail
      );
      return { success: true, funcionario: atualizado };
    } catch (err: any) {
      return { success: false, error: err.message || "Erro ao atualizar perfil." };
    }
  }
}