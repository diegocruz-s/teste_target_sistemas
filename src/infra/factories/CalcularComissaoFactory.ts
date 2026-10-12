import { CalcularComissoesUseCase } from "../../application/use-cases/calcularComissao/CalcularComissoesUseCase.js";
import { CalcularComissao } from "../../domain/services/CalcularComissao.js";
import { JsonVendaRepository } from "../repositories/json/JsonVendaRepository.js";

export interface ICreateCalcularComissaoFactory {
  calcularComissoesUseCase: CalcularComissoesUseCase;
}

export class CreateCalcularComissaoFactory {
  static create (): ICreateCalcularComissaoFactory {
    const calcularComissaoService = new CalcularComissao();
    const jsonVendaRepository = new JsonVendaRepository();

    const calcularComissoesUseCase = new CalcularComissoesUseCase(
      calcularComissaoService,
      jsonVendaRepository,
    );

    return {
      calcularComissoesUseCase
    };
  }
}
