import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { UsersRepository } from "../repositories/usersRepository";
import request, { agent } from 'supertest'
import app from "../../app";
import { before } from "node:test";


let mongoServer: MongoMemoryServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });


  describe('Intergration test for userRep', () =>{

    let userRepository: UsersRepository;

    beforeEach(() =>{
        userRepository = new UsersRepository();
    })

     describe('Test Repo', () =>{

        test('should be add a new user to a DB', async() =>{

            const MOCK_USER = {
                _id: '1',
                username: 'test',
                age: 6
            };

            const response = await request(app).post('/users').send(MOCK_USER).expect(201);

            expect(response.body.data).toBeDefined();
            expect(response.body.data.username).toEqual('test');
            expect(response.body.data.age).toEqual(6)

        });

        test('should be get users', async() =>{
            
            const response = await request(app).get('/users').expect(200);

            console.log('error:',response.body.id)
            expect(response.body.data).toBeDefined();
        });
     })

//      describe('PATCH /users/:id', () => {
//         let userId: string; // This will hold the _id of the created user
    
//         before(async () => {
//           // Create a user before testing the PATCH method
//           const newUser = new UsersRepository.updateUser({
//             username: 'testuser',
//             age: 6
//           });
//           const savedUser = await newUser.save();
//           userId = savedUser._id;
//         });
    
//         it('should update the user\'s information', async () => {
//           const updatedUserData = {
//             username: 'updatedusername',
//             age: 6
//           };
    
//           const response = await request(app)
//             .patch(`/users/${userId}`) // Use the userId obtained from before hook
//             .send(updatedUserData)
//             .expect(200);
    
//           // Check if the response body contains the updated user data
//           expect(response.body).toBeDefined()
    
//           // Optionally, you can make a request to fetch the user by userId
//         //   const fetchedUser = await User.findById(userId);
//         //   expect(fetchedUser).to.exist;
//         //   expect(fetchedUser.username).to.equal(updatedUserData.username);
//         //   expect(fetchedUser.email).to.equal(updatedUserData.email);
//      });
//   })
})