/// <reference path="../types/windown.d.ts" />

export {}

function mostrarErro(mensagem: string) {
    let modal = document.getElementById('erro-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'erro-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        document.body.appendChild(modal);
    }

    const conteudo = document.createElement('div');
    conteudo.style.cssText = `
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    const titulo = document.createElement('h3');
    titulo.textContent = `Erro de Validação: ${mensagem}`;
    titulo.style.color = '#d9534f';

    const texto = document.createElement('p');
    texto.textContent = mensagem;
    texto.style.marginTop = '15px';

    const botao = document.createElement('button');
    botao.textContent = 'OK';
    botao.style.cssText = `
        margin-top: 20px;
        padding: 10px 30px;
        background-color: #d9534f;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    `;

    botao.addEventListener('click', () => {
        modal!.remove();
    });

    conteudo.appendChild(titulo);
    conteudo.appendChild(texto);
    conteudo.appendChild(botao);

    modal.innerHTML = '';
    modal.appendChild(conteudo);
    modal.style.display = 'flex';
}

window.addEventListener('DOMContentLoaded', () => {
    const dadosSalvos = sessionStorage.getItem('dadosAssistida');
    if (!dadosSalvos) return;

    const dados = JSON.parse(dadosSalvos);

    (document.getElementById('nome-completo') as HTMLInputElement).value = dados.nome || '';
    (document.getElementById('idade') as HTMLInputElement).value = dados.idade?.toString() || '';
    (document.getElementById('endereco') as HTMLInputElement).value = dados.endereco || '';
    (document.getElementById('identidade-genero') as HTMLInputElement).value = dados.identidadeGenero || '';
    (document.getElementById('nome-social') as HTMLInputElement).value = dados.nomeSocial || '';
    (document.getElementById('escolaridade') as HTMLInputElement).value = dados.escolaridade || '';
    (document.getElementById('religiao') as HTMLInputElement).value = dados.religiao || '';
    (document.getElementById('profissao') as HTMLInputElement).value = dados.profissao || '';
    (document.getElementById('limitacao') as HTMLInputElement).value = dados.limitacaoFisica || '';
    (document.getElementById('numero-cadastro') as HTMLInputElement).value = dados.numeroCadastroSocial || '';
    (document.getElementById('nacionalidade') as HTMLInputElement).value = dados.nacionalidade || '';
    (document.getElementById('dependentes') as HTMLInputElement).value = dados.quantidadeDependentes?.toString() || '';

    const radios = document.querySelectorAll('input[name="zona_habitacao"]') as NodeListOf<HTMLInputElement>;
    radios.forEach(r => {
        if (r.value === dados.zonaHabitacao) {
            r.checked = true;
        }
    });
});


const pxmBtn = document.getElementById('proximo') as HTMLButtonElement; 
const voltarBtn = document.getElementById('voltar') as HTMLButtonElement;

voltarBtn.addEventListener('click', async (event) => {
    sessionStorage.removeItem('dadosAssistida');
    const mudarTela = await window.api.openWindow("telaInicial");
})


pxmBtn.addEventListener('click', async (event) => {
    try {
        const nomeInput = document.getElementById('nome-completo') as HTMLInputElement;
        const idadeInput = document.getElementById('idade') as HTMLInputElement;
        const enderecoInput = document.getElementById('endereco') as HTMLInputElement;
        const generoInput = document.getElementById('identidade-genero') as HTMLInputElement;
        const nomeSocialInput = document.getElementById('nome-social') as HTMLInputElement;
        const escolaridadeInput = document.getElementById('escolaridade') as HTMLInputElement;
        const religiaoInput = document.getElementById('religiao') as HTMLInputElement;
        const profissaoInput = document.getElementById('profissao') as HTMLInputElement;
        const limitacaoInput = document.getElementById('limitacao') as HTMLInputElement;
        const programaSocialInput = document.getElementById('numero-cadastro') as HTMLInputElement;
        const nacionalidadeInput = document.getElementById('nacionalidade') as HTMLInputElement;
        const dependentesInput = document.getElementById('dependentes') as HTMLInputElement;

        // Validar se todos os elementos foram encontrados
        if (!nomeInput || !idadeInput || !enderecoInput || !generoInput || !nomeSocialInput || 
            !escolaridadeInput || !religiaoInput || !profissaoInput || !limitacaoInput || 
            !programaSocialInput || !nacionalidadeInput || !dependentesInput) {
            throw new Error('Um ou mais campos do formulário não foram encontrados no HTML');
        }

        // Obter zona de habitação do radio button
        const zonaHabitacaoRadios = document.querySelectorAll('input[name="zona_habitacao"]') as NodeListOf<HTMLInputElement>;
        let zonaHabitacao: string = '';
        zonaHabitacaoRadios.forEach(radio => {
            if (radio.checked) {
                zonaHabitacao = radio.value;
            }
        });

        // Validar campos obrigatórios
        if (!nomeInput.value.trim()) throw new Error('O nome é obrigatório');
        if (!idadeInput.value.trim()) throw new Error('A idade é obrigatória');
        if (!enderecoInput.value.trim()) throw new Error('O endereço é obrigatório');
        if (!nacionalidadeInput.value.trim()) throw new Error('A nacionalidade é obrigatória');
        if (!profissaoInput.value.trim()) throw new Error('A profissão é obrigatória');
        if (!limitacaoInput.value.trim()) throw new Error('O campo de limitação física é obrigatório');
        if (!dependentesInput.value.trim()) throw new Error('O campo de dependentes é obrigatório');
        if (!zonaHabitacao) throw new Error('Por favor, selecione uma zona de habitação');

        const nome: string = nomeInput.value.trim();
        const idade: number = parseInt(idadeInput.value.trim(), 10); 
        const identidadeGenero: string = generoInput.value.trim(); 
        const nomeSocial: string = nomeSocialInput.value.trim();
        const endereco: string = enderecoInput.value.trim();
        const escolaridade: string = escolaridadeInput.value.trim();
        const religiao: string = religiaoInput.value.trim();
        const nacionalidade: string = nacionalidadeInput.value.trim();
        const profissao: string = profissaoInput.value.trim();
        const limitacaoFisica: string = limitacaoInput.value.trim();
        const numeroCadastroSocial: string = programaSocialInput.value.trim();
        const quantidadeDependentes: number = parseInt(dependentesInput.value.trim(), 10);
        const temDependentes: boolean = quantidadeDependentes > 0;

        // Armazenar dados no localStorage para recuperar na próxima tela
        const dadosAssistida = {
            nome,
            idade,
            identidadeGenero,
            nomeSocial,
            endereco,
            escolaridade,
            religiao,
            nacionalidade,
            zonaHabitacao,
            profissao,
            limitacaoFisica,
            numeroCadastroSocial,
            quantidadeDependentes,
            temDependentes
        };


        sessionStorage.setItem('dadosAssistida', JSON.stringify(dadosAssistida));

        const mudarTela = await window.api.openWindow("telaCadastro2");

    } catch (error) {
        mostrarErro(error instanceof Error ? error.message : 'Erro desconhecido');
        console.error("Erro de validação:", error);
    }
});

// Lógica para pular para o próximo campo ao pressionar Enter
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll<HTMLInputElement>('input[type="text"], input[type="number"], input[type="radio"]');

    inputs.forEach((input, index) => {
        input.addEventListener('keydown', function(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                event.preventDefault();

                if (input.type === 'radio') {
                    let nextIndex = index + 1;
                    while (nextIndex < inputs.length && inputs[nextIndex].type === 'radio' && 
                        inputs[nextIndex].name === input.name) {
                        nextIndex++;
                    }

                    if (nextIndex < inputs.length) {
                        inputs[nextIndex].focus();
                    } else {
                        pxmBtn?.click();
                    }
                } else {
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    } else {
                        pxmBtn?.click();
                    }
                }
            }
        });
    });

});

