import request from "supertest";
import { StatusCode } from "../../utils/consts";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("/users", () => {
  const userData = {
    _id: '1',
    username: "test",
    age: 7,
  };

  test("GET users", async () => {
    const response = await request(app).get("/users").expect(200)

    expect(response.body.data).toBeDefined();
    // expect(response.status).toBe(StatusCode.OK);
    // expect(response.body.username).toBe("test");
    // expect(response.body.age).toBe(7);
  });

  test("POST it should be return data", async () => {
    const response = await request(app).post("/users").send(userData).expect(201).expect('Content-Type', 'application/json; charset=utf-8')


    expect(response.body.data).toBeDefined();
    expect(response.body.message).toEqual("POST success");
    expect(response.body.data.username).toEqual('test');
    expect(response.body.data.age).toEqual(7)

  });

});
