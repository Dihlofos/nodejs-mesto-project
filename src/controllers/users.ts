import { NextFunction, Request, Response } from 'express';
import CustomError from '../errors/custom-errors';
import User, { IUser } from '../models/user';
import { STATUS_CODE } from '../utils/constants';

export function getUser(req: Request, res: Response, next: NextFunction) {
  return User.findOne({ _id: req.params.userId })
    .orFail(() => new CustomError(STATUS_CODE.NOT_FOUND, 'Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CustomError(STATUS_CODE.BAD_REQUEST, 'Некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
}

export function getUsers(_req: Request, res: Response, next: NextFunction) {
  return User.find({})
    .then((users) => res.send(users))
    .catch(next);
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const {
    name, about, avatar,
  } = req.body;

  return User.create({
    name,
    about,
    avatar,
  })
    .then((user: IUser) => {
      res.status(STATUS_CODE.CREATED).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CustomError(STATUS_CODE.BAD_REQUEST, 'Некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
}

export function updateUser(req: Request, res: Response, next: NextFunction) {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new CustomError(STATUS_CODE.NOT_FOUND, 'Пользователя не существует'))
    .then((user) => res.status(STATUS_CODE.OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CustomError(STATUS_CODE.BAD_REQUEST, 'Некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
}

export function updateUserAvatar(req: Request, res: Response, next: NextFunction) {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new CustomError(STATUS_CODE.NOT_FOUND, 'Пользователя не существует'))
    .then((user) => res.status(STATUS_CODE.OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CustomError(STATUS_CODE.BAD_REQUEST, 'Некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
}
