import axios from "axios";
import APIError from "../errors/apiError";


export class GoogleConfig {
  private static instance: GoogleConfig

  private constructor() {
    // Any initialization logic you want to perform
  }

  public static async getInstance(): Promise<GoogleConfig> {
    if (!GoogleConfig.instance) {
      GoogleConfig.instance = new GoogleConfig();
    }
    return GoogleConfig.instance;
  }

  public async GoogleSigninConfig(code: string){
    try{
      const tokenResponse = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID as string ,
          client_secret: process.env.GOOGLE_CLIENT_SECRET as string ,
          redirect_uri: process.env.REDIRECT_URL as string,
          grant_type: 'authorization_code'
        }
      );
      return await tokenResponse.data;
    }catch(error: unknown){
      throw new APIError('Unable to config user in google api')
    }
  }

  public async AccessInfo (access_token: string){
    try {
      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      return userInfoResponse;
    } catch (error: unknown) {
      throw new APIError('Unalbe to access info in google api')
    }
  }

  public async AuthConfigUrl(clienId: string, redirectUri: string){
    try{
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clienId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=email%20profile`;
    
      return authUrl;
    }catch(error: unknown){
      throw new APIError('Unable to AuthConfigUrl in google api')
    }
  }
}

