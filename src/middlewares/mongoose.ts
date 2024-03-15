import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

const validateMongooseId = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    _next(new Error("Invalid Id"));
  }
  _next();
};

export { validateMongooseId };
