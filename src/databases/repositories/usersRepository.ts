import { UserType } from "../../schemas/userValidation.schema";
import { BaseCustomError } from "../../errors/baseCustomError";
import { StatusCode } from "../../utils/consts";
import APIError from "../../errors/apiError";
const userModel = require("../models/users.model");

class UsersRepository {
  async getUserById(id: string): Promise<any> {
    try {
      const userData = await userModel.findById({ _id: id });

      if (!userData) {
        throw new BaseCustomError("No data found!", StatusCode.NotFound);
      }
      return userData;
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error;
      } 
      throw new APIError("Unable to find user in database");
    }
  }

  async getUsers(): Promise<any> {
    try {
      const usersData = await userModel.find();

      if (!usersData) {
        throw new BaseCustomError("No data found!", StatusCode.NotFound);
      }
      return usersData;
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new APIError("Unable to find user in database");
    }
  }

  async createUser(user: UserType | null) {

    try{
      const userCreated = await userModel(user);

      if (!userCreated) {
        throw new BaseCustomError("user not created!",StatusCode.NotFound);
      }
      return userCreated.save();
    }catch(error: unknown){
      if(error instanceof BaseCustomError){
        throw error
      }
      throw new APIError("Unable to create user in database", StatusCode.InternalServerError)
    }
  }

  async updateUser(id: string, user: UserType | null) {
    try {
      const updated = await userModel.findByIdAndUpdate({ _id: id }, user);

      if (!updated) {
        throw new BaseCustomError(
          "user could be not updated!",
          StatusCode.NotFound
        );
      }
      return updated;
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new APIError(
        "Unable to update to database",
        StatusCode.InternalServerError
      );
    }
  }
  async deleteOneUser(id: string) {
    try{
      const deleted = await userModel.deleteOne({ _id: id });

      if (deleted.deletedCount === 0) {
        throw new BaseCustomError("user could be not deleted!", StatusCode.NotFound);
      }
      return deleted;
    }catch(error: unknown){
      if(error instanceof BaseCustomError){
        throw error;
      }
      throw new APIError("Unable to delete user in database", StatusCode.InternalServerError)
    }
  }

  async deleteAllUsers() {
     try{
      const deleted = await userModel.deleteMany({});

      if (deleted.deletedCount === 0) {
        throw new BaseCustomError("users could be not deleted!", StatusCode.NotFound);
      }
  
      return deleted;
     }catch(error: unknown){
      if(error instanceof BaseCustomError){
        throw error
      }
      throw new APIError("Unable to delete user in database", StatusCode.InternalServerError)
     }
  }
}

export { UsersRepository };
