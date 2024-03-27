import { BaseCustomError } from "../../errors/baseCustomError";
import { UserType } from "../../schemas/@types/user";
import { StatusCode } from "../../utils/consts";
import APIError from "../../errors/apiError";
import { DuplicateError } from "../../errors/duplicateError";
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
