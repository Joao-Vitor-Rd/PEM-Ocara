export interface ICasoRedeApoioContatoRepository {
    registrarContato(params: {
        idCaso: number;
        emailRede: string;
        assunto?: string | null;
        mensagem?: string | null;
        dataEnvio?: Date;
    }): Promise<void>;

    obterNomesRedesContatadas(idCaso: number): Promise<string[]>;
}
