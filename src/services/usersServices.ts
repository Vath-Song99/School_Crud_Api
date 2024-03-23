import { UsersRepository } from "../databases/repositories/usersRepository";
import { UserType } from "../schema/userValidation.schema";
import { generatePassword } from "../utils/generatePassword";

class UsersServices {
  repository: UsersRepository;

  constructor() {
    this.repository = new UsersRepository();
  }

  async getUserById(id: string) {
    try {
      return await this.repository.getUserById(id);
    } catch (error: unknown) {
      throw error;
    }
  }

  async getUsers() {
    try {
      return await this.repository.getUsers();
    } catch (error: unknown) {
      throw error;
    }
  }

  async createUser(user: UserType | null) {
    try {
      const { password, username, age } = user as UserType;

      const hashPassword = await generatePassword(password);

      return await this.repository.createUser({
        username,
        password: hashPassword,
        age,
      });
    } catch (error: unknown) {
      throw error;
    }
  }

  async updateUser(id: string, user: UserType | null) {
    return await this.repository.updateUser(id, user);
  }

  async deleteOneUser(id: string) {
    return await this.repository.deleteOneUser(id);
  }

  async deleteAllUsers() {
    return await this.repository.deleteAllUsers();
  }
}

export { UsersServices };
