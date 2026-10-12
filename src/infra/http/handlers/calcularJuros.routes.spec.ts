import { jest } from '@jest/globals';
import request from 'supertest';
import { appController } from '../../../app.js';
import { IResultadoCalcularJuros } from '../../../application/use-cases/calcularJuros/protocols.js';
import { ValorInicialInvalidoError } from '../../../application/use-cases/errors/ValorInicialInvalidoError.js';
import { CreateCalcularJurosFactory } from '../../factories/CalcularJurosFactory.js';

const app = appController.getApp();

jest.mock('../../factories/CalcularJurosFactory.js', () => ({
  CreateCalcularJurosFactory: { create: jest.fn() },
}));
const executeCalcularJurosUseCaseMock =
  jest.fn<() => Promise<IResultadoCalcularJuros>>();

const makeSut = () => {
  jest.spyOn(CreateCalcularJurosFactory, 'create').mockReturnValue({
    calcularJurosUseCase: { execute: executeCalcularJurosUseCaseMock },
  } as unknown as ReturnType<typeof CreateCalcularJurosFactory.create>);

  return { app };
};

describe('POST /api/juros', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    executeCalcularJurosUseCaseMock.mockReset();
    makeSut();
  });

  it('should return 200 and the calculated interest when the data is valid.', async () => {
    const result: IResultadoCalcularJuros = {
      valorOriginal: 100,
      dataVencimento: new Date('2023-05-29T00:00:00.000Z'),
      dataAtual: new Date('2023-06-01T00:00:00.000Z'),
      diasAtraso: 3,
      percentualJuros: '7,5%',
      valorJuros: 7.5,
      valorFinal: 107.5,
    };

    executeCalcularJurosUseCaseMock.mockResolvedValue(result);

    const response = await request(app)
      .post('/api/juros')
      .send({ dataVencimento: '2023-05-29', valorInicial: 100 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Juros calculado com sucesso',
      data: {
        ...result,
        dataVencimento: result.dataVencimento.toISOString(),
        dataAtual: result.dataAtual.toISOString(),
      },
    });

    expect(CreateCalcularJurosFactory.create).toHaveBeenCalledTimes(1);
    expect(executeCalcularJurosUseCaseMock).toHaveBeenCalledWith({
      dataVencimento: '2023-05-29',
      valorInicial: 100,
    });
  });

  it('should return 400 when the due date is invalid.', async () => {
    const response = await request(app)
      .post('/api/juros')
      .send({ dataVencimento: '29-05-2023', valorInicial: 100 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Dados inválidos',
      errors: { dataVencimento: ['Data de vencimento inválida'] },
    });

    expect(executeCalcularJurosUseCaseMock).not.toHaveBeenCalled();
  });

  it('should return 400 when the due date does not exist.', async () => {
    const response = await request(app)
      .post('/api/juros')
      .send({ dataVencimento: '2023-02-30', valorInicial: 100 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Dados inválidos');
    expect(response.body.errors).toHaveProperty('dataVencimento');

    expect(executeCalcularJurosUseCaseMock).not.toHaveBeenCalled();
  });

  it('should return 400 when the initial value is not a number.', async () => {
    const response = await request(app)
      .post('/api/juros')
      .send({ dataVencimento: '2023-05-29', valorInicial: 'abc' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Dados inválidos',
      errors: { valorInicial: ['Valor inicial inválido'] },
    });

    expect(executeCalcularJurosUseCaseMock).not.toHaveBeenCalled();
  });

  it('should return 400 when the initial value is less then zero', async () => {
    executeCalcularJurosUseCaseMock.mockRejectedValue(
      new ValorInicialInvalidoError(),
    );

    const response = await request(app)
      .post('/api/juros')
      .send({ dataVencimento: '2023-05-29', valorInicial: -10 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Dado inválido',
      errors: 'Valor inicial não pode ser zero ou negativo.',
    });

    expect(executeCalcularJurosUseCaseMock).toHaveBeenCalledTimes(1);
  });

  it('should return 400 when the due date is missing.', async () => {
    const response = await request(app)
      .post('/api/juros')
      .send({ valorInicial: 100 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Dados inválidos');
    expect(response.body.errors).toHaveProperty('dataVencimento');

    expect(executeCalcularJurosUseCaseMock).not.toHaveBeenCalled();
  });

  it('should return 400 when the initial value is missing.', async () => {
    const response = await request(app)
      .post('/api/juros')
      .send({ dataVencimento: '2023-05-29' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Dados inválidos');
    expect(response.body.errors).toHaveProperty('valorInicial');

    expect(executeCalcularJurosUseCaseMock).not.toHaveBeenCalled();
  });

  it('should return 400 when both fields are invalid.', async () => {
    const response = await request(app)
      .post('/api/juros')
      .send({ dataVencimento: 'data-invalida', valorInicial: 'abc' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Dados inválidos');
    expect(response.body.errors).toHaveProperty('dataVencimento');
    expect(response.body.errors).toHaveProperty('valorInicial');

    expect(executeCalcularJurosUseCaseMock).not.toHaveBeenCalled();
  });

  it('should return 500 when the use case throws an error.', async () => {
    executeCalcularJurosUseCaseMock.mockRejectedValue(
      new Error('Erro interno ao calcular juros'),
    );

    const response = await request(app)
      .post('/api/juros')
      .send({ dataVencimento: '2023-05-29', valorInicial: 100 });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: 'Erro interno ao calcular juros',
    });
  });
});
