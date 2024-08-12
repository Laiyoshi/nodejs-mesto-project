import { NextFunction, Request, Response } from "express";
import Card from "../models/card";
import { UserRequest } from "utils/types";

const UserError = require("../errors/user-err.ts");

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  return Card.find({})
    .then((cards) => res.status(201).send({ data: cards }))
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
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        next(
          new UserError(
            "Переданы некорректные данные при создании карточки",
            400
          )
        );
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  return Card.findByIdAndDelete({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        throw new UserError("Карточка не найдена", 404);
      }
      res.send({ data: card });
    })
    .catch(next);
};

export const likeCard = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true }
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        next(err);
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true }
  )
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        next(err);
      } else {
        next(err);
      }
    });
};
