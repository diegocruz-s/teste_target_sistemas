import {
  ICalcularComissao,
  IResultadoCalcularComissao,
} from '../../application/use-cases/calcularComissao/protocols.js';
import type { Venda } from '../entities/Venda.js';

export class CalcularComissao implements ICalcularComissao {
  run(venda: Venda): IResultadoCalcularComissao {
    const valorVenda = venda.getValor();

    if (valorVenda < 100) {
      const result = {
        valorVenda,
        comissao: 0,
        mensagem: 'Venda abaixo do valor mínimo para comissão.',
      };

      return result;
    }

    const comissao = valorVenda < 500 ? valorVenda * 0.01 : valorVenda * 0.05;

    const result = {
      valorVenda,
      comissao: this.arredondarComCasas(comissao, 2),
      mensagem: `Comissão calculada com sucesso!`,
    };

    return result;
  }

  private arredondarComCasas(valor: number, casasDecimais: number) {
    const fator = Math.pow(10, casasDecimais);
    return Math.round((valor + Number.EPSILON) * fator) / fator;
  }
}
