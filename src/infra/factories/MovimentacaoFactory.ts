import { MovimentarEstoqueUseCase } from "../../application/use-cases/movimentarEstoque/MovimentarEstoqueUseCase.js";
import { JsonMovimentacaoRepository } from "../repositories/json/JsonMovimentacaoRepository.js";
import { JsonProdutoRepository } from "../repositories/json/JsonProdutoRepository.js";

export interface ICreateMovimentacaoFactory {
  movimentarEstoqueUseCase: MovimentarEstoqueUseCase;
}

export class CreateMovimentacaoFactory {
  static create(): ICreateMovimentacaoFactory {
    const produtoRepository = new JsonProdutoRepository();
    const movimentacaoRepository = new JsonMovimentacaoRepository();

    const movimentarEstoqueUseCase = new MovimentarEstoqueUseCase(
      produtoRepository,
      movimentacaoRepository,
    );

    return {
      movimentarEstoqueUseCase,
    };
  }
}
