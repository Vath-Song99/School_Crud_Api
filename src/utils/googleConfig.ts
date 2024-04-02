import axios from "axios";

export const googleSinginConfig = async (code: string) => {
  const tokenResponse = await axios.post(
    "https://oauth2.googleapis.com/token",
    {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID as string || "760529098159-v2ldqed2dju8up2ribsj1m2o4shjbrcq.apps.googleusercontent.com",
      client_secret: process.env.GOOGLE_CLIENT_SECRET as string || "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",
      redirect_uri: process.env.REDIRECT_URL as string || "http://localhost:3001/auth/google/callback",
      // grant_type: process.env.GOOGLE_CLIENT_ID as string
    }
  );
  return await tokenResponse;
};
export const acccInfor = async (access_token: string) => {
  try {
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    return userInfoResponse;
  } catch (error: unknown) {
    console.log(error);
  }
};

export const authConfigUrl = (clienId: string, redirectUri: string) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clienId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=email%20profile`;

  return authUrl;
};
