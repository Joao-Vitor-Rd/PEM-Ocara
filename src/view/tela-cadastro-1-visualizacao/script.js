// ========================================
// SCRIPT DE VISUALIZAÇÃO - TELA 1
// Identificação da Assistida (SOMENTE LEITURA)
// ========================================

//  DADOS MOCKADOS (Futuramente virão do banco de dados)
const dadosMockados = {
    nomeCompleto: "Maria Silva Santos",
    idade: 34,
    endereco: "Rua das Flores, 123 - Centro, Fortaleza/CE",
    identidadeGenero: "Feminino",
    nomeSocial: "",
    escolaridade: "Ensino Médio Completo",
    religiao: "Católica",
    nacionalidade: "Brasileira",
    zonaHabitacao: "urbana", // "rural" ou "urbana"
    profissao: "Auxiliar Administrativa",
    limitacao: "Nenhuma",
    numeroCadastro: "12345678901",
    dependentes: "2"
};

// ========================================
// CARREGAR E PREENCHER DADOS
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Tela de Visualização 1 carregada');
    
    preencherCampos();
    
    configurarNavegacao();
});

// ========================================
// FUNÇÃO: PREENCHER CAMPOS
// ========================================
function preencherCampos() {
    console.log('✏️ Preenchendo campos com dados mockados...');
    
    // Campos de texto simples
    document.getElementById('nome-completo').value = dadosMockados.nomeCompleto;
    document.getElementById('idade').value = dadosMockados.idade;
    document.getElementById('endereco').value = dadosMockados.endereco;
    document.getElementById('identidade-genero').value = dadosMockados.identidadeGenero;
    document.getElementById('nome-social').value = dadosMockados.nomeSocial;
    document.getElementById('escolaridade').value = dadosMockados.escolaridade;
    document.getElementById('religiao').value = dadosMockados.religiao;
    document.getElementById('nacionalidade').value = dadosMockados.nacionalidade;
    document.getElementById('profissao').value = dadosMockados.profissao;
    document.getElementById('limitacao').value = dadosMockados.limitacao;
    document.getElementById('numero-cadastro').value = dadosMockados.numeroCadastro;
    document.getElementById('dependentes').value = dadosMockados.dependentes;

    // Radio button de zona de habitação
    if (dadosMockados.zonaHabitacao === 'rural') {
        document.getElementById('rural').checked = true;
    } else if (dadosMockados.zonaHabitacao === 'urbana') {
        document.getElementById('urbana').checked = true;
    }
    
    console.log('✅ Campos preenchidos com sucesso!');
}

// ========================================
// CONFIGURAR NAVEGAÇÃO
// ========================================
function configurarNavegacao() {
    const btnVoltar = document.getElementById('voltar');
    const btnProximo = document.getElementById('proximo');

    // ========================================
    // BOTÃO VOLTAR
    // volta para a tela de informações do caso
    // ========================================
    if (btnVoltar) {
        btnVoltar.addEventListener('click', function() {
            console.log('⬅️ Botão Voltar clicado');
            
            // volta no histórico
                window.history.back();
        
        });
    }

    // ========================================
    // BOTÃO PRÓXIMO
    // vai para a tela de visualização 2
    // ========================================
    if (btnProximo) {
        btnProximo.addEventListener('click', function() {
            console.log('➡️ Botão Próximo clicado - Indo para Visualização 2');
            
            if (window.api && window.api.openWindow) {
                window.api.openWindow("telaVisualizacao2");
            }
           
        });
    }
}

// ========================================
// INTEGRAÇÃO BD
// ========================================
/*
@joaovitor aq ------------ */

console.log('🚀 Script de visualização 1 carregado com sucesso!');