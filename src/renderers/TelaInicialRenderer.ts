export {}

const cadastroAssistidaBtn = document.getElementById('telaCadastroAssistida') as HTMLButtonElement;
const assistidasBtn = document.getElementById('listarAssistidas') as HTMLLIElement;

assistidasBtn.addEventListener('click', async (event) => {
    const mudarTela = await window.api.openWindow("telaListarAssistidas");
})

cadastroAssistidaBtn.addEventListener('click', async (event) => {
    const mudarTela = await window.api.openWindow("telaCadastroAssistida");
})
