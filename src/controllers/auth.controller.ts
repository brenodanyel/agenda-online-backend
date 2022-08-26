import { Request, Response, NextFunction } from 'express';
import { Service } from '../service/auth.service';

export class Controller {
  service: Service;

  constructor(service = new Service()) {
    this.service = service;

    this.login = this.login.bind(this);
  };

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      const result = await this.service.login(username, password);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}
