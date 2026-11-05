const DATA_INICIAL = new Date(2026, 10, 10);

const LIVROS_INICIAIS = [
  { id: 'L01', titulo: 'Dom Casmurro', autor: 'Machado de Assis', genero: 'Romance', ano: 1899, total: 3, disponiveis: 2, consulta: false, filaOutros: 0 },
  { id: 'L02', titulo: 'Vidas Secas', autor: 'Graciliano Ramos', genero: 'Romance', ano: 1938, total: 2, disponiveis: 0, consulta: false, filaOutros: 2 },
  { id: 'L03', titulo: 'O Cortiço', autor: 'Aluísio Azevedo', genero: 'Romance', ano: 1890, total: 2, disponiveis: 1, consulta: false, filaOutros: 0 },
  { id: 'L04', titulo: 'Capitães da Areia', autor: 'Jorge Amado', genero: 'Romance', ano: 1937, total: 2, disponiveis: 0, consulta: false, filaOutros: 0 },
  { id: 'L05', titulo: 'A Hora da Estrela', autor: 'Clarice Lispector', genero: 'Romance', ano: 1977, total: 1, disponiveis: 1, consulta: false, filaOutros: 0 },
  { id: 'L06', titulo: 'Sagarana', autor: 'Guimarães Rosa', genero: 'Contos', ano: 1946, total: 2, disponiveis: 2, consulta: false, filaOutros: 0 },
  { id: 'L07', titulo: 'Laços de Família', autor: 'Clarice Lispector', genero: 'Contos', ano: 1960, total: 1, disponiveis: 0, consulta: false, filaOutros: 1 },
  { id: 'L08', titulo: 'Morte e Vida Severina', autor: 'João Cabral de Melo Neto', genero: 'Poesia', ano: 1955, total: 3, disponiveis: 3, consulta: false, filaOutros: 0 },
  { id: 'L09', titulo: 'Antologia Poética', autor: 'Manuel Bandeira', genero: 'Poesia', ano: 1961, total: 1, disponiveis: 1, consulta: false, filaOutros: 0 },
  { id: 'L10', titulo: 'Dicionário Houaiss da Língua Portuguesa', autor: 'Antônio Houaiss', genero: 'Referência', ano: 2009, total: 2, disponiveis: 2, consulta: true, filaOutros: 0 },
  { id: 'L11', titulo: 'Atlas Geográfico Escolar', autor: 'IBGE', genero: 'Referência', ano: 2018, total: 1, disponiveis: 1, consulta: true, filaOutros: 0 },
  { id: 'L12', titulo: 'Casa-Grande & Senzala', autor: 'Gilberto Freyre', genero: 'História', ano: 1933, total: 2, disponiveis: 1, consulta: false, filaOutros: 0 }
];

const DIAS_RETIRADA = 3;
const DIAS_EMPRESTIMO = 14;
const DIAS_RENOVACAO = 7;
const LIMITE_ITENS = 3;
const LIMITE_FILAS = 2;
const MULTA_POR_DIA = 1.5;
const MULTA_MAXIMA = 30;
