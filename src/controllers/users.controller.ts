import { NextFunction, Request, Response } from "express";
import { UserType } from "../schemas/userValidation.schema";
import { StatusCode } from "../utils/consts";
import { UsersServices } from "../services/usersServices";
import { Body, Post, Route } from "tsoa";

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
      _next(error);
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

      const userData = await userServices.getUserById(id);

      res.status(StatusCode.OK).json({
        message: "found success",
        data: userData,
      });
    } catch (error: unknown) {
      _next(error);
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
        password: req.body.password,
        email: req.body.email,
      };

      const user = await userServices.createUser(userData);

      res.status(StatusCode.Created).json({
        message: "POST success",
        data: user.user,
        token: user.token
      });
    } catch (error: unknown) {
      _next(error);
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
        password: req.body.password,
        email: req.body.email,
      };

      const updated = await userServices.updateUser(id, data);

      res.status(StatusCode.Created).json({
        message: "PATCH success",
        data: updated,
      });
    } catch (error: unknown) {
      _next(error);
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
      _next(error);
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
      _next(error);
    }
  },
};

interface SignUpRequestBody {
  username: string;
  email: string;
  password: string;
  // Add any other properties if present in the Zod schema
}

@Route("/api/v1")
export class UserControllers {
  @Post("/auth/signup")
  
  public async Signup (@Body() requestBody : SignUpRequestBody):Promise <object> {
      try{
        const {username, email , password} = requestBody;

        const UsersService = new UsersServices();
        const newUser = await UsersService.createUser({ username, email , password})
        return newUser.user
      }catch(error: unknown){
        throw error
      }
  }

}