import { body, header } from 'express-validator';
import { ValidatorMiddleware } from '../../middlewares/validator.middleware';

export class Middleware {
  static findByUser = [
    header('authorization')
      .isString().withMessage('O campo "token" deve ser uma string')
      .bail(),
    ValidatorMiddleware,
  ];

  static createByUser = [
    body('customer')
      .isLength({ min: 5, max: 35 }).withMessage('O campo "customer" deve ser uma string')
      .bail(),
    body('installments')
      .isInt({ min: 0 }).withMessage('O campo "installments" deve um número maior que zero')
      .bail(),
    body('price')
      .isInt({ min: 0 }).withMessage('O campo "price" deve um número maior que zero')
      .bail(),
    ValidatorMiddleware,
  ];

  static deleteByUser = [
    header('authorization')
      .isString().withMessage('O campo "token" deve ser uma string')
      .bail(),
    ValidatorMiddleware,
  ];

  static updateByUser = [
    header('authorization')
      .isString().withMessage('O campo "token" deve ser uma string')
      .bail(),
    ValidatorMiddleware,
  ];
}
