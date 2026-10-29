/**
 * Fonte única de verdade do site.
 * Edite SÓ este arquivo para mudar nome, contatos, links e stack.
 */

export const site = {
  nome: 'Natan Jonatan de Lima',
  nomeCurto: 'Natan Jonatan',
  titulo: 'Desenvolvedor Backend & Automação',
  // Frase do hero (1 linha, aparece embaixo do título)
  tagline:
    'Construo serviços e automações em Python que resolvem processos repetitivos — de microsserviços com filas a deploy em VPS Linux.',
  // Usada na meta description e no Open Graph
  descricao:
    'Portfólio de Natan Jonatan de Lima, desenvolvedor backend na Santos Silveiro Advogados. Python em produção, com especialização em Java e Spring Boot.',
  // Cargo atual, exibido no topo do hero
  cargoAtual: 'Desenvolvedor Backend na Santos Silveiro Advogados',
  // Formação, exibida na seção Sobre
  formacao: 'Sistemas de Informação — Universidade Positivo',

  email: 'natanjonatan3103@gmail.com',

  links: {
    linkedin: 'https://www.linkedin.com/in/natan-lima-716652397/',
    github: 'https://github.com/NatanLima3103',
  },

  // Arquivos em public/ — veja o README
  curriculo: '/curriculo.pdf',
  foto: '/foto.jpg',
  ogImage: '/og-image.png',
} as const;

export const sobre = {
  // Parágrafos da seção "Sobre". Cada item é um <p>.
  paragrafos: [
    'Sou desenvolvedor backend na Santos Silveiro Advogados, onde trabalho com Python em produção: automações para portais governamentais, microsserviços com filas e a infraestrutura que os mantém no ar — VPS, Docker e deploy. Na prática, isso significa transformar tarefas manuais e repetitivas do escritório em serviços que rodam sozinhos.',
    'Estou me especializando em Java e Spring Boot, a stack de que mais gosto e onde quero focar minha carreira. Curso Sistemas de Informação na Universidade Positivo, e meu interesse está em backend e arquitetura de microsserviços: entender como separar responsabilidades, lidar com falhas e manter sistemas rodando de forma previsível.',
  ],
} as const;

export type CategoriaStack = {
  categoria: string;
  itens: readonly string[];
  /** true = o que está sendo estudado agora; aparece com badge de contorno */
  estudando?: boolean;
};

export const stack: readonly CategoriaStack[] = [
  { categoria: 'Linguagens', itens: ['Java', 'Python', 'SQL'] },
  { categoria: 'Backend', itens: ['FastAPI', 'RabbitMQ'] },
  { categoria: 'Automação', itens: ['Playwright', 'nodriver'] },
  { categoria: 'Infra', itens: ['Docker', 'Docker Compose', 'Nginx', 'Linux/VPS'] },
  { categoria: 'Bancos', itens: ['MySQL', 'SQLite'] },
  { categoria: 'Estudando agora', itens: ['Java', 'Spring Boot', 'IntelliJ IDEA'], estudando: true },
] as const;

export const navegacao = [
  { href: '#sobre', texto: 'Sobre' },
  { href: '#stack', texto: 'Stack' },
  { href: '#projetos', texto: 'Projetos' },
  { href: '#contato', texto: 'Contato' },
] as const;
