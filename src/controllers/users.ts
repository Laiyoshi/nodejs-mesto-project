import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { UserRequest } from "utils/types";

const UserError = require("../errors/user-err.ts");

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  return User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  return User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      if (!user) {
        throw new UserError.IncorrectData("Некорректные данные пользователя");
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const updateUserInfo = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, about } = req.body;
  const id = req.user?._id;
  return User.findByIdAndUpdate(id, { name, about }, { new: true })
    .then((user) => {
      if (!user?._id) {
        throw new UserError.NotFoundData("Пользователь не найден");
      }
      if (!user) {
        throw new UserError.IncorrectData("Переданые некорректные данные");
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const updateUserAvatar = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;
  const id = req.user?._id;
  return User.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((avatar) => {
      if (!avatar) {
        throw new UserError.IncorrectData("Переданые некорректные данные");
      }
      res.send({ data: avatar });
    })
    .catch(next);
};
