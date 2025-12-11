(() => {
  const closeButton = document.querySelector('.title .material-symbols-outlined');

  const navegarParaOrigem = async () => {
    const fallback = 'telaConfiguracoesConta';

    if (!window.api) {
      console.warn('API do Electron indisponível, retornando para a tela padrão.');
      return;
    }

    try {
      const resposta = await window.api.obterOrigemSobreAplicacao();
      const destino = resposta?.origem || fallback;
      window.api.openWindow(destino);
    } catch (error) {
      console.error('Falha ao recuperar a origem da tela Sobre a Aplicação:', error);
      window.api.openWindow(fallback);
    }
  };

  closeButton?.addEventListener('click', navegarParaOrigem);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      navegarParaOrigem();
    }
  });
})();
