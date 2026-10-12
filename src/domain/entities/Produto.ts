export interface ProdutoProps {
  codigoProduto: number;
  descricaoProduto: string;
  estoque: number;
}

export class Produto {
  private codigoProduto: number;
  private descricaoProduto: string;
  private estoque: number;

  constructor(codigoProduto: number, descricaoProduto: string, estoque: number) {
    this.codigoProduto = codigoProduto;
    this.descricaoProduto = descricaoProduto;
    this.estoque = estoque;
  }

  public getCodigoProduto(): number {
    return this.codigoProduto;
  }

  public getDescricaoProduto(): string {
    return this.descricaoProduto;
  }

  public getEstoque(): number {
    return this.estoque;
  }

  public setEstoque(estoque: number): void {
    this.estoque = estoque;
  }
}