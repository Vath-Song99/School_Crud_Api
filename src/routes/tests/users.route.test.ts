import request from "supertest";
import app from "../../app";
import { handleConnectToMongoServer } from "../../utils/mongoMemoryServer ";
import { UserType } from "../../schemas/@types/user";

// Connect to mongo-memory-server
handleConnectToMongoServer();

describe("User API endpoints", () => {
  let userId: string;
  const usersControllers = jest.fn() as jest.Mock<UserType>;
  beforeAll(async () => {
    // Add any setup logic here
  });

  describe("POST /api/v1/user Intergration test", () => {
    it("POST /api/v1/users should create a new user", async () => {
      const MOCK_USER: UserType = {
        username: "SmeourySongvat",
        email: "vatgaming287@gmail.com",
        password: "0973238144Vath",
      };

      
      const response = await request(app)
        .post("/api/v1/auth/signup")
        .send(MOCK_USER)
        .expect(201)
        .expect("Content-Type", "application/json; charset=utf-8");

      userId = response.body.user._id
      expect(response.body).toBeDefined();
      expect(response.body.user.username).toEqual(MOCK_USER.username);
      expect(response.body.user.email).toEqual(MOCK_USER.email);
    });
  });

  describe("GET /api/v1/users ", () => {
    it("GET /api/users should return list of users", async () => {
      const response = await request(app).get("/api/v1/user").expect(200);

      expect(response.body).toBeDefined();
    });
  });

  describe("UPDATE /api/v1/users/:id", () => {
    it("should update and return a user", async () => {
      const MOCK_USER = {
        username: "Vath IT",
        email: "vathgaming287@gmail.com",
        password: "smeourysongva344"
      };

      const response = await request(app)
        .patch(`/api/v1/user/${userId}`)
        .send(MOCK_USER)
        .expect(200);

      expect(response).toBeDefined();
      // expect(response.body.username).toEqual("Hello guys what is your name");
      // expect(response.body.data.email).toBe(5)
    }, 20000);
  });

  describe("DELETE Intergration test", () => {
    it("DELETE /api/users/:id should delete a user", async () => {
      const response = await request(app)
        .delete(`/api/v1/user/${userId}`)
        .expect(200);

      expect(response.body.message).toEqual("DELETE success");
    }, 20000);
  });

  afterAll(async () => {
    // Add any teardown logic here
  });
});
