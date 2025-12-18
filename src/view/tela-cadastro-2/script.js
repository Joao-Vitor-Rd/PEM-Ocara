// Controle de exibição condicional da seção de filhos
document.addEventListener('DOMContentLoaded', function() {
    const secaoFilhos = document.getElementById('se-tem-filhos');
    
    const todasPerguntas = document.querySelectorAll('.pergunta-selecao');
    let pergunta16 = null;
    
    todasPerguntas.forEach(pergunta => {
        const label = pergunta.querySelector('.titulo-pergunta label');
        if (label && label.textContent.includes('Você tem filho(s)?')) {
            pergunta16 = pergunta;
        }
    });
    
    if (!pergunta16 || !secaoFilhos) {
        console.error('Elementos não encontrados');
        return;
    }
    const checkboxes = pergunta16.querySelectorAll('.opcao input[type="checkbox"]');

    secaoFilhos.style.display = 'none';
    
    function atualizarVisibilidade() {
        const temFilhos = checkboxes[0].checked || checkboxes[1].checked;
        
        if (temFilhos) {
            secaoFilhos.style.display = 'flex';
        } else {
            secaoFilhos.style.display = 'none';
        }
    }
    
// Lógica para a opção "Não" ser exclusiva na pergunta 16
    const checkboxNao = checkboxes[2];
    const checkboxesSimAgressor = checkboxes[0]; 
    const checkboxesSimOutro = checkboxes[1]; 
    
    checkboxNao.addEventListener('change', function() {
        if (this.checked) {
            checkboxesSimAgressor.checked = false;
            checkboxesSimOutro.checked = false;
        }
        atualizarVisibilidade();
    });
    
    checkboxesSimAgressor.addEventListener('change', function() {
        if (this.checked) {
            checkboxNao.checked = false;
        }
        atualizarVisibilidade();
    });
    
    checkboxesSimOutro.addEventListener('change', function() {
        if (this.checked) {
            checkboxNao.checked = false;
        }
        atualizarVisibilidade();
    });
    
    // Chamar atualizarVisibilidade() ao carregar a página para prefill correto
    // Isso garante que a seção de filhos seja mostrada/escondida mesmo se preenchida fora de ordem
    atualizarVisibilidade();

// Função genérica para tornar opções "Não", "Não sei" e "Nenhuma" exclusivas
    function configurarCheckboxExclusivo(idCheckboxExclusivo, idsOutrosCheckboxes) {
        const checkboxExclusivo = document.getElementById(idCheckboxExclusivo);
        const outrosCheckboxes = idsOutrosCheckboxes.map(id => document.getElementById(id));
        
        if (!checkboxExclusivo || outrosCheckboxes.some(cb => !cb)) return;
        
        checkboxExclusivo.addEventListener('change', function() {
            if (this.checked) {
                outrosCheckboxes.forEach(cb => cb.checked = false);
            }
        });
        
        outrosCheckboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked) {
                    checkboxExclusivo.checked = false;
                }
            });
        });
    }
    
    configurarCheckboxExclusivo('q01-ameaca-nao', [
        'q01-ameaca-arma',
        'q01-ameaca-faca',
        'q01-ameaca-outra'
    ]);
    
    configurarCheckboxExclusivo('q02-agressao-nenhuma', [
        'q02-agressao-queimadura',
        'q02-agressao-enforcamento',
        'q02-agressao-sufocamento',
        'q02-agressao-tiro',
        'q02-agressao-afogamento',
        'q02-agressao-facada',
        'q02-agressao-paulada'
    ]);
    
    configurarCheckboxExclusivo('q03-agressao-nenhuma', [
        'q03-agressao-socos',
        'q03-agressao-chutes',
        'q03-agressao-tapas',
        'q03-agressao-empurroes',
        'q03-agressao-puxoes-cabelo'
    ]);
    
    configurarCheckboxExclusivo('q05-comportamento-nenhum', [
        'q05-comportamento-frase-possessiva',
        'q05-comportamento-perseguicao',
        'q05-comportamento-proibiu-visitas',
        'q05-comportamento-proibiu-trabalhar',
        'q05-comportamento-contato-insistente',
        'q05-comportamento-impediu-acesso-bens',
        'q05-comportamento-ciumes-controle'
    ]);
    
    const q08Nao = document.getElementById('q08-uso-abusivo-nao');
    const q08NaoSei = document.getElementById('q08-uso-abusivo-nao-sei');
    const q08Alcool = document.getElementById('q08-uso-abusivo-alcool');
    const q08Drogas = document.getElementById('q08-uso-abusivo-drogas');
    
    if (q08Nao && q08NaoSei && q08Alcool && q08Drogas) {
        q08Nao.addEventListener('change', function() {
            if (this.checked) {
                q08NaoSei.checked = false;
                q08Alcool.checked = false;
                q08Drogas.checked = false;
            }
        });
        
        q08NaoSei.addEventListener('change', function() {
            if (this.checked) {
                q08Nao.checked = false;
                q08Alcool.checked = false;
                q08Drogas.checked = false;
            }
        });
        
        q08Alcool.addEventListener('change', function() {
            if (this.checked) {
                q08Nao.checked = false;
                q08NaoSei.checked = false;
            }
        });
        
        q08Drogas.addEventListener('change', function() {
            if (this.checked) {
                q08Nao.checked = false;
                q08NaoSei.checked = false;
            }
        });
    }
    
    const q14Nao = document.getElementById('q14-ameacou-agrediu-nao');
    const q14NaoSei = document.getElementById('q14-ameacou-agrediu-nao-sei');
    const q14Filhos = document.getElementById('q14-ameacou-agrediu-filhos');
    const q14Familiares = document.getElementById('q14-ameacou-agrediu-familiares');
    const q14Outras = document.getElementById('q14-ameacou-agrediu-outras-pessoas');
    const q14Animais = document.getElementById('q14-ameacou-agrediu-animais');
    
    if (q14Nao && q14NaoSei && q14Filhos && q14Familiares && q14Outras && q14Animais) {
        q14Nao.addEventListener('change', function() {
            if (this.checked) {
                q14NaoSei.checked = false;
                q14Filhos.checked = false;
                q14Familiares.checked = false;
                q14Outras.checked = false;
                q14Animais.checked = false;
            }
        });
        
        q14NaoSei.addEventListener('change', function() {
            if (this.checked) {
                q14Nao.checked = false;
                q14Filhos.checked = false;
                q14Familiares.checked = false;
                q14Outras.checked = false;
                q14Animais.checked = false;
            }
        });
        
        [q14Filhos, q14Familiares, q14Outras, q14Animais].forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked) {
                    q14Nao.checked = false;
                    q14NaoSei.checked = false;
                }
            });
        });
    }
    
    configurarCheckboxExclusivo('q16-3-conflito-nao', [
        'q16-3-conflito-guarda',
        'q16-3-conflito-visitas',
        'q16-3-conflito-pensao'
    ]);

// Controle de visibilidade dos campos de texto/número
    // Pergunta 16 - quantos filhos
    const q16CheckboxAgressor = document.getElementById('q16-tem-filhos-sim-agressor');
    const q16InputAgressor = document.getElementById('q16-quantos-agressor');
    const q16CheckboxOutro = document.getElementById('q16-tem-filhos-sim-outro');
    const q16InputOutro = document.getElementById('q16-quantos-outro');
    
    if (q16CheckboxAgressor && q16InputAgressor) {
        q16CheckboxAgressor.addEventListener('change', function() {
            q16InputAgressor.style.display = this.checked ? 'inline-block' : 'none';
            if (!this.checked) q16InputAgressor.value = '';
        });
    }
    
    if (q16CheckboxOutro && q16InputOutro) {
        q16CheckboxOutro.addEventListener('change', function() {
            q16InputOutro.style.display = this.checked ? 'inline-block' : 'none';
            if (!this.checked) q16InputOutro.value = '';
        });
    }
    
    // Pergunta 16.2 - filhos com deficiência
    const q162RadioSim = document.getElementById('q16-2-deficiencia-sim');
    const q162Input = document.getElementById('q16-2-quantos-deficiencia');
    const q162RadioNao = document.getElementById('q16-2-deficiencia-nao');
    
    if (q162RadioSim && q162Input && q162RadioNao) {
        q162RadioSim.addEventListener('change', function() {
            q162Input.style.display = this.checked ? 'inline-block' : 'none';
        });
        
        q162RadioNao.addEventListener('change', function() {
            if (this.checked) {
                q162Input.style.display = 'none';
                q162Input.value = '';
            }
        });
    }
    
    // Pergunta 18 - deficiência da assistida
    const q18RadioSim = document.getElementById('q18-deficiencia-sim');
    const q18Input = document.getElementById('q18-qual-deficiencia');
    const q18RadioNao = document.getElementById('q18-deficiencia-nao');
    
    if (q18RadioSim && q18Input && q18RadioNao) {
        q18RadioSim.addEventListener('change', function() {
            q18Input.style.display = this.checked ? 'inline-block' : 'none';
        });
        
        q18RadioNao.addEventListener('change', function() {
            if (this.checked) {
                q18Input.style.display = 'none';
                q18Input.value = '';
            }
        });
    }

// Funcionalidade: Enter para próxima pergunta 
    const titulosSessao = document.querySelectorAll('.titulo-sessao');
    let secaoAgressor = null;
    
    titulosSessao.forEach(titulo => {
        const h4 = titulo.querySelector('h4');
        if (h4 && h4.textContent.includes('Identificação do Agressor(a)')) {
            secaoAgressor = titulo.nextElementSibling;
        }
    });
    
    if (secaoAgressor) {
        const inputsAgressor = secaoAgressor.querySelectorAll('.pergunta input[type="text"], .pergunta input[type="number"], .pergunta input[type="date"]');
        
        inputsAgressor.forEach((input, index) => {
            input.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault(); 
                    
                    const proximoInput = inputsAgressor[index + 1];
                    
                    if (proximoInput) {
                        proximoInput.focus();
                        
                        if (proximoInput.type === 'date') {
                            proximoInput.showPicker && proximoInput.showPicker();
                        }
                    }
                }
            });
        });
    }
});
