import { UserType } from "../../schema/userValidation.schema";
import { BaseCustomError } from "../../errors/baseCustomError";
import { StatusCode } from "../../utils/consts";
import APIError from "../../errors/apiError";
const userModel = require("../models/users.model");

class UsersRepository {

  async getUserById(id: string): Promise<any> {
    try {
      const userData = await userModel.findById({ _id: id });

      if (!userData) {
        throw new BaseCustomError("No data found!",  StatusCode.NotFound);
      }
      return userData;
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error
      }else{
        throw new APIError("Unable to find user in database")
      }
    }
  }

  async getUsers(): Promise<any> {
    try{
        const usersData = await userModel.find();

        if (!usersData) {
          throw new BaseCustomError("No data found!", StatusCode.NotFound);
        }
        return usersData;
    }catch(error: unknown){
        if(error instanceof BaseCustomError){
            throw error
        }else{
          throw new APIError("Unable to find user in database")
        }
    }
  }

  async createUser(user: UserType | null) {

    const userCreated = await userModel(user);

    if (!userCreated) {
      throw new Error("user not created!");
    }
    return userCreated.save();
  }

  async updateUser(id: string, user: UserType | null) {
    const updated = await userModel.findByIdAndUpdate({ _id: id }, user);

    if (!updated) {
      throw new Error("user could be not updated!");
    }
    return updated;
  }

  async deleteOneUser(id: string) {
    const deleted = await userModel.deleteOne({ _id: id });

    if (deleted.deletedCount === 0) {
      throw new Error("user could be not deleted!");
    }
    return deleted;
  }

  async deleteAllUsers() {
    const deleted = await userModel.deleteMany({});

    if (deleted.deletedCount === 0) {
      throw new Error("users could be not deleted!");
    }

    return deleted;
  }
}

export { UsersRepository };
