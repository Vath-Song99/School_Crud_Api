import { ObjectId } from "mongodb";
import { handleConnectToMongoServer } from "../../utils/mongoMemoryServer ";
import { UsersServices } from "../usersServices";

handleConnectToMongoServer();

describe("Test Services", () => {
  let UserServices: UsersServices;
  let id: string

  beforeEach(() => {
    UserServices = new UsersServices();
  });

  describe("Create user Services", () => {
    test("it should be return user info", async () => {
      const MOCK_USER = {
        username: "This test is gay",
        age: 5,
      };

      const userUpdated = await UserServices.createUser(MOCK_USER);
      // console.log('waht',userUpdated)
      expect(userUpdated).toBeDefined();

      //   // Expect that userUpdated has user information
      // expect(userUpdated.data).toBeDefined();
      expect(userUpdated.username).toBe(MOCK_USER.username);
      expect(userUpdated.age).toBe(MOCK_USER.age);
    });
  });
  describe("Test method GET all users", () => {
    it("should be return data from db", async () => {
      const userUpdated = await UserServices.getUsers();
    
      id = userUpdated[0]._id
      expect(userUpdated).toBeDefined();
    
    //   console.log("this gay data", userUpdated);

      expect(userUpdated[0].username).toEqual("This test is gay");
      expect(userUpdated[0].age).toEqual(5);
    });

    describe("Test method get a user", () => {
    //   let req: Partial<Request>;
    //   beforeEach(() => {});
      it("should be return a user", async () => {
        const userUpdated = await UserServices.getUserById(id);
        // console.log("this is new gay", userUpdated);
        console.log('GET gay',id)
        expect(userUpdated).toBeDefined()
        expect(userUpdated.username).toEqual("This test is gay");
        expect(userUpdated.age).toEqual(5)
      });
    });  
    
    describe('Test method updateUser', () =>{

       

        it('should be update data and return updated data', async () =>{
            const MOCK_USER_UPDATE = {
                username: 'gay is test',
                age: 9
            }
            const userUpdated = await UserServices.updateUser(id, MOCK_USER_UPDATE);

            if( id === userUpdated._id){
              console.log("Gay whattt")
            }
            console.log('gay id',id)
            console.log('gay update id', userUpdated._id)
            console.log("updated gay", userUpdated)
            expect(userUpdated).toBeDefined();
            expect(userUpdated.username).toEqual('gay is test');
            expect(userUpdated.age).toEqual(9)
        })
    })
  });
});
