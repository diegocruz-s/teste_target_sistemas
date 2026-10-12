import { Router } from "express";
import { CreateCalcularComissaoFactory } from "../../factories/CalcularComissaoFactory.js";

const router = Router();

// api/comissao
router.get("/", async (request, response) => {
  try {
      const { calcularComissoesUseCase } = CreateCalcularComissaoFactory.create();
      const result = await calcularComissoesUseCase.execute();

      return response.status(200).json({
        message: "Comissões calculadas com sucesso",
        data: result,
      });
    } catch (error: unknown) {
      return response.status(500).json({
        message: (error instanceof Error)
          ? error.message
          : 'Erro interno do servidor',
      });
    }
});

export {
  router,
}
