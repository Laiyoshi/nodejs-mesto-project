import { Router } from 'express';
import { regExp } from '../utils/config';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';

const { celebrate, Joi } = require('celebrate');

const router = Router();

router.get('/', getCards);
router.post(
  '/',
  celebrate({
    body: Joi.object({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().pattern(regExp).required(),
    }),
  }),
  createCard,
);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCard,
);
router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  likeCard,
);
router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  dislikeCard,
);

export default router;
