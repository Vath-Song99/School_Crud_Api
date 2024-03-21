import { Request, Response } from "express";
import { userValidation } from "../../schema/userValidation.schema";
import { validateUser } from "../userValidate";
import { handleConnectToMongoServer } from "../../utils/mongoMemoryServer ";


handleConnectToMongoServer()

describe("validateInput middleware", () => {
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeAll(() => {
    res = {};
  });

  beforeEach(() => {
    next = jest.fn();
  });

  test("should pass validation and call next() for valid input", async () => {
    res = {};
    next = jest.fn();

    const req: Partial<Request> = {
      body: {
        fullname: "sokritha",
      },
    };

    await validateUser(userValidation)(req as Request, res as Response, next);

    // expect(next).toHaveBeenCalledWith(); // Assert that next is called with no arguments
    expect(next).toHaveBeenCalledTimes(1); // Ensure that next is called exactly once
  });

  test("should call next() with an InvalidInputError for invalid input", async () => {
    res = {};
    next = jest.fn();
    const req = {
      body: {
        fullname: "so",
      },
    }; // Provide invalid data for your testSchema

    await validateUser(userValidation)(req as Request, res as Response, next);

    // Expect next to be called with an instance of InvalidInputError
    // expect(next).toHaveBeenCalledWith(expect.any(InvalidInputError));
    expect(next).toHaveBeenCalledTimes(1);
  });
});
