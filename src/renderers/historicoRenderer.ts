const btnFecharHistorico = document.getElementById("btn-fechar-historico");

btnFecharHistorico?.addEventListener("click", () => {
    window.api.openWindow('telaConfiguracoesConta');
});