const form = document.getElementById('userForm') as HTMLFormElement;
const resultDiv = document.getElementById('result') as HTMLDivElement;
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
const listarUser = document.getElementById('getAll') as HTMLButtonElement;


listarUser.addEventListener('click', async (event) => {
  event.preventDefault();

  try {
    const result = await window.api.getUsers()

      if (result.success && Array.isArray(result.users)) {
          resultDiv.className = 'result success';
          const allUsersHtml = result.users.map(user => `
              <div class="user-info-item">
                  <p><strong>ID:</strong> ${user.id}</p>
                  <p><strong>Nome:</strong> ${user.name}</p>
                  <p><strong>E-mail:</strong> ${user.email}</p>
                  <hr>
              </div>
          `).join('');

          resultDiv.innerHTML = `
              <h2>✅ Lista de Usuários</h2>
              ${allUsersHtml}
          `;
      }

  }  catch (error) {

    resultDiv.className = 'result error';
    resultDiv.innerHTML = `
      <h2> Erro de Comunicação</h2>
      <p>Não foi possível se comunicar com o servidor.</p>
      <p><small>${error instanceof Error ? error.message : String(error)}</small></p>
    `;
  } finally {
    listarUser.disabled = false;
    listarUser.textContent = 'Listar user';
  }
});

form.addEventListener('submit', async (event) => {

  event.preventDefault();

  const nameInput = document.getElementById('name') as HTMLInputElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

    if (!name || !email) {
      resultDiv.className = 'result error';
      resultDiv.innerHTML = `
        <h2>⚠️ Atenção</h2>
        <p>Preencha todos os campos!</p>
      `;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Criando...';

    try {
      
      const result = await window.api.createUser(name, email);

      if (result.success && result.user) {
        resultDiv.className = 'result success';
        resultDiv.innerHTML = `
          <h2>✅ Usuário Criado com Sucesso!</h2>
          <div class="user-info">
            <p><strong>Nome:</strong> ${escapeHtml(result.user.name)}</p>
            <p><strong>E-mail:</strong> ${escapeHtml(result.user.email)}</p>
          </div>
        `;
        form.reset();
      } else {
        resultDiv.className = 'result error';
        resultDiv.innerHTML = `
          <h2>❌ Erro</h2>
          <p>${escapeHtml(result.error || 'Erro desconhecido')}</p>
        `;
      }
    } catch (error) {

      resultDiv.className = 'result error';
      resultDiv.innerHTML = `
        <h2> Erro de Comunicação</h2>
        <p>Não foi possível se comunicar com o servidor.</p>
        <p><small>${error instanceof Error ? error.message : String(error)}</small></p>
      `;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '✓ Aceitar e Criar Usuário';
    }
  });

 
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}
