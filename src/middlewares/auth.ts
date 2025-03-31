// Auth Mock
import { NextFunction, Request, Response } from 'express';
import { STATUS_CODE } from '../utils/constants';
import CustomError from '../errors/custom-errors';

const jwt = require('jsonwebtoken');

export function auth(req: Request, res: Response, next: NextFunction) {
  const { cookie } = req.headers;

  if (!cookie || !cookie.startsWith('jwt=')) {
    next(new CustomError(STATUS_CODE.UNAUTHORIZED, 'Вы не авторизованы'));
    return;
  }

  const token = cookie.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, 'key');
  } catch {
    next(new CustomError(STATUS_CODE.UNAUTHORIZED, 'Вы не авторизованы'));
    return;
  }

  req.user = payload;

  next();
}
