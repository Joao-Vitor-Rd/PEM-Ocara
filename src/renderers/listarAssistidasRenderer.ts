document.addEventListener('DOMContentLoaded', () => {
    listarAssistidas();
});

async function listarAssistidas() {
   
    const container = document.getElementById('assistidas-container');

    if (!container) {
        console.error("Container 'assistidas-container' não encontrado no DOM.");
        return;
    }

    if (!window.api || !window.api.listarAssistidas) {
        console.error("API de Electron não disponível. O preload pode não ter sido carregado corretamente.");
        container.innerHTML += '<p>Erro: Não foi possível carregar os dados.</p>';
        return;
    }

    try {
        const result = await window.api.listarAssistidas();
        console.log(result.assistidas)

        if (result.success && result.assistidas) {
            
            result.assistidas.forEach(assistida => {
                
                const assistidaID = assistida.protocolo; 
                const nomeCompleto = assistida.nome;
                
                const cardHTML = `
                    <div class="card">
                        <div class="card-id">${assistidaID}</div>
                        <div class="card-name">${nomeCompleto}</div>
                    </div>
                `;
                container.innerHTML += cardHTML;
            });
        
        } else {
            console.error('Erro ao buscar assistidas:', result.error);
            container.innerHTML += `<p>Falha ao carregar a lista: ${result.error}</p>`;
        }

    } catch (error) {
        console.error('Erro na comunicação IPC:', error);
        container.innerHTML += '<p>Erro de comunicação com o backend.</p>';
    }
}