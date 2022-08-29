import { Request, Response, NextFunction } from 'express';
import { Service } from '../service/payments.service';
import { Token } from '../helpers/token';

export class Controller {
  service: Service;
  token: Token;

  constructor(service = new Service(), token = new Token()) {
    this.service = service;
    this.token = token;

    this.findByUser = this.findByUser.bind(this);
  };

  public async findByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      const [, token] = String(authorization).split(' ');
      const { user } = await this.token.verify(token);
      const result = await this.service.findByUser(user.id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}
