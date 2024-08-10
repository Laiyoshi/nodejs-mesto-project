import { NextFunction, Request, Response } from "express";
import Card from "../models/card";
import { UserRequest } from "utils/types";

const UserError = require("../errors/user-err.ts");

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  return Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const createCard = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  return Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new UserError.IncorrectData(
          "Переданы некорректные данные при создании карточки"
        );
      }
      res.send({ data: card });
    })
    .catch(next);
};

export const deleteCard = (req: Request, res: Response) => {
  return Card.findByIdAndDelete(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const likeCard = (req: UserRequest, res: Response) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new UserError.IncorrectData(
          "Переданы некорректные данные при создании карточки"
        );
      }
      res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const dislikeCard = (req: UserRequest, res: Response) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new UserError.IncorrectData(
          "Переданы некорректные данные при создании карточки"
        );
      }
      res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};
