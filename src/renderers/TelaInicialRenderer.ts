export {}

const cadastroAssistidaBtn = document.getElementById('telaCadastroAssistida') as HTMLButtonElement;

cadastroAssistidaBtn.addEventListener('click', async (event) => {
    const mudarTela = await window.api.openWindow("telaCadastroAssistida");
})
