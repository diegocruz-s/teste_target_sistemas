import { Venda } from "../entities/Venda.js";
import { CalcularComissao } from "./CalcularComissao.js";

const makeSut = () => {
  const sut = new CalcularComissao();

  return {
    sut,
  }
}

describe('CalcularComissaoService', () => {
  it('should calculate commission for a sale below the minimum value', () => {
    const { sut } = makeSut();
    const mockVenda = new Venda('Vendedor Teste', 50);
    const result = sut.run(mockVenda);

    expect(result).toEqual({
      comissao: 0,
      valorVenda: 50,
      mensagem: "Venda abaixo do valor mínimo para comissão.",
    });
  });

  it('should calculate commission for a sale between 100 and 500', () => {
    const { sut } = makeSut();
    const mockVenda = new Venda('Vendedor Teste', 200);
    const result = sut.run(mockVenda);

    expect(result).toEqual({
      comissao: 2,
      valorVenda: 200,
      mensagem: "Comissão calculada com sucesso!",
    });
  });

  it('should calculate commission for a sale above 500', () => {
    const { sut } = makeSut();
    const mockVenda = new Venda('Vendedor Teste', 600);
    const result = sut.run(mockVenda);

    expect(result).toEqual({
      comissao: 30,
      valorVenda: 600,
      mensagem: "Comissão calculada com sucesso!",
    });
  });

  it('should calculate commission for a sale exactly 100', () => {
    const { sut } = makeSut();
    const mockVenda = new Venda('Vendedor Teste', 100);
    const result = sut.run(mockVenda);

    expect(result).toEqual({
      comissao: 1,
      valorVenda: 100,
      mensagem: "Comissão calculada com sucesso!",
    });
  });

  it('should calculate commission for a sale exactly 500', () => {
    const { sut } = makeSut();
    const mockVenda = new Venda('Vendedor Teste', 500);
    const result = sut.run(mockVenda);

    expect(result).toEqual({
      comissao: 25,
      valorVenda: 500,
      mensagem: "Comissão calculada com sucesso!",
    });
  });

  it('calculate and return a decimal value with two decimal places', () => {
    const { sut } = makeSut();
    const mockVenda = new Venda('Vendedor Teste', 333.33);
    const result = sut.run(mockVenda);

    expect(result).toEqual({
      comissao: 3.33,
      valorVenda: 333.33,
      mensagem: "Comissão calculada com sucesso!",
    });
  });
})
