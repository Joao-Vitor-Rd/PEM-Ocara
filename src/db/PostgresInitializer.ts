import { Pool, PoolConfig } from 'pg';
import { IDataBase } from './IDataBase';
import * as dotenv from 'dotenv';
import * as path from 'path';

export class PostgresInitializer implements IDataBase {
    
    private connectionPool: Pool | null = null;
    private config: PoolConfig;

    constructor() {
        // 1. Lógica de Carregamento do .env (Trazida do seu db.ts)
        // Garante que leia o arquivo na raiz do projeto
        const envPath = path.resolve(process.cwd(), '.env');
        
        const result = dotenv.config({ path: envPath });

        // --- LOGS DE DEBUG (Para garantir que funcionou) ---
        console.log("\n========================================");
        console.log("🔌 [DB INIT] Inicializando configuração...");
        console.log("📂 Caminho do .env:", envPath);
        if (result.error) {
            console.error("❌ Erro ao ler .env:", result.error.message);
        } else {
            console.log("✅ Arquivo .env carregado com sucesso.");
        }
        console.log("👤 Usuário lido:", process.env.DB_USER);
        console.log("🏠 Host lido:", process.env.DB_HOST);
        console.log("🗄️  Database lido:", process.env.DB_NAME);
        console.log("========================================\n");

        // 2. Configuração do Pool
        this.config = {
            user: process.env.DB_USER || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'postgres', // 'postgres' é um default mais seguro que 'pocara' se falhar
            password: process.env.DB_PASSWORD || '',
            port: Number(process.env.DB_PORT) || 5432,
            max: 20,
            idleTimeoutMillis: 30000,
            // ssl: { rejectUnauthorized: false } // Descomente se for usar Supabase no futuro
        };
    }

    public pool(): Pool {
        if (!this.connectionPool) {
            throw new Error('Database pool not initialized. Call initialize() first.');
        }
        return this.connectionPool;
    }

    async initialize(): Promise<void> {
        if (this.connectionPool) {
            console.warn('PostgreSQL pool already initialized.');
            return;
        }
        
        console.log('Attempting to initialize PostgreSQL pool...');
        this.connectionPool = new Pool(this.config);

        await this.testConnection(); 
    }

    async testConnection(): Promise<void> {
        if (!this.connectionPool) {
             console.warn('Pool not initialized, skipping connection test.');
             return;
        }
        
        // Tenta conectar
        try {
            const client = await this.connectionPool.connect(); 
            console.log('✅ Conectado ao PostgreSQL com sucesso!');
            
            // TESTE DE HORA
            const timeResult = await client.query('SELECT NOW() AS server_time');
            console.log('⏰ Hora do Servidor:', timeResult.rows[0].server_time);

            // --- O RAIO-X: LISTAR BANCOS DE DADOS ---
            console.log("\n🔎 INVESTIGANDO QUAIS BANCOS ESTÃO NESTE SERVIDOR:");
            const dbs = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false;');
            
            const nomesBancos = dbs.rows.map(row => row.datname);
            console.log(nomesBancos);

            if (nomesBancos.includes('db_procuradoria')) {
                console.log("\n✅ OPA! O banco 'db_procuradoria' ESTÁ AQUI. O problema pode ser espaço em branco no .env antigo.");
            } else {
                console.log("\n❌ ALERTA: O banco 'db_procuradoria' NÃO ESTÁ AQUI.");
                console.log("👉 Conclusão: Seu código está conectando em um servidor diferente do seu DBeaver.");
                console.log("👉 Verifique a PORTA (5432 vs 5433) no .env e no DBeaver.");
            }
            console.log("========================================\n");
            
            client.release(); // Importante liberar o cliente!
        } catch (error: any) {
            console.error("\n❌ ERRO CRÍTICO NA CONEXÃO:");
            console.error("Mensagem:", error.message);
            console.error("\n");
            throw error; 
        }
    }

    async close(): Promise<void> {
        if (this.connectionPool) {
            console.log('Closing PostgreSQL pool...');
            await this.connectionPool.end();
            this.connectionPool = null;
            console.log('PostgreSQL pool closed.');
        } else {
            console.warn('PostgreSQL pool was not active.');
        }
    }
}