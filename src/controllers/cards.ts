import { NextFunction, Request, Response } from 'express';
import { UserRequest } from '../utils/types';
import Card from '../models/card';

const UserError = require('../errors/user-err.ts');

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch(next);

export const createCard = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new UserError(
            'Переданы некорректные данные при создании карточки',
            400,
          ),
        );
      } else {
        next(err);
      }
    });
};

export const deleteCard = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const currentUser = req.user?._id;
    const currentCard = await Card.findById(cardId);

    if (!currentCard?.id) {
      throw new UserError('Карточка не найдена', 404);
    }

    if (currentCard?.owner.toString() !== currentUser) {
      throw new UserError('Нет прав на удаление текущей карточки', 403);
    }

    await Card.deleteOne({ _id: currentCard?.id });
    res.status(200).send({ data: currentCard });
  } catch (err) {
    next(err);
  }
};

export const likeCard = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user?._id } },
  { new: true },
)
  .then((card) => {
    res.status(200).send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(
        new UserError('Переданы некорректные данные при лайке карточки', 400),
      );
    }
    next(err);
  });

export const dislikeCard = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user?._id } },
  { new: true },
)
  .then((card) => {
    res.status(200).send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(
        new UserError(
          'Переданы некорректные данные при дизлайке карточки',
          400,
        ),
      );
    }
    next(err);
  });
