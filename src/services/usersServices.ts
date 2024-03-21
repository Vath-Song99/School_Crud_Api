import { UsersRepository } from "../databases/repositories/usersRepository";
import { UserType } from "../schema/userValidation.schema";

class UsersServices {
   repository: UsersRepository;

  constructor() {
    this.repository = new UsersRepository();
  }

  async getUserById(id: string) {
    return await this.repository.getUserById(id);
  }

  async getUsers() {
    try{
   
      return await this.repository.getUsers();
    }catch(error: unknown | any){
      console.log(error)
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
