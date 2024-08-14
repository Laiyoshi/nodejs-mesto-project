import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_KEY } from '../utils/config';

const UserError = require('../errors/user-err');

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export default (req: AuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UserError('Необходима авторизация', 401);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    next(new UserError('Необходима авторизация', 401));
  }

  req.user = payload;

  next();
};
