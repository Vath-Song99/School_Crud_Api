import { SmtpServer, SmtpServerConfig } from "./@types/emailSender.type";

export default class NodemailerSmtpServer implements SmtpServer {
  private host = process.env.SMTP_HOST;
  private port = parseInt(process.env.SMTP_PORT!, 10);
  private user = process.env.SMTP_APIKEY_PUBLIC;
  private pass = process.env.SMTP_APIKEY_PRIVATE;

  getConfig(): SmtpServerConfig {
    return {
      host: this.host as string,
      port: this.port,
      auth: {
        user: this.user as string,
        pass: this.pass as string,
      },
    };
  }
}
