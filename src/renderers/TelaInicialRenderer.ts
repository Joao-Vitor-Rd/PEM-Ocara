export {};

const cadastroAssistidaBtn = document.getElementById(
  'telaCadastroAssistida'
) as HTMLButtonElement;

const assistidasBtn = document.getElementById(
  'listarAssistidas'
) as HTMLLIElement;

const redeApoioBtn = document.getElementById(
  'telaRedeApoio'
) as HTMLLIElement;

assistidasBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  await window.api.openWindow('telaListarAssistidas');
});

cadastroAssistidaBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  await window.api.openWindow('telaCadastroAssistida');
});

redeApoioBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  await window.api.openWindow('telaRedeApoio');
});
