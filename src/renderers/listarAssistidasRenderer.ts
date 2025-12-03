/// <reference path="../types/windown.d.ts" />

export {}

document.addEventListener('DOMContentLoaded', async () => {
    const resultado = await window.api.casosPorProtocolo(1);
    
    if (resultado.success && resultado.caso) {
        exibirInformacoesCaso(resultado.caso);
    } else {
        const content = document.getElementById('content');
        if (content) {
            content.innerHTML = '<div class="empty-state"><p>Nenhum caso encontrado.</p></div>';
        }
    }
});

function formatarData(data: string | Date): string {
    try {
        const d = new Date(data);
        return d.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
        return 'N/A';
    }
}

function formatarBooleano(valor: boolean): string {
    return valor ? '✅ Sim' : '❌ Não';
}

function formatarArray(arr: any[]): string {
    if (!Array.isArray(arr) || arr.length === 0) return 'Nenhum';
    return arr.join(', ');
}

function criarSecao(titulo: string, campos: Array<{ label: string; valor: any }>): string {
    let html = `<div class="section">
        <div class="section-title">${titulo}</div>
        <div class="grid">`;
    
    campos.forEach(campo => {
        let valorFormatado = campo.valor;
        if (typeof campo.valor === 'boolean') {
            valorFormatado = formatarBooleano(campo.valor);
        } else if (Array.isArray(campo.valor)) {
            valorFormatado = formatarArray(campo.valor);
        } else if (!campo.valor) {
            valorFormatado = 'N/A';
        }
        
        html += `
            <div class="field">
                <span class="field-label">${campo.label}</span>
                <span class="field-value">${valorFormatado}</span>
            </div>`;
    });
    
    html += `</div></div>`;
    return html;
}

function exibirInformacoesCaso(caso: any) {
    const content = document.getElementById('content');
    const protocoloEl = document.getElementById('protocolo');

    if (!content || !protocoloEl) return;

    protocoloEl.textContent = `Protocolo: ${caso.protocoloCaso || 'N/A'}`;

    let html = '';

    // Seção: Dados Básicos do Caso
    html += criarSecao('Dados Básicos do Caso', [
        { label: 'Protocolo', valor: caso.protocoloCaso },
        { label: 'Data', valor: formatarData(caso.data) },
        { label: 'Profissional Responsável', valor: caso.profissionalResponsavel },
        { label: 'Descrição', valor: caso.descricao }
    ]);

    // Seção: Informações da Assistida
    if (caso.assistida) {
        html += criarSecao('Informações da Assistida', [
            { label: 'Nome', valor: caso.assistida.nome },
            { label: 'Idade', valor: caso.assistida.idade },
            { label: 'Identidade de Gênero', valor: caso.assistida.identidadeGenero },
            { label: 'Nome Social', valor: caso.assistida.nomeSocial },
            { label: 'Endereço', valor: caso.assistida.endereco },
            { label: 'Nacionalidade', valor: caso.assistida.nacionalidade },
            { label: 'Escolaridade', valor: caso.assistida.escolaridade },
            { label: 'Religião', valor: caso.assistida.religiao },
            { label: 'Zona de Habitação', valor: caso.assistida.zonaHabitacao },
            { label: 'Profissão/Ocupação', valor: caso.assistida.profissao },
            { label: 'Limitação Física', valor: caso.assistida.limitacaoFisica },
            { label: 'Número de Cadastro Social', valor: caso.assistida.numeroCadastroSocial },
            { label: 'Quantidade de Dependentes', valor: caso.assistida.quantidadeDependentes },
            { label: 'Possui Dependentes', valor: caso.assistida.temDependentes }
        ]);
    }

    // Seção: Informações do Agressor
    if (caso.agressor) {
        html += criarSecao('Informações do Agressor', [
            { label: 'Nome', valor: caso.agressor.nome },
            { label: 'Idade', valor: caso.agressor.idade },
            { label: 'Vínculo com a Assistida', valor: caso.agressor.vinculoAssistida },
            { label: 'Data da Ocorrência', valor: formatarData(caso.agressor.dataOcorrida) }
        ]);
    }

    // Seção: Dados Comportamentais do Agressor
    if (caso.sobreAgressor) {
        html += criarSecao('Dados Comportamentais do Agressor', [
            { label: 'Uso de Drogas/Álcool', valor: caso.sobreAgressor.usoDrogasAlcool },
            { label: 'Doença Mental Diagnosticada', valor: caso.sobreAgressor.doencaMental },
            { label: 'Cumpriu Medida Protetiva', valor: caso.sobreAgressor.agressorCumpriuMedidaProtetiva },
            { label: 'Tentativa de Suicídio', valor: caso.sobreAgressor.agressorTentativaSuicidio },
            { label: 'Desempregado/Dificuldades', valor: caso.sobreAgressor.agressorDesempregado },
            { label: 'Possui Arma de Fogo', valor: caso.sobreAgressor.agressorPossuiArmaFogo },
            { label: 'Ameaçou/Agrediu Outros', valor: caso.sobreAgressor.agressorAmeacouAlguem }
        ]);
    }

    // Seção: Histórico de Violência
    if (caso.historicoViolencia) {
        html += criarSecao('Histórico de Violência', [
            { label: 'Ameaças Familiares', valor: caso.historicoViolencia.ameacaFamiliar },
            { label: 'Agressão Física', valor: caso.historicoViolencia.agressaoFisica },
            { label: 'Abuso Sexual', valor: caso.historicoViolencia.abusoSexual },
            { label: 'Outras Formas de Violência', valor: caso.historicoViolencia.outrasFormasViolencia },
            { label: 'Comportamentos do Agressor', valor: caso.historicoViolencia.comportamentosAgressor },
            { label: 'Ocorrência Policial/Medida Protetiva', valor: caso.historicoViolencia.ocorrenciaPolicialMedidaProtetivaAgressor },
            { label: 'Agressões Mais Frequentes Ultimamente', valor: caso.historicoViolencia.agressoesMaisFrequentesUltimamente }
        ]);
    }

    // Seção: Preenchimento Profissional
    if (caso.preenchimentoProfissional) {
        html += criarSecao('Preenchimento Profissional', [
            { label: 'Assistida Respondeu Sem Ajuda', valor: caso.preenchimentoProfissional.assistidaRespondeuSemAjuda },
            { label: 'Assistida Respondeu Com Auxílio', valor: caso.preenchimentoProfissional.assistidaRespondeuComAuxilio },
            { label: 'Assistida Sem Condições', valor: caso.preenchimentoProfissional.assistidaSemCondicoes },
            { label: 'Assistida Recusou', valor: caso.preenchimentoProfissional.assistidaRecusou },
            { label: 'Terceiro Comunicante', valor: caso.preenchimentoProfissional.terceiroComunicante },
            { label: 'Tipo de Violência', valor: Array.isArray(caso.preenchimentoProfissional.tipoViolencia) ? caso.preenchimentoProfissional.tipoViolencia.join('; ') : caso.preenchimentoProfissional.tipoViolencia }
        ]);
    }

    // Seção: Informações Pessoais (Sobre Você)
    if (caso.sobreVoce) {
        html += criarSecao('Informações Pessoais da Assistida', [
            { label: 'Separação Recente', valor: caso.sobreVoce.separacaoRecente },
            { label: 'Tem Filhos com Agressor', valor: caso.sobreVoce.temFilhosComAgressor },
            { label: 'Quantidade de Filhos com Agressor', valor: caso.sobreVoce.qntFilhosComAgressor },
            { label: 'Tem Filhos de Outro Relacionamento', valor: caso.sobreVoce.temFilhosOutroRelacionamento },
            { label: 'Quantidade de Filhos de Outro Relacionamento', valor: caso.sobreVoce.qntFilhosOutroRelacionamento },
            { label: 'Faixa Etária dos Filhos', valor: caso.sobreVoce.faixaFilhos },
            { label: 'Filhos com Deficiência', valor: caso.sobreVoce.filhosComDeficiencia },
            { label: 'Conflito com Agressor', valor: caso.sobreVoce.conflitoAgressor },
            { label: 'Filhos Presenciaram Violência', valor: caso.sobreVoce.filhosPresenciaramViolencia },
            { label: 'Violência Durante Gravidez', valor: caso.sobreVoce.violenciaDuranteGravidez },
            { label: 'Novo Relacionamento Aumentou Agressão', valor: caso.sobreVoce.novoRelacionamentoAumentouAgressao },
            { label: 'Possui Deficiência/Doença', valor: caso.sobreVoce.possuiDeficienciaDoenca },
            { label: 'Cor/Raça', valor: caso.sobreVoce.corRaca }
        ]);
    }

    // Seção: Outras Informações de Encaminhamento
    if (caso.outrasInformacoesEncaminhamento) {
        html += criarSecao('Outras Informações de Encaminhamento', [
            { label: 'Anotações Livres', valor: caso.outrasInformacoesEncaminhamento.anotacoesLivres }
        ]);
    }

    // Seção: Outras Informações Importantes
    if (caso.outrasInformacoesImportantes) {
        html += criarSecao('Outras Informações Importantes', [
            { label: 'Mora em Área de Risco', valor: caso.outrasInformacoesImportantes.moraEmAreaRisco },
            { label: 'Dependente Financeiro do Agressor', valor: caso.outrasInformacoesImportantes.dependenteFinanceiroAgressor },
            { label: 'Aceita Abrigamento Temporário', valor: caso.outrasInformacoesImportantes.aceitaAbrigamentoTemporario }
        ]);
    }

    content.innerHTML = html;
}

function voltarParaInicio() {
    window.api.openWindow('telaInicial');
}