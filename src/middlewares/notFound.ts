import { NextFunction, Request, Response } from 'express';
import { STATUS_CODE } from '../utils/constants';
import CustomError from '../errors/custom-errors';

export function notFound(req: Request, res: Response, next: NextFunction) {
  next(new CustomError(STATUS_CODE.NOT_FOUND, 'Запрашиваемый ресурс не найден'));
}
