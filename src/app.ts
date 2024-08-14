import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users";
import cardsRouter from "./routes/cards";
import { UserRequest } from "utils/types";
import { IError } from "./errors/user-err";
import { createUser, login } from "./controllers/users";
import auth from "./middlewares/auth";
import { requestLogger, errorLogger } from "./middlewares/logger";
import { regExp } from "utils/regexp";

const helmet = require("helmet");
const { celebrate, Joi } = require("celebrate");

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(helmet());

app.use(requestLogger);

app.post(
  "/signin",
  celebrate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      about: Joi.string().min(2).max(200),
      avatar: Joi.string().pattern(regExp),
    }),
  }),
  createUser
);

app.use(auth);

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use("*", (req: Request, res: Response) => {
  res.status(404).send({ message: "Запрашиваемая страница не найдена" });
});

app.use(errorLogger);

app.use((err: IError, req: UserRequest, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
