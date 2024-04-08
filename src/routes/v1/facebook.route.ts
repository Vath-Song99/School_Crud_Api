import { NextFunction, Router, Request, Response } from "express";
import { PATH_ROUTE } from "./userDefs";
import axios from "axios";
const FacebookRouter = Router();

FacebookRouter.get(
  PATH_ROUTE.PATH_FACEBOOK,
  async (req: Request, res: Response, _next: NextFunction) => {
    const facebookClientId = process.env.FACEBOOK_CLIENT_ID as string;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URL as string;
    try {
      res.redirect(
        `https://www.facebook.com/v12.0/dialog/oauth?client_id=${facebookClientId}&redirect_uri=${redirectUri}&scope=email`
      );
    } catch (error: unknown) {
      _next(error);
    }
  }
);

FacebookRouter.get(
  PATH_ROUTE.PATH_FACEBOOK_CALLBACK,
  async (req: Request, res: Response, _next: NextFunction) => {

    const { code } = req.query;
    const facebookClientId = process.env.FACEBOOK_CLIENT_ID as string;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URL as string;
    const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET as string;


    if (!code || typeof code !== "string") {
      return res.status(400).send("Invalid code");
    }
    try {
      // Exchange code for access token
      const response = await axios.get(
        `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${facebookClientId}&redirect_uri=${redirectUri}&client_secret=${facebookClientSecret}&code=${code}`
      );

      const { access_token } = response.data;
      console.log(access_token)
      if (!access_token) {
        return res.status(400).send("Failed to retrieve access token");
      }

      // Fetch user profile using the access token
      const profileResponse = await axios.get(
        `https://graph.facebook.com/me?fields=id,email&access_token=${access_token}`
      );

      const { id, email } = profileResponse.data;

      // Store user information in session or database as needed
      // req.session.user = { id, email };

      // Redirect user to home page or any other route
      res.redirect("/");
    } catch (error: unknown) {
      _next(error);
    }
  }
);

export default FacebookRouter
