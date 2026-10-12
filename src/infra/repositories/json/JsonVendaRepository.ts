import { readFile } from "node:fs/promises";
import { IVendasRepository } from "../../../application/use-cases/calcularComissao/protocols.js";
import { Venda, VendaProps } from "../../../domain/entities/Venda.js";
import { databasePaths } from "../../database/databasePaths.js";

export class JsonVendaRepository implements IVendasRepository {
  private readonly filePath = databasePaths.vendas;

  async getAllVendas(): Promise<Venda[]> {
    const data = await readFile(this.filePath, 'utf-8');
    const json = JSON.parse(data);
    const vendas: VendaProps[] = json.vendas;

    return vendas.map(
      (venda) =>
        new Venda(
          venda.vendedor,
          venda.valor
        )
    );
  }
}