import {
  ICalcularComissao,
  ICalcularComissoesUseCase,
  IResultadoCalcularComissoes,
  IVendasRepository,
} from './protocols.js';

export class CalcularComissoesUseCase implements ICalcularComissoesUseCase {
  constructor(
    private readonly calcularComissaoService: ICalcularComissao,
    private readonly vendasRepository: IVendasRepository,
  ) {}

  async execute(): Promise<IResultadoCalcularComissoes[]> {
    const vendas = await this.vendasRepository.getAllVendas();
    if (vendas.length === 0) {
      return [];
    }

    const comissaoTotalPorVendedor = vendas.reduce((map, venda) => {
      const resultado = this.calcularComissaoService.run(venda);
      const vendedor = venda.getVendedor();

      const comissaoAtual = map.get(vendedor) ?? 0;

      const novaComissaoTotal = Number(
        (comissaoAtual + resultado.comissao).toFixed(2),
      );
      map.set(vendedor, novaComissaoTotal);

      return map;
    }, new Map<string, number>());

    const result = Array.from(
      comissaoTotalPorVendedor,
      ([vendedor, comissaoTotal]) => ({
        vendedor,
        comissaoTotal,
      }),
    );

    return result;
  }
}
