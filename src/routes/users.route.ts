import { UserControllers, usersControllers } from "../controllers/users.controller";
import { validateMongooseId } from "../middlewares/mongoose";
import {validateUser} from '../middlewares/userValidate'
import { userValidation } from "../schemas/userValidation.schema";
import express, { NextFunction, Request, Response } from 'express'
import { ZodSchema } from "zod";
import { StatusCode } from "../utils/consts";


const Schema: ZodSchema = userValidation;
const Route = express.Router()

  // get all users
  Route.get('/users', usersControllers.getUsers);
  //get one user
  Route.get(`/:id`, validateMongooseId, usersControllers.getUserById);

  //create user
  Route.post('/auth/signup', validateUser(Schema), async (req: Request, res: Response, _next: NextFunction) =>{
      try{
        const controller = new UserControllers()
        const requestBody = req.body;
        const response = await controller.Signup(requestBody)
        
        res.status(StatusCode.Created).send(response)
      }catch(error: unknown){
        _next(error)
      }
  });

  //update user
  Route.patch(`/:id`, validateMongooseId, usersControllers.updateUser);

  //delete user
  Route.delete(`/:id`, validateMongooseId, usersControllers.deleteUser);

  //delete all users
  Route.delete('/', usersControllers.deleteAllusers )



export {Route}