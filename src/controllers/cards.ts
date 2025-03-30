import { Request, Response, NextFunction } from 'express';
import { STATUS_CODE } from '../utils/constants';
import Card from '../models/card';
import CustomError from '../errors/custom-errors';

export async function getCards(req: Request, res: Response, next: NextFunction) {
  return Card.find({})
    .then((users) => res.send(users))
    .catch(next);
}

export async function createCard(req: Request, res: Response, next: NextFunction) {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({
    name,
    link,
    owner,
  })
    .then((card) => res.status(STATUS_CODE.CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CustomError(STATUS_CODE.BAD_REQUEST, 'Некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
}

export async function deleteCard(req: Request, res: Response, next: NextFunction) {
  return Card.findById(req.params.cardId)
    .orFail(new CustomError(STATUS_CODE.NOT_FOUND, 'Карточки не существует'))
    .then(() => {
      Card.findByIdAndDelete(req.params.cardId)
        .then((cardInfo) => res.send(cardInfo));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CustomError(STATUS_CODE.BAD_REQUEST, 'Некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
}

export async function likeCard(req: Request, res: Response, next: NextFunction) {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new CustomError(STATUS_CODE.NOT_FOUND, 'Карточки не существует'))
    .then((card) => res.status(STATUS_CODE.OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CustomError(STATUS_CODE.BAD_REQUEST, 'Некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
}

export async function dislikeCard(req: Request, res: Response, next: NextFunction) {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new CustomError(STATUS_CODE.NOT_FOUND, 'Карточки не существует'))
    .then((card) => res.status(STATUS_CODE.OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CustomError(STATUS_CODE.BAD_REQUEST, 'Некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
}
