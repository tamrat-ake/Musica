import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_OAUTH_CALLBACK_URL,
} from "../environments";
import User from "../../models/user";
import logger from "../winston";
import { errorMessages } from "../../utils/messages/errorMessages";
import { logMessages } from "../../utils/messages/logMessages";
import { responseMessages } from "../../utils/messages/responseMessages";

const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_OAUTH_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findUserByGoogleId(profile.id);

      if (user) {
        logger.info(logMessages.userApi.login(user.email));
        return done(null, user, { message: responseMessages.userApi.login });
      }

      user = await User.createUserFromGoogle(profile);
      logger.info(logMessages.userApi.signUp(user.email));

      return done(null, user, {
        message: responseMessages.userApi.googleSignUp,
      });
    } catch (error) {
      logger.error(errorMessages.googleStrategy, error);
      return done(error);
    }
  }
);

export default googleStrategy;
