import { RequestHandler } from 'express';
import { Service } from './auth.service';
import { Token } from '../../helpers/token';

export class Controller {
  service: Service;

  constructor(service = new Service()) {
    this.service = service;
  };

  public login: RequestHandler<
    {}, {}, { username: string, password: string; }
  > = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const result = await this.service.login(username, password);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  public register: RequestHandler<
    {}, {}, { username: string, email: string, password: string; }
  > = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const result = await this.service.register(username, email, password);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  };

  public verify: RequestHandler<
    {}, {}, {}
  > = async (req, res, next) => {
    try {
      const token = Token.extract(String(req.headers.authorization));
      const result = await this.service.verify(token);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };
}
