/// <reference path="../types/windown.d.ts" />

export {}

let casosSalvos: any[] = [];

// Formatar data
function formatarData(data: any): string {
    if (!data) return 'N/A';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
}

// Carregar casos do banco de dados
async function carregarCasosDoBD(): Promise<void> {
    try {
        const container = document.getElementById('casos-container')!;
        container.innerHTML = '<div class="loading"><p>Carregando casos do banco de dados...</p></div>';

        // Aqui você chamaria a API para buscar casos do BD
        // Por enquanto, vamos simular com dados de teste
        const resultado = await window.api.listarAssistidas();
        
        if (!resultado.success || !resultado.assistidas) {
            container.innerHTML = '<div class="vazio"><p>Nenhum caso encontrado no banco de dados.</p></div>';
            return;
        }

        casosSalvos = resultado.assistidas;

        if (casosSalvos.length === 0) {
            container.innerHTML = '<div class="vazio"><p>Nenhum caso encontrado no banco de dados.</p></div>';
        } else {
            renderizarCasos(casosSalvos);
        }
    } catch (error) {
        console.error('Erro ao carregar casos:', error);
        const container = document.getElementById('casos-container')!;
        container.innerHTML = '<div class="vazio"><p>Erro ao carregar casos. Tente novamente mais tarde.</p></div>';
    }
}

// Renderizar cards de casos
function renderizarCasos(casos: any[]): void {
    const container = document.getElementById('casos-container')!;
    
    if (casos.length === 0) {
        container.innerHTML = '<div class="vazio"><p>Nenhum caso encontrado.</p></div>';
        return;
    }

    container.innerHTML = casos.map((caso, index) => `
        <div class="caso-card" data-index="${index}">
            <div class="caso-header">
                <div class="caso-protocolo">CASO #${index + 1}</div>
                <div class="caso-data">${formatarData(caso.data_criacao)}</div>
            </div>
            
            <div class="caso-info">
                <span class="caso-label">Assistida:</span>
                <span class="caso-valor">${caso.nome || 'N/A'}</span>
            </div>

            <div class="caso-info">
                <span class="caso-label">Idade:</span>
                <span class="caso-valor">${caso.idade || 'N/A'} anos</span>
            </div>

            <div class="caso-info">
                <span class="caso-label">Endereço:</span>
                <span class="caso-valor">${caso.endereco || 'N/A'}</span>
            </div>

            <div class="caso-info">
                <span class="caso-label">Profissão:</span>
                <span class="caso-valor">${caso.profissao || 'N/A'}</span>
            </div>

            <div class="caso-info">
                <span class="caso-label">Nacionalidade:</span>
                <span class="caso-valor">${caso.nacionalidade || 'N/A'}</span>
            </div>

            <span class="caso-status status-novo">✓ Salvo no BD</span>

            <div class="caso-footer">
                <button class="btn-visualizar" onclick="exibirDetalhes(${index})">Ver Detalhes</button>
                <button class="btn-excluir" onclick="excluirCaso(${index})">Excluir</button>
            </div>
        </div>
    `).join('');

    // Adicionar event listeners
    document.querySelectorAll('.caso-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).tagName !== 'BUTTON') {
                const index = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0');
                exibirDetalhes(index);
            }
        });
    });
}

// Exibir detalhes do caso em modal
function exibirDetalhes(index: number): void {
    const caso = casosSalvos[index];
    if (!caso) return;

    const modal = document.getElementById('modal-detalhes')!;
    const conteudo = document.getElementById('detalhes-caso-conteudo')!;

    let html = `
        <h2>Detalhes do Caso - Assistida #${index + 1}</h2>
        
        <div class="detalhes-secao">
            <h3>📋 Informações Pessoais</h3>
            <div class="detalhes-linha">
                <span class="detalhes-label">Nome:</span>
                <span class="detalhes-valor">${caso.nome || 'N/A'}</span>
            </div>
            <div class="detalhes-linha">
                <span class="detalhes-label">Idade:</span>
                <span class="detalhes-valor">${caso.idade || 'N/A'} anos</span>
            </div>
            <div class="detalhes-linha">
                <span class="detalhes-label">Identidade de Gênero:</span>
                <span class="detalhes-valor">${caso.identidade_genero || 'N/A'}</span>
            </div>
            <div class="detalhes-linha">
                <span class="detalhes-label">Nome Social:</span>
                <span class="detalhes-valor">${caso.nome_social || 'N/A'}</span>
            </div>
            <div class="detalhes-linha">
                <span class="detalhes-label">Nacionalidade:</span>
                <span class="detalhes-valor">${caso.nacionalidade || 'N/A'}</span>
            </div>
            <div class="detalhes-linha">
                <span class="detalhes-label">Cor/Raça:</span>
                <span class="detalhes-valor">${caso.cor_raca || 'N/A'}</span>
            </div>
        </div>

        <div class="detalhes-secao">
            <h3>🏠 Informações de Residência</h3>
            <div class="detalhes-linha">
                <span class="detalhes-label">Endereço:</span>
                <span class="detalhes-valor">${caso.endereco || 'N/A'}</span>
            </div>
            <div class="detalhes-linha">
                <span class="detalhes-label">Zona de Habitação:</span>
                <span class="detalhes-valor">${caso.zona_habitacao || 'N/A'}</span>
            </div>
            <div class="detalhes-linha">
                <span class="detalhes-label">Mora em Área de Risco:</span>
                <span class="detalhes-valor">${caso.mora_area_risco ? 'Sim' : 'Não'}</span>
            </div>
        </div>

        <div class="detalhes-secao">
            <h3>💼 Informações Profissionais</h3>
            <div class="detalhes-linha">
                <span class="detalhes-label">Profissão:</span>
                <span class="detalhes-valor">${caso.profissao || 'N/A'}</span>
            </div>
            <div class="detalhes-linha">
                <span class="detalhes-label">Escolaridade:</span>
                <span class="detalhes-valor">${caso.escolaridade || 'N/A'}</span>
            </div>
            <div class="detalhes-linha">
                <span class="detalhes-label">Limitação Física:</span>
                <span class="detalhes-valor">${caso.limitacao_fisica || 'Nenhuma'}</span>
            </div>
        </div>

        <div class="detalhes-secao">
            <h3>👨‍👩‍👧 Informações Familiares</h3>
            <div class="detalhes-linha">
                <span class="detalhes-label">Quantidade de Dependentes:</span>
                <span class="detalhes-valor">${caso.quantidade_dependentes || 0}</span>
            </div>
            <div class="detalhes-linha">
                <span class="detalhes-label">Possui Dependentes:</span>
                <span class="detalhes-valor">${caso.tem_dependentes ? 'Sim' : 'Não'}</span>
            </div>
            <div class="detalhes-linha">
                <span class="detalhes-label">Religião:</span>
                <span class="detalhes-valor">${caso.religiao || 'N/A'}</span>
            </div>
        </div>

        <div class="detalhes-secao">
            <h3>📊 Status do Caso</h3>
            <div class="detalhes-linha">
                <span class="detalhes-label">Data de Criação:</span>
                <span class="detalhes-valor">${formatarData(caso.data_criacao)}</span>
            </div>
            <div class="detalhes-linha">
                <span class="detalhes-label">Status:</span>
                <span class="detalhes-valor">✓ Salvo no Banco de Dados PostgreSQL</span>
            </div>
            <div class="detalhes-linha">
                <span class="detalhes-label">Número de Cadastro Social:</span>
                <span class="detalhes-valor">${caso.numero_cadastro_social || 'N/A'}</span>
            </div>
        </div>
    `;

    conteudo.innerHTML = html;
    modal.classList.add('ativo');
}

// Excluir caso
function excluirCaso(index: number): void {
    if (confirm('Tem certeza que deseja excluir este caso?')) {
        // Aqui você implementaria a lógica de exclusão
        alert('Função de exclusão será implementada em breve.');
        console.log('Excluir caso index:', index);
    }
}

// Buscar/filtrar casos
function filtrarCasos(): void {
    const termo = (document.getElementById('buscar-caso') as HTMLInputElement).value.toLowerCase();
    
    const casosFiltrados = casosSalvos.filter(caso => {
        const nome = (caso.nome || '').toLowerCase();
        const endereco = (caso.endereco || '').toLowerCase();
        const profissao = (caso.profissao || '').toLowerCase();
        
        return nome.includes(termo) || endereco.includes(termo) || profissao.includes(termo);
    });

    renderizarCasos(casosFiltrados);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Carregar casos ao abrir a página
    carregarCasosDoBD();

    // Busca em tempo real
    const inputBusca = document.getElementById('buscar-caso') as HTMLInputElement;
    inputBusca.addEventListener('input', filtrarCasos);

    // Recarregar dados
    const btnRecarregar = document.getElementById('recarregar-dados') as HTMLButtonElement;
    btnRecarregar.addEventListener('click', carregarCasosDoBD);

    // Fechar modal
    const modal = document.getElementById('modal-detalhes') as HTMLElement;
    const btnFechar = document.querySelector('.modal-fechar') as HTMLElement;
    
    btnFechar.addEventListener('click', () => {
        modal.classList.remove('ativo');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('ativo');
        }
    });

    // Voltar para início
    const btnVoltar = document.getElementById('voltar-inicio') as HTMLElement;
    btnVoltar.addEventListener('click', (e) => {
        e.preventDefault();
        window.api.openWindow('telaInicial');
    });
});

// Exportar funções para serem acessadas globalmente
declare global {
    function exibirDetalhes(index: number): void;
    function excluirCaso(index: number): void;
}

globalThis.exibirDetalhes = exibirDetalhes;
globalThis.excluirCaso = excluirCaso;
