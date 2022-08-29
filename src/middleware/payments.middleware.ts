import { header } from 'express-validator';
import { ValidatorMiddleware } from './validator.middleware';

export class Middleware {
  static findByUser = [
    header('authorization')
      .isString().withMessage('O campo "token" deve ser uma string')
      .bail(),
    ValidatorMiddleware,
  ];
}
