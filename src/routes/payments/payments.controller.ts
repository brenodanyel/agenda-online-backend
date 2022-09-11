import { RequestHandler } from 'express';
import { Service } from './payments.service';
import { Token } from '../../helpers/token';

export class Controller {
  service: Service;
  token: Token;

  constructor(service = new Service(), token = new Token()) {
    this.service = service;
    this.token = token;
  };

  public findByUser: RequestHandler<
    {}, {}, {}, { startDate?: Date, endDate?: Date; }
  > = async (req, res, next) => {
    try {
      const token = Token.extract(String(req.headers.authorization));
      const { startDate, endDate } = req.query;
      const { user } = await this.token.verify(token);
      const result = await this.service.findByUser(user.id, startDate, endDate);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  public createByUser: RequestHandler<
    {}, {}, { customer: string; date: Date, installments: number; price: number; }
  > = async (req, res, next) => {
    try {
      const token = Token.extract(String(req.headers.authorization));
      const { user } = await this.token.verify(token);
      const { customer, date, installments, price } = req.body;
      const result = await this.service.createByUser({ customer, date, installments, price, userId: user.id });
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  };

  public deleteByUser: RequestHandler<
    { id: string; }, {}, {}
  > = async (req, res, next) => {
    try {
      const token = Token.extract(String(req.headers.authorization));
      const { user } = await this.token.verify(token);
      await this.service.deleteByUser(user.id, req.params.id);
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  };

  public updateByUser: RequestHandler<
    { id: string; }, {}, { customer: string; date: Date, installments: number; price: number; }
  > = async (req, res, next) => {
    try {
      const token = Token.extract(String(req.headers.authorization));
      const { user } = await this.token.verify(token);
      const { customer, date, installments, price } = req.body;
      const result = await this.service.updateByUser(user.id, req.params.id, { customer, date, installments, price });
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
