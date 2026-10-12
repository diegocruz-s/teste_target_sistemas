import { readFile, writeFile } from "fs/promises";
import { IMovimentacaoRepository } from "../../../application/use-cases/movimentarEstoque/protocols.js";
import { Movimentacao } from "../../../domain/entities/Movimentacao.js";
import { databasePaths } from "../../database/databasePaths.js";

export class JsonMovimentacaoRepository implements IMovimentacaoRepository {
  private filePath = databasePaths.movimentacoes;

  async save(movimentacao: Movimentacao): Promise<void> {
    try {
      const data = await readFile(this.filePath, "utf-8");
      const json = JSON.parse(data);
      const movimentacoes: Movimentacao[] = json.movimentacoes;

      movimentacoes.push(movimentacao);

      await writeFile(
        this.filePath,
        JSON.stringify({ movimentacoes }, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao salvar movimentação no arquivo JSON", {
        cause: error,
      });
    }
  }
}
