
// export const usersControllers = {
//   getUsers: async (
//     req: Request,
//     res: Response,
//     _next: NextFunction
//   ): Promise<void> => {
//     const userServices = new UsersServices();
//     try {
//       const usersData: UserType | null = await userServices.getUsers();

//       res
//         .status(StatusCode.OK)
//         .json({ message: "GET success", data: usersData });
//     } catch (error: unknown) {
//       _next(error);
//     }
//   },

//   getUserById: async (
//     req: Request,
//     res: Response,
//     _next: NextFunction
//   ): Promise<void | Response> => {
//     const userServices = new UsersServices();
//     // const user =  await userModel.find({});

//     try {
//       const { id } = req.params;

//       const userData = await userServices.getUserById(id);

//       res.status(StatusCode.OK).json({
//         message: "found success",
//         data: userData,
//       });
//     } catch (error: unknown) {
//       _next(error);
//     }
//   },

//   // createUsers: async (
//   //   req: Request,
//   //   res: Response,
//   //   _next: NextFunction
//   // ): Promise<void> => {
//   //   const userServices = new UsersServices();

//   //   try {
//   //     const userData: UserType = {
//   //       username: req.body.username,
//   //       password: req.body.password,
//   //       email: req.body.email,
//   //     };

//   //     const user = await userServices.createUser(userData);

//   //     res.status(StatusCode.Created).json({
//   //       message: "POST success",
//   //       data: user.user,
//   //       token: user.token
//   //     });
//   //   } catch (error: unknown) {
//   //     _next(error);
//   //   }
//   // },

//   updateUser: async (
//     req: Request,
//     res: Response,
//     _next: NextFunction
//   ): Promise<void> => {
//     const userServices = new UsersServices();
//     try {
//       const { id } = req.params;

//       const data: UserType = {
//         username: req.body.username,
//         password: req.body.password,
//         email: req.body.email,
//       };

//       const updated = await userServices.updateUser(id, data);

//       res.status(StatusCode.Created).json({
//         message: "PATCH success",
//         data: updated,
//       });
//     } catch (error: unknown) {
//       _next(error);
//     }
//   },

//   deleteUser: async (
//     req: Request,
//     res: Response,
//     _next: NextFunction
//   ): Promise<void> => {
//     const userServices = new UsersServices();

//     try {
//       const { id } = req.params;

//       await userServices.deleteOneUser(id);

//       res.status(StatusCode.OK).json({
//         message: "DELETE successfully!",
//         error: false,
//       });
//     } catch (error: unknown) {
//       _next(error);
//     }
//   },
//   deleteAllusers: async (req: Request, res: Response, _next: NextFunction) => {
//     const userServices = new UsersServices();
//     try {
//       await userServices.deleteAllUsers();

//       res.status(StatusCode.OK).json({
//         message: "DELETE successfully!",
//         error: false,
//       });
//     } catch (error: unknown) {
//       _next(error);
//     }
//   },
// };

import { UsersServices } from "../services/usersServices";
import { Body, Get, Post, Route, Path, Put, Delete, Patch, Query, Queries, SuccessResponse, Middlewares } from "tsoa";
import { UserControllerType } from "./@types/userController";
import { LoginType, Options } from "../routes/@types/userRoute";
import { StatusCode } from "../utils/consts";
import { generateSignature } from "../utils/JWT";
import { PATH_ROUTE } from "../routes/v1/userDefs";
import passport from "passport";

@Route("/api/v1")
export class UserControllers {
  @Post("/auth/signup")
  public async Signup(
    @Body() requestBody: UserControllerType
  ): Promise<UserControllerType> {
    try {
      const { username, email, password } = requestBody;

      const usersService = new UsersServices();
      const newUser = await usersService.createUser({
        username,
        email,
        password,
      });
      await usersService.SendVerifyEmailToken({ userId: newUser.user._id });
      return newUser.user;
    } catch (error: unknown) {
      throw error;
    }
  }


  @SuccessResponse(StatusCode.OK, "OK")
  @Get("/auth/signup/verify")
  public async VerifyEmail(@Query() token: string): Promise<{ token: string }> {
    try {
      const userService = new UsersServices()

      // Verify the email token
      const user = await userService.VerifyEmailToken({ token });

      // Generate JWT for the verified user
      const jwtToken = await generateSignature({
        userId: user._id,
      });

      return { token: jwtToken };
    } catch (error) {
      throw error;
    }
  }

  @Post("/auth/login")
  public async Login(@Body() requestBody: LoginType): Promise<any> {
    try{
      const {identifier, password } = requestBody;
      const userService = new UsersServices();
      const userLogin = await userService.Login({identifier, password});
      
      return userLogin
    }catch(error: unknown){
      throw error
    }
  }


  @Get(`user/:userId`)
  public async GetUserById(
    @Path() userId: string
  ): Promise<UserControllerType> {
    try {
      const userService = new UsersServices();
      const users = await userService.getUserById(userId);

      return users;
    } catch (error: unknown) {
      throw error;
    }
  }

  @Get("/user")
  public async GetUsers(@Queries() options: Options): Promise<any> {
    try {
      const userService = new UsersServices();
      const users = await userService.getUsers(options);

      return users;
    } catch (error: unknown) {
      throw error;
    }
  }

  @Patch(`/user/:userId`)
  public async UpdateUser(
    @Path() userId: string,
    @Body() requestBody: UserControllerType
  ): Promise<UserControllerType> {
    try {
      const { username, email, password } = requestBody;
      const userService = new UsersServices();
      const userUpdated = await userService.updateUser(userId, {
        username,
        email,
        password,
      });

      return userUpdated;
    } catch (error: unknown) {
      throw error;
    }
  }

  @Delete(`/user/:userId`)
  public async DeleteUser(@Path() userId: string): Promise<object> {
    try {
      const userService = new UsersServices();
      const deleteUser = await userService.deleteOneUser(userId);

      return deleteUser;
    } catch (error: unknown) {
      throw error;
    }
  }
  @Delete("/user")
  public async DeleteAllUsers (): Promise <object> {
    try{ 
      const userService = new UsersServices();
      const deletedUsers = await userService.deleteAllUsers();

      return deletedUsers

    }catch(error: unknown){
      throw error
    }
  }


  @SuccessResponse(StatusCode.OK,"OK")
  @Post(PATH_ROUTE.PATH_GOOGLE)
  @Middlewares(passport.authenticate("google", { scope: ["email"]}))
  public async GoolgeAuth(){
  }

  @SuccessResponse(StatusCode.OK,"OK")
  @Post(PATH_ROUTE.PATH_GOOGLE_CALLBACK)
  @Middlewares(passport.authenticate('google', { failureRedirect: '/error' }))
  public async GoogleAuthCallBack(){
  }
}
