export type IResultadoCalcularJuros = {
  valorOriginal: number;
  dataVencimento: Date;
  dataAtual: Date;
  diasAtraso: number;
  percentualJuros: string;
  valorJuros: number;
  valorFinal: number;
}

export interface IDatasCalcularJuros {
  valorInicial: number;
  dataVencimento: Date;
}

export interface ICalcularJurosUseCase {
  execute(datas: IDatasCalcularJuros): Promise<IResultadoCalcularJuros>;
}