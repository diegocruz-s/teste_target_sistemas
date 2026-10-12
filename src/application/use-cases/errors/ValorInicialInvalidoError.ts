export class ValorInicialInvalidoError extends Error {
  constructor() {
    super("Valor inicial não pode ser zero ou negativo.");
    this.name = "ValorInicialInvalidoError";
  }
}