import { NextFunction, Router, Request, Response } from "express";
import { PATH_ROUTE } from "./userDefs";
import axios from "axios";
import querystring from "querystring";
import { FacebookConfig } from "../../utils/facebookConfigs";
import { UserControllers } from "../../controllers/users.controller";
import APIError from "../../errors/apiError";

const FacebookRouter = Router();

FacebookRouter.get(
  "/auth/facebook",
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const facebookClientId = process.env.FACEBOOK_CLIENT_ID as string;
      const config = await FacebookConfig.getInstance();
      const params = await config.AuthConfigUrl(facebookClientId);

      const url = `https://www.facebook.com/v19.0/dialog/oauth?${params}`;
      res.redirect(url);
    } catch (error: unknown) {
      _next(error);
    }
  }
);

// Callback URL for handling the Facebook Login response
FacebookRouter.get("/auth/facebook/callback", async (req: Request, res: Response , _next: NextFunction) => {
  const code = req.query.code as string ;
  try {
    const controller = new UserControllers();
    const response = await controller.FacebookAuthSigninCallBack(code)
    console.log(response)
    if(!response){
      throw new APIError("Can't create user")
    }
    res.redirect("/success");
  } catch (error: unknown) {
    _next(error)
  }
});

// FacebookRouter.get(
//   PATH_ROUTE.PATH_FACEBOOK_CALLBACK,
//   async (req: Request, res: Response, _next: NextFunction) => {
//     const { code } = req.query;
//     const facebookClientId = process.env.FACEBOOK_CLIENT_ID as string;
//     const redirectUri = process.env.FACEBOOK_REDIRECT_URL as string;
//     const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET as string;

//     console.log(code)
//     console.log(facebookClientId)
//     console.log(facebookClientSecret)
//     console.log(redirectUri)

//     if (!code || typeof code !== "string") {
//       return res.status(400).send("Invalid code");
//     }

//     try {
//       // Exchange code for access token
//       const response = await axios.get(
//         `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${facebookClientId}&redirect_uri=${redirectUri}&client_secret=${facebookClientSecret}&code=${code}`
//       );

//       const { access_token } = response.data;
//       console.log(access_token)

//       if (!access_token) {
//         return res.status(400).send("Failed to retrieve access token");
//       }

//       // Fetch user profile using the access token
//       const profileResponse = await axios.get(
//         `https://graph.facebook.com/me?fields=id,email&access_token=${access_token}`
//       );

//       const { id, email } = profileResponse.data;

//       // Store user information in session or database as needed
//       // req.session.user = { id, email };

//       // Redirect user to home page or any other route
//       res.redirect("/");
//     } catch (error) {
//       _next(error);
//     }
//   }
// );

export default FacebookRouter;
