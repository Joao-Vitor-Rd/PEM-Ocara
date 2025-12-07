const itemHistoricoMudancas = document.getElementById("itemHistoricoMudancas");

itemHistoricoMudancas?.addEventListener("click", () => {
    window.api.openWindow('historicoMudancas');
});