import { randomUUID } from 'node:crypto';

export type TiposMovimentacao = 'entrada' | 'saida';

export class Movimentacao {
  private id: string;
  private descricao: string;
  private codigoProduto: number;
  private tipo: TiposMovimentacao;
  private quantidade: number;
  private quantidadeTotalEstoque: number;

  constructor(datas: {
    descricao: string;
    codigoProduto: number;
    tipo: TiposMovimentacao;
    quantidade: number;
    quantidadeTotalEstoque: number;
  }) {
    const {
      codigoProduto,
      descricao,
      quantidade,
      quantidadeTotalEstoque,
      tipo,
    } = datas;
    
    this.id = randomUUID();
    this.descricao = descricao;
    this.codigoProduto = codigoProduto;
    this.tipo = tipo;
    this.quantidade = quantidade;
    this.quantidadeTotalEstoque = quantidadeTotalEstoque;
  }

  public getId(): string {
    return this.id;
  }

  public getDescricao(): string {
    return this.descricao;
  }

  public getCodigoProduto(): number {
    return this.codigoProduto;
  }

  public getTipo(): TiposMovimentacao {
    return this.tipo;
  }

  public getQuantidade(): number {
    return this.quantidade;
  }

  public getQuantidadeTotalEstoque(): number {
    return this.quantidadeTotalEstoque;
  }
}
