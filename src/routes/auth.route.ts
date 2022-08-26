import { Router } from 'express';
import { Controller } from '../controllers/auth.controller';
import { Middleware } from '../middleware/auth.middleware';

const controller = new Controller();

export const router = Router();

router.route('/login')
  .post(Middleware.login, controller.login);

router.route('/register')
  .post(Middleware.register, controller.register);
