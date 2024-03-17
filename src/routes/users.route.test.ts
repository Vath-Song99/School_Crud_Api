import request from "supertest";
import app from "../app";

describe("test route", () => {

  test("test method get", async () => {
    const response = await request(app).get("/users");
    expect(response.body).toEqual({})
  });

  test("test method post", async () => {
    const response = await request(app).post("/users");
    expect(response.body.message).toEqual('Required')
  });
});
