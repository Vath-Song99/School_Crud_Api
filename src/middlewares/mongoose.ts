import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import {BaseCustomError} from '../errors/baseCustomError'
import { StatusCode } from "../utils/consts";

const validateMongooseId = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    const customError = new BaseCustomError('Id is invalid', StatusCode.NotFound);
    _next(customError);
  }
  _next();
};

export { validateMongooseId };