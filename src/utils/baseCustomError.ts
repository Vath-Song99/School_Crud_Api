export class BaseCustomError extends Error {
    [x: string]: any;
    constructor(message: string | undefined, statusCode: number) {
      super(message); // Call the super constructor (Error class)
      this.statusCode = statusCode; // Custom property to hold status code
      this.name = this.constructor.name; // Set the name of the error to the class name
      Error.captureStackTrace(this, this.constructor); // Capture stack trace
    }
  }