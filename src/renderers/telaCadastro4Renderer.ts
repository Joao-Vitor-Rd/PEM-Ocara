/// <reference path="../types/windown.d.ts" />

export {}

function mostrarSucesso(mensagem: string) {
    let modal = document.getElementById('sucesso-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'sucesso-modal';
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
    titulo.textContent = '✅ Sucesso';
    titulo.style.color = '#5cb85c';

    const texto = document.createElement('p');
    texto.textContent = mensagem;
    texto.style.marginTop = '15px';

    const botao = document.createElement('button');
    botao.textContent = 'OK';
    botao.style.cssText = `
        margin-top: 20px;
        padding: 10px 30px;
        background-color: #5cb85c;
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

const pxmBtn = document.getElementById('proximo') as HTMLButtonElement; 
const voltarBtn = document.getElementById('voltar') as HTMLButtonElement;

voltarBtn.addEventListener('click', async (event) => {
    window.api.openWindow("telaCadastro3");
});

pxmBtn.addEventListener('click', async (event) => {
    try {
        const dadosCasoJSON = sessionStorage.getItem('dadosCaso');
        
        if (!dadosCasoJSON) {
            throw new Error('Erro ao recuperar dados anteriores');
        }
        
        const dadosCaso = JSON.parse(dadosCasoJSON);

        const respostaFormularioInput = document.querySelector('input[name="resposta-formulario"]:checked') as HTMLInputElement;
        const tiposViolenciaInputs = document.querySelectorAll('input[name="tipo-violencia"]:checked') as NodeListOf<HTMLInputElement>;

        const respostaFormularioValue = respostaFormularioInput?.value || "";
        const tiposViolenciaArray = Array.from(tiposViolenciaInputs).map(input => input.value);

        dadosCaso.assistidaRespondeuSemAjuda = respostaFormularioValue === 'Assistida respondeu sem ajuda';
        dadosCaso.assistidaRespondeuComAuxilio = respostaFormularioValue === 'Assistida respondeu com auxílio';
        dadosCaso.assistidaSemCondicoes = respostaFormularioValue === 'Assistida sem condições';
        dadosCaso.assistidaRecusou = respostaFormularioValue === 'Assistida recusou';
        dadosCaso.terceiroComunicante = respostaFormularioValue === 'Terceiro comunicante';

        dadosCaso.tipoViolencia = tiposViolenciaArray.join('; ');

        dadosCaso.preenchimentoProfissional = {
            respostaFormulario: respostaFormularioValue,
            tiposViolencia: tiposViolenciaArray
        };

        sessionStorage.setItem('dadosCaso', JSON.stringify(dadosCaso));
        window.api.openWindow("telaCadastro5");

    } catch (error) {
        mostrarSucesso(error instanceof Error ? error.message : 'Erro ao processar o formulário');
    }
});


