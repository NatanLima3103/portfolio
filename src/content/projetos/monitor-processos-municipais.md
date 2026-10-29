---
titulo: 'Monitor de Processos Municipais'
resumo: 'Automação em Playwright que acompanha o andamento de processos em portais de prefeituras, lidando com captchas de tipos diferentes e interfaces distribuídas em múltiplos frames.'
tipo: 'estudo-de-caso'
tags: ['Python', 'Playwright', 'Docker']
ordem: 2
periodo: '' # TODO: preencher o período (ex.: 2025)
---

## Problema

Processos que tramitam em prefeituras não notificam ninguém quando mudam de status. Para
não perder um prazo, alguém precisa entrar periodicamente em cada portal municipal,
consultar cada processo e comparar com o que já se sabia. É um trabalho de verificação
puro: na maior parte das vezes nada mudou, e o esforço foi gasto só para confirmar isso.

O custo não está na consulta individual, está na **frequência multiplicada pela
quantidade** — e na fragilidade de um controle que depende de alguém se lembrar de checar.

## Solução

Uma automação que faz essas consultas de forma programada e registra o andamento de cada
processo, destacando o que mudou desde a última verificação. A pessoa deixa de varrer
portais em busca de novidade e passa a receber apenas a novidade.

A automação foi construída com **Playwright**, que controla um navegador real — necessário
porque os portais dependem de JavaScript, de sessão e de etapas de verificação que não
funcionam com requisições HTTP simples.

## Arquitetura

![Diagrama do fluxo: agendador, coletor Playwright e comparação com o estado anterior](/projetos/monitor-processos.svg)

Estrutura em três camadas:

1. **Agendador** — dispara as rodadas de verificação.
2. **Coletor (Playwright)** — abre o portal, preenche a consulta, vence as etapas de
   verificação e extrai o andamento do processo.
3. **Comparação e saída** — confronta o resultado com o estado anterior e reporta as
   diferenças.

Tudo roda em **Docker**, o que resolve um problema prático e chato de automação de
navegador: a versão do navegador e das suas dependências de sistema fica congelada na
imagem. A automação funciona igual na máquina de desenvolvimento e no servidor, sem
depender do que está instalado em cada lugar.

## Decisões técnicas

### Playwright em vez de requisições HTTP diretas

Reproduzir a conversa HTTP dos portais seria mais leve e mais rápido, mas esses sites
montam a página no cliente, mantêm estado de sessão e inserem etapas de verificação
antiautomação. Navegador real é mais custoso, e foi a escolha que permitiu o fluxo
funcionar de ponta a ponta de forma estável.

### Espera por condição, nunca por tempo fixo

Portal de prefeitura tem tempo de resposta errático. Pausa com valor fixo falha nos dois
sentidos: curta demais quebra a automação, longa demais desperdiça a maior parte das
execuções. Toda espera é por uma condição observável — o elemento existir, o frame
carregar, o estado mudar.

### Docker desde o começo

Automação de navegador é sensível a versão de navegador e de biblioteca do sistema.
Empacotar tudo numa imagem elimina a classe de bug "funciona local e falha no servidor",
que é especialmente difícil de diagnosticar quando a falha é visual.

## Desafios

### Dois tipos de reCAPTCHA no mesmo conjunto de portais

Essa foi a parte mais difícil. Alguns portais usam **reCAPTCHA invisível** e outros a
**versão normal**, com checkbox visível — e os dois exigem tratamentos completamente
diferentes.

No invisível não há nada para clicar: a verificação é disparada pelo próprio envio do
formulário e acontece em segundo plano, com base no comportamento da sessão. A automação
não resolve nada explicitamente; ela precisa seguir o fluxo normal da página e detectar,
depois, se foi aprovada ou barrada.

Na versão normal existe um elemento concreto para interagir, mas ele vive num **iframe
próprio**, com ciclo de vida independente do documento principal.

O resultado prático: era preciso **identificar qual variante o portal estava usando antes
de decidir como agir** — não dá para aplicar o mesmo caminho nos dois casos.

### Modais e conteúdo em frames diferentes

Vários portais abrem modais cujo conteúdo não pertence ao documento principal, mas a um
frame separado. Buscar o elemento no contexto errado resulta em "elemento não encontrado"
mesmo com o modal visivelmente aberto na tela — um erro que engana, porque o que se vê e o
que o código alcança não coincidem. Foi necessário localizar o frame correto e só então
interagir, em vez de assumir um único contexto de página.

<!-- TODO: se houver mais algum desafio relevante (sessão expirando, bloqueio por IP,
     limite de consultas, variação de layout entre municípios), descreva aqui. -->

## Resultados

<!-- TODO: PREENCHER só com o que você pode afirmar com segurança. Sugestões:
     - quantos portais/municípios são monitorados
     - quantos processos são acompanhados
     - com que frequência a verificação roda
     - quanto tempo de conferência manual isso substitui
     NÃO cite nomes de clientes, números de processo ou URLs internas. -->

- Verificação dos processos passou a ser programada, em vez de depender de consulta manual
  periódica.
- Execução containerizada, com comportamento idêntico em desenvolvimento e em produção.
