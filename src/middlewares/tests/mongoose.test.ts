import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { validateMongooseId } from "../mongoose";
import { BaseCustomError } from "../../errors/baseCustomError";
import { StatusCode } from "../../utils/consts";
import { handleConnectToMongoServer } from "../../utils/mongoMemoryServer ";


handleConnectToMongoServer();

jest.mock("mongoose");

describe("validateMongooseId middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: { id: "" }
    };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should call next if the id is a valid mongoose ObjectId", async () => {
    const validId = "6600f153d56a702191098732";
    req.params!.id = validId;
    (mongoose.isValidObjectId as jest.Mock).mockReturnValueOnce(true);

    await validateMongooseId(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next with an error if the id is not a valid mongoose ObjectId", async () => {
    const invalidId = "6600f153d56a70219109";
    req.params!.id = invalidId;
    (mongoose.isValidObjectId as jest.Mock).mockReturnValueOnce(false);

    await validateMongooseId(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledWith(
      new BaseCustomError("Id is invalid", StatusCode.NotFound)
    );
  });
});
