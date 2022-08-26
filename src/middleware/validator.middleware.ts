import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const ValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return;
  }

  next();
};
