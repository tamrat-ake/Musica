import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [false, "Password confirmation is required."],
      validate: {
        validator: function (this: any, el: string) {
          return el === this.password;
        },
        message: "Passwords do not match.",
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export default userSchema;
