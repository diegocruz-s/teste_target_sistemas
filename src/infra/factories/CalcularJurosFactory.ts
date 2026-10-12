import { CalcularJurosUseCase } from "../../application/use-cases/calcularJuros/CalcularJuros.js";

export interface ICreateCalcularJurosFactory {
  calcularJurosUseCase: CalcularJurosUseCase;
}

export class CreateCalcularJurosFactory {
  static create (): ICreateCalcularJurosFactory {
    const calcularJurosUseCase = new CalcularJurosUseCase();

    return {
      calcularJurosUseCase,
    };
  }
}
