/// <reference path="../types/windown.d.ts" />

export const SIDEBAR_STORAGE_KEY = 'sidebarType';
export type SidebarType = 'admin' | 'normal';

/**
 * Obtém o tipo de sidebar que deve ser exibido baseado no usuário logado
 */
export function getSidebarType(): SidebarType {
    // Verifica se já há um tipo salvo (durante a navegação)
    const savedType = sessionStorage.getItem(SIDEBAR_STORAGE_KEY) as SidebarType | null;
    if (savedType === 'admin' || savedType === 'normal') {
        return savedType;
    }

    // Se não houver, determina baseado no cargo do usuário
    const usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (usuarioLogado) {
        try {
            const usuario = JSON.parse(usuarioLogado);
            const cargo = usuario.cargo?.toUpperCase() || '';
            const sidebarType: SidebarType = cargo === 'ADMINISTRADOR' ? 'admin' : 'normal';
            sessionStorage.setItem(SIDEBAR_STORAGE_KEY, sidebarType);
            return sidebarType;
        } catch (error) {
            console.error('Erro ao parsear usuário do sessionStorage:', error);
        }
    }

    return 'normal'; // padrão
}

/**
 * Salva o tipo de sidebar no sessionStorage
 */
export function setSidebarType(type: SidebarType): void {
    sessionStorage.setItem(SIDEBAR_STORAGE_KEY, type);
}

/**
 * Redireciona para a tela inicial correta baseada no tipo de sidebar
 */
export async function navigateToTelaInicial(): Promise<void> {
    const sidebarType = getSidebarType();
    const telaDestino = sidebarType === 'admin' ? 'telaInicialAdm' : 'telaInicial';
    await window.api.openWindow(telaDestino);
}

/**
 * Abre uma janela mantendo a sidebar consistente
 */
export async function openWindow(windowName: string): Promise<void> {
    // Se for voltar para a tela inicial, usa a função específica
    if (windowName === 'telaInicial') {
        await navigateToTelaInicial();
    } else {
        await window.api.openWindow(windowName);
    }
}

/**
 * Obtém a tela de conta correta baseada no tipo de sidebar
 */
export async function navigateToTelaConta(): Promise<void> {
    const sidebarType = getSidebarType();
    const telaDestino = sidebarType === 'admin' ? 'telaContaAdm' : 'telaConfiguracoesConta';
    await window.api.openWindow(telaDestino);
}

/**
 * Obtém a tela de estatísticas correta baseada no tipo de sidebar
 */
export async function navigateToTelaEstatisticas(): Promise<void> {
    const sidebarType = getSidebarType();
    const telaDestino = sidebarType === 'admin' ? 'telaEstatisticasAdm' : 'telaEstatisticas';
    await window.api.openWindow(telaDestino);
}

/**
 * Obtém a tela de rede de apoio correta baseada no tipo de sidebar
 */
export async function navigateToTelaRedeApoio(): Promise<void> {
    const sidebarType = getSidebarType();
    const telaDestino = sidebarType === 'admin' ? 'telaRedeApoioAdm' : 'telaRedeApoio';
    await window.api.openWindow(telaDestino);
}
