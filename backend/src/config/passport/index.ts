import passport from "passport";
import localStrategy from "./localStrategy";
import jwtStrategy from "./jwtStrategy";
import googleStrategy from "./googleStrategy";

const initiatePassport = () => {
  passport.use(googleStrategy)
  passport.use(localStrategy);
  passport.use(jwtStrategy);
};

export default initiatePassport;
