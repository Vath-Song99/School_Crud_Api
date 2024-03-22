import { MongoMemoryServer } from "mongodb-memory-server";
import { UsersRepository } from "../repositories/usersRepository";
import { handleConnectToMongoServer } from "../../utils/mongoMemoryServer ";
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
      const MOCK_USER = {
        username: "test",
        age: 6,
      };
      (userModel.find as jest.Mock).mockReturnValue(MOCK_USER);

      const usersData = await userRepository.getUsers();

      expect(usersData).toBeDefined();
      expect(usersData).toEqual(MOCK_USER);
    });

    it("should be get users", async () => {
      const MOCK_USER = {
        _id: "gehglewyg",
        username: "test-duma",
        age: 9,
      };
      (userModel.findById as jest.Mock).mockReturnValue(MOCK_USER);

      const userData = await userRepository.getUserById(MOCK_USER._id);

      expect(userData).toBeDefined();
      expect(userData).toEqual(MOCK_USER);
    });
  });
});
