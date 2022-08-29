import { Router } from 'express';
import { Controller } from '../controllers/payments.controller';
import { Middleware } from '../middleware/payments.middleware';

const controller = new Controller();

export const router = Router();

router.route('/me')
  .get(Middleware.findByUser, controller.findByUser)
  .post(Middleware.createByUser, controller.createByUser);

router.route('/me/:id')
  .patch(Middleware.updateByUser, controller.updateByUser)
  .delete(Middleware.deleteByUser, controller.deleteByUser);
