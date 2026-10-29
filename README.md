# Portfólio — Natan Jonatan de Lima

Site pessoal estático feito com [Astro](https://astro.build), TypeScript e
[Tailwind CSS](https://tailwindcss.com). Sem backend e sem banco de dados: o build gera
HTML puro, que é servido direto pela CDN do Vercel.

- **Home** (`/`) — página única com hero, sobre, stack, projetos e contato.
- **Projetos** (`/projetos/[slug]`) — uma página por projeto, gerada a partir de um
  arquivo Markdown.

---

## Sumário

- [Rodar localmente](#rodar-localmente)
- [Comandos](#comandos)
- [Onde editar o quê](#onde-editar-o-quê)
- [Arquivos que você precisa colocar em `public/`](#arquivos-que-você-precisa-colocar-em-public)
- [Adicionar um projeto novo](#adicionar-um-projeto-novo)
- [Subir para o GitHub](#subir-para-o-github)
- [Fazer deploy no Vercel](#fazer-deploy-no-vercel)
- [Tema claro/escuro](#tema-claroescuro)
- [Estrutura de pastas](#estrutura-de-pastas)

---

## Rodar localmente

Precisa de **Node.js 22 ou superior** ([download](https://nodejs.org)). Para conferir a
versão instalada, no PowerShell:

```powershell
node -v
```

Depois, dentro da pasta do projeto:

```powershell
npm install
npm run dev
```

Abra **http://localhost:4321**. O site recarrega sozinho quando você salva um arquivo.

Para parar o servidor: `Ctrl + C` no terminal.

---

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe o servidor de desenvolvimento em http://localhost:4321 |
| `npm run build` | Gera o site estático na pasta `dist/` |
| `npm run preview` | Serve a pasta `dist/` para conferir o resultado do build |
| `npm run check` | Verifica tipos e erros nos arquivos `.astro` e `.ts` |
| `npm run verificar` | Roda `check` + `build` — use antes de dar `git push` |
| `npm run og` | Regenera `public/og-image.png` a partir de `src/data/site.ts` |

> O build baixa as fontes Inter e JetBrains Mono do Google na primeira vez e guarda em
> cache. Por isso o primeiro build precisa de internet; os próximos não.

---

## Onde editar o quê

Praticamente todo o texto fixo do site está em **um único arquivo**:
[`src/data/site.ts`](src/data/site.ts).

| O que mudar | Arquivo |
| --- | --- |
| Nome, título, frase do hero, e-mail, LinkedIn, GitHub | `src/data/site.ts` |
| Parágrafos da seção "Sobre" | `src/data/site.ts` → `sobre.paragrafos` |
| Tecnologias da seção "Stack" | `src/data/site.ts` → `stack` |
| Itens do menu | `src/data/site.ts` → `navegacao` |
| Projetos | `src/content/projetos/*.md` |
| Cores e tipografia | `src/styles/global.css` |
| URL do site (sitemap, Open Graph) | `astro.config.mjs` → `SITE` |

### Mudar a cor de destaque

As cores ficam no topo de `src/styles/global.css`, em dois blocos: `:root` (tema escuro) e
`:root[data-theme='light']` (tema claro). Para trocar o verde-água por outra cor, mude
`--c-accent` nos **dois** blocos — a versão do tema claro precisa ser mais escura para
manter o contraste com o fundo branco.

---

## Arquivos que você precisa colocar em `public/`

Tudo que está em `public/` é copiado para a raiz do site sem nenhum processamento.

| Arquivo | Para que serve | Se faltar |
| --- | --- | --- |
| `public/curriculo.pdf` | Botão "Baixar currículo" do hero | O botão aparece, mas dá 404 |
| `public/foto.jpg` | Foto da seção "Sobre" (quadrada, ~600×600px) | Aparece um monograma "NJ" no lugar |
| `public/projetos/*.png` ou `*.svg` | Diagramas de arquitetura dos projetos | A seção "Arquitetura" fica só com texto |

Já estão prontos: `public/favicon.svg`, os diagramas dos três estudos de caso em
`public/projetos/*.svg` e a `public/og-image.png` (prévia ao compartilhar o link, 1200×630px).
A OG image é gerada por `scripts/gerar-og-image.mjs` com o nome, o título e a stack de
`src/data/site.ts` — se mudar algum deles, rode `npm run og` e faça commit da imagem nova.

---

## Adicionar um projeto novo

Cada projeto é **um arquivo `.md`** em `src/content/projetos/`. O nome do arquivo vira a
URL: `src/content/projetos/meu-projeto.md` → `/projetos/meu-projeto/`.

Use nomes em minúsculas, sem acento e com hífen no lugar de espaço.

### 1. Crie o arquivo

O mais rápido é copiar um projeto existente:

```powershell
Copy-Item src/content/projetos/triagem-intimacoes.md src/content/projetos/meu-projeto.md
```

### 2. Preencha o cabeçalho (frontmatter)

É o bloco entre `---` no topo do arquivo:

```markdown
---
titulo: 'Nome do Projeto'
resumo: 'Uma ou duas frases. Este texto aparece no card da home.'
tipo: 'codigo-aberto'
tags: ['Python', 'FastAPI', 'Docker']
ordem: 5
repo: 'https://github.com/seu-usuario/meu-projeto'
demo: 'https://meu-projeto.vercel.app'
periodo: '2026'
rascunho: false
---
```

| Campo | Obrigatório | O que é |
| --- | --- | --- |
| `titulo` | sim | Título do card e da página |
| `resumo` | sim | 1–2 frases, aparece no card |
| `tipo` | sim | `'codigo-aberto'` ou `'estudo-de-caso'` (veja abaixo) |
| `tags` | não | Tecnologias, viram badges. Padrão: vazio |
| `ordem` | não | Menor aparece primeiro na home. Padrão: `99` |
| `repo` | não | URL do repositório. Só use em `'codigo-aberto'` |
| `demo` | não | URL da demo. Só use em `'codigo-aberto'` |
| `periodo` | não | Ex.: `'2025 — atual'`. Aparece na página do projeto |
| `rascunho` | não | `true` esconde o projeto do site sem apagar o arquivo |

**Os dois tipos de projeto:**

- `'codigo-aberto'` — mostra os botões de GitHub e demo no card e na página.
- `'estudo-de-caso'` — projeto profissional. Não mostra links de código e exibe
  automaticamente um aviso explicando que o código não é público.

> **Importante:** em estudos de caso, não inclua nome de cliente, URL interna,
> credencial, caminho de servidor ou print com dado real.

### 3. Escreva o corpo

Depois do frontmatter, use estes seis títulos `##` — a página de detalhe foi desenhada
para essa estrutura:

```markdown
## Problema

Que dor existia antes. Por que o jeito manual não escalava.

## Solução

O que o projeto faz, em alto nível.

## Arquitetura

Como as peças se encaixam.

## Decisões técnicas

### Por que X e não Y

A parte mais interessante é quase sempre a alternativa que você NÃO escolheu, e o motivo.

## Desafios

O que foi mais difícil do que parecia.

## Resultados

Em que estado está hoje. Não invente números — se não tem métrica, descrever o estado
atual e o que você aprendeu é resposta suficiente.
```

Dá para usar `### subtítulos`, listas, `**negrito**` e blocos de código normalmente.

Comentários `<!-- TODO: ... -->` podem ficar no arquivo à vontade: um plugin do build os
remove do HTML publicado, então eles servem como anotação só para quem edita.

### 4. Adicione o diagrama de arquitetura (opcional)

1. Salve a imagem em `public/projetos/meu-projeto.png` (PNG ou SVG, 1200–1600px de largura).
2. Na seção `## Arquitetura` do `.md`, adicione:

```markdown
![Diagrama: a API publica na fila e os workers consomem dela](/projetos/meu-projeto.png)
```

O texto entre `[` e `]` é o **alt**, que leitores de tela anunciam. Descreva o que o
diagrama mostra, não escreva só "diagrama".

### 5. Confira

```powershell
npm run dev
```

O card aparece na home e a página em `/projetos/meu-projeto/`. Se o cabeçalho tiver um
campo errado, o Astro mostra o erro direto no navegador apontando o arquivo e o campo.

---

## Subir para o GitHub

O repositório já está inicializado com o primeiro commit. Falta conectá-lo ao GitHub.

### 1. Crie o repositório no GitHub

Em **https://github.com/new**:

- **Repository name:** `portfolio` (ou outro nome)
- **Visibility:** `Public` (pode ser `Private` — o Vercel funciona nos dois)
- **Não marque** "Add a README file", "Add .gitignore" nem "Choose a license". O projeto já
  tem esses arquivos, e marcar causa conflito no primeiro push.

Clique em **Create repository**.

### 2. Conecte e envie

No PowerShell, dentro da pasta do projeto (troque `SEU-USUARIO` e `portfolio`):

```powershell
git remote add origin https://github.com/SEU-USUARIO/portfolio.git
git branch -M main
git push -u origin main
```

Na primeira vez o Git pede login — uma janela do navegador abre para você autorizar.

### 3. Nos próximos envios

```powershell
git add .
git commit -m "Atualiza seção de projetos"
git push
```

> Rode `npm run verificar` antes do push. Se o build falhar localmente, ele falha no Vercel
> também.

---

## Fazer deploy no Vercel

### 1. Crie a conta

Em **https://vercel.com/signup**, escolha **Continue with GitHub** e autorize o acesso.

### 2. Importe o repositório

1. No painel do Vercel, clique em **Add New...** → **Project**.
2. Encontre o repositório `portfolio` na lista e clique em **Import**.
3. O Vercel detecta Astro sozinho e já preenche tudo:
   - **Framework Preset:** `Astro`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

   Não precisa mudar nada e não há variável de ambiente para configurar.
4. Clique em **Deploy** e aguarde — normalmente menos de um minuto.

No fim o Vercel mostra a URL, algo como `https://portfolio-seu-usuario.vercel.app`.

### 3. Ajuste a URL no projeto

Esse passo é necessário para o sitemap, as URLs canônicas e a prévia de compartilhamento
funcionarem. Abra `astro.config.mjs`, troque o valor de `SITE` pela URL real e envie:

```powershell
git add astro.config.mjs
git commit -m "Ajusta URL do site para producao"
git push
```

### 4. Deploys automáticos

A partir daí, **todo `git push` na branch `main` publica automaticamente**. Push em outras
branches gera uma URL de pré-visualização, sem afetar o site principal.

### 5. Domínio próprio (opcional)

No projeto do Vercel: **Settings** → **Domains** → **Add**. O Vercel mostra os registros
DNS que você precisa criar no seu provedor de domínio e emite o certificado HTTPS
automaticamente.

---

## Tema claro/escuro

O **escuro é o padrão**, definido em CSS — então funciona mesmo com o JavaScript
desabilitado.

O botão no header alterna o tema e salva a escolha em `localStorage`. Um script pequeno,
inline no `<head>`, aplica a preferência salva **antes da primeira pintura**, o que evita
o site piscar no tema errado ao carregar.

Tanto a leitura quanto a escrita do `localStorage` estão dentro de `try/catch`: em janela
privada ou com armazenamento bloqueado, o navegador lança exceção. Nesse caso o botão
continua funcionando — só não lembra da escolha na próxima visita.

---

## Estrutura de pastas

```
PortfolioNatan/
├── public/                      arquivos servidos como estão
│   ├── favicon.svg
│   ├── curriculo.pdf            você coloca
│   ├── foto.jpg                 você coloca
│   ├── og-image.png             gerada por npm run og
│   └── projetos/                diagramas de arquitetura (SVG)
├── scripts/
│   └── gerar-og-image.mjs       gera a og-image.png
├── src/
│   ├── data/site.ts             nome, contatos, links e stack
│   ├── content.config.ts        schema dos projetos (valida o frontmatter)
│   ├── content/projetos/        um .md por projeto
│   ├── layouts/
│   │   ├── BaseLayout.astro     <head>, SEO, fontes, tema, header/footer
│   │   └── ProjetoLayout.astro  página de detalhe do projeto
│   ├── components/              Hero, Sobre, Stack, Projetos, Contato, ...
│   ├── pages/
│   │   ├── index.astro          home
│   │   ├── 404.astro
│   │   └── projetos/[slug].astro
│   ├── plugins/                 remove os comentários TODO do HTML publicado
│   └── styles/global.css        tokens de cor e estilos base
├── astro.config.mjs
└── package.json
```

### Decisões de implementação

- **Site 100% estático.** Nenhuma rota é renderizada no servidor, então tudo é servido
  pela CDN.
- **Fontes auto-hospedadas.** O Astro baixa Inter e JetBrains Mono no build e gera
  fallbacks com as mesmas métricas, o que elimina o "salto" de layout no carregamento.
  Nenhuma requisição ao Google em runtime.
- **Zero JavaScript de framework.** Não tem React nem Vue. O único JS enviado ao navegador
  são duas funções curtas: a troca de tema e o fade-in ao rolar.
- **Animações respeitam `prefers-reduced-motion`.** Quem desativou animações no sistema vê
  o conteúdo direto, sem transição.
- **Conteúdo validado em tempo de build.** O schema em `content.config.ts` falha o build se
  um projeto tiver campo faltando ou valor inválido — o erro aparece antes do deploy, não
  depois.
