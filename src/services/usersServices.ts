import { UsersRepository } from "../databases/repositories/usersRepository";
import {
  comparePassword,
  generatePassword,
  generateSignature,
} from "../utils/JWT";
import { UserType } from "../schemas/@types/user";
import { LoginType, Options } from "../routes/@types/userRoute";
import {
  generateEmailVerificationToken,
  generateExpireTime,
} from "../utils/acountVerifycation";
import AccountVerificationModel from "../databases/models/acountVerifycation";
import APIError from "../errors/apiError";
import EmailSender from "../utils/emailSender";
import { AccountVerificationRepository } from "../databases/repositories/acountVerifycation";
import { StatusCode } from "../utils/consts";
import { BaseCustomError } from "../errors/baseCustomError";
import { acccInfor, googleSinginConfig } from "../utils/googleConfig";
import { userModel } from "../databases/models/users.model";
import { ClientError } from "../errors/clientError";
import { DuplicateError } from "../errors/duplicateError";

class UsersServices {
  private repository: UsersRepository;
  private accountVerificationRepo: AccountVerificationRepository;

  constructor() {
    this.repository = new UsersRepository();
    this.accountVerificationRepo = new AccountVerificationRepository();
  }

  async getUserById(id: string) {
    try {
      return await this.repository.getUserById(id);
    } catch (error: unknown) {
      throw error;
    }
  }

  async getUsers(options: Options) {
    try {
      return await this.repository.getUsers(options);
    } catch (error: unknown) {
      throw error;
    }
  }

  async createUser(user: UserType | null) {
    //TODO
    //1. hash password
    //2. check exist user and user not verify
    //3. create user to database
    //4. generateToken

    try {
      const { username, email, password } = user as UserType;
      // step 1
      const hashPassword = await generatePassword(password);

      // step 2
      const existUser = await this.repository.getUserByEmail({ email: email });
      if (existUser && existUser.isVerified === false) {
        throw new DuplicateError(
          "Email already exists in the system!, please login"
        );
      }
      //step 3
      const newUser = await this.repository.createUser({
        username,
        email,
        password: hashPassword,
      });
      // step 4
      const { _id } = newUser;
      const token = await generateSignature({ email, _id: _id });

      return { user: newUser, token };
    } catch (error: unknown) {
      throw error;
    }
  }

  async SendVerifyEmailToken({ userId }: { userId: string }) {
    // TODO
    // 1. Generate Verify Token
    // 2. Generate expire time
    // 3. Save the Verify Token in the Database
    // 4. Get the Info User By Id
    // 5. Send the Email to the User

    try {
      // Step 1
      const emailVerificationToken = generateEmailVerificationToken();

      //step 2
      const expireTime = generateExpireTime();
      // Step 3
      const accountVerification = new AccountVerificationModel({
        userId,
        emailVerificationToken,
        expireAt: expireTime,
      });
      const newAccountVerification = await accountVerification.save();

      // Step 4
      const existedUser = await this.repository.getUserById(userId);
      if (!existedUser) {
        throw new APIError("User does not exist!");
      }

      // Step 5
      const emailSender = EmailSender.getInstance();
      emailSender.sendSignUpVerificationEmail({
        toEmail: existedUser.email,
        emailVerificationToken: newAccountVerification.emailVerificationToken,
      });
    } catch (error) {
      throw error;
    }
  }

  async VerifyEmailToken({ token }: { token: string }) {
    const isTokenExist =
      await this.accountVerificationRepo.FindVerificationToken({ token });

    if (!isTokenExist) {
      throw new APIError(
        "Verification token is invalid",
        StatusCode.BadRequest
      );
    }
    if (new Date() > isTokenExist.expireAt) {
      throw new ClientError("token url is expired", StatusCode.BadRequest);
    }
    // Find the user associated with this token
    const user = await this.repository.getUserById(
      isTokenExist.userId.toString()
    );
    if (!user) {
      throw new APIError("User does not exist.", StatusCode.NotFound);
    }

    // Mark the user's email as verified
    user.isVerified = true;
    await user.save();

    // Remove the verification token
    await this.accountVerificationRepo.DeleteVerificationToken({ token });

    return user;
  }

  async updateUser(id: string, user: UserType | null) {
    try {
      return await this.repository.updateUser(id, user);
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteOneUser(id: string) {
    try {
      return await this.repository.deleteOneUser(id);
    } catch (error: unknown) {
      throw error;
    }
  }

  async deleteAllUsers() {
    try {
      return await this.repository.deleteAllUsers();
    } catch (error: unknown) {
      throw error;
    }
  }

  async Login({ identifier, password }: LoginType) {
    // TODO

    try {
      // Example authentication logic, replace with your own
      const user = await this.repository.getUserByUsernameAndPassword(
        identifier
      );
      // Compare hashed passwords
      const passwordMatch = await comparePassword({
        password,
        userPassword: user.password,
      });
      if (!passwordMatch) {
        throw new BaseCustomError("Invalid credentials", 401);
      }

      const token = await generateSignature({ username: user.username });
      // const token = jwt.sign({ username: user.username }, 'secret', { expiresIn: '1h' });

      return { user, token };
    } catch (error: unknown) {
      throw error;
    }
  }

  async SigninWithGoogleCallBack(code: string) {
    // TODO
    // 1. configure client
    // 2. accessToken from user
    // 3. Use the access token to access user info from Google APIs
    // 4. find you that exist in database
    //************************ */

    try {
      // step 1
      const tokenResponse = await googleSinginConfig(code);

      // step 2
      const accessToken = tokenResponse.data.access_token;
      // step 3
      const userInfoResponse = await acccInfor(accessToken);

      // stept 4
      const { name, email, id } = userInfoResponse?.data;
      const user = await this.repository.getUserByEmail({ email: email });
      // Check if the user exists in the database
      if (user) {
        // If the user doesn't exist, create a new user record
        throw new BaseCustomError(
          "your account already exist, please sign in with email password instead",
          StatusCode.BadRequest
        );
      }
      const newUser = new userModel({
        googleId: id,
        username: name,
        email: email,
        eisVerified: true,
      });
      await newUser.save();
      return { userInfoResponse, accessToken };
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new APIError("Unable to Singin with google");
    }
  }
}

export { UsersServices };
