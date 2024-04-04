import { UserType } from "../../schemas/@types/user";

export interface UserControllerType {
    username: string;
    email: string;
    password: string;
    // Add any other properties if present in the Zod schema
  }

export interface SingupUser {
  user: UserType;
  token: string;
  expireAt: Date;
}