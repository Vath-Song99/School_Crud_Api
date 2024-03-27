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
  describe("GET /api/v1/users should return list of users", () =>{

    it("GET /api/users should return list of users", async () => {
      const response = await request(app).get("/api/v1/users").expect(200);

      console.log(response.body.data)
      
      expect(response.body.data).toBeDefined();
    });
  })


  it("POST /api/v1/users should create a new user", async () => {

    const MOCK_USER:UserType = { username: 'Hello it',  email: "vathgaming@gmail.com", password: "0973238144Vath",}

    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send(MOCK_USER)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");
    
    console.log(response.body)
    expect(response.body).toBeDefined();
    expect(response.body.username).toEqual(MOCK_USER.username);
    expect(response.body.email).toEqual(MOCK_USER.email);
  });

  describe("UPDATE /api/v1/users/:id should update a user", () =>{
     it("should update and return a user", async () =>{
      const MOCK_USER = { username: "Hello IT", email: "vathgaming287@gmail.com"}
        
      const response = await request(app).patch(`/api/v1/users/${userId}`).send(MOCK_USER).expect(201);


      console.log(response.body)
      expect(response).toBeDefined()
      // expect(response.body.username).toEqual("Hello guys what is your name");
      // expect(response.body.data.email).toBe(5)

     },20000)
  } )


  it("DELETE /api/users/:id should delete a user", async () => {
    const response = await request(app).delete(`/api/v1/users/${userId}`).expect(200);

    expect(response.body.message).toEqual('DELETE successfully!');
  },20000);

  afterAll(async () => {
    // Add any teardown logic here
  });
});
