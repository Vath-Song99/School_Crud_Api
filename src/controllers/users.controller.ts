import { NextFunction, Request, Response } from "express";
// import { User } from "../types/users";
import { BaseCustomError } from "../utils/baseCustomError";
import { UserType } from "../schema/userValidation.schema";
import { StatusCode } from "../utils/consts";
import { UsersServices } from "../services/usersServices";

const userServices = new UsersServices();

export const usersControllers = {
  getUsers: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const usersData: UserType | null = await userServices.getUsers();

      if (!usersData) {
        throw new Error("No data found!");
      }
      res
        .status(StatusCode.OK)
        .json({ message: "GET success", data: usersData });
    } catch (error: unknown | any) {
      _next(new BaseCustomError(error.message, StatusCode.InternalServerError));
    }
  },

  getUserById: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;

      const userData: UserType | null = await userServices.getUserById(id);

      if (!userData) {
        throw new Error("no user Found");
      }
      res.status(200).json({
        message: "found success",
        data: userData,
      });
    } catch (error: unknown | any) {
      _next(new BaseCustomError(error.message, StatusCode.InternalServerError));
    }
  },

  createUsers: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const userData: UserType = {
        username: req.body.username,
        age: req.body.age,
      };

      const user: UserType | null = await userServices.createUser(userData);

      if (!user) {
        throw new Error("user not created!");
      }
      res.status(StatusCode.Created).json({
        message: "POST success",
        data: user,
      });
    } catch (error: unknown | any) {
      _next(new BaseCustomError(error.message, StatusCode.InternalServerError));
    }
  },

  updateUser: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const data: UserType = {
        username: req.body.username,
        age: req.body.age,
      };

      const updated = await userServices.updateUser(id, data);

      if (!updated) {
        throw new Error("user could be not updated!");
      }
      res.status(StatusCode.OK).json({
        message: "PATCH success",
        data: updated,
      });
    } catch (error: unknown | any) {
      _next(new BaseCustomError(error.message, StatusCode.InternalServerError));
    }
  },

  deleteUser: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const deleted = await userServices.deleteOneUser(id);

      console.log(deleted);
      if (deleted.deletedCount === 0) {
        throw new Error("user could be not deleted!");
      }
      res.status(StatusCode.OK).json({
        message: "DELETE successfully!",
        error: false,
      });
    } catch (error: unknown | any) {
      _next(new BaseCustomError(error.message, StatusCode.InternalServerError));
    }
  },
  deleteAllusers: async (req: Request, res: Response, _next: NextFunction) =>{
    try{
      const deleted = await userServices.deleteAllUsers()

      if(!deleted){
        throw new Error('users could be not deleted!');
      }

      res.status(StatusCode.OK).json({
        message: "DELETE successfully!",
        error: false
      })

    }catch(error: unknown | any){
      _next(new BaseCustomError(error.message, StatusCode.InternalServerError
        ))
    }
  }
};
