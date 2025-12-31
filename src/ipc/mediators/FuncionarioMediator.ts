import { Logger } from '../../utils/Logger';
import { ControladorFuncionario } from '../../controllers/FuncionarioController';
import { PerfilUsuario } from '../../models/Funcionario';

export class FuncionarioMediator {
  private usuarioLogadoAtual: { email: string; nome: string; cargo: string } | null = null;

  constructor(private funcionarioController: ControladorFuncionario) {}

  setUsuarioLogado(usuario: { email: string; nome: string; cargo: string } | null) {
    this.usuarioLogadoAtual = usuario;
  }

  getUsuarioLogado() {
    return this.usuarioLogadoAtual;
  }

  async criar(data: any): Promise<any> {
    try {
      Logger.info('Requisição para criar funcionário:', data.email);
      
      const cargoAtual = (this.usuarioLogadoAtual?.cargo ?? '').toUpperCase();
      if (!this.usuarioLogadoAtual || cargoAtual !== PerfilUsuario.ADMIN) {
        Logger.warn('Tentativa de cadastro de funcionário sem permissão adequada.');
        return { success: false, error: 'Apenas administradores podem cadastrar funcionários.' };
      }
      return await this.funcionarioController.cadastrarFuncionario(data);
    } catch (error) {
      Logger.error('Erro ao criar funcionário:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  async listar() {
    try {
      Logger.info('Requisição para listar funcionários');
      const resultado = await this.funcionarioController.listarFuncionarios();
      if (!resultado.success) {
        return { success: false, error: resultado.error ?? 'Não foi possível listar os funcionários.' };
      }
      return { success: true, funcionarios: resultado.lista ?? [] };
    } catch (error) {
      Logger.error('Erro ao listar funcionários:', error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, error: message };
    }
  }

  async buscarPorEmail(email: string): Promise<any> {
    try {
      Logger.info('Requisição para buscar funcionário por email:', email);
      return await this.funcionarioController.buscarPorEmail(email);
    } catch (error) {
      Logger.error('Erro ao buscar funcionário por email:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  async atualizar(email: string, dados: any): Promise<any> {
    try {
      Logger.info('Requisição para atualizar funcionário:', email);
      return await this.funcionarioController.atualizarFuncionario(email, dados);
    } catch (error) {
      Logger.error('Erro ao atualizar funcionário:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  async deletar(email: string): Promise<any> {
    try {
      Logger.info('Requisição para deletar funcionário:', email);
      return await this.funcionarioController.deletarFuncionario(email);
    } catch (error) {
      Logger.error('Erro ao deletar funcionário:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  async autenticar(email: string, senha: string): Promise<any> {
    try {
      Logger.info('Tentativa de login para:', email);
      const resultado = await this.funcionarioController.autenticarFuncionario(email, senha);
      if (resultado.success && resultado.funcionario) {
        this.usuarioLogadoAtual = {
          email: resultado.funcionario.email,
          nome: resultado.funcionario.nome,
          cargo: resultado.funcionario.cargo,
        };
      } else {
        this.usuarioLogadoAtual = null;
      }
      return resultado;
    } catch (error) {
      Logger.error('Erro ao autenticar funcionário:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }

  async logout() {
    Logger.info('Encerrando sessão atual.');
    this.usuarioLogadoAtual = null;
    return { success: true };
  }

  async atualizarPerfil(email: string, data: any): Promise<any> {
    try {
      Logger.info('Requisição de atualização de perfil para:', email);
      return await this.funcionarioController.atualizarMinhaConta(email, data);
    } catch (error) {
      Logger.error('Erro ao atualizar perfil:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  }
}
