import { ErrorRequestHandler } from 'express';
import { STATUS_CODE } from '../utils/constants';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send(err.message);
    return;
  }
  res
    .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
    .send({ message: 'На сервере произошла ошибка' });
  next();
};

export { errorHandler };
