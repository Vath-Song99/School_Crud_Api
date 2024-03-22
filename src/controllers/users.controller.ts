import { NextFunction, Request, Response } from "express";
import { BaseCustomError } from "../utils/baseCustomError";
import { UserType } from "../schema/userValidation.schema";
import { StatusCode } from "../utils/consts";
import { UsersServices } from "../services/usersServices";

export const usersControllers = {
  getUsers: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const userServices = new UsersServices();
    try {
      const usersData: UserType | null = await userServices.getUsers();

      res
        .status(StatusCode.OK)
        .json({ message: "GET success", data: usersData });
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        _next(
          new BaseCustomError(error.message, StatusCode.InternalServerError)
        );
      }
    }
  },

  getUserById: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void | Response> => {
    const userServices = new UsersServices();
    // const user =  await userModel.find({});

    try {
      const { id } = req.params;

      const userData: UserType | null = await userServices.getUserById(id);

      res.status(StatusCode.OK).json({
        message: "found success",
        data: userData,
      });
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        _next(
          new BaseCustomError(error.message, StatusCode.InternalServerError)
        );
      }
    }
  },

  createUsers: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const userServices = new UsersServices();

    try {
      const userData: UserType = {
        username: req.body.username,
        age: req.body.age,
      };

      const user: UserType | null = await userServices.createUser(userData);

      res.status(StatusCode.Created).json({
        message: "POST success",
        data: user,
      });
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        _next(
          new BaseCustomError(error.message, StatusCode.InternalServerError)
        );
      }
    }
  },

  updateUser: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const userServices = new UsersServices();
    try {
      const { id } = req.params;

      const data: UserType = {
        username: req.body.username,
        age: req.body.age,
      };

      const updated = await userServices.updateUser(id, data);

      res.status(StatusCode.Created).json({
        message: "PATCH success",
        data: updated,
      });
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        _next(
          new BaseCustomError(error.message, StatusCode.InternalServerError)
        );
      }
    }
  },

  deleteUser: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const userServices = new UsersServices();

    try {
      const { id } = req.params;

      await userServices.deleteOneUser(id);

      res.status(StatusCode.OK).json({
        message: "DELETE successfully!",
        error: false,
      });
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        _next(
          new BaseCustomError(error.message, StatusCode.InternalServerError)
        );
      }
    }
  },
  deleteAllusers: async (req: Request, res: Response, _next: NextFunction) => {
    const userServices = new UsersServices();
    try {
      await userServices.deleteAllUsers();

      res.status(StatusCode.OK).json({
        message: "DELETE successfully!",
        error: false,
      });
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        _next(
          new BaseCustomError(error.message, StatusCode.InternalServerError)
        );
      }
    }
  },
};
