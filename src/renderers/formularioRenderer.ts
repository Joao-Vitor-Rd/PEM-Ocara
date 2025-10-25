export {}

    const form = document.getElementById('atendimentoForm') as HTMLFormElement;
    const resultDiv = document.getElementById('result') as HTMLDivElement;
    const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;


    form.addEventListener('submit', async (event) => {

        event.preventDefault();

        try {

            const nomeInput = document.getElementById('assistida-nome') as HTMLInputElement;
            const idadeInput = document.getElementById('assistida-idade') as HTMLInputElement;
            const enderecoInput = document.getElementById('assistida-endereco') as HTMLInputElement;
            const generoInput = document.getElementById('assistida-genero') as HTMLInputElement;
            const nomeSocialInput = document.getElementById('assistida-nome-social') as HTMLInputElement;
            const escolaridadeInput = document.getElementById('assistida-escolaridade') as HTMLInputElement;
            const religiaoInput = document.getElementById('assistida-religiao') as HTMLInputElement;
            const profissaoInput = document.getElementById('assistida-profissao') as HTMLInputElement;
            const limitacaoInput = document.getElementById('assistida-limitacao') as HTMLInputElement;
            const programaSocialInput = document.getElementById('assistida-programa-social') as HTMLInputElement;
            const nacionalidadeInput = document.getElementById('nacionalidade') as HTMLInputElement;
            const zonaHabitacaoInput = document.getElementById('habitacao') as HTMLInputElement;

            const nome: string = nomeInput.value.trim();
            const idade: number = parseInt(idadeInput.value.trim(), 10); 
            const identidadeGenero: string = generoInput.value.trim(); 
            const nomeSocial: string = nomeSocialInput.value.trim();
            const endereco: string = enderecoInput.value.trim();
            const escolaridade: string = escolaridadeInput.value.trim();
            const religiao: string = religiaoInput.value.trim();
            const nacionalidade: string = nacionalidadeInput.value.trim();
            const zonaHabitacao: string = zonaHabitacaoInput.value.trim();
            const profissao: string = profissaoInput.value.trim();
            const limitacaoFisica: string = limitacaoInput.value.trim();
            const numeroCadastroSocial: string = programaSocialInput.value.trim();
            const temDependentes = true;
    
            const result = await window.api.criarAssistida(
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
                temDependentes
            )
            
            if(result.success && result.assistida) {
    
                resultDiv.className = 'result success' 
                resultDiv.innerHTML = `
                <h2>✅ Cadastro Realizado com Sucesso!</h2>
                <div class="user-info">
                    <p><strong>Nome:</strong>${result.assistida.nome}</p>
                    <p><strong>Nome:</strong>${result.assistida.idade}</p>
                    <p><strong>Nome:</strong>${result.assistida.profissao}</p>
                    <p><strong>Nome:</strong>${result.assistida.endereco}</p>
                </div>
                `;
                form.reset();
            } else {
                resultDiv.className = 'result error';
                resultDiv.innerHTML = `
                    <h2> Erro de Validação</h2>
                    <p>Falha ao cadastrar. Detalhes: ${result.error || 'Erro desconhecido.'}</p>
                `;
            }

        } catch (error) {

            resultDiv.className = 'result error';
            resultDiv.innerHTML = `
                <h2>Erro de Comunicação</h2>
                <p>Não foi possível se comunicar com o servidor.</p>
                <p><small>${error instanceof Error ? error.message : String(error)}</small></p>
            `;
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Finalizar Cadastro'; 
        }
    });
        
