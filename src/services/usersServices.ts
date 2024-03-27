import { UsersRepository } from "../databases/repositories/usersRepository";
import { generatePassword, generateSignature } from "../utils/JWT";
import { UserType } from "../schemas/@types/user";

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
      const {username, email , password } = user as UserType;

      const hashPassword = await generatePassword(password);

      const newUser =  await this.repository.createUser({
        username,
        email,
        password: hashPassword
      });
      const { _id } = newUser || ''
      const token = await generateSignature( { email, _id: _id });

      return { user: newUser, token }

    } catch (error: unknown) {
      throw error;
    }
  }

  async updateUser(id: string, user: UserType | null) {
    try {
      return await this.repository.updateUser(id, user);
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteOneUser(id: string) {
    try {
      return await this.repository.deleteOneUser(id);
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteAllUsers() {
    try {
      return await this.repository.deleteAllUsers();
    } catch (error: unknown) {
      throw error;
    }
  }
}

export { UsersServices };
