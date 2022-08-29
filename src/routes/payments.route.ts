import { Router } from 'express';
import { Controller } from '../controllers/payments.controller';
import { Middleware } from '../middleware/payments.middleware';

const controller = new Controller();

export const router = Router();

router.route('/me')
  .get(Middleware.findByUser, controller.findByUser);
