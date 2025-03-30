import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../utils/constants';
import Card from '../models/card';

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
    .then((card) => res.status(STATUS_CODES.CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error('Некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
}

export async function deleteCard(req: Request, res: Response, next: NextFunction) {
  return Card.findById(req.params.cardId)
    .orFail(new Error('Карточки не существует'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        next(new Error('Ошибка прав доступа'));
      } else {
        Card.findByIdAndDelete(req.params.cardId)
          .then((cardInfo) => res.send(cardInfo))
          .catch(next);
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
    .orFail(() => new Error('Карточки не существует'))
    .then((card) => res.status(STATUS_CODES.OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error('Некорректные данные'));
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
    .orFail(() => new Error('Карточки не существует'))
    .then((card) => res.status(STATUS_CODES.OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error('Некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
}
