import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userScema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowecase: true,
    validate: [validator.isEmail, "Please provide a valid emai!"],
  },
  photo: String,

  password: {
    type: String,
    required: [true, "Please Provide the password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
});

userScema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userScema.methods.correctPassword = async function (
  condidatePassword,
  userPassword,
) {
  return await bcrypt.compare(condidatePassword, userPassword);
};

userScema.methods.changedPasswordAfter = function (JWTTimstamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimstamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userScema);

export default User;
