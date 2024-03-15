import { Express } from "express";
import { usersControllers } from "../controllers/users.controller";
import { validateMongooseId } from "../middlewares/mongoose";
import express from 'express'

const Route = express.Router()

  // get all users
  Route.get('/', usersControllers.getUsers);
  //get one user
  Route.get(`/:id`, validateMongooseId, usersControllers.getUserById);

  //create user
  Route.post('/', usersControllers.createUsers);

  //update user
  Route.patch(`/:id`, validateMongooseId, usersControllers.updateUser);

  //delete user
  Route.delete(`/:id`, validateMongooseId, usersControllers.deleteUser);



export {Route}