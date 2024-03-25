import request from "supertest";
import app from "../../app";
import { handleConnectToMongoServer } from "../../utils/mongoMemoryServer ";
import { UserType } from "../../schemas/userValidation.schema";

// Connect to mongo-memory-server
handleConnectToMongoServer();

describe("User API endpoints", () => {
  let userId: string;

  beforeAll(async () => {
    // Add any setup logic here
  });

  test("GET /api/users should return list of users", async () => {
    const response = await request(app).get("/api/users").expect(200);

    expect(response.body.data).toBeDefined();
  });

  test("POST /api/users should create a new user", async () => {

    const MOCK_USER:UserType = { username: 'Hello test', password: "Songvatgg", age: 8}

    const response = await request(app)
      .post("/api/users")
      .send(MOCK_USER)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");

    userId = response.body.data._id;
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toEqual("POST success");
    expect(response.body.data.username).toEqual(MOCK_USER.username);
    expect(response.body.data.age).toEqual(MOCK_USER.age);
  });

  test("PATCH /api/users/:id should update an existing user", async () => {
    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .send({ username: "gay is test", age: 8 })
      .expect(201);

    expect(response.body.data).toBeDefined();
    // Add more assertions if needed
  });

  test("DELETE /api/users/:id should delete a user", async () => {
    const response = await request(app).delete(`/api/users/${userId}`).expect(200);

    expect(response.body.message).toEqual('DELETE successfully!');
  });

  afterAll(async () => {
    // Add any teardown logic here
  });
});
