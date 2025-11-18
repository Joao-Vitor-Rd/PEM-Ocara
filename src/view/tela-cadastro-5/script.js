document.addEventListener('DOMContentLoaded', () => {
    const btnProximo = document.getElementById('proximo')
    const btnVoltar = document.getElementById('voltar');

    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            window.api.openWindow('tela-cadastro-4');
        });
    }

    btnProximo.addEventListener('click', async (e) => {
        e.preventDefault();
        btnProximo.disable = true;
        btnProximo.textContent = 'Processando...'
    });

    try {
        const dadosArmazenados = JSON.parse(sessionStorage.getItem('dadosFormulario') || '{}');

        const dadosCompletos = {
            ...dadosArmazenados,
            data: newDate(),
            profissionalResponsavel: nomeProfissional
        };

        console.log("Criando caso com responsável:", nomeProfissional);
        const resultadoCaso = await window.api.criarCaso(dadosCompletos);
    }
});

const areaUpload = document.getElementById('areaUpload');
const fileInput = document.getElementById('fileInput');
const escolherArquivo = document.querySelector('.escolher-arquivo');

escolherArquivo.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFiles(files);});

areaUpload.addEventListener('dragover', (e) => {
    e.preventDefault(); 
    areaUpload.classList.add('drag-over');
});

areaUpload.addEventListener('dragleave', (e) => {
    e.preventDefault();
    areaUpload.classList.remove('drag-over');
});

areaUpload.addEventListener('drop', (e) => {
    e.preventDefault(); 
    areaUpload.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    handleFiles(files);
});

function handleFiles(files) {
    if (files.length === 0) return;    
    const maxSize = 100 * 1024 * 1024;  
    let arquivosValidos = 0;   
    for (let file of files) {        
        if (file.size > maxSize) {
            alert(`O arquivo "${file.name}" excede o tamanho máximo de 100MB.`);
            continue; 
        }        
        console.log('Arquivo válido selecionado:', {
            nome: file.name,
            tipo: file.type,
            tamanho: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        });
        arquivosValidos++;
    }
    if (arquivosValidos > 0) {
        alert(`${arquivosValidos} arquivo(s) selecionado(s) com sucesso!`);
    }
}