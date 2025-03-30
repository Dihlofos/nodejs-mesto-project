import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { STATUS_CODES } from '../utils/constants';

const SALT_LENGTH = 16;

export async function getUser(req: Request, res: Response, next: NextFunction) {
  const user = await User.findById(req.params.userId);
  return user
    ? res.send(user)
    : next(new Error('User not found'));
}

export async function getUsers(_req: Request, res: Response) {
  return res.send(await User.find());
}

export async function createUser(req: Request, res: Response) {
  const {
    email, password, name, about, avatar,
  } = req.body;
  const {
    _id,
  } = await User.create({
    email,
    password: await bcrypt.hash(password, SALT_LENGTH),
    name,
    about,
    avatar,
  });

  return res.status(201).send({
    _id,
    name,
    about,
    avatar,
    email,
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
    .orFail(() => new Error('Пользователя не существует'))
    .then((user) => res.status(STATUS_CODES.OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error('Некорректные данные'));
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
    .orFail(() => new Error('Пользователя не существует'))
    .then((user) => res.status(STATUS_CODES.OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error('Некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
}
