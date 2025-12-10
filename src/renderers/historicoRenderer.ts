/// <reference path="../types/windown.d.ts" />

import { navigateToTelaConta } from '../utils/SidebarManager.js';

export {}

const btnFecharHistorico = document.getElementById("btn-fechar-historico");

btnFecharHistorico?.addEventListener("click", () => {
    navigateToTelaConta();
});