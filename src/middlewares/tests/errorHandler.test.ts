import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { BaseCustomError } from "../../utils/baseCustomError";
import { StatusCode } from "../../utils/consts";
import { handleConnectToMongoServer } from "../../utils/mongoMemoryServer ";
import { validateMongooseId } from "../mongoose";
import errorHandler from "../errorHandler";


handleConnectToMongoServer();

describe('Test Error handler ', () =>{
    let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
 
    };
    next = jest.fn();
  });

  test('handle BaseCumtomError Correctly', () =>{
    const mockError = new BaseCustomError("Test error", StatusCode.BadRequest);

    errorHandler(mockError, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(StatusCode.BadRequest);
    // expect(res.message).toHaveBeenCalledWith(StatusCode.BadRequest);
    // expect(res.json).toHaveBeenCalledWith(mockError.serializeErrorOutput());
  })


})