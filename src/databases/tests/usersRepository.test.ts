import { MongoMemoryServer } from "mongodb-memory-server";
import { UsersRepository } from "../repositories/usersRepository";
import { handleConnectToMongoServer } from "../../utils/mongoMemoryServer ";
import { UserType } from "../../schemas/@types/user";
const userModel = require("../models/users.model");

jest.mock("../models/users.model");

let mongoServer: MongoMemoryServer;

//connect to mongomemoryserver
handleConnectToMongoServer();

describe("Unit test for userRep", () => {
  let userRepository: UsersRepository;

  beforeEach(() => {
    userRepository = new UsersRepository();
  });

  describe("Test Repository", () => {
    it("should return all users data", async () => {
      const MOCK_USER: UserType[] = [{username: "songvat", email: "vatgaming2287@gmail.com", password: "0973238144VATH"}];
      (userModel.find as jest.Mock).mockReturnValue(MOCK_USER);

      const usersData = await userRepository.getUsers();

      expect(usersData).toBeDefined();
      expect(usersData).toEqual(MOCK_USER);
    });

    it("should be get users", async () => {
      const MOCK_USER = {
        _id: "hahathisisid",
        username: "test-dumagg",
        email: "vathgaming287@gmail.com",
        password: "hahawhatisthat432"
      };
      (userModel.findById as jest.Mock).mockReturnValue(MOCK_USER);

      const userData = await userRepository.getUserById(MOCK_USER._id);

      expect(userData).toBeDefined();
      expect(userData).toEqual(MOCK_USER);
    });
  });
});
