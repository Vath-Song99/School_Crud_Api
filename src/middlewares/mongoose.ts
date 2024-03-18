import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import {BaseCustomError} from '../utils/baseCustomError'
import { StatusCode } from "../utils/consts";

const validateMongooseId = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    const customError = new BaseCustomError('id Invalide', StatusCode.NotFound);
    _next(customError);
  }
  _next();
};

export { validateMongooseId };