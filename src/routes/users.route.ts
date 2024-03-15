import { Express } from "express";
import { usersControllers } from "../controllers/users.controller";
import { validateMongooseId } from "../middlewares/mongoose";

export const usersRoute = (app: Express, path: string) => {
  // get all users
  app.get(path, usersControllers.getUsers);
  //get one user
  app.get(`${path}/:id`, validateMongooseId, usersControllers.getUserById);

  //create user
  app.post(path, usersControllers.createUsers);

  //update user
  app.patch(`${path}/:id`, validateMongooseId, usersControllers.updateUser);

  //delete user
  app.delete(`${path}/:id`, validateMongooseId, usersControllers.deleteUser);
};
