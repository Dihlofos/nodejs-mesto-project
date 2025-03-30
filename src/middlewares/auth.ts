// Auth Mock
import { NextFunction, Request, Response } from 'express';

export function auth(req: Request, _res: Response, next: NextFunction) {
  req.user = {
    _id: '67e8db39372cc89c98a2ee68',
  };

  next();
}
