export interface VendaProps {
  vendedor: string;
  valor: number;
}

export class Venda {
  private vendedor: string;
  private valor: number;

  constructor(vendedor: string, valor: number) {
    this.vendedor = vendedor;
    this.valor = valor;
  }

  public getValor(): number {
    return this.valor;
  }

  public getVendedor(): string {
    return this.vendedor;
  }
}