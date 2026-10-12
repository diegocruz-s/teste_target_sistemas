import { jest } from '@jest/globals';
import request from 'supertest';
import { appController } from '../../../app.js';
import { EstoqueInsuficienteError } from '../../../application/use-cases/errors/EstoqueInsuficienteError.js';
import { ProdutoNaoEncontradoError } from '../../../application/use-cases/errors/ProdutoNaoEncontradoError.js';
import { Movimentacao } from '../../../domain/entities/Movimentacao.js';
import { CreateMovimentacaoFactory } from '../../factories/MovimentacaoFactory.js';

const app = appController.getApp();

jest.mock('../../factories/MovimentacaoFactory.js', () => ({
  CreateMovimentacaoFactory: { create: jest.fn() },
}));
const executeMovimentarEstoqueUseCaseMock =
  jest.fn<() => Promise<Movimentacao>>();

const makeSut = () => {
  jest.spyOn(CreateMovimentacaoFactory, 'create').mockReturnValue({
    movimentarEstoqueUseCase: { execute: executeMovimentarEstoqueUseCaseMock },
  } as unknown as ReturnType<typeof CreateMovimentacaoFactory.create>);

  return { app };
};

describe('POST /api/movimentacao', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    executeMovimentarEstoqueUseCaseMock.mockReset();
    makeSut();
  });

  it('should return 200 and movimentation when the data is valid.', async () => {
    const result: Movimentacao = new Movimentacao({
      codigoProduto: 100,
      descricao: 'Descricao teste',
      quantidade: 10,
      quantidadeTotalEstoque: 150,
      tipo: 'entrada',
    });

    executeMovimentarEstoqueUseCaseMock.mockResolvedValue(result);

    const response = await request(app).post('/api/movimentacao').send({
      codigoProduto: 100,
      quantidade: 10,
      tipoMovimentacao: 'entrada',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Movimentação gerada com sucesso',
      data: { ...result },
    });

    expect(CreateMovimentacaoFactory.create).toHaveBeenCalledTimes(1);
    expect(executeMovimentarEstoqueUseCaseMock).toHaveBeenCalledWith({
      codigoProduto: 100,
      quantidade: 10,
      tipoMovimentacao: 'entrada',
    });
  });

  it('should return 400 when the codigoProduto is not a number.', async () => {
    const response = await request(app).post('/api/movimentacao').send({
      codigoProduto: 'texto',
      quantidade: 10,
      tipoMovimentacao: 'entrada',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Dados inválidos',
      errors: { codigoProduto: ['Código do produto inválido'] },
    });

    expect(executeMovimentarEstoqueUseCaseMock).not.toHaveBeenCalled();
  });

  it('should return 400 when the quantidade is not a number.', async () => {
    const response = await request(app).post('/api/movimentacao').send({
      codigoProduto: 100,
      quantidade: 'texto',
      tipoMovimentacao: 'entrada',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Dados inválidos',
      errors: { quantidade: ['Quantidade inválida'] },
    });

    expect(executeMovimentarEstoqueUseCaseMock).not.toHaveBeenCalled();
  });

  it('should return 400 when the tipoMovimentacao value is not a enum["entrada", "saida"].', async () => {
    const response = await request(app).post('/api/movimentacao').send({
      codigoProduto: 100,
      quantidade: 10,
      tipoMovimentacao: 'texto',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Dados inválidos',
      errors: {
        tipoMovimentacao: [
          'Tipo de movimentação inválido (use entrada ou saida)',
        ],
      },
    });

    expect(executeMovimentarEstoqueUseCaseMock).not.toHaveBeenCalled();
  });

  it('should return 400 when the codigoProduto is missing.', async () => {
    const response = await request(app).post('/api/movimentacao').send({
      quantidade: 10,
      tipoMovimentacao: 'texto',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Dados inválidos');
    expect(response.body.errors).toHaveProperty('codigoProduto');

    expect(executeMovimentarEstoqueUseCaseMock).not.toHaveBeenCalled();
  });

  it('should return 400 when the quantidade is missing.', async () => {
    const response = await request(app).post('/api/movimentacao').send({
      codigoProduto: 100,
      tipoMovimentacao: 'texto',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Dados inválidos');
    expect(response.body.errors).toHaveProperty('quantidade');

    expect(executeMovimentarEstoqueUseCaseMock).not.toHaveBeenCalled();
  });

  it('should return 400 when both tipoMovimentacao is missing.', async () => {
    const response = await request(app).post('/api/movimentacao').send({
      codigoProduto: 100,
      quantidade: 10,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Dados inválidos');
    expect(response.body.errors).toHaveProperty('tipoMovimentacao');

    expect(executeMovimentarEstoqueUseCaseMock).not.toHaveBeenCalled();
  });

  it('should return 400 when all fields are invalid.', async () => {
    const response = await request(app).post('/api/movimentacao').send({
      codigoProduto: 'texto',
      quantidade: 'texto',
      tipoMovimentacao: 'texto',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Dados inválidos');
    expect(response.body.errors).toHaveProperty('codigoProduto');
    expect(response.body.errors).toHaveProperty('quantidade');
    expect(response.body.errors).toHaveProperty('tipoMovimentacao');

    expect(executeMovimentarEstoqueUseCaseMock).not.toHaveBeenCalled();
  });

  it('should return 500 when the use case throws an error.', async () => {
    executeMovimentarEstoqueUseCaseMock.mockRejectedValue(
      new Error('Erro interno ao gerar uma movimentação'),
    );

    const response = await request(app).post('/api/movimentacao').send({
      codigoProduto: 100,
      quantidade: 10,
      tipoMovimentacao: 'entrada',
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: 'Erro interno ao gerar uma movimentação',
    });
  });

  it('should return 404 when useCase throw a ProdutoNaoEncontradoError error', async () => {
    executeMovimentarEstoqueUseCaseMock.mockRejectedValue(
      new ProdutoNaoEncontradoError(),
    );

    const response = await request(app).post('/api/movimentacao').send({
      codigoProduto: 100,
      quantidade: 10,
      tipoMovimentacao: 'entrada',
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Produto não encontrado');

    expect(executeMovimentarEstoqueUseCaseMock).toHaveBeenCalledTimes(1);
  });

  it('should return 409 when useCase throw a EstoqueInsuficienteError error', async () => {
    executeMovimentarEstoqueUseCaseMock.mockRejectedValue(
      new EstoqueInsuficienteError(),
    );

    const response = await request(app).post('/api/movimentacao').send({
      codigoProduto: 100,
      quantidade: 10,
      tipoMovimentacao: 'entrada',
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Quantidade insuficiente em estoque');

    expect(executeMovimentarEstoqueUseCaseMock).toHaveBeenCalledTimes(1);
  });
});
