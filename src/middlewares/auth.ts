// Auth Mock
import { NextFunction, Response } from 'express';

export function auth(req: any, _res: Response, next: NextFunction) {
  req.user = {
    _id: '67e23289866a0e39c2ae64d3',
  };

  next();
}
