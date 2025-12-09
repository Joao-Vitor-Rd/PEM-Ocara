export {};

const STORAGE_KEY = 'usuarioLogado';

const emailInput = document.getElementById('email') as HTMLInputElement;
const senhaInput = document.getElementById('senha') as HTMLInputElement;
const toggleIcon = document.querySelector('.password-icon');
const loginBtn = document.querySelector('#buttonLogin button') as HTMLButtonElement | null;
const errorBox = document.getElementById('loginError');

function setError(message: string | null) {
    if (!errorBox) return;
    errorBox.textContent = message ?? '';
    errorBox.classList.toggle('visible', Boolean(message));
}

function togglePasswordVisibility() {
    if (!senhaInput || !toggleIcon) return;
    const isPassword = senhaInput.type === 'password';
    senhaInput.type = isPassword ? 'text' : 'password';
    toggleIcon.textContent = isPassword ? 'visibility' : 'visibility_off';
    toggleIcon.classList.toggle('active', !isPassword);
}

async function handleLogin() {

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    if (!email || !senha) {
        setError('Preencha e-mail e senha.');
        return;
    }

    try {
        const resultado = await window.api.autenticar(email, senha);
        
        if (!resultado.success || !resultado.funcionario) {
            setError(resultado.error ?? 'Não foi possível autenticar.');
            return;
        }

        const usuario = resultado.funcionario;
        sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));

        console.log('Login efetuado. Cargo:', usuario.cargo);

        switch (usuario.cargo) {
            case 'ADMINISTRADOR':
                await window.api.openWindow('telaEstatisticas'); 
                break;
            
            case 'ASSISTENTE_SOCIAL':
                await window.api.openWindow('telaInicial'); 
                break;
            
            case 'JURIDICO':
                await window.api.openWindow('telaVisualizarCasosBD'); 
                break;

            default:
                setError('Perfil de usuário não identificado.');
                sessionStorage.clear();
        }

    } catch (error) {
        console.error('Erro:', error);
        setError('Erro de conexão.');
    } finally {
        loginBtn?.classList.remove('loading');
    }
}


function initialize() {
    const usuarioSalvo = sessionStorage.getItem(STORAGE_KEY);
    if (usuarioSalvo) {
        window.api.openWindow('telaInicial');
        return;
    }

    toggleIcon?.addEventListener('click', togglePasswordVisibility);
    loginBtn?.addEventListener('click', handleLogin);
    senhaInput?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    });
}

initialize();