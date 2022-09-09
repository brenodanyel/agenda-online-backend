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

  public sendPasswordResetCode: RequestHandler<
    {}, {}, { username: string; }
  > = async (req, res, next) => {
    try {
      const { username } = req.body;
      await this.service.sendPasswordResetCode(username);
      res.status(200).send();
    } catch (e) {
      next(e);
    }
  };

  public resetPassword: RequestHandler<
    {}, {}, { username: string; password: string, code: string; }
  > = async (req, res, next) => {
    try {
      const { username, password, code } = req.body;
      const user = await this.service.resetPassword(username, password, code);
      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  };
}
