// ========================================
// SCRIPT DE VISUALIZAÇÃO - TELA 1
// Identificação da Assistida (SOMENTE LEITURA)
// ========================================

function preencherCampos() {
    console.log('[tela-1-script] 📄 Preenchendo campos do sessionStorage...');
    
    // Obter dados do sessionStorage
    let dadosAssistida = {};
    const dadosAssistidaJSON = sessionStorage.getItem('dadosAssistida');
    
    console.log('[tela-1-script] 🔍 Procurando dadosAssistida no sessionStorage...');
    console.log('[tela-1-script] dadosAssistidaJSON:', dadosAssistidaJSON ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
    
    if (dadosAssistidaJSON) {
        try {
            dadosAssistida = JSON.parse(dadosAssistidaJSON);
            console.log('[tela-1-script] ✅ Dados carregados:', dadosAssistida);
        } catch (error) {
            console.error('[tela-1-script] ❌ Erro ao fazer parse:', error);
        }
    } else {
        console.warn('[tela-1-script] ⚠️  Nenhum dado em sessionStorage');
    }
    
    // Campos de texto simples
    const nomeInput = document.getElementById('nome-completo');
    if (nomeInput && dadosAssistida.nomeCompleto) {
        nomeInput.value = dadosAssistida.nomeCompleto;
        console.log('[tela-1-script] ✓ Nome:', dadosAssistida.nomeCompleto);
    }
    
    const idadeInput = document.getElementById('idade');
    if (idadeInput && dadosAssistida.idade) {
        idadeInput.value = dadosAssistida.idade;
        console.log('[tela-1-script] ✓ Idade:', dadosAssistida.idade);
    }
    
    const enderecoInput = document.getElementById('endereco');
    if (enderecoInput && dadosAssistida.endereco) {
        enderecoInput.value = dadosAssistida.endereco;
        console.log('[tela-1-script] ✓ Endereço:', dadosAssistida.endereco);
    }
    
    const identidadeInput = document.getElementById('identidade-genero');
    if (identidadeInput && dadosAssistida.identidadeGenero) {
        identidadeInput.value = dadosAssistida.identidadeGenero;
        console.log('[tela-1-script] ✓ Identidade:', dadosAssistida.identidadeGenero);
    }
    
    const nomeSocialInput = document.getElementById('nome-social');
    if (nomeSocialInput && dadosAssistida.nomeSocial) {
        nomeSocialInput.value = dadosAssistida.nomeSocial;
        console.log('[tela-1-script] ✓ Nome social:', dadosAssistida.nomeSocial);
    }
    
    const escolaridadeInput = document.getElementById('escolaridade');
    if (escolaridadeInput && dadosAssistida.escolaridade) {
        escolaridadeInput.value = dadosAssistida.escolaridade;
        console.log('[tela-1-script] ✓ Escolaridade:', dadosAssistida.escolaridade);
    }
    
    const religiaoInput = document.getElementById('religiao');
    if (religiaoInput && dadosAssistida.religiao) {
        religiaoInput.value = dadosAssistida.religiao;
        console.log('[tela-1-script] ✓ Religião:', dadosAssistida.religiao);
    }
    
    const nacionalidadeInput = document.getElementById('nacionalidade');
    if (nacionalidadeInput && dadosAssistida.nacionalidade) {
        nacionalidadeInput.value = dadosAssistida.nacionalidade;
        console.log('[tela-1-script] ✓ Nacionalidade:', dadosAssistida.nacionalidade);
    }
    
    const profissaoInput = document.getElementById('profissao');
    if (profissaoInput && dadosAssistida.profissao) {
        profissaoInput.value = dadosAssistida.profissao;
        console.log('[tela-1-script] ✓ Profissão:', dadosAssistida.profissao);
    }
    
    const limitacaoInput = document.getElementById('limitacao');
    if (limitacaoInput && dadosAssistida.limitacao) {
        limitacaoInput.value = dadosAssistida.limitacao;
        console.log('[tela-1-script] ✓ Limitação:', dadosAssistida.limitacao);
    }
    
    const numeroCadastroInput = document.getElementById('numero-cadastro');
    if (numeroCadastroInput && dadosAssistida.numeroCadastro) {
        numeroCadastroInput.value = dadosAssistida.numeroCadastro;
        console.log('[tela-1-script] ✓ Número cadastro:', dadosAssistida.numeroCadastro);
    }
    
    const dependentesInput = document.getElementById('dependentes');
    if (dependentesInput && dadosAssistida.dependentes) {
        dependentesInput.value = dadosAssistida.dependentes;
        console.log('[tela-1-script] ✓ Dependentes:', dadosAssistida.dependentes);
    }
    
    // Radio button de zona de habitação
    if (dadosAssistida.zona === 'rural') {
        const ruralRadio = document.getElementById('rural');
        if (ruralRadio) {
            ruralRadio.checked = true;
            console.log('[tela-1-script] ✓ Zona: rural');
        }
    } else if (dadosAssistida.zona === 'urbana') {
        const urbanaRadio = document.getElementById('urbana');
        if (urbanaRadio) {
            urbanaRadio.checked = true;
            console.log('[tela-1-script] ✓ Zona: urbana');
        }
    }
    
    console.log('[tela-1-script] ✅ Campos preenchidos com sucesso!');
}

function configurarNavegacao() {
    const btnVoltar = document.getElementById('voltar');
    const btnProximo = document.getElementById('proximo');

    if (btnVoltar) {
        btnVoltar.addEventListener('click', function() {
            console.log('[tela-1-script] ⬅️  Voltando para Informações do Caso');
            const idCaso = sessionStorage.getItem('idCasoVisualizacao');
            if (idCaso) {
                sessionStorage.setItem('idCasoAtual', idCaso);
            }
            // Limpar dados de visualização
            sessionStorage.removeItem('dadosCaso');
            sessionStorage.removeItem('dadosAssistida');
            sessionStorage.removeItem('dadosEncaminhamento');
            sessionStorage.removeItem('idCasoVisualizacao');
            
            if (window.api && window.api.openWindow) {
                window.api.openWindow("telaInformacoesCaso");
            } else {
                window.history.back();
            }
        });
    }

    if (btnProximo) {
        btnProximo.addEventListener('click', function() {
            console.log('[tela-1-script] ➡️  Indo para Tela 2');
            if (window.api && window.api.openWindow) {
                window.api.openWindow("telaVisualizacao2");
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('[tela-1-script] 📄 DOMContentLoaded');
    preencherCampos();
    configurarNavegacao();
});

console.log('[tela-1-script] ✅ Script carregado!');