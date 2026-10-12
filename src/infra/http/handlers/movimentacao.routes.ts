import { Router } from 'express';
import z from 'zod';
import { EstoqueInsuficienteError } from '../../../application/use-cases/errors/EstoqueInsuficienteError.js';
import { ProdutoNaoEncontradoError } from '../../../application/use-cases/errors/ProdutoNaoEncontradoError.js';
import { CreateMovimentacaoFactory } from '../../factories/MovimentacaoFactory.js';

const router = Router();

// api/movimentacao
router.post('/', async (request, response) => {
  const schema = z.object({
    codigoProduto: z.coerce.number({
      error: 'Código do produto inválido',
    }),
    quantidade: z.coerce.number({
      error: 'Quantidade inválida',
    }),
    tipoMovimentacao: z.enum(['entrada', 'saida'], {
      error: 'Tipo de movimentação inválido (use entrada ou saida)',
    }),
  });

  try {
    schema.parse(request.body);

    const { movimentarEstoqueUseCase } = CreateMovimentacaoFactory.create();
    const result = await movimentarEstoqueUseCase.execute(request.body);

    return response.status(201).json({
      message: 'Movimentação gerada com sucesso',
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

    if (error instanceof ProdutoNaoEncontradoError) {
      return response.status(404).json({
        message: error.message,
      });
    }

    if (error instanceof EstoqueInsuficienteError) {
      return response.status(409).json({
        message: error.message,
      });
    }

    return response.status(500).json({
      message:
        error instanceof Error ? error.message : 'Erro interno do servidor',
    });
  }
});

export { router };
