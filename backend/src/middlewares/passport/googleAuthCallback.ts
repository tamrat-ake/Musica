// middlewares/googleAuthCallback.ts
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { UserInterface } from "../../models/user/types";
import AppError from "../../errors/appErrors";
import logger from "../../config/winston";
import { errorMessages } from "../../utils/messages/errorMessages";
import httpStatus from "http-status";
import { ENVIRONMENT, MAX_COOKIE_AGE } from "../../utils/constants";
import { AuthenticationStrategy, NodeEnv, Status } from "../../utils/enums";
import { responseMessages } from "../../utils/messages/responseMessages";

export const googleAuthCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    AuthenticationStrategy.Google,
    { session: false },
    async (err: Error | null, user: UserInterface | null, info: any) => {
      if (err) {
        logger.error(errorMessages.googleAuthError(err.message));
        return next(
          new AppError(
            errorMessages.internalServerError,
            httpStatus.INTERNAL_SERVER_ERROR
          )
        );
      }

      if (!user) {
        return next(
          new AppError(
            errorMessages.googleUserNotFound,
            httpStatus.UNAUTHORIZED
          )
        );
      }

      try {
        const token = user.generateAuthToken();

        res.cookie("jwt", token, {
          httpOnly: true,
          secure: ENVIRONMENT === NodeEnv.Production,
          sameSite: "strict",
          maxAge: MAX_COOKIE_AGE,
        });

        const statusCode =
          info?.message === responseMessages.userApi.googleSignUp
            ? httpStatus.CREATED
            : httpStatus.OK;

        // return res.status(statusCode).json({
        //   status: Status.Success,
        //   message:
        //     statusCode === httpStatus.CREATED
        //       ? responseMessages.userApi.googleSignUp
        //       : responseMessages.userApi.login,
        //   data: {
        //     user: {
        //       id: user._id,
        //       email: user.email,
        //     },
        //   },
        // });

        const frontendUrl = `${process.env.FRONTEND_URL}/songs`; // Or wherever you want
        res.redirect(frontendUrl);
      } catch (error) {
        logger.error(errorMessages.internalServerError, error);
        return next(
          new AppError(
            errorMessages.internalServerError,
            httpStatus.INTERNAL_SERVER_ERROR
          )
        );
      }
    }
  )(req, res, next);
};
