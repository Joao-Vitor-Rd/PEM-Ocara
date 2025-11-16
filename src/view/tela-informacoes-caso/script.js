// 1. Pega o contêiner da lista no HTML
const listaContainer = document.getElementById("lista-anexos");

// 2. Limpa a lista (caso tenha algum "Carregando...")
listaContainer.innerHTML = ""; 

// 3. Cria um item na lista para CADA anexo
dadosDosAnexos.forEach(arquivo => {
  // Cria um elemento <li> (item da lista)
    const itemLista = document.createElement("li");
    itemLista.className = "item-anexo"; // Adiciona uma classe para o CSS
    
    // Define o status (se está "upando", desabilita o botão de apagar)
    const estaUpando = arquivo.status === 'upando';
    const textoStatus = estaUpando ? 'Upando...' : 'Concluído';
    
    // 4. Cria o HTML interno do item
    // Usamos "data-id" para guardar o ID do arquivo no próprio botão
    itemLista.innerHTML = `
        <div class="info-arquivo">
        <span class="nome-arquivo">${arquivo.nome}</span>
        <span class="tamanho-arquivo">${arquivo.tamanho}</span>
        </div>
        
        <div class="status-arquivo status-${arquivo.status}">
        <span>${textoStatus}</span>
        </div>
        
        <button class="btn-apagar" data-id="${arquivo.id}" ${estaUpando ? 'disabled' : ''}>
        Apagar
        </button>
    `;
    
    // 5. Adiciona o item (<li>) pronto dentro da lista (<ul>)
    listaContainer.appendChild(itemLista);
});