/// <reference path="../types/windown.d.ts" />

import { navigateToTelaInicial, navigateToTelaConta, navigateToTelaEstatisticas, navigateToTelaRedeApoio } from '../utils/SidebarManager.js';

export {}

// 1. Captura dos Elementos da Sidebar Admin
const navFuncionarios = document.getElementById('navFuncionarios') as HTMLLIElement;
const navRede = document.getElementById('navRede') as HTMLLIElement;
const navInicial = document.getElementById('navInicial') as HTMLLIElement;
const navEstatisticas = document.getElementById('navEstatisticas') as HTMLLIElement;
const navConta = document.getElementById('navConta') as HTMLLIElement;

// 2. Lógica do Botão Listar Funcionários
if (navFuncionarios) {
    navFuncionarios.addEventListener('click', async (event) => {
        event.preventDefault();
        await window.api.openWindow('telaListarFuncionarios');
    });
}

// 3. Lógica do Botão Rede de Apoio
if (navRede) {
    navRede.addEventListener('click', async (event) => {
        event.preventDefault();
        await navigateToTelaRedeApoio();
    });
}

// 4. Lógica do Botão Inicial (volta para telaInicialAdm)
if (navInicial) {
    navInicial.addEventListener('click', async (event) => {
        event.preventDefault();
        await navigateToTelaInicial();
    });
}

// 5. Lógica do Botão Estatísticas
if (navEstatisticas) {
    navEstatisticas.addEventListener('click', async (event) => {
        event.preventDefault();
        await navigateToTelaEstatisticas();
    });
}

// 6. Lógica do Botão Conta
if (navConta) {
    navConta.addEventListener('click', async (event) => {
        event.preventDefault();
        await navigateToTelaConta();
    });
}
