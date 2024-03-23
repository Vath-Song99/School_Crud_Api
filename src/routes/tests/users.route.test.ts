import request from "supertest";
import app from "../../app";
import { handleConnectToMongoServer } from "../../utils/mongoMemoryServer ";
import { UserType } from "../../schema/userValidation.schema";

// Connect to mongo-memory-server
handleConnectToMongoServer();

describe("User API endpoints", () => {
  let userId: string;

  beforeAll(async () => {
    // Add any setup logic here
  });

  test("GET /users should return list of users", async () => {
    const response = await request(app).get("/users").expect(200);

    expect(response.body.data).toBeDefined();
  });

  test("POST /users should create a new user", async () => {

    const MOCK_USER:UserType = { username: 'Hello test', password: "Songvatgg", age: 8}

    const response = await request(app)
      .post("/users")
      .send(MOCK_USER)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");

    userId = response.body.data._id;
    expect(response.body.data).toBeDefined();
    expect(response.body.message).toEqual("POST success");
    expect(response.body.data.username).toEqual(MOCK_USER.username);
    expect(response.body.data.age).toEqual(MOCK_USER.age);
  });

  test("PATCH /users/:id should update an existing user", async () => {
    const response = await request(app)
      .patch(`/users/${userId}`)
      .send({ username: "gay is test", age: 8 })
      .expect(201);

    console.log('User updated:', response.body.data);
    expect(response.body.data).toBeDefined();
    // Add more assertions if needed
  });

  test("DELETE /users/:id should delete a user", async () => {
    const response = await request(app).delete(`/users/${userId}`).expect(200);

    expect(response.body.message).toEqual('DELETE successfully!');
  });

  afterAll(async () => {
    // Add any teardown logic here
  });
});
