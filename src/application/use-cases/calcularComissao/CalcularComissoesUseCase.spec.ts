import { Venda } from '../../../domain/entities/Venda.js';
import { CalcularComissoesUseCase } from './CalcularComissoesUseCase.js';
import { ICalcularComissao, IVendasRepository } from './protocols.js';

const mockVendas = [
  new Venda('Vendedor Teste 1', 200),
  new Venda('Vendedor Teste 2', 1000),
  new Venda('Vendedor Teste 1', 600),
  new Venda('Vendedor Teste 2', 500),
  new Venda('Vendedor Teste 1', 100),
  new Venda('Vendedor Teste 2', 800),
];

const makeCalcularComissaoServiceStub = () => {
  // Cria um stub para o serviço de cálculo de comissão, implementando a interface ICalcularComissao.
  // O método run retorna um objeto com o valor da venda, a comissão calculada
  // (1% do valor da venda) e uma mensagem de sucesso.
  class CalcularComissaoServiceStub implements ICalcularComissao {
    run(venda: Venda): any {
      return {
        valorVenda: venda.getValor(),
        comissao: venda.getValor() * 0.01,
        mensagem: 'Comissão calculada com sucesso!',
      };
    }
  }

  return {
    calcularComissaoServiceStub: new CalcularComissaoServiceStub(),
  };
};

const makeVendasRepositoryStub = () => {
  class VendasRepositoryStub implements IVendasRepository {
    async getAllVendas(): Promise<Venda[]> {
      return mockVendas;
    }
  }

  const vendasRepositoryStub = new VendasRepositoryStub();

  return {
    vendasRepositoryStub,
  }
}

const makeSut = () => {
  const { calcularComissaoServiceStub } = makeCalcularComissaoServiceStub();
  const { vendasRepositoryStub } = makeVendasRepositoryStub();
  const sut = new CalcularComissoesUseCase(
    calcularComissaoServiceStub,
    vendasRepositoryStub,
  );

  return {
    sut,
    calcularComissaoServiceStub,
    vendasRepositoryStub,
  };
};

describe('CalcularComissoesUseCase', () => {
  it('should calculate the commission on all sales', async () => {
    const { sut } = makeSut();
    const result = await sut.execute();

    expect(result.length).toBe(2);
    expect(result[0]?.vendedor).toBe('Vendedor Teste 1');
    expect(result[0]?.comissaoTotal).toBe(9);
    expect(result[1]?.vendedor).toBe('Vendedor Teste 2');
    expect(result[1]?.comissaoTotal).toBe(23);
  });

  it ('should return a empty array when sales is empty', async () => {
    const { sut, vendasRepositoryStub } = makeSut();
    jest.spyOn(vendasRepositoryStub, 'getAllVendas').mockResolvedValueOnce([]);

    const result = await sut.execute();

    expect(result.length).toBe(0);
  })
});
