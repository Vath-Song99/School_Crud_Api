import { NextFunction, Request, Response } from "express";
import { User } from "../types/users";
const UserModel = require("../models/users.model");

export const usersControllers = {
  getUsers: async (
    req: Request,
    res: Response,
    _next: NextFunction
    
  ): Promise<void> => {
    try {
      const usersData: User = await UserModel.find({});
      res.json({data: usersData});

      //get time user request
    } catch (error: object | any) {
      _next(new Error("Internal Server Error"));
    }
  },

  getUserById: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { id } = req.params;

      const userData: User | null = await UserModel.findById(id);

      if (!userData) {
        throw new Error("Not Found");
      }

      res.status(200).json({
        data: userData,
      });
    } catch (error: { message: string } | any) {
      _next(new Error(error.message));
    }
  },

  createUsers: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const userData: User = {
        username: req.body.username,
        age: req.body.age,
      };

      const user = await UserModel(userData);
      user.save();
      res.json(user);
    } catch (error: { message: string } | any) {
      _next(new Error("Internal Server Error"));
    }
  },

  updateUser: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const data: User = {
        username: req.body.username,
        age: req.body.age,
      };

      await UserModel.findByIdAndUpdate(id, data);
      const updated = await UserModel.findById(id);
      res.json(updated);
    } catch (error: { message: string } | any) {
      _next(new Error("Internal Server Error"));
    }
  },

  deleteUser: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      await UserModel.deleteOne({ _id: id });
      res.json({
        message: "Delete successfully!",
        error: false,
      });
    } catch (error: { message: string } | any) {
      _next(new Error("Internal Server Error"));
    }
  },
};
