import { StatusCode } from "../utils/consts";
import { BaseCustomError } from "./baseCustomError";

export class DuplicateError extends BaseCustomError {
  constructor(message: string, statusCode: number = StatusCode.Conflict) {
    super(message, statusCode);

    Object.setPrototypeOf(this, DuplicateError.prototype);
  }
}
