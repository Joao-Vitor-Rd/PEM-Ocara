import { navigateToTelaInicial, navigateToTelaConta, navigateToTelaEstatisticas, navigateToTelaRedeApoio } from '../utils/SidebarManager.js';

const itemHistoricoMudancas = document.getElementById("itemHistoricoMudancas");

itemHistoricoMudancas?.addEventListener("click", () => {
    window.api.openWindow('historicoMudancas');
});

// Event listeners para a sidebar
const navFuncionarios = document.getElementById("navFuncionarios");
const navRede = document.getElementById("navRede");
const navInicial = document.getElementById("navInicial");
const navEstatisticas = document.getElementById("navEstatisticas");
const navConta = document.getElementById("navConta");
const navAssistidas = document.getElementById("navAssistidas");

if (navInicial) {
    navInicial.addEventListener('click', async (event) => {
        await navigateToTelaInicial();
    });
}

if (navRede) {
    navRede.addEventListener('click', async (event) => {
        await navigateToTelaRedeApoio();
    });
}

if (navEstatisticas) {
    navEstatisticas.addEventListener('click', async (event) => {
        await navigateToTelaEstatisticas();
    });
}

if (navFuncionarios) {
    navFuncionarios.addEventListener('click', async (event) => {
        await window.api.openWindow("telaListarFuncionarios");
    });
}

if (navAssistidas) {
    navAssistidas.addEventListener('click', async (event) => {
        await window.api.openWindow("telaListarAssistidas");
    });
}