/// <reference path="../types/windown.d.ts" />

import { navigateToTelaInicial, navigateToTelaConta, navigateToTelaEstatisticas, navigateToTelaRedeApoio } from '../utils/SidebarManager.js';

export {}

document.addEventListener('DOMContentLoaded', async () => {
    // IDs do sidebar normal
    const navAssistidas = document.getElementById('navAssistidas') as HTMLLIElement;
    const navRede = document.getElementById('navRede') as HTMLLIElement;
    const navInicial = document.getElementById('navInicial') as HTMLLIElement;
    const navEstatisticas = document.getElementById('navEstatisticas') as HTMLLIElement;
    const navConta = document.getElementById('navConta') as HTMLLIElement;
    
    // IDs do sidebar admin
    const navFuncionarios = document.getElementById('navFuncionarios') as HTMLLIElement;

    // Navegação para Assistidas
    if (navAssistidas) {
        navAssistidas.addEventListener('click', async (event) => {
            event.preventDefault();
            await window.api.openWindow('telaListarAssistidas');
        });
    }

    // Navegação para Rede de Apoio (já estamos aqui)
    if (navRede) {
        navRede.addEventListener('click', async (event) => {
            event.preventDefault();
            await navigateToTelaRedeApoio();
        });
    }

    // Navegação para Inicial
    if (navInicial) {
        navInicial.addEventListener('click', async (event) => {
            event.preventDefault();
            await navigateToTelaInicial();
        });
    }

    // Navegação para Estatísticas
    if (navEstatisticas) {
        navEstatisticas.addEventListener('click', async (event) => {
            event.preventDefault();
            await navigateToTelaEstatisticas();
        });
    }

    // Navegação para Conta
    if (navConta) {
        navConta.addEventListener('click', async (event) => {
            event.preventDefault();
            await navigateToTelaConta();
        });
    }

    // Navegação para Funcionários (admin only)
    if (navFuncionarios) {
        navFuncionarios.addEventListener('click', async (event) => {
            event.preventDefault();
            await window.api.openWindow('telaListarFuncionarios');
        });
    }
});

