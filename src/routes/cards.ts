import { Router } from 'express';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/cards';
import { cardIdValidate, cardValidate } from '../middlewares/validations';

const cardsRouter = Router();

cardsRouter.get('/', getCards);
cardsRouter.post('/', cardValidate, createCard);
cardsRouter.delete('/:cardId', cardIdValidate, deleteCard);
cardsRouter.put('/:cardId/likes', cardIdValidate, likeCard);
cardsRouter.delete('/:cardId/likes', cardIdValidate, dislikeCard);

export default cardsRouter;
