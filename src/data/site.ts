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
    'Portfólio de Natan Jonatan de Lima, desenvolvedor backend focado em Python, automação de portais e arquitetura de microsserviços.',
  // Cargo atual, exibido no topo do hero
  cargoAtual: 'Estagiário de TI na Santos Silveiro Advogados',
  // Formação, exibida na seção Sobre
  formacao: 'Sistemas de Informação — Universidade Positivo',

  // TODO: preencher com seu e-mail real
  email: 'seu-email@exemplo.com',

  links: {
    // TODO: preencher com a URL do seu perfil do LinkedIn
    linkedin: 'https://www.linkedin.com/in/SEU-USUARIO',
    // TODO: preencher com a URL do seu perfil do GitHub
    github: 'https://github.com/SEU-USUARIO',
  },

  // Arquivos em public/ — veja o README
  curriculo: '/curriculo.pdf',
  foto: '/foto.jpg',
  ogImage: '/og-image.png',
} as const;

export const sobre = {
  // Parágrafos da seção "Sobre". Cada item é um <p>.
  paragrafos: [
    'Sou estagiário de TI na Santos Silveiro Advogados, onde desenvolvo automações em Python para portais governamentais e cuido da infraestrutura — VPS, Docker e deploy. Na prática, isso significa transformar tarefas manuais e repetitivas do escritório em serviços que rodam sozinhos.',
    'Curso Sistemas de Informação na Universidade Positivo e estudo Java por conta própria. Meu interesse está em backend, automação e arquitetura de microsserviços: entender como separar responsabilidades, lidar com falhas e manter sistemas rodando de forma previsível.',
  ],
} as const;

export type CategoriaStack = {
  categoria: string;
  itens: readonly string[];
};

export const stack: readonly CategoriaStack[] = [
  { categoria: 'Linguagens', itens: ['Python', 'Java', 'SQL'] },
  { categoria: 'Backend', itens: ['FastAPI', 'RabbitMQ'] },
  { categoria: 'Automação', itens: ['Playwright', 'nodriver'] },
  { categoria: 'Infra', itens: ['Docker', 'Docker Compose', 'Nginx', 'Linux/VPS'] },
  { categoria: 'Bancos', itens: ['MySQL', 'SQLite'] },
] as const;

export const navegacao = [
  { href: '#sobre', texto: 'Sobre' },
  { href: '#stack', texto: 'Stack' },
  { href: '#projetos', texto: 'Projetos' },
  { href: '#contato', texto: 'Contato' },
] as const;
