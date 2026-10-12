import express, { Express } from 'express';
import cors from 'cors';
import { comissaoRouter, jurosRouter, movimentacaoRouter } from './infra/http/routes.js';

class AppController {
  private app: Express;

  constructor() {
    this.app = express();
    this.cors();
    this.middlewares();
    this.routes();
  }

  private routes () {
    this.app.use('/api/comissao', comissaoRouter);
    this.app.use('/api/movimentacao', movimentacaoRouter);
    this.app.use('/api/juros', jurosRouter);
  }

  private middlewares () {
    this.app.use(express.json());
  }

  private cors () {
    this.app.use(cors());
  }

  private logServerStart (port: number) {
    console.log(`Server is running on port ${port}...`);
  }

  public start (port: number) {
    this.app.listen(port, () => this.logServerStart(port));
  }

  public getApp (): Express {
    return this.app;
  }
}

const appController = new AppController();

export {
  appController,
};