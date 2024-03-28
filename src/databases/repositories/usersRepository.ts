import { BaseCustomError } from "../../errors/baseCustomError";
import { UserType } from "../../schemas/@types/user";
import { StatusCode } from "../../utils/consts";
import APIError from "../../errors/apiError";
import { DuplicateError } from "../../errors/duplicateError";
import { Options } from "../../routes/@types/userRoute";
import { PaginateType } from "../@types/repository";
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

  async getUsers(options: Options): Promise<any> {
    try {

      const {page, limit} = options

      const skip: number = (page - 1) * limit;

      const usersData = await userModel.find().skip(skip).limit(limit).exec();

      const totalDocuments: number = await userModel.countDocuments();
      const totalPages: number = Math.ceil(totalDocuments / limit);

      if (!usersData) {
        throw new BaseCustomError("No data found!", StatusCode.NotFound);
      }

      const pagination:PaginateType = {
        currentPage: page,
        totalPages: totalPages,
        totalDocuments: totalDocuments,
    };

      return {user: usersData, paginate: pagination};
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new APIError("Unable to find user in database");
    }
  }

  async createUser(user: UserType | null) {
    try {
      const { email } = user as UserType;
      const existingUser = await this.getUserByEmail({ email });

      if (existingUser) {
        throw new DuplicateError("Email already in use!");
      }

      const userCreated = await userModel(user);

      return userCreated.save();
    } catch (error: unknown) {
      if (error instanceof DuplicateError) {
        throw error;
      }
      throw new APIError(
        "Unable to create user in database",
        StatusCode.InternalServerError
      );
    }
  }

  async getUserByEmail({ email }: { email: string }) {
    try {
      const existingUser = await userModel.findOne({ email: email });
      return existingUser;
    } catch (error: unknown) {
      throw null;
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
    try {
      const deleted = await userModel.deleteOne({ _id: id });

      if (deleted.deletedCount === 0) {
        throw new BaseCustomError(
          "user could be not deleted!",
          StatusCode.NotFound
        );
      }
      return deleted;
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new APIError(
        "Unable to delete user in database",
        StatusCode.InternalServerError
      );
    }
  }

  async deleteAllUsers() {
    try {
      const deleted = await userModel.deleteMany({});

      if (deleted.deletedCount === 0) {
        throw new BaseCustomError(
          "users could be not deleted!",
          StatusCode.NotFound
        );
      }

      return deleted;
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new APIError(
        "Unable to delete user in database",
        StatusCode.InternalServerError
      );
    }
  }
}

export { UsersRepository };
