import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
    });
}

export function getUsers(_req: Request, res: Response, next: NextFunction) {
  return User.find({})
    .then((users) => res.send(users))
    .catch(next);
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash: string) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user: IUser) => {
          res.status(STATUS_CODE.CREATED).send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new CustomError(STATUS_CODE.CONFLICT, 'Пользователь уже существует'));
          } else if (err.name === 'ValidationError') {
            next(new CustomError(STATUS_CODE.BAD_REQUEST, 'Некорректные данные'));
          } else {
            next(err);
          }
        });
    });
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
    });
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
    });
}

export function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'key', {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'ok' });
    })
    .catch(next);
}

export function getUserInfo(req: Request, res: Response, next: NextFunction) {
  return User.findById(req.user._id)
    .orFail(() => new CustomError(STATUS_CODE.NOT_FOUND, 'Пользователя не существует'))
    .then((user) => res.status(STATUS_CODE.OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CustomError(STATUS_CODE.BAD_REQUEST, 'Некорректные данные'));
      } else {
        next(err);
      }
    });
}
