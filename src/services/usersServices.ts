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
import { GoogleConfig } from "../utils/googleConfigs";
import { ClientError } from "../errors/clientError";
import { DuplicateError } from "../errors/duplicateError";
import { FacebookConfig } from "../utils/facebookConfigs";

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
      if (existUser) {
        if (existUser.isVerified === true) {
          throw new DuplicateError(
            "Email already exists in the system!, please login"
          );
        }
        await this.SendVerifyEmailToken({ userId: existUser._id });
        throw new ClientError(
          "Email is resent, please check email to verify!",
          StatusCode.BadRequest
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
      const token = await generateSignature(_id);

      const expireUser = await this.SendVerifyEmailToken({
        userId: newUser._id,
      });
      return { user: newUser, token, expireAt: expireUser };
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
      return expireTime;
    } catch (error) {
      throw error;
    }
  }

  async VerifyEmailToken({ token }: { token: string }) {
    const isTokenExist =
      await this.accountVerificationRepo.FindVerificationToken({ token });
    const emailVerificationToken = generateEmailVerificationToken();
    const expireTime = generateExpireTime();
    if (!isTokenExist) {
      throw new APIError(
        "Verification token is invalid",
        StatusCode.BadRequest
      );
    }

    // Find the user associated with this token
    const user = await this.repository.getUserById(
      isTokenExist.userId.toString()
    );
    if (!user) {
      throw new APIError("User does not exist.", StatusCode.NotFound);
    }

    if (new Date() > isTokenExist.expireAt) {
      await AccountVerificationModel.updateOne(
        { userId: isTokenExist.userId },
        {
          emailVerificationToken: emailVerificationToken,
          expireAt: expireTime,
        }
      );
      const emailSender = EmailSender.getInstance();
      emailSender.sendSignUpVerificationEmail({
        toEmail: user.email,
        emailVerificationToken: emailVerificationToken,
      });
      throw new ClientError(
        "your email token was expire, please request new token",
        StatusCode.BadRequest
      );
    }

    // Mark the user's email as verified
    user.isVerified = true;
    await user.save();

    // Remove the verification token
    await this.accountVerificationRepo.DeleteVerificationToken({ token });

    return user;
  }

  async updateUser(id: string, user: UserType) {
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
    // 1. find username or password in datanbase
    // 2. campare password between user input password and password exist in database
    // 3. generate token
    try {
      // step 1
      const user = await this.repository.getUserByUsernameAndEmail(identifier);
      // step 2
      const passwordMatch = await comparePassword({
        password,
        userPassword: user.password,
      });
      if (!passwordMatch) {
        throw new ClientError(
          "Invalid email or password!",
          StatusCode.BadRequest
        );
      }
      // step 3
      const token = await generateSignature(user._id);
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
    // 5. create new user to database
    // 6. generate jwt token
    //************************ */

    try {
      // step 1
      const googleConfig = await GoogleConfig.getInstance();
      const tokenResponse = await googleConfig.GoogleStrategy(code);

      // step 2
      const accessToken = tokenResponse.access_token;
      // step 3
      const userInfoResponse = await googleConfig.AccessInfo(accessToken);

      // stept 4
      const { name, email, id, verified_email } = userInfoResponse?.data;
      const user = await this.repository.getUserByEmail({ email: email });
      // Check if the user exists in the database
      if (user) {
        // If the user doesn't exist, create a new user record
        throw new BaseCustomError(
          "your account already exist, please login with email password instead",
          StatusCode.BadRequest
        );
      }
      // steps 5
      const newUser = await this.repository.createGoogleUser({
        name,
        email,
        id,
        verified_email,
      });
      // step 6
      const jwtToken = await generateSignature(id);
      return { newUser, jwtToken };
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new APIError("Unable to Singin with google");
    }
  }

  async SigninWithFacebookCallBack(code: string) {
    //********************* */\
    // 1. config facebook strategy
    // 2. destruce access_token from data
    // 3. access data from facebook api
    // 4. create user into database
    // 5. generate jwt token for user
    //*********************** */
    try {
      // step 1
      const config = await FacebookConfig.getInstance();
      const data: any = await config.FacebookStrategy(code);

      // step 2
      const { access_token } = data;

      // step 3
      const profile = await config.AccessInfo(access_token);
      console.log(profile)
      // step 4
      const user = await this.repository.createFacebookUser(profile);

      // step 5
      const jwtToken = await generateSignature(user._id)

      return {profile , jwtToken}
    } catch (error: unknown) {
      throw error;
    }
  }
}

export { UsersServices };
