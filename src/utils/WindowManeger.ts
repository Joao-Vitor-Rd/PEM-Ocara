import { BrowserWindow } from 'electron';
import * as path from 'path';

export class WindowManager {
  private windows: Map<string, BrowserWindow> = new Map();

  public loadContent(name: string, htmlFile: string): boolean {
      const window = this.windows.get(name);

      if (window && !window.isDestroyed()) {
          const htmlPath = path.join(__dirname, '..', '..', '..', 'src', 'view', htmlFile);
          
          window.loadFile(htmlPath).catch(err => {
              console.error('WindowManager: Erro ao carregar novo HTML:', err);
          });

          window.focus();
          return true;
      }
      return false;
  }

  public createWindow(
    name: string,
    options: {
      width?: number;
      height?: number;
      htmlFile: string;
      preloadFile?: string;
    }
  ): BrowserWindow {
    if (this.windows.has(name)) {
      const existingWindow = this.windows.get(name);
      if (existingWindow && !existingWindow.isDestroyed()) {
        existingWindow.focus();
        return existingWindow;
      }
    }

    const window = new BrowserWindow({
      width: options.width || 1200,
      height: options.height || 1880,
      frame: true, 
      fullscreen: false, 
      autoHideMenuBar: true,
      resizable: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: options.preloadFile
          ? path.join(__dirname, '..', options.preloadFile)
          : path.join(__dirname, '..', 'preload.js'),
        sandbox: false,
      },
    });

    window.maximize();


    const htmlPath = path.join(__dirname, '..', '..', '..', 'src', 'view', options.htmlFile);
    

    window.loadFile(htmlPath).catch(err => {
      console.error('WindowManager: Erro ao carregar HTML:', err);
    });

    this.windows.set(name, window);

    window.on('closed', () => {
      this.windows.delete(name);
    });

    window.webContents.openDevTools();

    return window;
  }

  public getWindow(name: string): BrowserWindow | undefined {
    return this.windows.get(name);
  }

  public closeWindow(name: string): void {
    const window = this.windows.get(name);
    if (window && !window.isDestroyed()) {
      window.close();
    }
  }

  public closeAllWindows(): void {
    this.windows.forEach((window) => {
      if (!window.isDestroyed()) {
        window.close();
      }
    });
    this.windows.clear();
  }
}