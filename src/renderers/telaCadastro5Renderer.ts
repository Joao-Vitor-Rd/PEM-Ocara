/// <reference path="../types/windown.d.ts" />

export {}

let caminhosArquivosSelecionados: string[] = [];

function mostrarSucesso(mensagem: string) {
    let modal = document.getElementById('sucesso-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'sucesso-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        document.body.appendChild(modal);
    }

    const conteudo = document.createElement('div');
    conteudo.style.cssText = `
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    const titulo = document.createElement('h3');
    titulo.textContent = '✅ Sucesso';
    titulo.style.color = '#5cb85c';

    const texto = document.createElement('p');
    texto.textContent = mensagem;
    texto.style.marginTop = '15px';

    const botao = document.createElement('button');
    botao.textContent = 'OK';
    botao.style.cssText = `
        margin-top: 20px;
        padding: 10px 30px;
        background-color: #5cb85c;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    `;

    botao.addEventListener('click', () => {
        modal!.remove();
    });

    conteudo.appendChild(titulo);
    conteudo.appendChild(texto);
    conteudo.appendChild(botao);

    modal.innerHTML = '';
    modal.appendChild(conteudo);
    modal.style.display = 'flex';
}

const pxmBtn = document.getElementById('proximo') as HTMLButtonElement; 
const voltarBtn = document.getElementById('voltar') as HTMLButtonElement;
const areaUpload = document.getElementById('areaUpload') as HTMLElement;
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const escolherArquivo = document.querySelector('.escolher-arquivo') as HTMLElement;

voltarBtn.addEventListener('click', async (event) => {
    window.api.openWindow("telaCadastro4");
});

pxmBtn.addEventListener('click', async (event) => {
    if (caminhosArquivosSelecionados.length > 0) {
        sessionStorage.setItem('cadastro_anexos', JSON.stringify(caminhosArquivosSelecionados));
    } else {
        sessionStorage.removeItem('cadastro_anexos');
    }

    window.api.openWindow("telaCadastro6");
});

escolherArquivo.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const files = (e.target as HTMLInputElement).files;
    handleFiles(files);
});

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

    const files = (e as DragEvent).dataTransfer?.files;
    handleFiles(files || null);
});

function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;    
    const maxSize = 100 * 1024 * 1024;  
    let arquivosValidos = 0;   
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
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

        const caminho = window.api.getPathForFile(file);
        caminhosArquivosSelecionados.push(caminho);
    }
    if (arquivosValidos > 0) {
        alert(`${arquivosValidos} arquivo(s) selecionado(s) com sucesso!`);
    }
}