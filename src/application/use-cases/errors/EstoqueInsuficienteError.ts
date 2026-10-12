export class EstoqueInsuficienteError extends Error {
  constructor() {
    super("Quantidade insuficiente em estoque");
    this.name = "EstoqueInsuficienteError";
  }
}