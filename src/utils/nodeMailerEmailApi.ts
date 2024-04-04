import { EmailApi, EmailApiSendSignUpVerificationEmailArgs, EmailApiSendEmailResponse, EmailApiSendEmailArgs } from "./@types/emailSender.type";
import NodemailerSmtpServer from "./nodeMailerSmtpServer";
import Mail from  "nodemailer/lib/mailer"
import nodemailer from "nodemailer";

export type BuildEmailVerificationLinkArgs = {
  emailVerificationToken: string;
};

export type BuildSignUpVerificationEmailArgs = {
  emailVerificationLink: string;
};

export default class NodemailerEmailApi implements EmailApi {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport(
      new NodemailerSmtpServer().getConfig()
    );
  }

  async sendSignUpVerificationEmail(
    args: EmailApiSendSignUpVerificationEmailArgs
  ): Promise<EmailApiSendEmailResponse> {
    const { toEmail, emailVerificationToken } = args;

    const emailVerificationLink = this.buildEmailVerificationLink({
      emailVerificationToken,
    });

    const subject = "welcome to School mangement! Please verify your email address";
    const textBody = this.buildSignUpVerificationEmailTextBody({
      emailVerificationLink,
    });
    const htmlBody = this.buildSignUpVerificationEmailHtmlBody({
      emailVerificationLink,
    });

    await this.sendEmail({ toEmail, subject, textBody, htmlBody });

    return {
      toEmail,
      status: "success",
    };
  }

  private buildEmailVerificationLink = (
    args: BuildEmailVerificationLinkArgs
  ): string => {
    const { emailVerificationToken } = args;

    // TODO: this url will change once we integrate kubernetes in our application
    return `http://localhost:3001/api/v1/auth/signup/verify/?token=${emailVerificationToken}`;
  };

  private buildSignUpVerificationEmailTextBody = (
    args: BuildSignUpVerificationEmailArgs
  ): string => {
    const { emailVerificationLink } = args;

    return `Welcome to School Managerment, the coolest micro sample platform! Please click on the link below (or copy it to your browser) to verify your email address. ${emailVerificationLink}`;
  };

  private buildSignUpVerificationEmailHtmlBody = (
    args: BuildSignUpVerificationEmailArgs
  ): string => {
    const { emailVerificationLink } = args;

    return `
        <h1>Welcome to School mangement</h1>
        <br/>
        Welcome to School mangement, the coolest micro sample platform!
        <br/>
        <br/>
        Please click on the link below (or copy it to your browser) to verify your email address:
        <br/>
        <br/>
        <a href="${emailVerificationLink}">${emailVerificationLink}</a>`;
  };

  private async sendEmail(args: EmailApiSendEmailArgs): Promise<void> {
    const { toEmail, subject, htmlBody, textBody } = args;
    await this.transporter.sendMail({
      from: "School mangement <noreply@microsample.app>",
      to: toEmail,
      subject,
      text: textBody,
      html: htmlBody,
    });
  }
}
