/// <reference path="../types/windown.d.ts" />

(() => {
  type SidebarElement = HTMLElement & {
    dataset: DOMStringMap & { sidebarBound?: string; windowTarget?: string };
  };

  const DATA_TARGET = 'windowTarget';
  const DATA_BOUND = 'sidebarBound';

  const initialize = (): void => {
    const candidates = document.querySelectorAll<SidebarElement>(`[data-window-target]`);

    candidates.forEach((element) => {
      if (element.dataset[DATA_BOUND] === 'true') {
        return;
      }

      const windowName = element.dataset[DATA_TARGET];
      if (!windowName) {
        return;
      }

      element.addEventListener(
        'click',
        (event) => handleNavigation(event, windowName)
      );
      element.dataset[DATA_BOUND] = 'true';
    });
  };

  const handleNavigation = async (event: Event, windowName: string): Promise<void> => {
    if (!windowName) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    try {
      await window.api?.openWindow(windowName);
    } catch (error) {
      console.error('Falha ao abrir janela via sidebar:', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
