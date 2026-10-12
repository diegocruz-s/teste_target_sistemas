import path from 'path';

export const databasePaths = {
  vendas: new URL(path.join(__dirname, './vendas.json'), 'file:'),
  produtos: new URL(path.join(__dirname, './estoque.json'), 'file:'),
  movimentacoes: new URL(path.join(__dirname, './movimentacoes.json'), 'file:'),
}
