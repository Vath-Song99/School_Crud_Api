import { UsersRepository } from "../databases/repositories/usersRepository";
import {
  comparePassword,
  generatePassword,
  generateSignature,
} from "../utils/JWT";
import { UserType } from "../schemas/@types/user";
import { LoginType, Options } from "../routes/@types/userRoute";
import { generateEmailVerificationToken } from "../utils/acountVerifycation";
import AccountVerificationModel from "../databases/models/acountVerifycation";
import APIError from "../errors/apiError";
import EmailSender from "../utils/emailSender";
import { AccountVerificationRepository } from "../databases/repositories/acountVerifycation";
import { StatusCode } from "../utils/consts";
import { BaseCustomError } from "../errors/baseCustomError";

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
    try {
      const { username, email, password } = user as UserType;

      const hashPassword = await generatePassword(password);

      const newUser = await this.repository.createUser({
        username,
        email,
        password: hashPassword,
      });
      const { _id } = newUser || "";
      const token = await generateSignature({ email, _id: _id });

      return { user: newUser, token };
    } catch (error: unknown) {
      throw error;
    }
  }

  async SendVerifyEmailToken({ userId }: { userId: string }) {
    // TODO
    // 1. Generate Verify Token
    // 2. Save the Verify Token in the Database
    // 3. Get the Info User By Id
    // 4. Send the Email to the User

    try {
      // Step 1
      const emailVerificationToken = generateEmailVerificationToken();

      // Step 2
      const accountVerification = new AccountVerificationModel({
        userId,
        emailVerificationToken,
      });
      const newAccountVerification = await accountVerification.save();

      // Step 3
      const existedUser = await this.repository.getUserById(userId);
      if (!existedUser) {
        throw new APIError("User does not exist!");
      }

      // Step 4
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

      return { user , token };
    } catch (error: unknown) {
      throw error;
    }
  }
}

export { UsersServices };
