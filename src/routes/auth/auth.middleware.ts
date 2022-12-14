import { body, header } from 'express-validator';
import { ValidatorMiddleware } from '../../middlewares/validator.middleware';

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

  static register = [
    body('username')
      .isString().withMessage('O campo "username" deve ser uma string')
      .bail()
      .isLength({ min: 4, max: 15 }).withMessage('O campo "username" deve ter entre 4 e 15 caracteres')
      .bail(),
    body('email')
      .isString().withMessage('O campo "email" deve ser uma string')
      .bail()
      .isEmail().withMessage('O campo "email" deve ser um e-mail válido')
      .bail(),
    body('password')
      .isString().withMessage('O campo "password" deve ser uma string')
      .bail()
      .isLength({ min: 4, max: 35 }).withMessage('O campo "password" deve ter entre 4 e 35 caracteres')
      .trim(),
    ValidatorMiddleware,
  ];

  static verify = [
    header('authorization')
      .isString().withMessage('O campo "token" deve ser uma string')
      .bail(),
    ValidatorMiddleware,
  ];

  static sendPasswordResetCode = [
    body('username')
      .isString().withMessage('O campo "username" deve ser uma string')
      .bail()
      .isLength({ min: 5 }).withMessage('O campo "username" deve ter pelo menos 5 caracteres')
      .bail(),
    ValidatorMiddleware,
  ];

  static resetPassword = [
    body('username')
      .isString().withMessage('O campo "username" deve ser uma string')
      .bail()
      .isLength({ min: 5 }).withMessage('O campo "username" deve ter pelo menos 5 caracteres')
      .bail(),
    body('password')
      .isString().withMessage('O campo "password" deve ser uma string')
      .bail()
      .isLength({ min: 4, max: 35 }).withMessage('O campo "password" deve ter entre 4 e 35 caracteres')
      .bail(),
    body('code')
      .isString().withMessage('O campo "code" deve ser uma string')
      .bail()
      .isLength({ min: 3 }).withMessage('O campo "code" deve ter pelo menos 3 caracteres')
      .bail(),
    ValidatorMiddleware,
  ];
}
