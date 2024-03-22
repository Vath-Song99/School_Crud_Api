import { UsersRepository } from "../databases/repositories/usersRepository";
import { UserType } from "../schema/userValidation.schema";
import { BaseCustomError } from "../utils/baseCustomError";
import { StatusCode } from "../utils/consts";

class UsersServices {
   repository: UsersRepository;

  constructor() {
    this.repository = new UsersRepository();
  }

  async getUserById(id: string) {
      try{
        return await this.repository.getUserById(id);
      }catch(error: unknown){
        if(error instanceof BaseCustomError){
          throw new BaseCustomError("Internal server error",StatusCode.InternalServerError)
        }
      }
  }

  async getUsers() {
    try{
      return await this.repository.getUsers();
    }catch(error: unknown){
      if(error instanceof BaseCustomError){
        throw new BaseCustomError("Internal server error",StatusCode.InternalServerError)
      }
    }
  }

  async createUser(user: UserType | null) {
    
    return await this.repository.createUser(user);
  }

  async updateUser (id: string, user: UserType | null){
    return await this.repository.updateUser(id, user)
  }

  async deleteOneUser(id: string){
    return await this.repository.deleteOneUser(id)
  }

  async deleteAllUsers (){
    return await this.repository.deleteAllUsers();
  }
}

export { UsersServices };
