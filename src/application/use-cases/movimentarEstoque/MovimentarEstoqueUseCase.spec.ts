import { Movimentacao } from '../../../domain/entities/Movimentacao.js';
import { Produto } from '../../../domain/entities/Produto.js';
import { EstoqueInsuficienteError } from '../errors/EstoqueInsuficienteError.js';
import { ProdutoNaoEncontradoError } from '../errors/ProdutoNaoEncontradoError.js';
import { MovimentarEstoqueUseCase } from './MovimentarEstoqueUseCase.js';
import {
  IDatasMovimentacao,
  IMovimentacaoRepository,
  IProdutoRepository,
} from './protocols.js';

const makeProductRepository = () => {
  class ProductRepositoryStub implements IProdutoRepository {
    public produtos: Produto[] = [new Produto(123, 'Produto Mock', 100)];

    async save(produto: Produto): Promise<void> {
      return Promise.resolve();
    }

    async findByCodigoProduto(codigoProduto: number): Promise<Produto | null> {
      const produto =
        this.produtos.find((pr) => pr.getCodigoProduto() === codigoProduto) ||
        null;
      return Promise.resolve(produto);
    }
  }

  const productRepositoryStub = new ProductRepositoryStub();

  return {
    productRepositoryStub,
  };
};

const makeMovimentacaoRepository = () => {
  class MovimentacaoRepositoryStub implements IMovimentacaoRepository {
    async save(movimentacao: Movimentacao): Promise<void> {
      return Promise.resolve();
    }
  }

  const movimentacaoRepositoryStub = new MovimentacaoRepositoryStub();

  return {
    movimentacaoRepositoryStub,
  };
};

const makeSut = () => {
  const { productRepositoryStub } = makeProductRepository();
  const { movimentacaoRepositoryStub } = makeMovimentacaoRepository();
  const sut = new MovimentarEstoqueUseCase(
    productRepositoryStub,
    movimentacaoRepositoryStub,
  );

  return {
    sut,
    productRepositoryStub,
  };
};

describe('MovimentarEstoqueUseCase', () => {
  it('should return a error when product is not exists', async () => {
    const { sut } = makeSut();
    const datas: IDatasMovimentacao = {
      tipoMovimentacao: 'entrada',
      codigoProduto: -1,
      quantidade: 10,
    };

    jest
      .spyOn(sut['produtoRepository'], 'findByCodigoProduto')
      .mockResolvedValueOnce(null);

    await expect(sut.execute(datas)).rejects.toThrow(ProdutoNaoEncontradoError);
  });

  it('should reduce the stock product when the movimentation is of type "saida"', async () => {
    const { sut, productRepositoryStub } = makeSut();
    const spyProductRepositoryStubSave = jest.spyOn(
      productRepositoryStub,
      'save',
    );

    const datas: IDatasMovimentacao = {
      tipoMovimentacao: 'saida',
      codigoProduto: 123,
      quantidade: 10,
    };

    await sut.execute(datas);

    expect(productRepositoryStub.produtos[0]?.getEstoque()).toBe(90);
    expect(spyProductRepositoryStubSave).toHaveBeenCalledTimes(1);
  });

  it('should return an error when attempting to decrease the quantity by more than what is in stock.', async () => {
    const { sut, productRepositoryStub } = makeSut();
    const spyProductRepositoryStubSave = jest.spyOn(
      productRepositoryStub,
      'save',
    );

    const datas: IDatasMovimentacao = {
      tipoMovimentacao: 'saida',
      codigoProduto: 123,
      quantidade: 120,
    };

    await expect(sut.execute(datas)).rejects.toThrow(EstoqueInsuficienteError);
    expect(spyProductRepositoryStubSave).toHaveBeenCalledTimes(0);
  });

  it('should increase the stock product when the movimentation is of type "entrada"', async () => {
    const { sut, productRepositoryStub } = makeSut();
    const spyProductRepositoryStubSave = jest.spyOn(
      productRepositoryStub,
      'save',
    );

    const datas: IDatasMovimentacao = {
      tipoMovimentacao: 'entrada',
      codigoProduto: 123,
      quantidade: 10,
    };

    await sut.execute(datas);

    expect(productRepositoryStub.produtos[0]?.getEstoque()).toBe(110);
    expect(spyProductRepositoryStubSave).toHaveBeenCalledTimes(1);
  });

  it('should return a movimentacao object with the correct properties when executed with valid input ["entrada"]', async () => {
    const { sut } = makeSut();
    const spyMovimentacaoRepositoryStubSave = jest.spyOn(
      sut['movimentacaoRepository'],
      'save',
    );

    const datas: IDatasMovimentacao = {
      tipoMovimentacao: 'entrada',
      codigoProduto: 123,
      quantidade: 30,
    };
    const movimentacao = await sut.execute(datas);

    expect(movimentacao).toBeInstanceOf(Movimentacao);
    expect(movimentacao.getTipo()).toBe('entrada');
    expect(movimentacao.getDescricao()).toBe('Entrada de produto no estoque');
    expect(movimentacao.getCodigoProduto()).toBe(123);
    expect(movimentacao.getQuantidade()).toBe(30);
    expect(movimentacao.getQuantidadeTotalEstoque()).toBe(130);
    expect(spyMovimentacaoRepositoryStubSave).toHaveBeenCalledWith(
      movimentacao,
    );
  });

  it('should return a movimentacao object with the correct properties when executed with valid input ["saida"]', async () => {
    const { sut } = makeSut();
    const spyMovimentacaoRepositoryStubSave = jest.spyOn(
      sut['movimentacaoRepository'],
      'save',
    );

    const datas: IDatasMovimentacao = {
      tipoMovimentacao: 'saida',
      codigoProduto: 123,
      quantidade: 30,
    };
    const movimentacao = await sut.execute(datas);

    expect(movimentacao).toBeInstanceOf(Movimentacao);
    expect(movimentacao.getTipo()).toBe('saida');
    expect(movimentacao.getDescricao()).toBe('Saída de produto do estoque');
    expect(movimentacao.getCodigoProduto()).toBe(123);
    expect(movimentacao.getQuantidade()).toBe(30);
    expect(movimentacao.getQuantidadeTotalEstoque()).toBe(70);
    expect(spyMovimentacaoRepositoryStubSave).toHaveBeenCalledWith(
      movimentacao,
    );
  });
});
