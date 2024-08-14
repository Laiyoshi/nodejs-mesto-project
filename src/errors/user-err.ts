// eslint-disable-next-line import/no-import-module-exports
import { Error } from 'mongoose';

export interface IError extends Error {
  statusCode?: number;
}

class UserError extends Error implements IError {
  public statusCode: number;

  constructor(message: string, status: number) {
    super(message);
    this.statusCode = status;
  }
}

module.exports = UserError;
