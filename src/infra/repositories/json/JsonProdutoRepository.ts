import { readFile, writeFile } from 'fs/promises';
import { IProdutoRepository } from '../../../application/use-cases/movimentarEstoque/protocols.js';
import { Produto, ProdutoProps } from '../../../domain/entities/Produto.js';
import { databasePaths } from '../../database/databasePaths.js';

export class JsonProdutoRepository implements IProdutoRepository {
  private filePath = databasePaths.produtos;

  async findByCodigoProduto(codigoProduto: number): Promise<Produto | null> {
    const data = await readFile(this.filePath, 'utf-8');
    const json = JSON.parse(data);
    const produtos: ProdutoProps[] = json.estoque;

    const produto =
      produtos.find((produto) => produto.codigoProduto === codigoProduto) ||
      null;
    if (!produto) return null;

    return new Produto(
      produto.codigoProduto,
      produto.descricaoProduto,
      produto.estoque,
    );
  }

  async save(produto: Produto): Promise<void> {
    try {
      const data = await readFile(this.filePath, 'utf-8');
      const json = JSON.parse(data);
      const produtos: ProdutoProps[] = json.estoque;

      const index = produtos.findIndex(p => p.codigoProduto === produto.getCodigoProduto());

      produtos[index] = {
        codigoProduto: produto.getCodigoProduto(),
        descricaoProduto: produto.getDescricaoProduto(),
        estoque: produto.getEstoque(),
      };

      await writeFile(
        this.filePath,
        JSON.stringify({ estoque: produtos }, null, 2),
        'utf-8',
      );
    } catch (error) {
      throw new Error('Erro ao salvar movimentação no arquivo JSON', {
        cause: error,
      });
    }
  }
}
