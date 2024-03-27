//odl version of the CRUD controller
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
import { Body, Get, Post, Route, Path, Put, Delete, Patch } from "tsoa";
import { UserControllerType } from "./@types/userController";

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
      return newUser.user;
    } catch (error: unknown) {
      throw error;
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
  public async GetUsers(): Promise<any> {
    try {
      const userService = new UsersServices();
      const users = await userService.getUsers();

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
}
