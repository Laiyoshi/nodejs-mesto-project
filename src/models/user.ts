import mongoose from "mongoose";

let validator = require("validator");

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    about: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 300,
    },
    avatar: {
      type: String,
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: "Некорректный URL",
      },
    },
  },
  { versionKey: false }
);

export default mongoose.model<IUser>("user", userSchema);
