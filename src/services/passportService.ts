import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";


export const googleAuth = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.REDIRECT_URL!,
      },
      (accessToken, refreshToken, profile, done) => {
        // This callback function will be called after successful authentication
        // You can perform operations such as saving the user to a database here

        return done(null, profile);
      }
    )
  );
};
