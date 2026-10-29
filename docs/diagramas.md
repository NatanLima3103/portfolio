# Diagramas dos projetos

Os diagramas de arquitetura ficam em `public/projetos/` e são referenciados nos arquivos
de `src/content/projetos/`. Use PNG ou SVG e mantenha o nome que o `.md` espera:

- `certidoes.svg` — pronto
- `monitor-processos.svg` — pronto
- `triagem-intimacoes.svg` — pronto
- `juridico-ai.png` — falta

Os SVGs têm fundo opaco próprio, na paleta escura do site. É de propósito: imagem
carregada via `<img>` não enxerga o `data-theme` do site, então um fundo transparente
deixaria o texto ilegível em um dos dois temas.

Depois de salvar a imagem em `public/projetos/`, abra o `.md` correspondente e descomente a linha
`<!-- ![...](/projetos/arquivo.png) -->` da seção **Arquitetura**.

Dica: largura entre 1200px e 1600px é suficiente. Escreva um texto alternativo
descritivo entre os colchetes — é o que leitores de tela vão anunciar.
