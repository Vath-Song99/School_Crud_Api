export interface EmailApiSendSignUpVerificationEmailArgs {
    toEmail: string;
    emailVerificationToken: string;
  }
  
  export interface EmailApiSendEmailArgs {
    toEmail: string;
    subject: string;
    textBody: string;
    htmlBody: string;
  }
  
  export interface EmailApiSendEmailResponse {
    toEmail: string;
    status: "success" | "error";
  }
  
  export interface SmtpServerConfigAuth {
    user: string;
    pass: string;
  }
  
  export interface SmtpServerConfig {
    host: string;
    port: number;
    auth: SmtpServerConfigAuth;
  }
  
  export interface EmailApi {
    sendSignUpVerificationEmail(
      args: EmailApiSendSignUpVerificationEmailArgs
    ): Promise<EmailApiSendEmailResponse>;
  }
  
  export interface SmtpServer {
    getConfig(): SmtpServerConfig;
  }
  