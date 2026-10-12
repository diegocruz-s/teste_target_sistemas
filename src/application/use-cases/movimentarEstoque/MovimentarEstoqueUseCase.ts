import { Movimentacao } from '../../../domain/entities/Movimentacao.js';
import { EstoqueInsuficienteError } from '../errors/EstoqueInsuficienteError.js';
import { ProdutoNaoEncontradoError } from '../errors/ProdutoNaoEncontradoError.js';
import {
  IDatasMovimentacao,
  IMovimentacaoRepository,
  IMovimentarEstoqueUseCase,
  IProdutoRepository,
} from './protocols.js';

export class MovimentarEstoqueUseCase implements IMovimentarEstoqueUseCase {
  constructor(
    private readonly produtoRepository: IProdutoRepository,
    private readonly movimentacaoRepository: IMovimentacaoRepository,
  ) {}

  async execute(datas: IDatasMovimentacao): Promise<Movimentacao> {
    const { codigoProduto, quantidade, tipoMovimentacao } = datas;

    const produtoExistente =
      await this.produtoRepository.findByCodigoProduto(codigoProduto);
    if (!produtoExistente) {
      throw new ProdutoNaoEncontradoError();
    }

    const estoqueAtual = produtoExistente.getEstoque();

    if (tipoMovimentacao === 'saida' && estoqueAtual < quantidade) {
      throw new EstoqueInsuficienteError();
    }

    const fator = tipoMovimentacao === 'saida' ? -1 : 1;
    const novoEstoque = estoqueAtual + quantidade * fator;

    produtoExistente.setEstoque(novoEstoque);

    const descricao =
      tipoMovimentacao === 'saida'
        ? 'Saída de produto do estoque'
        : 'Entrada de produto no estoque';

    const movimentacao = new Movimentacao({
      descricao,
      codigoProduto: produtoExistente.getCodigoProduto(),
      tipo: tipoMovimentacao,
      quantidade,
      quantidadeTotalEstoque: produtoExistente.getEstoque(),
    });

    await this.produtoRepository.save(produtoExistente);
    await this.movimentacaoRepository.save(movimentacao);

    return movimentacao;
  }
}
