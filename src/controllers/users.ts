import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRequest } from '../utils/types';
import { JWT_KEY } from '../utils/config';
import User from '../models/user';

const UserError = require('../errors/user-err.ts');

export const getUsers = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

export const getUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new UserError('Пользователь не найден', 404);
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, email, password, about, avatar,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then(() => {
      User.create({
        name, email, about, avatar,
      })
        .then((user) => {
          res.status(201).send({ data: user });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(
              new UserError('Пользователь с таким email уже существует', 409),
            );
          }
          if (err.name === 'ValidationError') {
            next(
              new UserError(
                'Некорректные данные при создании пользователя',
                400,
              ),
            );
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

export const getUserInfo = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  const id = req.user?._id;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new UserError('Пользователь с таким id не найден', 404);
      }
      res.send({ data: user });
    })
    .catch(next);
};

export const updateUserInfo = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;
  const id = req.user;
  return User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user?._id) {
        throw new UserError.NotFoundData('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new UserError(
            'Переданы некорректные данные при изменении пользователя',
            400,
          ),
        );
      }
      next(err);
    });
};

export const updateUserAvatar = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  const id = req.user?._id;
  return User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((data) => {
      res.send({ data });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new UserError('Переданы некорректные данные при обновлении фото', 400),
        );
      }
      next(err);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.id }, JWT_KEY, {
        expiresIn: '7d',
      });

      res.send({ token });
    })
    .catch(next);
};
