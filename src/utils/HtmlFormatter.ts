export class HtmlFormatter {
  /**
   * Escapa caracteres HTML perigosos
   * @param texto Texto a ser escapado
   * @returns Texto com caracteres escapados
   */
  static escaparHtmlBasico(texto: string): string {
    return texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Formata corpo de e-mail HTML
   * @param conteudo Conteúdo a ser formatado
   * @returns HTML formatado e pronto para envio
   */
  static formatarCorpoEmailHTML(conteudo: string): string {
    const seguro = this.escaparHtmlBasico(conteudo ?? '');
    const comQuebras = seguro.replace(/\r?\n/g, '<br />');
    return `<div style="font-family: Arial, sans-serif; line-height: 1.5; font-size: 14px;">${comQuebras}</div>`;
  }
}
