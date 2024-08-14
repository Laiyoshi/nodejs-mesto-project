import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { UserRequest } from './utils/types';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { IError } from './errors/user-err';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import { regExp } from './utils/config';

const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const UserError = require('./errors/user-err');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(helmet());

app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      about: Joi.string().min(2).max(200),
      avatar: Joi.string().pattern(regExp),
    }),
  }),
  createUser,
);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new UserError('Страница не найдена', 404));
});

app.use(errorLogger);
app.use(errors());

app.use((err: IError, req: UserRequest, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });

  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
