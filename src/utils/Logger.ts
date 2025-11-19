export class Logger {
  private static prefix = '[Electron MVC]';

  public static info(message: string, ...args: any[]): void {
    console.log(`${this.prefix} i`, message, ...args);
  }

  public static error(message: string, ...args: any[]): void {
    console.error(`${this.prefix} x`, message, ...args);
  }

  public static warn(message: string, ...args: any[]): void {
    console.warn(`${this.prefix} !`, message, ...args);
  }

  public static success(message: string, ...args: any[]): void {
    console.log(`${this.prefix} v`, message, ...args);
  }
}