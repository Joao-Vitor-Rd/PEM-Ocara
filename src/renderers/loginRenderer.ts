export {}

const loginBtn = document.getElementById('buttonLogin') as HTMLButtonElement;

loginBtn.addEventListener('click', async (event) => {
    const mudarTela = await window.api.openWindow("telaInicial");
})