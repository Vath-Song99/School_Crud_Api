import { UserControllers } from "../../controllers/users.controller";
import { validateMongooseId } from "../../middlewares/mongoose";
import {validateUser} from '../../middlewares/userValidate'
import { userValidation } from "../../schemas/userValidation.schema";
import express, { NextFunction, Request, Response } from 'express'
import { ZodSchema } from "zod";
import { StatusCode } from "../../utils/consts";
import { PATH_AUTH, PATH_GET, PATH_LOGIN } from "./userPath";
import { Options } from "../@types/userRoute";

const Schema: ZodSchema = userValidation;
const Route = express.Router()


  // get all users
  Route.get(`${PATH_GET}`, async (req: Request, res: Response, _next: NextFunction) =>{
     try{
        const { page = 1 , limit = 5} = req.query;

        const options:Options = {
          page: parseInt(page as string, 10),
          limit: parseInt(limit as string, 10),
      };
        const controller = new UserControllers();
        const response = await controller.GetUsers(options);

        res.status(StatusCode.OK).json({
          message: "GET success",
          users: response.user,
          paginate: response.paginate
        })
     }catch(error: unknown){
      _next(error)
     }

  });
  //get one user
  Route.get(`${PATH_GET}/:userId`, validateMongooseId, async (req: Request, res: Response, _next: NextFunction) =>{
    try{

      const controller = new UserControllers();
      const  { userId }= req.params;
      const response = await controller.GetUserById(userId)

      res.status(StatusCode.OK).json({
        message: "GET success",
        user: response
      })
    }catch(error: unknown){
      _next(error)
    }
  });

  //create user
  Route.post(PATH_AUTH, validateUser(Schema), async (req: Request, res: Response, _next: NextFunction) =>{
      try{
        const controller = new UserControllers()
        const requestBody = req.body;
        const response = await controller.Signup(requestBody)
        
        res.status(StatusCode.Created).json({
          message: "POST success",
          user: response
        })
      }catch(error: unknown){
        _next(error)
      }
  });

  Route.post(PATH_LOGIN, async(req: Request, res: Response,_next: NextFunction) =>{
    try{
      const requestBody = req.body
      const controller = new UserControllers();
      const response = await controller.Login(requestBody);

      res.status(StatusCode.OK).json({
        message: "LOGIN success",
        user: response.user,
        token: response.token
      })

    }catch(error: unknown){
      _next(error)
    }
  })

  Route.get(`${PATH_AUTH}/verify`,async (req: Request, res: Response, _next: NextFunction) =>{
      try{
      const token = req.query.token as string
      const controller = new UserControllers();
      const response = await controller.VerifyEmail(token);

      res.status(StatusCode.OK).json({
        message: "Verify Success",
        token: response.token
      })

      }catch(error: unknown){
        _next(error)
      }
  })


  //update user
  Route.patch(`${PATH_GET}/:userId`, validateMongooseId, async (req: Request, res: Response, _next: NextFunction)=>{
    try{

      const controller = new UserControllers();
      const { userId } = req.params;
      const requestBody = req.body
      const response = await controller.UpdateUser(userId, requestBody)

      res.status(StatusCode.OK).json({
        message: "PATCH success",
        user: response
      })
    }catch(error: unknown){
      _next(error)
    }
  });

  //delete user
  Route.delete(`${PATH_GET}/:userId`, validateMongooseId, async (req: Request, res: Response, _next: NextFunction) =>{
    try{

      const { userId } = req.params;
      const controller = new UserControllers();
      const response = await controller.DeleteUser(userId);

      res.status(StatusCode.OK).json({
        message: "DELETE success",
        user: response
      })
    }catch(error: unknown){
      _next(error)
    }
  });

  //delete all users
  // Route.delete(PATH_GET, usersControllers.deleteAllusers )

export {Route}