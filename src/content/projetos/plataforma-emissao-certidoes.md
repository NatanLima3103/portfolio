---
titulo: 'Plataforma de Emissão de Certidões'
resumo: 'Conjunto de microsserviços que automatiza a emissão de certidões em mais de 20 portais governamentais, com fila de trabalho, workers isolados por portal e deploy em VPS.'
tipo: 'estudo-de-caso'
tags: ['Python', 'FastAPI', 'RabbitMQ', 'Docker', 'nodriver', 'Nginx']
ordem: 1
periodo: '' # TODO: preencher o período (ex.: '2025 — atual')
---

## Problema

A emissão de certidões é um passo obrigatório e recorrente em grande parte do trabalho
jurídico. Cada certidão vem de um portal diferente, com seu próprio formulário, suas
próprias regras de captcha e seu próprio formato de resposta. Feito à mão, o processo é
lento, repetitivo e fácil de errar: alguém precisa abrir o portal, preencher os dados,
resolver o captcha, esperar, baixar o arquivo e arquivá-lo no lugar certo — vezes o
número de portais, vezes o número de pedidos.

Além do tempo gasto, havia dois problemas estruturais. Primeiro, **um portal instável
travava todo o resto**: se o site de um órgão caísse, a pessoa simplesmente parava.
Segundo, **não existia rastro confiável** de quais pedidos tinham sido feitos, quais
falharam e por quê.

## Solução

Uma plataforma de microsserviços onde cada portal é tratado como um componente
independente e substituível. Um pedido entra por uma API, vira uma mensagem numa fila e
é consumido por um worker especializado naquele portal. O resultado volta para o
solicitante quando estiver pronto.

A separação entre **receber o pedido** e **executar o pedido** é o ponto central do
desenho: a API responde em milissegundos, enquanto a automação — que depende de sites
externos lentos e instáveis — acontece de forma assíncrona, com espaço para repetir o
que falhou sem perder nada.

## Arquitetura

![Diagrama da arquitetura: gateway FastAPI publicando na fila do RabbitMQ e workers por portal consumindo dela](/projetos/certidoes.svg)

O fluxo é o seguinte:

1. **Gateway (FastAPI)** — expõe a API, valida a entrada, autentica o chamador e publica
   a solicitação na fila. Não executa automação nenhuma.
2. **Broker (RabbitMQ)** — uma fila por portal, cada uma com sua **dead-letter queue**.
   Mensagem que falha além do limite de tentativas sai da fila principal e vai para a
   DLQ, onde pode ser inspecionada e reprocessada sem bloquear as demais.
3. **Workers (um por portal)** — cada worker conhece apenas o seu portal: como navegar,
   quais campos preencher, como reconhecer sucesso e como extrair o documento. Workers
   escalam de forma independente: portal com mais volume recebe mais réplicas.
4. **Biblioteca compartilhada** — pacote interno com o que é comum a todos os workers:
   contratos de mensagem, modelos de dados, cliente do broker, logging estruturado,
   política de retry e os helpers de automação. Escrever um worker novo significa
   implementar a parte específica do portal, não reescrever a infraestrutura.
5. **Camada de automação (nodriver)** — controla o navegador real para interagir com os
   portais.
6. **Resolução de captcha** — abstraída atrás de uma interface única, com implementações
   plugáveis. O worker pede "resolva este captcha" e não sabe quem resolve.

A orquestração local e de produção é feita com **Docker Compose**: cada serviço é um
container, a subida completa do ambiente é um comando. Em produção roda numa **VPS
Linux**, com **Nginx** como proxy reverso e **HTTPS via Certbot**.

## Decisões técnicas

### Fila em vez de chamadas síncronas

Automação de portal público é lenta e imprevisível — pode levar segundos ou minutos, e
pode simplesmente falhar. Uma API síncrona transferiria essa imprevisibilidade para quem
chama, com timeouts e requisições penduradas. Com fila, a API fica rápida e estável, e a
lentidão fica isolada onde ela realmente existe.

### Uma fila (e um worker) por portal

Seria mais simples ter uma fila única e workers genéricos. O problema é o **isolamento de
falha**: um portal fora do ar acumularia mensagens e consumiria todos os workers
disponíveis, derrubando a emissão de certidões que estavam perfeitamente funcionais.
Separando por portal, cada problema fica contido no seu domínio.

### Dead-letter queues em vez de descartar ou repetir infinitamente

Falha em automação tem duas naturezas bem diferentes: a transitória (site lento, oscilação
de rede), que o retry resolve, e a estrutural (o portal mudou o layout), que o retry nunca
vai resolver. Repetir para sempre gasta recurso e esconde o problema real; descartar perde
o pedido. A DLQ separa os dois casos: o que sobra lá é sinal de que algo precisa de código
novo, não de mais uma tentativa.

### nodriver em vez de automação convencional

Os portais aplicam detecção de automação. O `nodriver` opera sobre um navegador real via
CDP, sem o driver intermediário que torna a sessão facilmente identificável — o que
tornou possível completar fluxos que ferramentas convencionais não conseguiam concluir.

### Abstração plugável de captcha

Serviço de captcha é commodity: preço muda, qualidade muda, um cai e outro continua. Com a
resolução atrás de uma interface, trocar de provedor é escrever uma implementação nova —
nenhum worker é alterado.

### Biblioteca compartilhada em vez de copiar código

Com mais de 20 workers, qualquer lógica duplicada vira mais de 20 lugares para corrigir o
mesmo bug. Centralizar o que é comum deixa cada worker pequeno e focado só no que
realmente varia entre portais.

## Desafios

**Cada portal é um caso particular.** Não existe padrão entre órgãos: formulários, nomes
de campo, formatos de resposta e condições de erro mudam completamente. A arquitetura foi
desenhada justamente para absorver essa variedade — o que é comum fica na biblioteca, o
que é único fica no worker.

**Mudanças silenciosas de layout.** Um portal pode mudar o HTML sem aviso, e o worker
passa a falhar sem que nada tenha sido alterado do nosso lado. A DLQ funciona como o sinal
de que isso aconteceu.

**Distinguir "falhou" de "não existe".** Um portal que responde "nenhum registro
encontrado" não é um erro — é uma resposta válida. Confundir os dois casos gera retry
inútil e informação errada para o usuário. Cada worker precisa reconhecer explicitamente
os estados de sucesso, de ausência de registro e de falha real.

<!-- TODO: se houver outro desafio técnico marcante (ex.: controle de concorrência por
     portal, limite de sessões simultâneas, timeouts), descreva aqui. -->

## Resultados

<!-- TODO: PREENCHER. Não inclua nada que você não possa medir ou verificar.
     Ideias do que vale citar (escreva só o que for verdade):
     - número de portais cobertos hoje
     - volume de certidões emitidas por dia/semana
     - tempo médio do processo manual x automatizado
     - tempo em produção / se já é usado no dia a dia do escritório
     - quantas pessoas usam ou se beneficiam
     Evite dados sensíveis, nomes de clientes e URLs internas. -->

- Plataforma em produção numa VPS Linux, com HTTPS e deploy containerizado.
- Cobertura de mais de 20 portais governamentais, cada um com seu worker dedicado.
- Adicionar um portal novo passou a ser um trabalho contido: implementar um worker usando
  a biblioteca compartilhada, sem mexer no gateway nem nos demais workers.
