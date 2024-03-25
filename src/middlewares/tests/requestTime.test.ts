import { Request, Response, NextFunction } from "express";
import requestTimeMiddleware from "../requestTime";
import { handleConnectToMongoServer } from "../../utils/mongoMemoryServer ";


handleConnectToMongoServer()

// Mocking console.log
console.log = jest.fn();

describe("requestTimeMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    req = {
      method: 'GET',
      originalUrl: '/test'
    };
    res = {};
    next = jest.fn();
  });

  test("should call next function", () => {
    requestTimeMiddleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  test("should log request time", () => {
    // Call the middleware
    requestTimeMiddleware(req as Request, res as Response, next);
    
    // Extract the timestamp part from the received logs
    const receivedLogs = (console.log as jest.Mock).mock.calls.map(call => call[0]);
    const timestamps = receivedLogs.map(log => log.match(/^\[.*?\]/)?.[0]);

    // Ensure each extracted timestamp matches the expected format
    timestamps.forEach(timestamp => {
      expect(timestamp).toMatch(/^\[\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} GMT[+-]\d{4} \(.+?\)\]$/);
    });
  });
});
