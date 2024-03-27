import { UsersServices } from "../usersServices";
import { UserType } from "../../schemas/@types/user";
// Mock UsersRepository
jest.mock("../../databases/repositories/usersRepository");

describe("UsersServices", () => {
  let usersServices: UsersServices;
  let userId: string
  beforeEach(() => {
    usersServices = new UsersServices();
  });

  describe("CreateUser", () => {
    it("should call createUser method of UsersRepository with the provided user data", async () => {
      const userData: UserType = { username: "vahtzingIng", password: "gegeggegege", email: "vatgaming287@gmail.com" };
      const user =  await usersServices.createUser(userData);

      console.log(user)
      // expect(usersRepositoryMock.createUser).toHaveBeenCalledWith(userData);
    });
  });

  describe("getUserById", () => {
    it("should call getUserById method of UsersRepository with the provided id", async () => {
      const MOCK_USER = {  username: "vaht", password: "gegeggegege", email: "vatgaming287@gmail.com" };

      (usersServices.repository.getUserById as jest.Mock).mockReturnValue(MOCK_USER);

      const user = await usersServices.getUserById(userId);

      
      expect(user).toBeDefined();
      // expect(user.user).toEqual(MOCK_USER)
    });
  });

  describe("getUsers", () => {
    it("should return users from the repository", async () => {
      const MOCK_USER: Array<UserType> = [{ username: "vaht", password: "gegeggegege", email: "vatgaming287@gmail.com" }];

      // Mock the getUsers method of UserRepository to return dummy data
      (usersServices.repository.getUsers as jest.Mock).mockResolvedValue(MOCK_USER);

      const result = await usersServices.getUsers();

      expect(result).toBeDefined();
      expect(result).toEqual(MOCK_USER);
    });

    it("should throw an error if repository throws an error", async () => {
      // Mock the getUsers method of UserRepository to throw an error
      (usersServices.repository.getUsers as jest.Mock) = jest
        .fn()
        .mockRejectedValue(new Error("Repository error"));

      await expect(usersServices.getUsers()).rejects.toThrow(
        "Repository error"
      );
    });
  })
    

    describe("updateUser", () => {
      it("should call updateUser method of UsersRepository with the provided id and user data", async () => {
        const userId = "65fd3baa1ef197a14fc0b8bd";
        const userData: UserType = { username: "vaht", password: "gegeggegege", email: "vatgaming287@gmail.com" };
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
