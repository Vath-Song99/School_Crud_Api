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

  test('test method getById', async () => {
    const response = await request(app).put('/:id');

    expect(response.body).toEqual({
      "_id": "65f7a02396bbaa821593c488",
            "username": "Hello guy",
            "age": 5,
            "createdAt": "2024-03-18T02:00:03.500Z",
            "__v": 0
    })
  })
});
