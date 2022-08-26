import express from 'express';
import { ErrorMiddleware } from './helpers/error';

export class App {
  app: express.Express;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.get('/', (_, res) => res.send('Hello World'));
  }

  public listen(port: number) {
    this.app.listen(port, () => console.log(`Listening on port ${port}`));
  }

  public addRoute(path: string, route: express.Router) {
    this.app.use(path, route, ErrorMiddleware);
  };
}
