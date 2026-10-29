---
titulo: 'Trilha de estudos em Java'
# O número de commits é um retrato de out. 2026 — atualize de tempos em tempos
resumo: 'Repositório de exercícios do curso de Java da Cod3r (77h, em andamento), com 355 commits cobrindo fundamentos, orientação a objetos, coleções e lambdas.'
tipo: 'codigo-aberto'
tags: ['Java', 'IntelliJ IDEA', 'Orientação a objetos', 'Coleções', 'Lambdas']
ordem: 4
repo: 'https://github.com/NatanLima3103/CursoJavaCod3r'
periodo: 'jul. 2026 — out. 2026'
---

## Sobre o repositório

É onde registro o curso de Java da Cod3r, que estou fazendo enquanto trabalho com Python
em produção. Cada exercício resolvido vira um commit. O código das aulas fica no projeto
`PrimeiroPrograma`, e os exercícios de fixação de cada assunto ficam em `ExerciciosExt`.
Tudo foi escrito no IntelliJ IDEA.

## O que já foi estudado

### Fundamentos

Tipos primitivos, `var`, wrappers, conversão entre `String` e número e operadores
(aritméticos, relacionais, lógicos e ternário). O repositório também tem um resumo de
revisão desses temas, escrito por mim, em `resumo-java-fundamentos.md`.

### Estruturas de controle, arrays e matrizes

`if`/`else`, `switch`, `for`, `while`, `do`/`while` e laços aninhados, além de arrays,
matrizes e da diferença entre passagem por valor e por referência.

### Orientação a objetos

É a maior parte do repositório. Classes e construtores, encapsulamento e modificadores de
acesso, getters e setters, herança, composição (um para um, um para muitos e muitos para
muitos), polimorfismo, classes abstratas, interfaces e enums. Também há dois exercícios
de modelagem com várias classes: uma faculdade e uma clínica.

### Coleções

`List`/`ArrayList`, `Set` (`HashSet` e `TreeSet`), `Map`/`HashMap`, filas (`Queue`),
`Deque` e pilha, além de `equals` e `hashCode` — o que faz um objeto funcionar
corretamente dentro de um `HashSet` ou como chave de um `HashMap`.

### Lambdas e interfaces funcionais

Interfaces funcionais próprias (`@FunctionalInterface`) e as da biblioteca padrão:
`Consumer`, `Predicate` (inclusive composição com `and`, `or` e `negate`), `Function`,
`Supplier`, `UnaryOperator` e `BinaryOperator`, junto com `forEach` e method reference.

## O que vem a seguir

Terminar o curso e partir para o **Spring Boot**, a stack em que quero focar. A ideia é
levar para o ecossistema Java o mesmo tipo de serviço backend que hoje construo em Python.
