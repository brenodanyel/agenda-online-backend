import express from 'express';

export class App {
  app: express.Express;

  constructor() {
    this.app = express();
    this.app.get('/', (_, res) => res.send('Hello World'));
  }

  public listen(port: number) {
    this.app.listen(port, () => console.log(`Listening on port ${port}`));
  }

  public addRoute(path: string, route: express.Router) {
    this.app.use(path, route);
  };
}
