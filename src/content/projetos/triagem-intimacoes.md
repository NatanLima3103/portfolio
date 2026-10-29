---
titulo: 'Triagem de Intimações'
resumo: 'Ferramenta web interna que transforma planilhas de intimações em uma fila de trabalho priorizada por prazo, com destaque de palavras-chave e detecção de duplicatas.'
tipo: 'estudo-de-caso'
tags: ['Python', 'FastAPI', 'SQLite']
ordem: 3
periodo: '' # TODO: preencher o período (ex.: 2025)
---

## Problema

As intimações chegavam como planilha: muitas linhas, texto longo em cada célula e nenhuma
indicação de ordem de importância. Triar significava ler linha por linha, procurar no meio
do texto o que exigia ação, estimar mentalmente a urgência de cada uma e ainda perceber
quando a mesma intimação aparecia duas vezes.

Três problemas concretos:

- **O que importa está escondido no texto.** A informação que decide a prioridade é uma
  palavra ou expressão dentro de um parágrafo longo.
- **A urgência não é visível.** A planilha não ordena por prazo, então a tarefa mais
  urgente pode estar na última linha.
- **Duplicatas passam.** A mesma intimação repetida consome trabalho duas vezes — ou, pior,
  gera ação em duplicidade.

Planilha é boa para guardar dados e ruim para **trabalhar uma fila**. Era esse o
desencontro.

## Solução

Uma ferramenta web interna onde a planilha é importada e vira uma lista de trabalho
organizada. Em cima dos mesmos dados, três recursos:

- **Destaque de palavras-chave** — os termos que determinam o tipo de ação ficam
  visualmente marcados no texto, então a leitura deixa de ser uma busca.
- **Priorização por prazo** — a fila é ordenada pela urgência real, de modo que a ordem da
  tela já é a ordem de atendimento.
- **Detecção de duplicatas** — registros repetidos são identificados na importação, antes
  de alguém gastar tempo com eles.

O acesso é autenticado, com senhas armazenadas como hash **bcrypt**.

## Arquitetura

<!-- TODO: diagrama de arquitetura.
     1. Salve a imagem em public/projetos/triagem-intimacoes.png
     2. Descomente a linha abaixo (o texto entre [] e o alt, usado por leitores de tela)
-->
<!-- ![Diagrama do fluxo de importação: planilha, normalização, verificação de duplicatas e fila ordenada](/projetos/triagem-intimacoes.png) -->

Aplicação única e deliberadamente simples:

- **FastAPI** servindo a API e as páginas da ferramenta.
- **SQLite** como banco — um arquivo, sem servidor de banco para administrar.
- **Autenticação com bcrypt**, usando hash com salt; a senha em texto puro nunca é
  persistida.
- **Fluxo de importação**: planilha → normalização dos campos → verificação de duplicatas
  → gravação → exibição da fila ordenada.

## Decisões técnicas

### SQLite em vez de um banco cliente-servidor

A ferramenta é interna, com número pequeno e previsível de usuários simultâneos. MySQL ou
PostgreSQL traria um serviço a mais para subir, monitorar e fazer backup, sem ganho real
nessa escala. O SQLite é um arquivo: o backup é copiar o arquivo, e não existe camada de
rede entre a aplicação e o dado.

### Ferramenta web em vez de script de linha de comando

Quem faz a triagem não é da área técnica. Um script exigiria terminal e produziria um
arquivo de saída — que voltaria a ser uma planilha, recriando o problema original. A
interface web entrega o resultado no formato em que o trabalho é de fato executado: uma
lista navegável.

### bcrypt em vez de hash genérico

A ferramenta lida com informação de clientes, então o acesso precisa ser controlado de
verdade. O bcrypt é lento de propósito e usa salt por senha, o que torna ataque de força
bruta e tabela pré-computada caros — diferente de SHA-256 puro, que é rápido justamente
quando não deveria ser.

### Palavras-chave como configuração, não como código

Os termos relevantes mudam conforme a rotina do escritório. Deixá-los configuráveis
significa que ajustar a triagem não exige alterar e republicar a aplicação.

## Desafios

**Normalizar planilhas inconsistentes.** Nome de coluna, formato de data e presença de
campos variam entre arquivos. A importação precisa tolerar essa variação em vez de exigir
um formato exato — senão o usuário só troca um trabalho manual por outro.

**Definir o que conta como duplicata.** Comparar a linha inteira não funciona: pequenas
diferenças de espaçamento ou formatação fazem dois registros idênticos parecerem
distintos. Era preciso escolher quais campos realmente identificam uma intimação e
comparar a forma normalizada deles.

**Destacar sem atrapalhar a leitura.** Marcação excessiva é tão inútil quanto marcação
nenhuma — se tudo está destacado, nada está. O equilíbrio entre destaque suficiente e
texto ainda legível exigiu ajuste.

<!-- TODO: se houver outro desafio (performance com planilhas grandes, controle de
     permissões por usuário, auditoria de quem tratou cada intimação), descreva aqui. -->

## Resultados

<!-- TODO: PREENCHER só com fatos verificáveis. Sugestões:
     - quantas pessoas usam a ferramenta
     - quantas intimações são triadas por dia/semana
     - tempo de triagem antes x depois
     - se já está em uso no dia a dia e desde quando
     NÃO cite nomes de clientes nem conteúdo real de intimações. -->

- Triagem passou a ser feita sobre uma fila já ordenada por prazo, em vez de uma planilha
  sem ordem de prioridade.
- Duplicatas são identificadas na importação, antes de consumirem trabalho.
- Acesso restrito e autenticado, com senhas armazenadas apenas como hash bcrypt.
