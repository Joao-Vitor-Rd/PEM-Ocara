import { Funcionario } from "../models/Funcionario";

export interface IFuncionarioRepository {

    findByEmail(email: string): Promise<Funcionario | null>;

    create(funcionario: Funcionario): Promise<Funcionario>;

    update(email: string, dados: Partial<Funcionario>): Promise<Funcionario>;
    findAll(): Promise<Funcionario[]>;
    delete(email: string): Promise<void>;
}