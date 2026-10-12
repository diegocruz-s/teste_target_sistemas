import { Movimentacao, TiposMovimentacao } from "../../../domain/entities/Movimentacao.js";
import { Produto } from "../../../domain/entities/Produto.js";

export interface IDatasMovimentacao {
  tipoMovimentacao: TiposMovimentacao;
  codigoProduto: number;
  quantidade: number;
}

export interface IMovimentarEstoqueUseCase {
  execute(datas: IDatasMovimentacao): Promise<Movimentacao>;
}

export interface IProdutoRepository {
  findByCodigoProduto(codigoProduto: number): Promise<Produto | null>;
  save(produto: Produto): Promise<void>;
}

export interface IMovimentacaoRepository {
  save(movimentacao: Movimentacao): Promise<void>;
}