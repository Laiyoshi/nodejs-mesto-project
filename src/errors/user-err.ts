import { Error } from "mongoose";

export interface IError extends Error {
  statusCode?: number;
}

class UserError extends Error implements IError {
  public statusCode: number;

  constructor(message: string, status: number) {
    super(message);
    this.statusCode = status;
  }

  IncorrectData(message: string) {
    return new UserError(message, 400);
  }

  NotFoundData(message: string) {
    return new UserError(message, 404);
  }
}

module.exports = UserError;
