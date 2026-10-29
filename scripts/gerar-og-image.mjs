/**
 * Gera public/og-image.png (1200×630), a prévia exibida ao compartilhar o link
 * no WhatsApp, LinkedIn etc.
 *
 * Nome, título e stack vêm de src/data/site.ts — depois de mudar algo lá,
 * rode de novo:
 *
 *   npm run og
 *
 * O satori transforma o layout (e o texto) em SVG com as fontes embutidas, e o
 * sharp converte para PNG. O resultado é igual em qualquer máquina, sem depender
 * das fontes instaladas no sistema.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';
import { site, stack } from '../src/data/site.ts';

const LARGURA = 1200;
const ALTURA = 630;
const SAIDA = fileURLToPath(new URL('../public/og-image.png', import.meta.url));

// Mesmos valores do tema escuro em src/styles/global.css
const cor = {
  fundo: '#0b0f14',
  superficie: '#111a22',
  borda: '#1e2b36',
  texto: '#e6edf3',
  muted: '#93a4b3',
  accent: '#2dd4bf',
  accentSoft: 'rgba(45, 212, 191, 0.12)',
};

async function fonte(pacote, arquivo) {
  const url = new URL(`../node_modules/@fontsource/${pacote}/files/${arquivo}`, import.meta.url);
  return readFile(url);
}

const fontes = [
  { name: 'Inter', weight: 400, data: await fonte('inter', 'inter-latin-400-normal.woff') },
  { name: 'Inter', weight: 500, data: await fonte('inter', 'inter-latin-500-normal.woff') },
  { name: 'Inter', weight: 700, data: await fonte('inter', 'inter-latin-700-normal.woff') },
  {
    name: 'JetBrains Mono',
    weight: 500,
    data: await fonte('jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff'),
  },
];

// Satori aceita a mesma estrutura que o React.createElement produz
function h(type, props, ...children) {
  return { type, props: { ...props, children: children.length === 1 ? children[0] : children } };
}

// Primeiro item de cada categoria da stack, até 5
const destaques = stack.map((grupo) => grupo.itens[0]).slice(0, 5);

const iniciais = site.nomeCurto
  .split(' ')
  .map((parte) => parte[0])
  .join('')
  .toUpperCase();

const layout = h(
  'div',
  {
    style: {
      width: '100%',
      height: '100%',
      // Sem isso o satori soma o padding ao tamanho e o rodapé sai da imagem
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 80px',
      backgroundColor: cor.fundo,
      backgroundImage: `radial-gradient(circle at 100% 0%, ${cor.accentSoft} 0%, transparent 55%)`,
      fontFamily: 'Inter',
      color: cor.texto,
    },
  },

  // Monograma, igual ao do header
  h(
    'div',
    { style: { display: 'flex', alignItems: 'center', gap: 20 } },
    h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 64,
          height: 64,
          borderRadius: 14,
          backgroundColor: cor.accentSoft,
          color: cor.accent,
          fontFamily: 'JetBrains Mono',
          fontSize: 26,
          fontWeight: 500,
        },
      },
      iniciais,
    ),
    h(
      'div',
      { style: { display: 'flex', fontFamily: 'JetBrains Mono', fontSize: 22, color: cor.muted } },
      site.cargoAtual,
    ),
  ),

  h(
    'div',
    { style: { display: 'flex', flexDirection: 'column' } },
    h(
      'div',
      { style: { fontSize: 76, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 } },
      site.nome,
    ),
    h(
      'div',
      { style: { marginTop: 20, fontSize: 40, fontWeight: 500, color: cor.accent } },
      site.titulo,
    ),
  ),

  // Rodapé: linha de destaque + stack
  h(
    'div',
    { style: { display: 'flex', flexDirection: 'column', gap: 28 } },
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center' } },
      h('div', { style: { width: 120, height: 4, borderRadius: 2, backgroundColor: cor.accent } }),
      h('div', { style: { flexGrow: 1, height: 1, backgroundColor: cor.borda } }),
    ),
    h(
      'div',
      { style: { display: 'flex', gap: 12 } },
      ...destaques.map((item) =>
        h(
          'div',
          {
            style: {
              display: 'flex',
              padding: '8px 16px',
              borderRadius: 8,
              border: `1px solid ${cor.borda}`,
              backgroundColor: cor.superficie,
              fontFamily: 'JetBrains Mono',
              fontSize: 22,
              color: cor.muted,
            },
          },
          item,
        ),
      ),
    ),
  ),
);

const svg = await satori(layout, { width: LARGURA, height: ALTURA, fonts: fontes });
const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile(SAIDA, png);

console.log(`og-image.png gerada (${LARGURA}×${ALTURA}, ${(png.length / 1024).toFixed(0)} KB)`);
