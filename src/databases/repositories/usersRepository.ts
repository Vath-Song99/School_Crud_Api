import { UserType } from "../../schema/userValidation.schema";

const userModel = require("../models/users.model")

class UsersRepository {
  
    async getUserById (id: string) {
        return await  userModel.findById(id)
    }
    
    async getUsers (){
        return await userModel.find({});
    }

    async createUser (user: UserType | null){
        const userCreated = await userModel(user)
        return userCreated.save()
    }

    async updateUser (id: string, user: UserType | null){
        return await userModel.findByidAndUpdate({_id: id}, user)
    }

    async deleteOneUser (id: string){
        return await userModel.deleteOne({_id: id});
    }

    async deleteAllUsers (){
        return await userModel.deleteMany({});
    }
}

export {UsersRepository}