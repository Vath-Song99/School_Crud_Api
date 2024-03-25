import { usersControllers } from "../controllers/users.controller";
import { validateMongooseId } from "../middlewares/mongoose";
import {validateUser} from '../middlewares/userValidate'
import { userValidation } from "../schemas/userValidation.schema";
import express from 'express'
import { ZodSchema } from "zod";


const Schema: ZodSchema = userValidation;
const Route = express.Router()

  // get all users
  Route.get('/', usersControllers.getUsers);
  //get one user
  Route.get(`/:id`, validateMongooseId, usersControllers.getUserById);

  //create user
  Route.post('/', validateUser(Schema), usersControllers.createUsers);

  //update user
  Route.patch(`/:id`, validateMongooseId, usersControllers.updateUser);

  //delete user
  Route.delete(`/:id`, validateMongooseId, usersControllers.deleteUser);

  //delete all users
  Route.delete('/', usersControllers.deleteAllusers )



export {Route}