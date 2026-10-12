import { ValorInicialInvalidoError } from '../errors/ValorInicialInvalidoError.js';
import {
  ICalcularJurosUseCase,
  IDatasCalcularJuros,
  IResultadoCalcularJuros,
} from './protocols.js';

const PERCENTUAL_JUROS_POR_DIA = 2.5;
const MILISSEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;

export class CalcularJurosUseCase implements ICalcularJurosUseCase {
  async execute(datas: IDatasCalcularJuros): Promise<IResultadoCalcularJuros> {
    const { valorInicial, dataVencimento } = datas;

    if (valorInicial <= 0) {
      throw new ValorInicialInvalidoError();
    }

    const dataAtual = new Date();
    const diasAtraso = this.calcularDiasAtraso(dataVencimento, dataAtual);

    if (diasAtraso <= 0) {
      return {
        valorOriginal: valorInicial,
        dataVencimento,
        dataAtual,
        diasAtraso: 0,
        percentualJuros: '0%',
        valorJuros: 0,
        valorFinal: valorInicial,
      };
    }

    const percentualJuros = diasAtraso * PERCENTUAL_JUROS_POR_DIA;
    const valorJuros = (valorInicial * percentualJuros) / 100;
    const valorFinal = valorInicial + valorJuros;

    return {
      valorOriginal: valorInicial,
      dataVencimento,
      dataAtual,
      diasAtraso,
      percentualJuros: `${percentualJuros}%`.replace('.', ','),
      valorJuros,
      valorFinal,
    };
  }

  private calcularDiasAtraso(
    dataVencimentoParam: Date,
    dataAtualParam: Date,
  ): number {
    const dataVencimento = new Date(dataVencimentoParam);
    const dataAtual = new Date(dataAtualParam);

    dataVencimento.setUTCHours(0, 0, 0, 0);
    dataAtual.setUTCHours(0, 0, 0, 0);

    const diffMs = dataAtual.getTime() - dataVencimento.getTime();
    const diferencaDias = Math.round(diffMs / MILISSEGUNDOS_POR_DIA);

    return diferencaDias;
  }
}
