//signin with google
import { Router } from "express";
import { NextFunction , Request , Response } from "express";
import { PATH_ROUTE } from "./userDefs";
import { GoogleConfig } from "../../utils/googleConfigs";
import { UserControllers } from "../../controllers/users.controller";
import { StatusCode } from "../../utils/consts";

const GoogleRoute = Router()

GoogleRoute.get(
    PATH_ROUTE.PATH_GOOGLE,
    async (req: Request, res: Response, _next: NextFunction) => {
      try {
        const redirectUri = process.env.GOOGLE_REDIRECT_URL as string;
        const clienId = process.env.GOOGLE_CLIENT_ID as string;
        
        const googleConfig = await GoogleConfig.getInstance()
        const authUrl = await googleConfig.AuthConfigUrl(clienId, redirectUri);
        res.redirect(authUrl);
      } catch (error: unknown) {
        _next(error);
      }
    }
  );
  
  //Signin callback with google
  GoogleRoute.get(
    PATH_ROUTE.PATH_GOOGLE_CALLBACK,
    async (req: Request, res: Response, _next: NextFunction) => {
        try {
  
          const { code } = req.query;
          const queryCode = code as string;
          const controller = new UserControllers();
          const userInfoResponse = await controller.GoogleAuthCallBack(queryCode);
  
          res.status(StatusCode.OK).json({
            message: "Sigin success",
            token: userInfoResponse?.jwtToken,
          });
        } catch (error: unknown) {
          _next(error);
        }
      }
  );


  export default GoogleRoute