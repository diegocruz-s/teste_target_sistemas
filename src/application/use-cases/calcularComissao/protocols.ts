import { Venda } from '../../../domain/entities/Venda.js';

export type IResultadoCalcularComissao = {
  valorVenda: number;
  comissao: number;
  mensagem: string;
};

export type IResultadoCalcularComissoes = {
  vendedor: string;
  comissaoTotal: number;
};

export interface ICalcularComissao {
  run(venda: Venda): IResultadoCalcularComissao;
}

export interface ICalcularComissoesUseCase {
  execute(vendas: Venda[]): Promise<IResultadoCalcularComissoes[]>;
}

export interface IVendasRepository {
  getAllVendas(): Promise<Venda[]>;
}
