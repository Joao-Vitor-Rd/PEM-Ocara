document.addEventListener('DOMContentLoaded', () => {

    const botaoAbrirModal = document.getElementById('gerarEncaminhamento');
    const modal = document.getElementById('modalEncaminhamento');
    const botaoFecharModal = document.getElementById('fecharModal');

    function abrirModal() {
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden'; 
    }

    function fecharModal() {
        modal.classList.remove('visible');
        document.body.style.overflow = ''; 
    }

    botaoAbrirModal.addEventListener('click', abrirModal);
    botaoFecharModal.addEventListener('click', fecharModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            fecharModal();
        }
    });

    const fileInput = document.getElementById('inputAnexo');
    const escolherArquivo = document.getElementById('botaoAnexo');
    const nomeAnexoEl = document.getElementById('nome-anexo');

    nomeAnexoEl.textContent = 'Nenhum arquivo selecionado';

    escolherArquivo.addEventListener('click', (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        fileInput.click(); 
    });

    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        if (files.length === 0) {
            nomeAnexoEl.textContent = 'Nenhum arquivo selecionado';
            return;
        }

        const arquivo = files[0];
        const tiposPermitidos = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png'
        ];

        if (!tiposPermitidos.includes(arquivo.type)) {
            alert('Tipo de arquivo não permitido. Selecione PDF, DOC, DOCX, JPG ou PNG.');
            fileInput.value = '';
            nomeAnexoEl.textContent = 'Nenhum arquivo selecionado';
            return;
        }

        if (arquivo.size > 5 * 1024 * 1024) {
            alert('O arquivo deve ter no máximo 5 MB.');
            fileInput.value = '';
            nomeAnexoEl.textContent = 'Nenhum arquivo selecionado';
            return;
        }

        nomeAnexoEl.textContent = arquivo.name;

        const removerBtn = document.createElement('button');
        removerBtn.textContent = '✖';
        removerBtn.style.marginLeft = '8px';
        removerBtn.style.border = 'none';
        removerBtn.style.background = 'transparent';
        removerBtn.style.color = '#63468C';
        removerBtn.style.cursor = 'pointer';
        removerBtn.style.fontSize = '16px';

        removerBtn.addEventListener('click', () => {
            fileInput.value = '';
            nomeAnexoEl.textContent = 'Nenhum arquivo selecionado';
            removerBtn.remove();
        });

        nomeAnexoEl.appendChild(removerBtn);
        console.log('Arquivo selecionado:', arquivo.name);
    }

});
