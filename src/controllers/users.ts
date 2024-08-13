import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { UserRequest } from "utils/types";

const UserError = require("../errors/user-err.ts");

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  return User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  return User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new UserError("Пользователь не найден", 404);
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        return next(
          new UserError(
            "Переданы некорректные данные при создании пользователя",
            400
          )
        );
      } else {
        next(err);
      }
    });
};

export const updateUserInfo = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, about } = req.body;
  const id = req.user?._id;
  return User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user?._id) {
        throw new UserError.NotFoundData("Пользователь не найден");
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        return next(
          new UserError(
            "Переданы некорректные данные при изменении пользователя",
            400
          )
        );
      } else {
        next(err);
      }
    });
};

export const updateUserAvatar = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;
  const id = req.user?._id;
  return User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((avatar) => {
      res.status(200).send({ data: avatar });
    })
    .catch((err) => {
      if (err.name == "ValidationError") {
        return next(
          new UserError(
            "Переданы некорректные данные при обновлении фото",
            400
          )
        );
      } else {
        next(err);
      }
    });
};
