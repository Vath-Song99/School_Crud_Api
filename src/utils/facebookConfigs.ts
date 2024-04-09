import axios, { AxiosError } from "axios";
import APIError from "../errors/apiError";
import querystring from 'querystring'

export class FacebookConfig {
  private static instance: FacebookConfig

  private constructor() {
    // Any initialization logic you want to perform
  }

  public static async getInstance(): Promise<FacebookConfig> {
    if (!FacebookConfig.instance) {
      FacebookConfig.instance = new FacebookConfig();
    }
    return FacebookConfig.instance;
  }

  public async FacebookStrategy(code: string){
    try{
      const tokenResponse = await axios.post(
        "https://graph.facebook.com/v13.0/oauth/access_token",
        {
          client_id: process.env.FACEBOOK_CLIENT_ID as string ,
          client_secret: process.env.FACEBOOK_CLIENT_SECRET as string ,
          redirect_uri: process.env.FACEBOOK_REDIRECT_URL as string,
          code,
        }
      );
      return await tokenResponse.data;
    }catch(error: unknown){
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Facebook API Error:', axiosError.response.data);
          console.error('Status:', axiosError.response.status);
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.error('Facebook API No response:', axiosError.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Facebook API Error:', axiosError.message);
        }
      } else {
        // This block handles non-Axios errors
        console.error('Unknown error occurred:', error);
      }
      throw new Error('Unable to configure user in Facebook API');
    }
  }

  public async AccessInfo (access_token: string){
    try {
      const userInfoResponse = await axios.get(
        "https://graph.facebook.com/v13.0/me?fields=email,name",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      return userInfoResponse.data;
    } catch (error: unknown) {
      throw new APIError('Unalbe to access info in google api')
    }
  }

  public async AuthConfigUrl(clienId: string){
    try{
     
      const params = querystring.stringify({
        client_id: clienId,
        redirect_uri: 'http://localhost:3001/auth/facebook/callback',
        response_type: 'code',
        // Add more scopes as needed
    });
    
      return params;
    }catch(error: unknown){
      throw new APIError('Unable to AuthConfigUrl in facebook api')
    }
  }
}

