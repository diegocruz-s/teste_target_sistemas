import { ValorInicialInvalidoError } from '../errors/ValorInicialInvalidoError.js';
import { CalcularJurosUseCase } from './CalcularJuros.js';

const makeSut = () => {
  const sut = new CalcularJurosUseCase();

  return {
    sut,
  };
};

describe('CalcularJurosUseCase', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2023-06-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should throw an error if the initial value is negative.', async () => {
    const { sut } = makeSut();
    const datas = {
      valorInicial: -100,
      dataVencimento: new Date(),
    };

    await expect(sut.execute(datas)).rejects.toThrow(ValorInicialInvalidoError);
  });

  it('should throw an error if the initial value is zero.', async () => {
    const { sut } = makeSut();
    const datas = {
      valorInicial: 0,
      dataVencimento: new Date(),
    };

    await expect(sut.execute(datas)).rejects.toThrow(
      'Valor inicial não pode ser zero ou negativo.',
    );
  });

  it('should return zero interest if the due date is today.', async () => {
    const { sut } = makeSut();
    const dataAtual = new Date();

    const datas = {
      valorInicial: 100,
      dataVencimento: dataAtual,
    };

    const result = await sut.execute(datas);

    expect(result.valorJuros).toBe(0);
    expect(result.dataVencimento).toEqual(dataAtual);
    expect(result.diasAtraso).toBe(0);
    expect(result.percentualJuros).toBe('0%');
    expect(result.valorFinal).toBe(100);
    expect(result.valorOriginal).toBe(100);
  });

  it('should be returned at zero if the due date is after today.', async () => {
    const { sut } = makeSut();
    const dataAtual = new Date();
    const dataVencimento = new Date(dataAtual);
    dataVencimento.setUTCDate(dataAtual.getUTCDate() + 5);

    const datas = {
      valorInicial: 100,
      dataVencimento: dataVencimento,
    };

    const result = await sut.execute(datas);

    expect(result.valorJuros).toBe(0);
    expect(result.dataVencimento).toEqual(dataVencimento);
    expect(result.diasAtraso).toBe(0);
    expect(result.percentualJuros).toBe('0%');
    expect(result.valorFinal).toBe(100);
    expect(result.valorOriginal).toBe(100);
  });

  it('should return the interest calculated correctly if the due date is before today (3 days past due).', async () => {
    const { sut } = makeSut();
    const dataAtual = new Date();
    const dataVencimento = new Date(dataAtual);
    dataVencimento.setUTCDate(dataAtual.getUTCDate() - 3);

    const datas = {
      valorInicial: 100,
      dataVencimento: dataVencimento,
    };

    const result = await sut.execute(datas);

    expect(result.dataVencimento).toEqual(dataVencimento);
    expect(result.diasAtraso).toBe(3);
    expect(result.percentualJuros).toBe('7,5%');
    expect(result.valorJuros).toBe(7.5);
    expect(result.valorOriginal).toBe(100);
    expect(result.valorFinal).toBe(107.5);
  });

  it('should return the interest calculated correctly if the due date is before today (15 days past due).', async () => {
    const { sut } = makeSut();
    const dataAtual = new Date();
    const dataVencimento = new Date(dataAtual);
    dataVencimento.setUTCDate(dataAtual.getUTCDate() - 15);

    const datas = {
      valorInicial: 100,
      dataVencimento: dataVencimento,
    };

    const result = await sut.execute(datas);

    expect(result.dataVencimento).toEqual(dataVencimento);
    expect(result.diasAtraso).toBe(15);
    expect(result.percentualJuros).toBe('37,5%');
    expect(result.valorJuros).toBe(37.5);
    expect(result.valorOriginal).toBe(100);
    expect(result.valorFinal).toBe(137.5);
  });

  it('should return the interest calculated correctly if the due date is before today (3 months past due).', async () => {
    const { sut } = makeSut();
    const dataAtual = new Date();
    const dataVencimento = new Date(dataAtual);
    dataVencimento.setUTCMonth(dataAtual.getUTCMonth() - 3);

    const datas = {
      valorInicial: 100,
      dataVencimento: dataVencimento,
    };

    const result = await sut.execute(datas);

    expect(result.dataVencimento).toEqual(dataVencimento);
    expect(result.diasAtraso).toBe(92);
    expect(result.percentualJuros).toBe('230%');
    expect(result.valorJuros).toBe(230);
    expect(result.valorOriginal).toBe(100);
    expect(result.valorFinal).toBe(330);
  });
});
