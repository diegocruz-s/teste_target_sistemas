import request from 'supertest';
import { jest } from '@jest/globals';
import { appController } from '../../../app.js';
import { CreateCalcularComissaoFactory } from '../../factories/CalcularComissaoFactory.js';
import { IResultadoCalcularComissoes } from '../../../application/use-cases/calcularComissao/protocols.js';

const app = appController.getApp();

jest.mock('../../factories/CalcularComissaoFactory.js', () => ({
  CreateCalcularComissaoFactory: { create: jest.fn() }
}));
const executeCalcularComissaoUseCaseMock = jest.fn<() => Promise<IResultadoCalcularComissoes[]>>();

const makeSut = () => {
  jest
    .spyOn(CreateCalcularComissaoFactory, 'create')
    .mockReturnValue({
      calcularComissoesUseCase: { execute: executeCalcularComissaoUseCaseMock },
    } as unknown as ReturnType<typeof CreateCalcularComissaoFactory.create>);

  return { app };
};

describe('POST /api/comissao', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    executeCalcularComissaoUseCaseMock.mockReset();
    makeSut();
  });

  it('should return 200 and the calculated comissions when the data is valid.', async () => {
    const result: IResultadoCalcularComissoes[] = [
      {
        comissaoTotal: 100,
        vendedor: 'Vendedor 1'
      },
      {
        comissaoTotal: 150,
        vendedor: 'Vendedor 2'
      },
      {
        comissaoTotal: 200,
        vendedor: 'Vendedor 3'
      },
    ];

    executeCalcularComissaoUseCaseMock.mockResolvedValue(result);

    const response = await request(app)
      .get('/api/comissao');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Comissões calculadas com sucesso',
      data:  [ ...result ],
    });

    expect(CreateCalcularComissaoFactory.create).toHaveBeenCalledTimes(1);
    expect(executeCalcularComissaoUseCaseMock).toHaveBeenCalled();
  });

  it('should return 500 when the use case throws an error.', async () => {
    executeCalcularComissaoUseCaseMock.mockRejectedValue(new Error('Erro interno ao calcular comissoes'));

    const response = await request(app)
      .get('/api/comissao');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: 'Erro interno ao calcular comissoes',
    });
  });
});
