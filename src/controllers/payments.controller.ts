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
    this.createByUser = this.createByUser.bind(this);
    this.deleteByUser = this.deleteByUser.bind(this);
    this.updateByUser = this.updateByUser.bind(this);
  };

  public async findByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const token = Token.extract(String(req.headers.authorization));
      const { user } = await this.token.verify(token);
      const result = await this.service.findByUser(user.id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async createByUser(
    req: Request<{}, {}, { customer: string; installments: number; price: number; }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = Token.extract(String(req.headers.authorization));
      const { user } = await this.token.verify(token);
      const result = await this.service.createByUser({ ...req.body, userId: user.id });
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteByUser(
    req: Request<{ id: string; }, {}, {}>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const token = Token.extract(String(req.headers.authorization));
      const { user } = await this.token.verify(token);
      await this.service.deleteByUser(user.id, req.params.id);
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  }

  public async updateByUser(
    req: Request<{ id: string; }, {}, { customer: string; installments: number; price: number; }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = Token.extract(String(req.headers.authorization));
      const { user } = await this.token.verify(token);
      const result = await this.service.updateByUser(user.id, req.params.id, req.body);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}
