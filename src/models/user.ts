import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const UserError = require("../errors/user-err.ts");
let validator = require("validator");

interface IUser {
  name: string;
  email: string;
  password: string;
  about: string;
  avatar: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
}

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: false,
      default: "Жак-Ив Кусто",
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "Некорректный e-mail",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    about: {
      type: String,
      required: false,
      default: "Исследователь",
      minlength: 2,
      maxlength: 300,
    },
    avatar: {
      type: String,
      required: false,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator: (v: string) => validator.isURL(v),
        message: "Некорректный URL",
      },
    },
  },
  { versionKey: false }
);
userSchema.static(
  "findUserByCredentials",
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select("+password")
      .then((user) => {
        if (!user) {
          throw new UserError("Неверный e-mail или пароль!", 401);
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            throw new UserError("Неверный e-mail или пароль!", 401);
          }

          return user;
        });
      });
  }
);

export default mongoose.model<IUser, UserModel>("user", userSchema);
