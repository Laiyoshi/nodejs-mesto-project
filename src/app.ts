import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users";
import cardsRouter from "./routes/cards";
import { UserRequest } from "utils/types";
import { IError } from "errors/user-err";

const helmet = require("helmet");
const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use(helmet());
app.use((req: UserRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: "66b76aa926e8c917cba2a930",
  };

  next();
});
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use("*", (req: Request, res: Response) => {
  res.status(404).send({ message: "Запрашиваемая страница не найдена" });
});

app.use((err: IError, req: UserRequest, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
