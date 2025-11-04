/// <reference path="../types/windown.d.ts" />

export {}   

const pxmBtn = document.getElementById('proximo') as HTMLButtonElement; 
const voltarBtn = document.getElementById('voltar') as HTMLButtonElement;
const errorModal = document.getElementById('error-modal') as HTMLDivElement;
const modalMessage = document.getElementById('modal-message') as HTMLDivElement;

voltarBtn.addEventListener('click', async (event) => {
    const mudarTela = await window.api.openWindow("telaInicial");
})



pxmBtn.addEventListener('click', async (event) => {
    event.preventDefault();
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

        if (!zonaHabitacao) {
            throw new Error('Por favor, selecione uma zona de habitação');
        }

        // Validar campos obrigatórios
        if (!nomeInput.value.trim()) throw new Error('O nome é obrigatório');
        if (!idadeInput.value.trim()) throw new Error('A idade é obrigatória');
        if (!enderecoInput.value.trim()) throw new Error('O endereço é obrigatório');
        if (!nacionalidadeInput.value.trim()) throw new Error('A nacionalidade é obrigatória');
        if (!profissaoInput.value.trim()) throw new Error('A profissão é obrigatória');
        if (!limitacaoInput.value.trim()) throw new Error('O campo de limitação física é obrigatório');
        if (!dependentesInput.value.trim()) throw new Error('O campo de dependentes é obrigatório');

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

        localStorage.setItem('dadosAssistida', JSON.stringify(dadosAssistida));

        console.log('Abrindo tela de renderer de caso');
        const mudarTela = await window.api.openWindow("telaCadastroCaso");
        console.log('Tela de renderer de caso aberta com sucesso');

    } catch (error) {
        modalMessage.innerHTML = `<p>❌ ${error instanceof Error ? error.message : 'Erro desconhecido'}</p>`;
        errorModal.style.display = 'flex';
        console.error("Erro de validação:", error);
    }
});

        
