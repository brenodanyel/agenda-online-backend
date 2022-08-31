import { Router as ExpressRouter } from 'express';
import { Controller } from './payments.controller';
import { Middleware } from './payments.middleware';

export class Router {
  public router = ExpressRouter();

  constructor(controller = new Controller()) {
    this.router.route('/me')
      .get(Middleware.findByUser, controller.findByUser)
      .post(Middleware.createByUser, controller.createByUser);

    this.router.route('/me/:id')
      .patch(Middleware.updateByUser, controller.updateByUser)
      .delete(Middleware.deleteByUser, controller.deleteByUser);
  }
}
