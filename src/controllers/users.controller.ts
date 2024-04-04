import { UsersServices } from "../services/usersServices";
import {
  Body,
  Get,
  Post,
  Route,
  Path,
  Delete,
  Patch,
  Query,
  Queries,
  SuccessResponse,
  Middlewares,
} from "tsoa";
import { SingupUser, UserControllerType } from "./@types/userController";
import { LoginType, Options } from "../routes/@types/userRoute";
import { StatusCode } from "../utils/consts";
import { generateSignature } from "../utils/JWT";
import { PATH_ROUTE } from "../routes/v1/userDefs";
import { validateUser } from "../middlewares/userValidate";
import {
  userLoginValidate,
  userSignupValidation,
} from "../schemas/userValidation.schema";
import { validateMongooseId } from "../middlewares/mongoose";

@Route("/api/v1")
export class UserControllers {
  @Post("/auth/signup")
  @Middlewares(validateUser(userSignupValidation))
  public async Signup(
    @Body() requestBody: UserControllerType
  ): Promise<SingupUser> {
    try {
      const { username, email, password } = requestBody;

      const usersService = new UsersServices();
      const newUser = await usersService.createUser({
        username,
        email,
        password,
      });
      return newUser;
    } catch (error: unknown) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Get("/auth/signup/verify")
  public async VerifyEmail(@Query() token: string): Promise<{ token: string }> {
    try {
      const userService = new UsersServices();

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
  @Middlewares(validateUser(userLoginValidate))
  public async Login(@Body() requestBody: LoginType): Promise<any> {
    try {
      const { identifier, password } = requestBody;
      const userService = new UsersServices();
      const userLogin = await userService.Login({ identifier, password });

      return userLogin;
    } catch (error: unknown) {
      throw error;
    }
  }

  @Get(`user/:userId`)
  @Middlewares(validateMongooseId)
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
  @Middlewares(validateMongooseId)
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
  @Middlewares(validateMongooseId)
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
  public async DeleteAllUsers(): Promise<object> {
    try {
      const userService = new UsersServices();
      const deletedUsers = await userService.deleteAllUsers();

      return deletedUsers;
    } catch (error: unknown) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Get(PATH_ROUTE.PATH_GOOGLE)
  public async GoogleAuthCallBack(code: string) {
    try {
      const userService = new UsersServices();
      const userInfo = userService.SigninWithGoogleCallBack(code);

      return userInfo;
    } catch (error: unknown) {
      throw error;
    }
  }
}
