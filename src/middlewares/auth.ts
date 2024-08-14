import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const UserError = require("../errors/user-err.ts");

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export default (req: AuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UserError("Необходима авторизация", 401));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, "super-strong-key");
  } catch (err) {
    return next(new UserError("Необходима авторизация", 401));
  }

  req.user = payload;

  next();
};
