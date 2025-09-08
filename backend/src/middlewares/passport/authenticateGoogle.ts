import passport from "passport";
import { NextFunction, Request, Response } from "express";
import AppError from "../../errors/appErrors";
import logger from "../../config/winston";
import { UserInterface } from "../../models/user/types";
import { errorMessages } from "../../utils/messages/errorMessages";
import httpStatus from "http-status";
import { AuthenticationStrategy } from "../../utils/enums";

export const authenticateGoogle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    AuthenticationStrategy.Google,
    { scope: ["profile", "email"] },
    (err: Error | null, user: UserInterface | null, info: any) => {
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
        logger.error(errorMessages.googleUserNotFound);
        return next(
          new AppError(
            errorMessages.googleUserNotFound,
            httpStatus.UNAUTHORIZED
          )
        );
      }
    }
  )(req, res, next);
};
