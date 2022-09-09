import { Router as ExpressRouter } from 'express';
import { Controller } from './auth.controller';
import { Middleware } from './auth.middleware';

export class Router {
  public router = ExpressRouter();

  constructor(controller = new Controller()) {
    this.router.route('/login')
      .post(Middleware.login, controller.login);

    this.router.route('/register')
      .post(Middleware.register, controller.register);

    this.router.route('/verify')
      .get(Middleware.verify, controller.verify);

    this.router.route('/password/send')
      .post(Middleware.sendPasswordResetCode, controller.sendPasswordResetCode);
  }
}
