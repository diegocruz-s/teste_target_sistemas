import { Router } from 'express';
import z from 'zod';
import { ValorInicialInvalidoError } from '../../../application/use-cases/errors/ValorInicialInvalidoError.js';
import { CreateCalcularJurosFactory } from '../../factories/CalcularJurosFactory.js';

const router = Router();

const schema = z.object({
  dataVencimento: z.iso.date({
    error: 'Data de vencimento inválida',
  }),
  valorInicial: z.coerce.number({
    error: 'Valor inicial inválido',
  }),
});

// api/juros
router.post('/', async (request, response) => {
  try {
    schema.parse(request.body);

    const { calcularJurosUseCase } = CreateCalcularJurosFactory.create();
    const result = await calcularJurosUseCase.execute(request.body);

    return response.status(200).json({
      message: 'Juros calculado com sucesso',
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const { fieldErrors } = z.flattenError(error);

      return response.status(400).json({
        message: 'Dados inválidos',
        errors: fieldErrors,
      });
    }

    if (error instanceof ValorInicialInvalidoError) {
      return response.status(400).json({
        message: 'Dado inválido',
        errors: error.message,
      });
    }

    return response.status(500).json({
      message:
        error instanceof Error ? error.message : 'Erro interno do servidor',
    });
  }
});

export { router };
