import { UserControllers } from "../../controllers/users.controller";
import { validateMongooseId } from "../../middlewares/mongoose";
import { validateUser } from "../../middlewares/userValidate";
import {
  userLoginValidate,
  userSignupValidation,
} from "../../schemas/userValidation.schema";
import express, { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { StatusCode } from "../../utils/consts";
import { PATH_ROUTE } from "./userDefs";
import { Options } from "../@types/userRoute";
import { BaseCustomError } from "../../errors/baseCustomError";
import { authConfigUrl } from "../../utils/googleConfig";

const Schema: ZodSchema = userSignupValidation;
const Route = express.Router();

// get all users
Route.get(
  `${PATH_ROUTE.PATH_GET}`,
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { page = 1, limit = 5, name } = req.query;

      const options: Options = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        name: name as string,
      };
      const controller = new UserControllers();
      const response = await controller.GetUsers(options);

      res.status(StatusCode.OK).json({
        message: "GET success",
        users: response.user,
        paginate: response.paginate,
      });
    } catch (error: unknown) {
      _next(error);
    }
  }
);
//get one user
Route.get(
  `${PATH_ROUTE.PATH_GET}/:userId`,
  validateMongooseId,
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const controller = new UserControllers();
      const { userId } = req.params;
      const response = await controller.GetUserById(userId);

      res.status(StatusCode.OK).json({
        message: "GET success",
        user: response,
      });
    } catch (error: unknown) {
      _next(error);
    }
  }
);

//create user
Route.post(
  PATH_ROUTE.PATH_AUTH,
  validateUser(Schema),
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const controller = new UserControllers();
      const requestBody = req.body;
      const response = await controller.Signup(requestBody);

      res.status(StatusCode.Created).json({
        message: "POST success",
        user: response,
      });
    } catch (error: unknown) {
      _next(error);
    }
  }
);

Route.post(
  PATH_ROUTE.PATH_LOGIN,
  validateUser(userLoginValidate),
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const requestBody = req.body;
      const controller = new UserControllers();
      const response = await controller.Login(requestBody);

      res.status(StatusCode.OK).json({
        message: "LOGIN success",
        user: response.user,
        token: response.token,
      });
    } catch (error: unknown) {
      _next(error);
    }
  }
);

Route.get(
  `${PATH_ROUTE.PATH_AUTH}/verify`,
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const token = req.query.token as string;
      const controller = new UserControllers();
      const response = await controller.VerifyEmail(token);

      res.status(StatusCode.OK).json({
        message: "Verify Success",
        token: response.token,
      });
    } catch (error: unknown) {
      _next(error);
    }
  }
);

//update user
Route.patch(
  `${PATH_ROUTE.PATH_GET}/:userId`,
  validateMongooseId,
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const controller = new UserControllers();
      const { userId } = req.params;
      const requestBody = req.body;
      const response = await controller.UpdateUser(userId, requestBody);

      res.status(StatusCode.OK).json({
        message: "PATCH success",
        user: response,
      });
    } catch (error: unknown) {
      _next(error);
    }
  }
);

//delete user
Route.delete(
  `${PATH_ROUTE.PATH_GET}/:userId`,
  validateMongooseId,
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { userId } = req.params;
      const controller = new UserControllers();
      const response = await controller.DeleteUser(userId);

      res.status(StatusCode.OK).json({
        message: "DELETE success",
        user: response,
      });
    } catch (error: unknown) {
      _next(error);
    }
  }
);
//signin with google

// Route.get(
//   PATH_ROUTE.PATH_GOOGLE,
//   async (req: Request, res: Response, _next: NextFunction) => {
//     try {
//       const redirectUri = process.env.REDIRECT_URL as string;
//       const clienId = process.env.GOOGLE_CLIENT_ID as string;

//       const authUrl = await authConfigUrl(clienId, redirectUri);
//       res.redirect(authUrl);
//     } catch (error: unknown) {
//       _next(error);
//     }
//   }
// );

//Signin callback with google
Route.get(
  PATH_ROUTE.PATH_GOOGLE_CALLBACK,
  async (req: Request, res: Response, _next: NextFunction) => {
    const { code } = req.query;
    if (code || typeof code === "string") {
      try {
        // const queryCode = code as string;
        // const controller = new UserControllers();
        // const userInfoResponse = await controller.GoogleAuthCallBack(queryCode);

        // res.status(StatusCode.OK).json({
        //   message: "Sigin success",
        //   user: userInfoResponse?.userInfoResponse?.data,
        //   token: userInfoResponse?.accessToken,
        // });
      } catch (error: unknown) {
        _next(error);
      }
    }
    
      console.log("Missing authorization code", StatusCode.BadRequest)
    
  }
);

//delete all users
// Route.delete(PATH_GET, usersControllers.deleteAllusers )

export { Route };
