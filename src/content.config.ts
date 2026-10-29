import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projetos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projetos' }),
  schema: z.object({
    /** Título exibido no card e na página de detalhe */
    titulo: z.string(),
    /** 1–2 frases que aparecem no card */
    resumo: z.string(),
    /**
     * 'codigo-aberto'  → mostra botões de repositório e demo no card
     * 'estudo-de-caso' → projeto profissional, sem código público; abre a página de detalhe
     */
    tipo: z.enum(['codigo-aberto', 'estudo-de-caso']),
    /** Tecnologias exibidas como badges */
    tags: z.array(z.string()).default([]),
    /** Menor = aparece primeiro */
    ordem: z.number().default(99),
    /** Só para 'codigo-aberto' */
    repo: z.url().optional(),
    demo: z.url().optional(),
    /** Período do projeto, exibido na página de detalhe (ex.: '2025 — atual') */
    periodo: z.string().optional(),
    /** Esconde o projeto do site sem precisar apagar o arquivo */
    rascunho: z.boolean().default(false),
  }),
});

export const collections = { projetos };
