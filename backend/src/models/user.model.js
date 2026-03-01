import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 6
    },

    role: {
      type: String,
      enum: ["ADMIN", "STUDENT"],
      required: true,
    },

    refreshToken: {
      type: String
    },

    // Only for STUDENT users
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

  },
  { timestamps: true }
);

userSchema.pre("save", async function(next){
  if(!this.isModified("password"))
    return next();
  const saltrounds = 10
  this.password = await bcrypt.hash(this.password, saltrounds)
  next()
})

userSchema.methods.comparePassword = async function(password){
  return bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_EXPIRY
  );
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_EXPIRY
  );
};

export const User = mongoose.model("User", userSchema);
