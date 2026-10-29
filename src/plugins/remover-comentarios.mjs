/**
 * Plugin do Sätteri (processador de Markdown do Astro) que remove comentários
 * HTML do Markdown renderizado.
 *
 * Os arquivos em src/content/projetos/ usam <!-- TODO: ... --> como anotação
 * para quem edita. Sem este plugin esses comentários iriam para o HTML
 * publicado — invisíveis na tela, mas visíveis no código-fonte da página.
 * Eles continuam no .md; só não são publicados.
 */
export const removerComentariosHtml = {
  name: 'remover-comentarios-html',

  comment(node, ctx) {
    ctx.removeNode(node);
  },

  // Blocos de comentário em nível de bloco chegam como HTML bruto
  raw(node, ctx) {
    if (typeof node.value === 'string' && /^\s*<!--[\s\S]*-->\s*$/.test(node.value)) {
      ctx.removeNode(node);
    }
  },
};
