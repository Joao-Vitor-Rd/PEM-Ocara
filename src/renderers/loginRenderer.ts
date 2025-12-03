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
    if (!emailInput || !senhaInput) {
        setError('Formulário inválido.');
        return;
    }

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    if (!email || !senha) {
        setError('Preencha e-mail e senha.');
        return;
    }

    setError(null);
    loginBtn?.classList.add('loading');
    try {
        const resultado = await window.api.autenticar(email, senha);
        if (!resultado.success || !resultado.funcionario) {
            setError(resultado.error ?? 'Não foi possível autenticar.');
            return;
        }

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(resultado.funcionario));
        await window.api.openWindow('telaInicial');
    } catch (error) {
        console.error('Erro ao autenticar:', error);
        setError('Erro inesperado ao autenticar.');
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