import { UsersServices } from "../usersServices";
import { UsersRepository } from "../../databases/repositories/usersRepository";
import { UserType } from "../../schema/userValidation.schema";

// Mock UsersRepository
jest.mock("../../databases/repositories/usersRepository");

describe("UsersServices", () => {
  let usersServices: UsersServices;
  let usersRepositoryMock: jest.Mocked<UsersRepository>;

  beforeEach(() => {
    usersServices = new UsersServices();
    usersRepositoryMock = new UsersRepository() as jest.Mocked<UsersRepository>;
  });

  describe("getUserById", () => {
    it("should call getUserById method of UsersRepository with the provided id", async () => {
      const userData = { _id: "gjregr", username: "vaht", age: 5 };
      const userId = userData._id;
      (usersRepositoryMock.getUserById as jest.Mock).mockReturnValue(userData);
      const user = await usersServices.getUserById(userId);

      console.log(user)

      // expect(user).toEqual(userData)
      // expect(usersRepositoryMock.getUserById).toHaveBeenCalledWith(userId);
      // console.log("The data", user._id);
      // expect(user).toBeDefined();
    });
  });
  

  describe("getUsers", () => {
    it("should call getUsers method of UsersRepository", async () => {
      // Mock data
      const userData = { _id: "gjregr", username: "vaht", age: 5 };
  
      // Mock getUsers method of UsersRepository
      (usersRepositoryMock.getUsers as jest.Mock).mockResolvedValue([userData]);
  
      // Call the getUsers method from your service
      const usersData = await usersServices.getUsers();
  
      console.log("The data", usersData);
  
      // Expectation
      // expect(usersData).toBeDefined();
    });
  });
  

  describe("createUser", () => {
    it("should call createUser method of UsersRepository with the provided user data", async () => {
      const userData: UserType = { username: "John", age: 10 };
      await usersServices.createUser(userData);
      // expect(usersRepositoryMock.createUser).toHaveBeenCalledWith(userData);
    });
  });

  describe("updateUser", () => {
    it("should call updateUser method of UsersRepository with the provided id and user data", async () => {
      const userId = "65fd3baa1ef197a14fc0b8bd";
      const userData: UserType = { username: "John", age: 30 };
      await usersServices.updateUser(userId, userData);
      // expect(usersRepositoryMock.updateUser).toHaveBeenCalledWith(userId, userData);
    });
  });

  describe("deleteOneUser", () => {
    it("should call deleteOneUser method of UsersRepository with the provided id", async () => {
      const userId = "123";
      await usersServices.deleteOneUser(userId);
      // expect(usersRepositoryMock.deleteOneUser).toHaveBeenCalledWith(userId);
    });
  });

  describe("deleteAllUsers", () => {
    it("should call deleteAllUsers method of UsersRepository", async () => {
      await usersServices.deleteAllUsers();
      // expect(usersRepositoryMock.deleteAllUsers).toHaveBeenCalled();
    });
  });
});
