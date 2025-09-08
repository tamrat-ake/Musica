import { Model } from "mongoose";
import { UserInterface } from "./types";
import { Profile } from "passport";

export async function signUpUser(
  this: Model<UserInterface>,
  newUser: Omit<
    UserInterface,
    "_id" | "createdAt" | "updatedAt" | "generateAuthToken"
  >
): Promise<UserInterface> {
  return this.create(newUser);
}

export async function findUserById(
  this: Model<UserInterface>,
  id: string
): Promise<UserInterface | null> {
  return this.findById(id);
}

export async function findUserByGoogleId(
  this: Model<UserInterface>,
  googleId: string
) {
  return await this.findOne({ googleId });
}

export async function findUserByEmail(
  this: Model<UserInterface>,
  email: string
): Promise<UserInterface | null> {
  return this.findOne({ email }).select("+password");
}
export async function createUserFromGoogle(
  this: Model<UserInterface>,
  profile: Profile
) {
  const { emails, id: googleId } = profile;
  const email = emails && emails.length > 0 ? emails[0].value : undefined;

  let user = await this.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    if (!user.googleId) {
      user.googleId = googleId;
      return await user.save();
    }

    return user;
  }

  const newUser = {
    email,
    googleId,
    password: undefined,
    isVerified: true,
  };

  return await this.create(newUser);
}
