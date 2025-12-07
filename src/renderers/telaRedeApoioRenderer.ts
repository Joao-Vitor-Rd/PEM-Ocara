/// <reference path="../types/windown.d.ts" />

export {}

document.addEventListener('DOMContentLoaded', async () => {
    const menuAssistidas = document.getElementById('menuAssistidas') as HTMLLIElement;
    const menuInicial = document.getElementById('menuInicial') as HTMLLIElement;
    const listarAssistidas = document.getElementById('listarAssistidas') as HTMLLIElement;
    const telaInicial = document.getElementById('telaInicial') as HTMLLIElement;
    
    // Navegação sidebar
    if (listarAssistidas) {
        listarAssistidas.addEventListener('click', async (event) => {
            event.preventDefault();
            await window.api.openWindow('telaListarAssistidas');
        });
    }

    if (telaInicial) {
        telaInicial.addEventListener('click', async (event) => {
            event.preventDefault();
            await window.api.openWindow('telaInicial');
        });
    }

    if (menuAssistidas) {
        menuAssistidas.addEventListener('click', async (event) => {
            event.preventDefault();
            await window.api.openWindow('telaListarAssistidas');
        });
    }

    if (menuInicial) {
        menuInicial.addEventListener('click', async (event) => {
            event.preventDefault();
            await window.api.openWindow('telaInicial');
        });
    }
});

