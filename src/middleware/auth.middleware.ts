import { body } from 'express-validator';
import { ValidatorMiddleware } from './validator.middleware';

export class Middleware {
  static login = [
    body('username')
      .isString().withMessage('O campo "username" deve ser uma string')
      .bail()
      .isLength({ min: 4, max: 15 }).withMessage('O campo "username" deve ter entre 4 e 15 caracteres')
      .bail(),
    body('password')
      .isString().withMessage('O campo "password" deve ser uma string')
      .bail()
      .isLength({ min: 4, max: 35 }).withMessage('O campo "password" deve ter entre 4 e 35 caracteres')
      .trim(),
    ValidatorMiddleware,
  ];
}
