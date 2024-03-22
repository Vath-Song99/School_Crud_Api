import { StatusCode } from "../utils/consts";
import { BaseCustomError } from "./baseCustomError";

export default class APIError extends BaseCustomError{

    constructor(message: string | undefined, statusCode: number = StatusCode.InternalServerError){
        super(message,statusCode);
        
    Object.setPrototypeOf(this, APIError.prototype);
    }

    
  getStatusCode(): number {
    return this.statusCode;
  }
}