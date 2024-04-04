import AccountVerificationModel from "../models/acountVerifycation";


export class AccountVerificationRepository {
  async CreateVerificationToken({
    userId,
    token,
  }: {
    userId: string;
    token: string;
  }) {
    try {
      const accountVerification = new AccountVerificationModel({
        userId,
        emailVerificationToken: token,
      });

      const newAccountVerification = await accountVerification.save();
      return newAccountVerification;
    } catch (error) {
      throw error;
    }
  }


  async FindVerificationToken({ token }: { token: string }) {
    try {
      const existedToken = await AccountVerificationModel.findOne({
        emailVerificationToken: token,
      });

      return existedToken;
    } catch (error) {
      throw error;
    }
  }

  async DeleteVerificationToken({ token }: { token: string }) {
    try {
      await AccountVerificationModel.deleteOne({
        emailVerificationToken: token,
      });
    } catch (error) {
      throw error;
    }
  }
}
